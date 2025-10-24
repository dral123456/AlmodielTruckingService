<?php

require_once __DIR__ . "/databaseConnector.php"; // include the connector

$conn = getConnection(); // call the function to get a DB connection

$lat = isset($_POST['latitude']) ? (float)$_POST['latitude'] : null;
$lng = isset($_POST['longitude']) ? (float)$_POST['longitude'] : null;
$cat = isset($_POST['category']) ? trim($_POST['category']) : null;

if ($lat === null || $lng === null || $cat === null || $cat === "") {
    echo json_encode([
        "status"  => "error",
        "message" => "Incomplete data."
    ]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO locationtagging (latitude, longitude, category) VALUES (?, ?, ?)");
$stmt->bind_param("dds", $lat, $lng, $cat);

if ($stmt->execute()) {
    echo json_encode([
        "status"  => "success",
        "message" => "Location saved."
    ]);
} else {
    echo json_encode([
        "status"  => "error",
        "message" => "Insert failed: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
