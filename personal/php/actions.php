<?php

if (isset($_POST["action"])){
	switch ($_POST["action"]) {
		case 'getFactionModels':
			 getFactionModels();	
			break;
		case 'getFactionList':
			 getFactionList();
			break;
		case 'getModel':
			 getModel();
			break;
		case 'free':
			doQuery();
		break;
		default:
			# code...
			break;
	}
}

// Create connectionrew
function getFactionModels()
{
    $servername = "localhost";
	$username = "ibrs";
	$password = "infinity006";
	$dbname = "IBRS";
	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
	} 
    $sql = "SELECT * from  Modelo where faccion = ".$_POST["factionID"];
    $arr = array();
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
	    // output data of each row
	    while($row = $result->fetch_assoc()) {
	    	$modelo  = new stdClass();
	    	$modelo->id = $row["ModelID"];
	    	$modelo->nombre = $row["nombre"];
	    	$modelo->icon = $row["icono_path"];
	    	$modelo->textura = $row["textura_path"];	
	    	$modelo->silueta = $row["size"];
	    	$modelo->perfil = $row["perfil"];
	    	$modelo->faccion = $row["faccion"];
	    	$arr[] = $modelo;       
	    }
	} else {
	    echo "vacio";
	}

	echo json_encode($arr);

	$conn->close();
}


function getFactionList()
{
    $servername = "localhost";
	$username = "ibrs";
	$password = "infinity006";
	$dbname = "IBRS";
	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
	} 
    $sql = "SELECT * from Faccion";
    $arr = array();
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
	    // output data of each row
	    while($row = $result->fetch_assoc()) {
	    	$faccion  = new stdClass();
	    	$faccion->id = $row["FaccionID"];
	    	$faccion->nombre = $row["nombre"];
	    	$faccion->icon = $row["icon_path"];
	    	$arr[] = $faccion;       
	    }
	} else {
	    echo "vacio";
	}

	echo json_encode($arr);

	$conn->close();
}



function getModel()
{
    $servername = "localhost";
	$username = "ibrs";
	$password = "infinity006";
	$dbname = "IBRS";
	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
	} 
    $sql = "SELECT * from Modelo where ModelID = ".$_POST["modelID"];
    
	$result = $conn->query($sql);
	$modelo = new stdClass();
	if ($result->num_rows == 1) {
	    // output data of each row
	    $row = $result->fetch_assoc();
	    
    	$modelo->id = $row["ModelID"];
    	$modelo->nombre = $row["nombre"];
    	$modelo->icon = $row["icono_path"];
    	$modelo->textura = $row["textura_path"];	
    	$modelo->silueta = $row["size"];
    	$modelo->perfil = $row["perfil"];
    	$modelo->faccion = $row["faccion"];
	    	     
	    
	} else {
	    echo "error cantidad de modelos incorrecta";
	}

	echo json_encode($modelo);

	$conn->close();
}



function doQuery()
{
    $servername = "localhost";
	$username = "ibrs";
	$password = "infinity006";
	$dbname = "IBRS";
	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
	} 
    $sql = $_POST["sql"];
	$conn->query($sql);
	$conn->close();
}


// Check connection


?>