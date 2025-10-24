<?php
require_once __DIR__ . '/databaseConnector.php';

header('Content-Type: application/json'); // ensures JSON response

$conn = getConnection();

// Get POST data safely
$id = isset($_POST["paramID"]) ? $_POST["paramID"] : null;
$status = isset($_POST["status"]) ? $_POST["status"] : null;

// Check for missing fields
if (!$id || !$status) {
    echo json_encode([
        "status" => false,
        "message" => "Missing required parameters."
    ]);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE location SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);

    if ($stmt->execute()) {
        echo json_encode([
            "status" => true,
            "message" => "Status updated successfully."
        ]);
    } else {
        echo json_encode(value: [
            "status" => false,
            "message" => "Failed to update status."
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
