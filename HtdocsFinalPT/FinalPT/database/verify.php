<?php
session_start();

$response = [];

if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    $response = [
        "success" => false,
        "message" => "Not logged in"
    ];
} else {
    $response = [
        "success" => true,
        "role" => $_SESSION['role'],
        "username" => $_SESSION['username']
    ];
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>
