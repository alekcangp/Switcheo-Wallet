<?php
$wallets = $_POST['wallets'];
$iduser = $_POST['iduser'];
$idtoken = $_POST['idtoken'];

$servername = "localhost";
$uname = "u118820896_wallets";
$password = "Darina57";
$dbname = "u118820896_wallets";

// Create connection
$conn = new mysqli($servername, $uname, $password, $dbname);
// Check connection
if ($conn->connect_error) {
   // die("Connection failed: " . $conn->connect_error);
} 

$sql = "UPDATE users SET addresses='$wallets', token='$idtoken' WHERE username='$iduser'";


if ($conn->query($sql) === TRUE) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $conn->error;
}

$conn->close();
?>