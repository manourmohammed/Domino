<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Domaine extends Model
{

    protected $table = 'domaines';

    protected $fillable = [
        'nom',
        'en_ligne',
        'statut',
        'date_expiration',
        'cms',
        'availability', // Nouveau champ
        'response_time'
    ];
    public function cmsDetail()    {
        return $this->hasOne(CmsDetail::class);
    }

    public function whoisDetail()
    {
        return $this->hasOne(WhoisInfo::class);
    }

    public function networkDetail()
    {
        return $this->hasOne(Resaux::class);
    }

}
