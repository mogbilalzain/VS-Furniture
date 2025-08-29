<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolutionImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'solution_id',
        'image_path',
        'alt_text',
        'sort_order'
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    /**
     * علاقة Many-to-One مع الحل
     */
    public function solution()
    {
        return $this->belongsTo(Solution::class);
    }

    /**
     * ترتيب الصور حسب sort_order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}