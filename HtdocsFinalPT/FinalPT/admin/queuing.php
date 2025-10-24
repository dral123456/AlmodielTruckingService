<?php
// No whitespace before this line

ini_set('display_errors', 0);
error_reporting(0);

session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../database/databaseConnector.php';

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

// ✅ Modified query to include multiple statuses
$query = "
    SELECT
        location.*,
        client.fname AS client_name
    FROM 
        location
    INNER JOIN 
        client ON location.userID = client.id
    WHERE
        location.status IN (?)
    ORDER BY 
        location.date ASC
";

$status1 = "pending";
$responseStatus = "error";
$error_message = null;
$locations = [];

$stmt = $conn->prepare($query);

if ($stmt) {
    // ✅ Bind two string parameters
    $stmt->bind_param("s", $status1);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $locations[] = $row;
        }
        $responseStatus = "success";
    } else {
        $error_message = "Failed to retrieve results.";
    }

    $stmt->close();
} else {
    $error_message = "SQL Prepare Failed: " . $conn->error;
}

echo json_encode([
    "status" => $responseStatus,
    "data" => $locations,
    "error" => $error_message
]);

$conn->close();
exit; // no closing PHP tag
