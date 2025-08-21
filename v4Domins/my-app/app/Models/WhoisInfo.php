<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhoisInfo extends Model
{
    protected $table = 'whois_details';

    protected $fillable = [
        'domaine_id',
        'date_creation',
        'registrar',
        'dns',
    ];

    public function domaine()
    {
        return $this->belongsTo(Domaine::class);
    }
}

