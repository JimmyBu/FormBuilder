<?php

use App\Http\Controllers\FormController;
use Illuminate\Support\Facades\Route;

Route::post('/forms', [FormController::class, 'saveForm']);
Route::get('/forms', [FormController::class, 'getForms']);
Route::get('/forms/{id}', [FormController::class, 'getForm']);
Route::put('/forms/{id}', [FormController::class, 'updateForm']);
Route::delete('/forms/{id}', [FormController::class, 'deleteForm']);
