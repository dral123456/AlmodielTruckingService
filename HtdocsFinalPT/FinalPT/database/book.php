<?php
session_start(); // ✅ Required for $_SESSION['id']

require_once __DIR__ . "/../database/databaseConnector.php"; // ✅ Adjusted path
$conn = getConnection(); 

header('Content-Type: application/json');

// ✅ Safely get POST data
$pickUpAddress   = $_POST["pickUp"] ?? null;
$description     = $_POST["description"] ?? null;
$destination     = $_POST["destination"] ?? null;
$destinationLat  = $_POST["destinationLat"] ?? null;
$destinationLng  = $_POST["destinationLng"] ?? null;
$pickUpLat       = $_POST["pickUpLat"] ?? null;
$pickUpLng       = $_POST["pickUpLng"] ?? null;
$date            = $_POST["date"] ?? null;
$time            = $_POST["time"] ?? null;
$driverid        = $_POST["driverid"] ?? 0; // ✅ Default to 0 if not assigned
$price           = $_POST["price"] ?? null;
$status          = "pending";

// ✅ Validate session
if (!isset($_SESSION['id'])) {
    echo json_encode([
        "status" => "error",
        "message" => "User not authenticated."
    ]);
    exit;
}

// ✅ Validate required fields
if (!$pickUpAddress || !$destination || !$date) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields (pickup, destination, or date)."
    ]);
    exit;
}

// ✅ Convert date to proper format
$formattedDate = date("Y-m-d", strtotime($date));

try {
    // ✅ Prepare SQL safely
    $stmt = $conn->prepare("
        INSERT INTO location 
        (pickup, destination, description, date, userID, pickuplat, pickuplng, destinationlat, destinationlng, status, time, driverid, price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    // ✅ Correct binding string and parameter order
    $stmt->bind_param(
        "ssssiddddssid",
        $pickUpAddress,
        $destination,
        $description,
        $formattedDate,
        $_SESSION['id'],
        $pickUpLat,
        $pickUpLng,
        $destinationLat,
        $destinationLng,
        $status,
        $time,
        $driverid,
        $price
    );

    // ✅ Execute and respond
    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Location successfully registered."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Database execution failed.",
            "error" => $stmt->error
        ]);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Exception occurred.",
        "error" => $e->getMessage()
    ]);
}
?>
