
<?php
$host = "localhost";
$username = "root";
$password = ""; // Use your MariaDB password if you set one
$database = "CampusFlowDB";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>
