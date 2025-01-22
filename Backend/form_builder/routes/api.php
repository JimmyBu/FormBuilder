<?php

use App\Http\Controllers\FormController;
use Illuminate\Support\Facades\Route;


Route::get('forms/{id}', [FormController::class, 'fetch'])->withoutMiddleware('auth');;
Route::put('forms/update/{id}', [FormController::class, 'update'])->withoutMiddleware('auth');;
Route::get('forms/list', [FormController::class, 'list'])->withoutMiddleware('auth');;
Route::post('forms/save', [FormController::class, 'save'])->withoutMiddleware('auth');;

