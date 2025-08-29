<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Simple Swagger UI Route (Custom View)
Route::get('/api-docs', function () {
    return view('swagger');
});

// Simple Swagger UI Route
Route::get('/swagger-ui', function () {
    return view('l5-swagger::index', [
        'documentation' => 'default',
        'documentationTitle' => 'VS Furniture API Documentation',
        'urlsToDocs' => [
            'VS Furniture API' => '/docs/api-docs.json'
        ],
        'useAbsolutePath' => true,
        'operationsSorter' => null,
        'configUrl' => null,
        'validatorUrl' => null
    ]);
});

// Swagger JSON Route
Route::get('/docs/api-docs.json', function () {
    $jsonPath = storage_path('api-docs/api-docs.json');
    if (file_exists($jsonPath)) {
        return response()->json(json_decode(file_get_contents($jsonPath)));
    }
    return response()->json(['error' => 'Swagger documentation not found'], 404);
});

// Swagger Documentation Routes
Route::get('/swagger', function () {
    return view('l5-swagger::index', [
        'documentation' => 'default',
        'documentationTitle' => 'VS Furniture API Documentation',
        'urlsToDocs' => [
            'VS Furniture API' => '/docs/api-docs.json'
        ],
        'useAbsolutePath' => true,
        'operationsSorter' => null,
        'configUrl' => null,
        'validatorUrl' => null
    ]);
});

Route::get('/api/documentation', function () {
    return view('l5-swagger::index', [
        'documentation' => 'default',
        'documentationTitle' => 'VS Furniture API Documentation',
        'urlsToDocs' => [
            'VS Furniture API' => '/docs/api-docs.json'
        ],
        'useAbsolutePath' => true,
        'operationsSorter' => null,
        'configUrl' => null,
        'validatorUrl' => null
    ]);
});

Route::get('/docs', function () {
    return view('l5-swagger::index', [
        'documentation' => 'default',
        'documentationTitle' => 'VS Furniture API Documentation',
        'urlsToDocs' => [
            'VS Furniture API' => '/docs/api-docs.json'
        ],
        'useAbsolutePath' => true,
        'operationsSorter' => null,
        'configUrl' => null,
        'validatorUrl' => null
    ]);
});
