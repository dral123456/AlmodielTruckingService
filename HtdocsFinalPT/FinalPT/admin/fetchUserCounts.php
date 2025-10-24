<?php
header('Content-Type: application/json');
require_once __DIR__ . '../../database/databaseConnector.php';
$conn = getConnection();

$sql = "SELECT city, COUNT(*) AS user_count FROM client GROUP BY city";
$result = $conn->query($sql);

$data = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[$row['city']] = (int)$row['user_count'];
    }
}

echo json_encode(["status" => "success", "data" => $data]);
$conn->close();
?>
