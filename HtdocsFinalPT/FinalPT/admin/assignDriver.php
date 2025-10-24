<?php
require_once __DIR__ . '../../database/databaseConnector.php';
header('Content-Type: application/json');

$conn = getConnection();

$driverid = $_POST["driverid"] ?? null;
$price = $_POST["price"] ?? null;
$id = $_POST["id"] ?? null;

// Check for missing fields
if (!$driverid || !$price || !$id) {
    echo json_encode([
        "status" => false,
        "message" => "Missing required parameters."
    ]);
    exit;
}

try {
    // ✅ Correct UPDATE syntax
    $stmt = $conn->prepare("UPDATE location SET driverid = ?, price = ? WHERE id = ?");

    // ✅ Adjust binding type depending on your DB schema
    $stmt->bind_param("idi", $driverid, $price, $id);

    if ($stmt->execute()) {
        echo json_encode([
            "status" => true,
            "message" => "Status updated successfully."
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "message" => "Failed to update status. SQL Error: " . $stmt->error
        ]);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        "status" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>
