<?php

use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DomaineController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\GithubController;



Route::post('/domaines/store-full', [DomaineController::class, 'storeFull']);

Route::get('/domaines', [DomaineController::class, 'index']);

Route::get('/dashboard/stats', [DashboardController::class, 'stats']);


Route::get('/Auth/github/redirect', [GithubController::class, 'redirectToGithub']);
Route::get('/Auth/github/callback', [GithubController::class, 'handleGithubCallback']);

Route::get('/Auth/redirect', [GoogleController::class, 'redirectToGoogle']);
Route::get('/Auth/callback', [GoogleController::class, 'handleGoogleCallback']);

Route::get('/domaines/cms-stats', [DomaineController::class, 'cmsStats']);

Route::get('/domaines/alerts', [DomaineController::class, 'getAlerts']);

Route::post('/domaines/store-multiple', [DomaineController::class, 'storeMultiple']);

Route::get('/domaines/{id}', [DomaineController::class, 'show']);

Route::post('/domains', [DomaineController::class, 'storeDomains']);
