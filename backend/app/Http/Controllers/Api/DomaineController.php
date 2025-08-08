<?php

namespace App\Http\Controllers\Api;

use App\Models\Domaine;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use App\Http\Requests\DomainsListRequest;

class DomaineController extends Controller
{
    protected function validDate(?string $date): ?string
    {
        if (!$date) {
            return null;
        }
        return preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) ? $date : null;
    }

    protected function validInt($value): int
    {
        if (is_numeric($value)) {
            return (int) $value;
        }
        return 0;
    }

  public function storeDomains(DomainsListRequest $request)
{
    $validatedRequest = $request->validated();

    $response = Http::timeout(120)->post("http://localhost:8001/api/domains/check", [
        "domains" => $validatedRequest["domains"]
    ]);

    $domainsData = $response->json();

    $savedDomains = [];
    $errors = [];

    foreach ($domainsData as $domainData) {
        if (\App\Models\Domaine::where('nom', $domainData['nom'])->exists()) {
            $errors[] = [
                'domain' => $domainData['nom'],
                'error' => 'Domain already exists'
            ];
            continue; 
        }

        $domaine = \App\Models\Domaine::create([
            'nom' => $domainData['nom'],
            'en_ligne' => $domainData['en_ligne'] ?? false,
            'statut' => $domainData['statut'] ?? null,
            'date_expiration' => $this->validDate($domainData['date_expiration'] ?? null),
            'cms' => $domainData['cms'] ?? null,
            'availability' => $domainData['availability'] ?? null,
            'response_time' => $domainData['response_time'] ?? null
        ]);

        // CMS details
        if (!empty($domainData['cms_details'])) {
            $domaine->cmsDetail()->create([
                'cms' => $domainData['cms_details']['cms'] ?? null,
                'version' => $domainData['cms_details']['version'] ?? null,
                'theme' => $domainData['cms_details']['theme'] ?? null,
                'plugins_detectes' => $this->validInt($domainData['cms_details']['plugins_detectes'] ?? 0),
            ]);
        }

        // Whois details
        if (!empty($domainData['whois'])) {
            $domaine->whoisDetail()->create([
                'date_creation' => $this->validDate($domainData['whois']['date_creation'] ?? null),
                'registrar' => $domainData['whois']['registrar'] ?? null,
                'dns' => $domainData['whois']['dns'] ?? null,
            ]);
        }

        // Network details
        if (!empty($domainData['network'])) {
            $domaine->networkDetail()->create([
                'ping' => $domainData['network']['ping'] ?? null,
                'http_status' => $domainData['network']['http_status'] ?? null,
                'ssl_expiration' => $domainData['network']['ssl_expiration'] ?? null,
                'adress_ip' => $domainData['network']['adress_ip'] ?? null,
                'server_location' => $domainData['network']['server_location'] ?? null,
            ]);
        }

        $savedDomains[] = $domaine;
    }

    return response()->json([
        "message" => "Domaines analysés.",
        "result" => $savedDomains,
        "errors" => $errors
    ]);
}



    public function storeFull(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string',
            'en_ligne' => 'nullable|boolean',
            'statut' => 'nullable|string',
            'date_expiration' => 'nullable|date',
            'availability' => 'nullable|numeric',
            'response_time' => 'nullable|decimal:',
            'cms' => 'nullable|string',
            'cms_details' => 'nullable|array',
            'whois' => 'nullable|array',
            'network' => 'nullable|array',
        ]);

        $domaine = Domaine::create([
            'nom' => $request->nom,
            'en_ligne' => $request->en_ligne,
            'statut' => $request->statut,
            'date_expiration' => $request->date_expiration,
            'cms' => $request->cms,
            'availability' => $request->availability,
            'response_time' => $request->response_time
        ]);

        // Création des détails CMS
        if ($request->has('cms_details')) {
            $domaine->cmsDetail()->create([
                'cms' => $request->cms_details['cms'] ?? null,
                'version' => $request->cms_details['version'] ?? null,
                'theme' => $request->cms_details['theme'] ?? null,
                'plugins_detectes' => $request->cms_details['plugins_detectes'] ?? 0,
            ]);
        }

        // Création des infos Whois
        if ($request->has('whois')) {
            $domaine->whoisDetail()->create([
                'date_creation' => $request->whois['date_creation'] ?? null,
                'registrar' => $request->whois['registrar'] ?? null,
                'dns' => $request->whois['dns'] ?? null,
            ]);
        }

        // Création des infos Réseau
        if ($request->has('network')) {
            $domaine->networkDetail()->create([
                'ping' => $request->network['ping'] ?? null,
                'http_status' => $request->network['http_status'] ?? null,
                'ssl_expiration' => $request->network['ssl_expiration'] ?? null,
                'adress_ip' => $request->network['adress_ip'] ?? null,
                'server_location' => $request->network['server_location'] ?? null,
            ]);
        }

        return response()->json(['message' => '✅ Domaine enregistré avec succès !']);
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
}
