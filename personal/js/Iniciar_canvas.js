
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
				
    			
				//Escena
				escena = new THREE.Scene();



				//Camara
				camara = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);
				camara.position.set(-140, 60, -80);
				camara.lookAt(escena.position);
				escena.add(camara);
				//mapTextura = new THREE.ImageUtils.loadTexture('img/terrain01.png');
				
				render.domElement.addEventListener('click', function (evt) {
			  	var projector = new THREE.Projector();
    			var directionVector = new THREE.Vector3();
			  	var Offset = jQuery(this).offset();
			  	var paddingTop =parseInt(jQuery('this').css('padding-top'));
			  	var paddingLeft = parseInt(jQuery('this').css('padding-left'));
	
			  	var width =jQuery(this).width(); 
			  	var height =jQuery(this).height(); 

  				 //or $(this).offset(); if you really just want the current element's offset
			    var clickx = evt.pageX - Offset.left - 15;
			    var clicky = evt.pageY - Offset.top - 5;
			    directionVector.x = ( clickx / width ) * 2 - 1;
			    directionVector.y = -( clicky / height ) * 2 + 1;
			   
			    // Unproject the vector
			    var ray = projector.pickingRay(directionVector,camara);
    			//projector.unprojectVector(directionVector, camara);
    			// Substract the vector representing the camera position
    			//directionVector.sub(camara.position);
    			//directionVector.normalize();
				// Now our direction vector holds the right numbers!
				//raycaster.set(camara.position, directionVector);

				var linematerial = new THREE.LineBasicMaterial({
					        color: 0x0000ff,linewidth:5
					    });

					var rayo = new THREE.Geometry();
					    rayo.vertices.push(new THREE.Vector3(camara.position.x,camara.position.y,camara.position.z));
					    rayo.vertices.push(new THREE.Vector3(camara.position.x+directionVector.x*100,camara.position.x+directionVector.xy*100,camara.position.x+directionVector.z*100));
					var line = new THREE.Line(rayo,linematerial);
					elementos.add(line);

    			var intersects = ray.intersectObjects(escena.children, true);
 				
					if (intersects.length) {
					// intersections are, by default, ordered by distance,
					// so we only care for the first one. The intersection
					// object holds the intersection point, the face that's
					// been "hit" by the ray, and the object to which that
					// face belongs. We only care for the object itself.
					var target = intersects[0].object;
					 
					target.scale.set(0.2,0.2,0.2);
					}
			    }, false);				
				//mapTextura.minFilter = THREE.NearestFilter;
    			//mapTextura.magFilter = THREE.NearestFilter;
    			
				
				var territory = new scenery(120);
				elementos = new THREE.Object3D();
				elementos.ID = "elementos";
				territory.calculateRepresentation(elementos);
				//mapGeometria.computeVertexNormals();
			
				var asuangMini = new Miniature(3,2.5,'img/Asuang.jpg','img/CA.png');
				asuangMini.position.set(-20,18,2.5);
				asuangMini.ID = "asuang";
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
