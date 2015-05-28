<?php
$servername = "localhost";
$username = "ibrs";
$password = "infinity006";
$dbname = "IBRS";



// Create connectionrew

$conn = new mysqli($servername, $username, $password, $dbname);





// Check connection
if ($conn->connect_error) {
	 die("Connection failed: " . $conn->connect_error);
} 
$sql = "SELECT * from  Modelo where faccion = 41";


$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["ModelID"]. " - Name: " . $row["nombre"]. " " . $row["perfil"]. "<br>";
    }
} else {
    echo "0 results";
}
$conn->close();
?>