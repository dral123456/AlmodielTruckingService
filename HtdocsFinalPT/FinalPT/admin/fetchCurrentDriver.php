<?php
header('Content-Type: application/json'); // ✅ ensures JSON response always

require_once __DIR__ . '/../database/databaseConnector.php';
$conn = getConnection();

$id = $_GET['id'] ?? null;

if ($id) {
    $sql = "
        SELECT 
            client.fname
        FROM 
            location
        INNER JOIN 
            client ON location.driverid = client.id
        WHERE 
            location.id = ?
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id); // "i" means integer
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode([
            "status" => "success",
            "message" => "Successfully retrieved data.",
            "data" => $row
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "No record found."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Missing ID parameter."
    ]);
}
?>
