<?php
$servername = "localhost";
$username = "ibrs@localhost";
$password = "infinity006";
$dbname = "IBRS";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
echo "hooola";
$sql = "SELECT * from  Modelo where faccion = 12";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>