<?php
session_start(); // start session to access session variables

// Unset all session variables
$_SESSION = [];

// Destroy the session
session_destroy();

// Optionally clear cookies (if you used cookies for login)

// Redirect user to login page
header("Location: ../pages/login.html");
exit;
?>
