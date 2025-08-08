<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsDetail extends Model
{
    protected $fillable = [
        'domaine_id',
        'cms',
        'version',
        'theme',
        'plugins_detectes',
    ];

    public function domaine()
    {
        return $this->belongsTo(Domaine::class);
    }
}

