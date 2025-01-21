<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FormController extends Controller
{
    // Handle saving form data
    public function saveForm(Request $request)
    {
        // Validate the form data
        $request->validate([
            'title' => 'required|string|max:255',
            'fields' => 'required|array',
        ]);

        // Get form data from the request
        $formData = $request->only(['title', 'fields']);
        
        // Fetch the existing forms from the JSON file (if any)
        $forms = [];
        $path = storage_path('app/forms.json'); // Path to the JSON file

        if (file_exists($path)) {
            $forms = json_decode(file_get_contents($path), true);
        }

        // Add the new form to the list
        $forms[] = $formData;

        // Save the updated forms back to the JSON file
        file_put_contents($path, json_encode($forms, JSON_PRETTY_PRINT));

        // Respond with a success message
        return response()->json(['status' => 'success', 'message' => 'Form saved successfully!']);
    }

    // Get all saved forms
    public function getForms()
    {
        // Define the path to the saved forms file
        $path = storage_path('app/forms.json');

        if (file_exists($path)) {
            // Read the JSON file and return its content
            $forms = json_decode(file_get_contents($path), true);
            return response()->json($forms);
        }

        return response()->json(['status' => 'error', 'message' => 'No forms found.']);
    }
}
