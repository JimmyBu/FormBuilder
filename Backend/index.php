<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');  // Allow all origins, or specify the frontend URL (e.g., 'http://localhost:3000')
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle POST request to save form data
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Simulate saving form data (replace with actual DB operations)
    echo json_encode(['status' => 'success', 'message' => 'Form saved successfully']);
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
