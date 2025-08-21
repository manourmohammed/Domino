<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Http;
use Illuminate\Http\Request;
use App\Models\Domaine;

class DomaineController extends Controller
{
    protected function validDate(?string $date): ?string
    {
        if (!$date) {
            return null;
        }
        return preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) ? $date : null;
    }

        public function storeFull(Request $request)
        {
            $validated = $request->validate([
                'domains' => 'required|array',
                'domains.*' => 'required|string'
            ]);

            $response = Http::timeout(120)->post("http://localhost:8001/api/domains/check", [
                "domains" => $validated["domains"]
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'message' => 'Erreur lors de l\'analyse avec FastAPI',
                    'error' => $response->body()
                ], $response->status());
            }

            $domainsData = $response->json();
            // Dans storeFull(), juste après $response->json()
            \Log::debug('FastAPI response', $domainsData);
            $results = $domainsData['results'] ?? [];
            $savedDomains = [];

            foreach ($results as $domainData) {
                // Utilise la clé 'nom' et non 'domain'
                $existingDomain = Domaine::where('nom', $domainData['nom'])->first();

                if ($existingDomain) {
                    $savedDomains[] = $existingDomain;
                    continue;
                }

                // Conversion des dates ssl_expiration si nécessaire
                $sslExpiration = null;
                if (!empty($domainData['network']['ssl_expiration'])) {
                    // Format retourné dans Python : 'Y-m-d' (ex: 2025-08-07)
                    $sslExpiration = \DateTime::createFromFormat('Y-m-d', $domainData['network']['ssl_expiration']);
                    $sslExpiration = $sslExpiration ? $sslExpiration->format('Y-m-d') : null;
                }

                $domaine = Domaine::create([
                    'nom' => $domainData['nom'],
                    'en_ligne' => ($domainData['en_ligne'] ?? false) === true,
                    'statut' => $domainData['statut'] ?? null,
                    'date_expiration' => $this->validDate($domainData['date_expiration'] ?? null),
                    'cms' => $domainData['cms'] ?? null,
                    'availability' => (float)($domainData['availability'] ?? 0),
                    'response_time' => (int)($domainData['response_time'] ?? 0),
                    'last_scan_at' => now()
                ]);

                // Détails CMS
                if (!empty($domainData['cms_details'])) {
                    $domaine->cmsDetail()->create([
                        'cms' => $domainData['cms_details']['cms'] ?? null,
                        'version' => $domainData['cms_details']['version'] ?? null,
                        'theme' => $domainData['cms_details']['theme'] ?? null,
                        'plugins_detectes' => (int)($domainData['cms_details']['plugins_detectes'] ?? 0)
                    ]);
                }

                // Détails WHOIS
                    if (!empty($domainData['whois'])) {
                        $domaine->whoisDetail()->create([
                            'date_creation' => $this->validDate($domainData['whois']['date_creation'] ?? null),
                            'registrar' => $domainData['whois']['registrar'] ?? null,
                            'dns' => $domainData['whois']['dns'] ?? null
                        ]);
                    }

                    // Détails réseau
                    if (!empty($domainData['network'])) {
                        $domaine->networkDetail()->create([
                            'ping' => $domainData['network']['ping'] ?? null,
                            'http_status' => $domainData['network']['http_status'] ?? null,
                            'ssl_expiration' => $sslExpiration,
                            'adress_ip' => $domainData['network']['adress_ip'] ?? null,
                            'server_location' => $domainData['network']['server_location'] ?? null
                        ]);
                    }

                    $savedDomains[] = $domaine->load(['cmsDetail', 'whoisDetail', 'networkDetail']);
                }

                return response()->json([
                    'message' => 'Analyse terminée et domaines enregistrés',
                    'count' => count($savedDomains),
                    'results' => $savedDomains
                ], 201);
            }

    public function index()
    {
        // Récupérer tous les domaines avec leurs relations
        $domaines = Domaine::with(['cmsDetail', 'whoisDetail', 'networkDetail'])->get();

        return response()->json($domaines);
    }

    public function show($id)
    {
        // Récupérer un domaine avec ses relations par id
        $domaine = Domaine::with(['cmsDetail', 'whoisDetail', 'networkDetail'])->find($id);

        if (!$domaine) {
            return response()->json(['message' => 'Domaine non trouvé'], 404);
        }

        return response()->json($domaine);
    }

    public function cmsStats()
    {
        $stats = Domaine::selectRaw("
            SUM(CASE WHEN cms = 'wordpress' THEN 1 ELSE 0 END) as wordpressCount,
            cms, COUNT(*) as count
        ")
            ->groupBy('cms')
            ->get();

        $cmsDistribution = $stats->pluck('count', 'cms');
        $wordpressCount = $stats->sum('wordpressCount');

        return response()->json([
            'wordpressCount' => $wordpressCount,
            'cmsDistribution' => $cmsDistribution,
        ])->header('Access-Control-Allow-Origin', '*');
    }

    public function getAlerts()
    {
        try {
            $domaines = Domaine::with(['networkDetail'])
                ->where('en_ligne', false) // Juste les domaines offline pour commencer
                ->get();

            if ($domaines->isEmpty()) {
                return response()->json([
                    'message' => 'Aucun domaine offline trouvé',
                    'data' => []
                ], 200);
            }

            $alerts = $domaines->map(function ($domaine) {
                return [
                    'id' => $domaine->id,
                    'domain' => $domaine->nom,
                    'type' => 'offline',
                    'status' => 'pending',
                    'detected_at' => now()->toISOString(),
                    'en_ligne' => $domaine->en_ligne
                ];
            });

            return response()->json($alerts);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $domaine = Domaine::find($id);

            if (!$domaine) {
                return response()->json(['message' => 'Domaine non trouvé'], 404);
            }

            // Supprimer les relations d'abord
            if ($domaine->cmsDetail) {
                $domaine->cmsDetail()->delete();
            }
            if ($domaine->whoisDetail) {
                $domaine->whoisDetail()->delete();
            }
            if ($domaine->networkDetail) {
                $domaine->networkDetail()->delete();
            }

            // Puis supprimer le domaine
            $domaine->delete();

            return response()->json([
                'message' => 'Domaine supprimé avec succès'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }

// app/Http/Controllers/DomainController.php

    public function updatefull(Request $request, $id)
    {
        try {
            // Log des données reçues pour debugging
            \Log::info("=== UPDATE DOMAINE $id ===");
            \Log::info("Données reçues:", $request->all());

            $domain = Domaine::findOrFail($id);
            \Log::info("Domaine trouvé: " . $domain->nom);

            // Champs principaux avec validation et valeurs par défaut
            $updateData = [
                'nom' => $request->input('nom', $domain->nom),
                'en_ligne' => $request->input('en_ligne', false),
                'statut' => $request->input('statut', 'Inconnue'),
                'date_expiration' => $request->input('date_expiration'),
                'cms' => $request->input('cms'), // Peut être null
                'availability' => $request->input('availability', 0),
                'response_time' => $request->input('response_time', 0),
                'last_scan_at' => now(),
            ];

            \Log::info("Données mise à jour domaine principal:", $updateData);
            $domain->update($updateData);

            // CMS Details - ADAPTATION AU FORMAT PLAT
            $cmsData = $request->input('cms_details', []);

            // Si les données cms_details existent (nouveau format)
            if (!empty($cmsData)) {
                \Log::info("Format imbriqué détecté - Données CMS reçues:", $cmsData);

                $cmsUpdateData = [
                    'cms' => $cmsData['cms'] ?? $request->input('cms'),
                    'version' => $cmsData['version'] ?? '-',
                    'theme' => $cmsData['theme'] ?? '-',
                    'plugins_detectes' => isset($cmsData['plugins_detectes']) ? (int)$cmsData['plugins_detectes'] : 0,
                ];
            } else {
                // Format plat (ancien format) - LIRE DIRECTEMENT
                \Log::info("Format plat détecté - Lecture des champs directs");

                $cmsUpdateData = [
                    'cms' => $request->input('cms'),
                    'version' => $request->input('cms_version', '-'),
                    'theme' => $request->input('theme', '-'),
                    'plugins_detectes' => (int)$request->input('plugins_detectes', 0),
                ];
            }

            \Log::info("Données CMS à sauvegarder:", $cmsUpdateData);
            $domain->cmsDetail()->updateOrCreate(
                ['domaine_id' => $domain->id],
                $cmsUpdateData
            );

            // WHOIS Details - ADAPTATION AU FORMAT PLAT
            $whoisData = $request->input('whois', []);

            if (!empty($whoisData)) {
                // Format imbriqué
                \Log::info("Format imbriqué - Données WHOIS reçues:", $whoisData);

                $whoisUpdateData = [
                    'date_creation' => $whoisData['date_creation'] ?? null,
                    'registrar' => $whoisData['registrar'] ?? '-',
                    'dns' => $whoisData['dns'] ?? '-',
                ];
            } else {
                // Format plat
                \Log::info("Format plat - Lecture WHOIS direct");

                $whoisUpdateData = [
                    'date_creation' => $request->input('whois_date_creation'),
                    'registrar' => $request->input('whois_registrar', '-'),
                    'dns' => $request->input('whois_dns', '-'),
                ];
            }

            \Log::info("Données WHOIS à sauvegarder:", $whoisUpdateData);
            $domain->whoisDetail()->updateOrCreate(
                ['domaine_id' => $domain->id],
                $whoisUpdateData
            );

            // Network Details - ADAPTATION AU FORMAT PLAT
            $networkData = $request->input('network', []);

            if (!empty($networkData)) {
                // Format imbriqué
                \Log::info("Format imbriqué - Données Network reçues:", $networkData);

                $networkUpdateData = [
                    'ping' => $networkData['ping'] ?? null,
                    'http_status' => $networkData['http_status'] ?? 'Inaccessible',
                    'ssl_expiration' => $networkData['ssl_expiration'] ?? null,
                    'adress_ip' => $networkData['adress_ip'] ?? null,
                    'server_location' => $networkData['server_location'] ?? 'N/A',
                ];
            } else {
                // Format plat
                \Log::info("Format plat - Lecture Network direct");

                $networkUpdateData = [
                    'ping' => $request->input('ping'),
                    'http_status' => $request->input('http_status', 'Inaccessible'),
                    'ssl_expiration' => $request->input('ssl_expiration'),
                    'adress_ip' => $request->input('adress_ip'),
                    'server_location' => $request->input('server_location', 'N/A'),
                ];
            }

            \Log::info("Données Network à sauvegarder:", $networkUpdateData);
            $domain->networkDetail()->updateOrCreate(
                ['domaine_id' => $domain->id],
                $networkUpdateData
            );

            // Vérification finale
            $domain->refresh();
            $domain->load(['cmsDetail', 'whoisDetail', 'networkDetail']);

            \Log::info("=== VERIFICATION FINALE ===");
            \Log::info("CMS principal: " . $domain->cms);
            \Log::info("CMS detail: " . ($domain->cmsDetail ? $domain->cmsDetail->cms : 'NULL'));
            \Log::info("WHOIS detail: " . ($domain->whoisDetail ? $domain->whoisDetail->registrar : 'NULL'));
            \Log::info("Network detail: " . ($domain->networkDetail ? $domain->networkDetail->http_status : 'NULL'));

            return response()->json([
                'message' => 'Domaine et détails mis à jour avec succès',
                'domain_id' => $domain->id,
                'cms' => $domain->cms,
                'cms_detail' => $domain->cmsDetail ? $domain->cmsDetail->cms : null,
                'format_detected' => empty($request->input('cms_details', [])) ? 'flat' : 'nested',
            ]);

        } catch (\Exception $e) {
            \Log::error("Erreur mise à jour domaine $id: " . $e->getMessage());
            \Log::error($e->getTraceAsString());

            return response()->json([
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function logout(Request $request)
    {
        return response()
            ->json(['message' => 'Déconnexion réussie'])
            ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->header('Access-Control-Allow-Methods', 'POST')
            ->header('Access-Control-Allow-Credentials', 'true');
    }}
