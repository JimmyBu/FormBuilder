<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Form; // Assuming you have a Form model

class FormController extends Controller
{
    // Fetch a form by ID
    public function fetch($id)
    {
        $form = Form::find($id);
        if (!$form) {
            return response()->json(['error' => 'Form not found'], 404);
        }
        return response()->json($form);
    }

    // Update a form by ID
    public function update(Request $request, $id)
    {
        $form = Form::find($id);
        if (!$form) {
            return response()->json(['error' => 'Form not found'], 404);
        }

        $form->form_name = $request->input('form_name', $form->form_name);
        $form->form_data = $request->input('form_data', $form->form_data);
        $form->save();

        return response()->json($form);
    }

    // Get all forms
    public function list()
    {
        $forms = Form::all();
        return response()->json($forms);
    }

    // Save a new form
    public function save(Request $request)
    {
        $form = new Form();
        $form->form_name = $request->input('form_name');
        $form->form_data = $request->input('form_data');
        $form->save();

        return response()->json($form, 201);
    }
}
