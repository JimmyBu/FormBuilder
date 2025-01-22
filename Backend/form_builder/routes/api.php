<?php

use App\Http\Controllers\FormController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/forms/{id}', [FormController::class, 'fetch']);
    Route::put('/forms/update/{id}', [FormController::class, 'update']);
    Route::get('/forms/list', [FormController::class, 'list']);
    Route::post('/forms/save', [FormController::class, 'save']);
});
