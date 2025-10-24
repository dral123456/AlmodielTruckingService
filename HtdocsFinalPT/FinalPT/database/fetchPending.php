<?php
// No whitespace before this line

ini_set('display_errors', 0);
error_reporting(0);

session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/databaseConnector.php';

$conn = getConnection();

if (!$conn) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "data" => [],
        "error" => "Database connection failed."
    ]);
    exit();
}

if (!isset($_SESSION["id"])) {
    echo json_encode([
        "status" => "error",
        "data" => [],
        "error" => "Session ID not found."
    ]);
    exit();
}

$query = "
    SELECT
        location.*,
        client.fname AS client_name
    FROM 
        location
    INNER JOIN 
        client ON location.userID = client.id
    WHERE
        location.driverid = ? 
        AND location.status IN (?, ?)
    ORDER BY 
        location.date ASC
";

$status1 = "pending";
$status2 = "transmitting";

$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode([
        "status" => "error",
        "data" => [],
        "error" => "SQL prepare failed: " . $conn->error
    ]);
    exit();
}

// ✅ Bind parameters (driverid, status1, status2)
$stmt->bind_param("iss", $_SESSION["id"], $status1, $status2);
$stmt->execute();

$result = $stmt->get_result();

$locations = [];
$responseStatus = "success";
$error_message = null;

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $locations[] = $row;
    }
} else {
    $responseStatus = "error";
    $error_message = "SQL Query Failed: " . $conn->error;
}

echo json_encode([
    "status" => $responseStatus,
    "data" => $locations,
    "error" => $error_message
]);

$stmt->close();
$conn->close();
exit; // no closing PHP tag
