///
IBRS.Graphics = function(){

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);
    this.render = new THREE.WebGLRenderer({premultipliedAlpha:false, alpha:true});
    this.render.setClearColor(new THREE.Color(0xff0000),0);
    var canvasWidth = 1280;
    var canvasHeight = 720;
    this.render.setSize(canvasWidth, canvasHeight);

    this.referenceTime = 0;
    this.scenery = new IBRS.SCENERY();
    this.tageteableElementsList = [];//tienen uqe ser objetos 3d de THREE


    this.camera_Distance = 150;
    this.camera_Horizonatl_Angle = 0;
    this.camera_Vertical_Angle = Math.PI/3;
    this.camera_lookAt;

    function CameraReposition(distance_inc,hoizontalAngle_inc,verticalAngle_inc,targetObject){
        this.Camera_lookAt = targetObject = targetObject !== undefined ? targetObject : this.Camera_lookAt;
        //CurrentCamera= cameraAtScene;
        this.camera_Distance = Math.max(Camera_Distance+distance_inc,5);
        this.camera_Horizonatl_Angle += hoizontalAngle_inc;
        this.camera_Vertical_Angle += verticalAngle_inc;
        this.camera_Vertical_Angle = Math.max(0,Math.min(Math.PI,Camera_Vertical_Angle));
        var current_target_position = new THREE.Vector3();
        current_target_position.setFromMatrixPosition( Camera_lookAt.matrixWorld );
        CurrentCamera.position.set(
            current_target_position.x + Camera_Distance*Math.cos(Camera_Horizonatl_Angle)*Math.sin(Camera_Vertical_Angle),
            current_target_position.y + Camera_Distance*Math.cos(Camera_Vertical_Angle),
            current_target_position.z + Camera_Distance*Math.sin(Camera_Horizonatl_Angle)*Math.sin(Camera_Vertical_Angle)
        );
        var current_target_position = new THREE.Vector3();
        current_target_position.setFromMatrixPosition( Camera_lookAt.matrixWorld );
        CurrentCamera.lookAt(current_target_position);

    }



    this.startScene = function(){

    }

    this.renderEscene = function(){
        
        this.render.render(this.escene, this.camera);

    }
    this.animateEscene = function(){
        var delta=(Date.now()- this.referenceTime )/1000;
        this.referenceTime =Date.now();
        this.renderEscene();

        requestAnimationFrame(this.animateEsceneñ);
    }
    this.webGLStart = function () {
        this.startScene();
        this.animateEscene();        
    }

    this.setupGame = function(newGame){


    }

    this.setTargeteableElements = function(newList){
        this.tageteableElementsList = newList;
    }

};



////
var escena;
var cameraAtScene;
var render;

var elementos;
var edificios;
var TargeteableElementsList = [];
function iniciarEscena(){
    //Render
    
    
    render = new THREE.WebGLRenderer({premultipliedAlpha:false, alpha:true});
    
    

	
    var canvasWidth = 1280;
    var canvasHeight = 720;
    render.setSize(canvasWidth, canvasHeight);
    

    //Escena
    escena = new THREE.Scene();



    //Camara
    cameraAtScene = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);
    CameraReposition(0,0,0,escena);
    
    escena.add(cameraAtScene);

    //establecimiento de eventos
    SetunUpMouseInteraction(render.domElement);
    //SetupOnClick(render.domElement);
    
    
    //var territory = new scenery(120);
	edificios = new THREE.Object3D();
	edificios.ID = "edificios";
	
	var mesaprueba = new TableBoard(new THREE.Vector3(35,8,35),'img/tablero.jpg');
    edificios.add(mesaprueba);
	var edificio1 = new Building('img/vcara1.jpg',"b");
	var edificio2 = new Building('img/vcara2.jpg',"a");
	edificio1.position.set(-0.95,0,-10.83);
	edificio1.rotation.set(0,0.0309,0);
	edificio2.position.set(2.54,0,11.05);
	edificio2.rotation.set(0,2.4753,0);
	edificios.add(edificio1);
	edificios.add(edificio2);
	
	
    elementos = new THREE.Object3D();
    elementos.ID = "elementos";
	
	
	
    //territory.calculateRepresentation(elementos);
    var mesa = new TableBoard(new THREE.Vector3(120,20,120),'img/terrain01.png');
    elementos.add(mesa);
	
	
    var asuangMini = new Miniature(-1,2.5,'img/Asuang.jpg','img/CA.png',0);
    asuangMini.position.set(-16.25,18,1.25);
    asuangMini.rotation.set(0,3*Math.PI/4,0);
    asuangMini.name = "Asuang";
    CameraReposition(0,0,0,asuangMini);
    elementos.add(asuangMini);

    var asuMini = new Miniature(3,2.5,'img/Asuang.jpg','img/CA.png',0);
    asuMini.position.set(-40,0,25.25);
    asuMini.rotation.set(0,3*Math.PI/4,0);
    asuMini.name = "Asuang";
   
    elementos.add(asuMini);

    
    //luz
    var light = new THREE.PointLight(0xffffff);
    light.position.set(40,10,40);
    escena.add(light);
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-40,10,-40);
    escena.add(light);
    var light = new THREE.PointLight(0x888888);
    light.position.set(0,40,0);
    escena.add(light);
    
     // add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0x222222);
    escena.add(ambientLight);

    // add directional light source
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1,0).normalize();
    //escena.add(directionalLight);
    
    new sceneryElement(3, new coordinate(-20,13.0,2.5,0,Math.PI/2,0), new dimension(5,5,10)).calculateRepresentation(elementos);
    new sceneryElement(3, new coordinate(-20,6.5,0,0,Math.PI/2,0), new dimension(10,5,10)).calculateRepresentation(elementos);
    new sceneryElement(3, new coordinate(-20,0,0,0,Math.PI/2,0), new dimension(20,5,10)).calculateRepresentation(elementos);
    
    
    new sceneryElement(3, new coordinate(40,0,20,0,Math.PI/2,0), new dimension(25,5,25)).calculateRepresentation(elementos);
    new sceneryElement(3, new coordinate(40,5,20,0,Math.PI/2,0), new dimension(18,5,18)).calculateRepresentation(elementos);
    new sceneryElement(3, new coordinate(40,10,20,0,Math.PI/2,0), new dimension(10,5,10)).calculateRepresentation(elementos);
    ultimoTiempo=Date.now();
    escena.add(elementos);
	//escena.add(edificios);
}
function renderEscena(){
        
        render.render(escena, cameraAtScene);

}
function animarEscena(){
        var delta=(Date.now()-ultimoTiempo)/1000;
        ultimoTiempo=Date.now();
        renderEscena();
        requestAnimationFrame(animarEscena);
}
function webGLStart() {
        iniciarEscena();
        animarEscena();        
}