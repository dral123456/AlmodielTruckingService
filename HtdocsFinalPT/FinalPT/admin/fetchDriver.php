<?php
header('Content-Type: application/json'); // ✅ ensures JSON response always

require_once __DIR__ . '/../database/databaseConnector.php';
$conn = getConnection();

$role = "driver";

// Prepare the statement
$sql = $conn->prepare("SELECT * FROM client WHERE role = ?");
if (!$sql) {
    echo json_encode([
        "status" => "error",
        "data" => [],
        "error" => "SQL prepare failed: " . $conn->error
    ]);
    exit;
}

// Bind and execute
$sql->bind_param("s", $role);
$sql->execute();

// Fetch results
$result = $sql->get_result();
$status = "success";
$error_message = null;
$drivers = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $drivers[] = $row;
    }
} else {
    $status = "error";
    $error_message = "SQL Query Failed: " . $conn->error;
}

// Output JSON response
echo json_encode([
    "status" => $status,
    "data" => $drivers,
    "error" => $error_message
]);

$conn->close();
?>
