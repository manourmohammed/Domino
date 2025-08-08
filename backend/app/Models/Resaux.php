<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resaux extends Model
{
    protected $table = 'resaux'; // bien préciser si le nom n'est pas conventionnel

    protected $fillable = [
        'domaine_id',
        'ping',
        'http_status',
        'ssl_expiration',
        'adress_ip',
        'server_location'
    ];
    public function domaine()
    {
        return $this->belongsTo(Domaine::class);
    }
}
