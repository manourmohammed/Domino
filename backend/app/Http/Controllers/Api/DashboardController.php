<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domaine;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function stats()
    {
        // Cache les résultats pour 1 heure pour améliorer les performances
        $stats = Cache::remember('dashboard_stats', 3600, function () {
            // Statistiques de base
            $totalDomains = Domaine::count();

            // Alertes actives
            $expiredDomains = Domaine::where('date_expiration', '<', Carbon::now())->count();
            $offlineDomains = Domaine::where('en_ligne', false)->count();

            // Détection des domaines qui vont bientôt expirer (30 jours)
            $expiringSoon = Domaine::whereBetween('date_expiration', [
                Carbon::now(),
                Carbon::now()->addDays(30)
            ])->count();

            // Répartition par CMS
            $cmsDistribution = Domaine::select('cms')
                ->selectRaw('count(*) as count')
                ->groupBy('cms')
                ->get()
                ->pluck('count', 'cms');

            // Disponibilité moyenne (si vous avez ce champ)
            $averageAvailability = Domaine::avg('availability') ?? 0;

            // Temps de réponse moyen (si vous avez ce champ)
            $averageResponseTime = Domaine::avg('response_time') ?? 0;

            // Derniers domaines vérifiés
            $recentlyChecked = Domaine::orderBy('updated_at', 'desc')
                ->take(5)
                ->get(['nom', 'en_ligne', 'date_expiration', 'updated_at']);

            return [
                'totalDomains' => $totalDomains,
                'alertes' => [
                    'expired' => $expiredDomains,
                    'offline' => $offlineDomains,
                    'expiring_soon' => $expiringSoon,
                    'totalActiveAlerts' => $expiredDomains + $offlineDomains,
                ],
                'performance' => [
                    'averageAvailability' => round($averageAvailability, 2),
                    'averageResponseTime' => round($averageResponseTime),
                ],
                'cmsDistribution' => $cmsDistribution,
                'recentlyChecked' => $recentlyChecked,
            ];
        });

        return response()->json($stats);
    }
}
