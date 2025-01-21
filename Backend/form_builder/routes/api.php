<?php

use App\Http\Controllers\FormController;
use Illuminate\Support\Facades\Route;

// Route to save the form data (POST request)
Route::post('/save-form', [FormController::class, 'saveForm']);

// Route to get all saved forms (GET request)
Route::get('/get-forms', [FormController::class, 'getForms']);

