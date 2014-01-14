
var escena;
var camara;
var render;
var ultimoTiempo;
var elementos;
var AnguloRotado = 0;
function iniciarEscena(){
				//Render
				
				
				render = new THREE.WebGLRenderer({premultipliedAlpha:false, alpha:true});

				render.setClearColor(new THREE.Color(0xff0000),0);

				var canvasWidth = 1280;
				var canvasHeight = 720;
				render.setSize(canvasWidth, canvasHeight);

				//document.getElementById("canvas").appendChild(render.domElement);

				
				
				//Escena
				escena = new THREE.Scene();

				//Camara
				camara = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);
				camara.position.set(-140, 60, -80);
				camara.lookAt(escena.position);
				escena.add(camara);
				//mapTextura = new THREE.ImageUtils.loadTexture('img/terrain01.png');
				
				//mapTextura.minFilter = THREE.NearestFilter;
    			//mapTextura.magFilter = THREE.NearestFilter;
    			
				
				var territory = new scenery(120);
				elementos = new THREE.Object3D();
				territory.calculateRepresentation(elementos);
				//mapGeometria.computeVertexNormals();
			
				var asuangMini = new Miniature(3,2.5,'img/Asuang.jpg','img/CA.png');
				asuangMini.position.set(-20,18,2.5);
				elementos.add(asuangMini);
	   
				
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
			     var ambientLight = new THREE.AmbientLight(0x111111);
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
				}
			function renderEscena(){
				render.render(escena, camara);
			}
			function animarEscena(){
				var delta=(Date.now()-ultimoTiempo)/1000;
				ultimoTiempo=Date.now();
				
				AnguloRotado = AnguloRotado - 0.30*delta;
				elementos.rotation.set(0,AnguloRotado,0);
				renderEscena();
				requestAnimationFrame(animarEscena);
			}
			function webGLStart() {
				//log = document.getElementById("log");

				iniciarEscena();
				//ultimoTiempo=Date.now();

				//document.onkeydown=teclaPulsada;
				//document.onkeyup=teclaSoltada;
				
				animarEscena();	
			}
