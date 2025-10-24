<?php
require_once __DIR__ . "/databaseConnector.php";
$conn = getConnection(); 

$username = isset($_POST["username"]) ? $_POST["username"] : null;
$password = isset($_POST["password"]) ? $_POST["password"] : null;

if ($username && $password) {
    $stmt = $conn->prepare("SELECT * FROM admin WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();

    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
      //  $hashFromDb = $user['password'];

        if ($password == $user['password']) {
            session_start();
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['authenticated'] = true;
            $_SESSION['id'] = $user['id'];

            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'role' => $user['role']
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid password']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing username or password']);
}
?>
