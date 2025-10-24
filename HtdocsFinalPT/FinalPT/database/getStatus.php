<?php
require_once __DIR__ . '/databaseConnector.php';
$conn = getConnection();

$id = isset($_POST["paramID"]) ? $_POST["paramID"] : null;

if (!$id) {
  echo json_encode(["status" => "error", "message" => "Missing ID"]);
  exit;
}

$stmt = $conn->prepare("SELECT status FROM location WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

echo json_encode(["status" => $result["status"]]);
?>
