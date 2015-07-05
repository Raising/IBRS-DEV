<?php



if (isset($_POST["action"])){

	str_replace("world","Peter","Hello world!");


	$whitelist = array('var1','var2','var3');

	foreach($_POST as $key => $value) {
	   // Only handle $_POST keys you expect to receive...
	  // if (in_array($key, $whitelist)) {
	      $_POST[$key] = htmlspecialchars($value);
	    //}
	}


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
		case 'login':
			login();
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


function login(){
	$servername = "localhost";
	$username = "ibrs";
	$password = "infinity006";
	$dbname = "IBRS";
	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
	} 
    
    $sql = "SELECT * from Usuario where nombre = '".$_POST["user"] ."' and password = '".$_POST["password"]."'";
  
    $result = $conn->query($sql);
	
	
	if ($result->num_rows == 1) {
	    // output data of each row
	    $row = $result->fetch_assoc();
	    echo $row["UserID"];
	    
	} else {
		echo $result->num_rows;
	   // echo "ERROR";
	}

	
	
	$conn->close();
}

// Check connection




?>