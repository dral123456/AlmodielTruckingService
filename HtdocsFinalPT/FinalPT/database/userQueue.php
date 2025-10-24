<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../database/databaseConnector.php';

$conn = getConnection();
$id = $_SESSION['id'] ?? null;

if (!$conn) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "data" => [],
        "error" => "Database connection failed."
    ]);
    exit();
}

if (!$id) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "data" => [],
        "error" => "Missing session ID."
    ]);
    exit();
}

$sql = "
    SELECT 
        location.*, 
        client.fname AS client_name
    FROM 
        location
    INNER JOIN 
        client ON location.driverID = client.id
    WHERE 
        location.userID = ?
    ORDER BY 
        location.date ASC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$locations = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $locations[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $locations,
        "error" => null
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "data" => [],
        "error" => "SQL Query Failed: " . $conn->error
    ]);
}

$conn->close();
exit;
?>
