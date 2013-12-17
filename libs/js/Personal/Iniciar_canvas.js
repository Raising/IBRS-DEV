var escena;
var camara;
var render;

function iniciarEscena(){
				//Render
				
				
				render = new THREE.WebGLRenderer({premultipliedAlpha: false});

				render.setClearColor(0x660066, 0.4);

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
				}
			function renderEscena(){
				render.render(escena, camara);
			}
			function animarEscena(){
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
