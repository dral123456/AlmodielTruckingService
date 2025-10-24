    <?php
session_start();

if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    header("Location: ../pages/login.html");
    exit();
}

if ($_SESSION['role'] !== 'admin') {
    header("Location: ../client/home.php"); 
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Page</title>
</head>
<body>
  <a href="../pages/adminPages/queuing.html">Book</a>
  <h1>Welcome Admin, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h1>
</body>
</html>
