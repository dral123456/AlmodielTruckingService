<?php
require_once __DIR__ . "../../database/databaseConnector.php";
$conn = getConnection(); 

$role = "driver";

$username = isset($_POST["username"]) ? $_POST["username"] : null;
$password = isset($_POST["password"]) ? $_POST["password"] : null;
$firstName = isset($_POST["firstName"]) ? $_POST["firstName"] : null;
$lastName = isset($_POST["lastName"]) ? $_POST["lastName"] : null;
$number = isset($_POST["number"]) ? $_POST["number"] : null;
$city = isset($_POST["city"]) ? $_POST["city"] : null;
$brgy = isset($_POST["brgy"]) ? $_POST["brgy"] : null;



if (   $username === null || $username === "" ||
       $password === null || $password === "" ||
       $firstName === null || $firstName === "" ||
       $lastName === null || $lastName === "" ||
       $number === null || $city === null || $brgy === null) {
    echo json_encode([
        "status"  => "error",
        "message" => "Incomplete data."
    ]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO client (username, password, fname, lname, number, role, city, brgy) VALUES (?,?,?,?,?,?,?,?)");
$stmt->bind_param("ssssssss", $username, $hashedPassword, $firstName, $lastName, $number, $role, $city, $brgy);


if( $stmt->execute()){
    echo json_encode([
        "status"=> "success",
        "message"=> "Registered"
    ]);
}
else{
    echo json_encode([
        "status"=> "error",
        "message"=> "Registertion Failed",
        "error"=> $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>