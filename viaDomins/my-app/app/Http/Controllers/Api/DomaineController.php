<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Domaine;

class DomaineController extends Controller
{
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
            'availability' => $request->availability ,
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

            $alerts = $domaines->map(function($domaine) {
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
