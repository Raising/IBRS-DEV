var CurrentCamera;

function SetunUpMouseInteraction(currentRenderDomElement) {
	var mouseIsDown = 0;
	var mouseDownPosition = new THREE.Vector3(0,0,0);
		
	currentRenderDomElement.addEventListener("mousewheel", MouseWheelHandler, false);// IE9, Chrome, Safari, Opera	
	currentRenderDomElement.addEventListener("DOMMouseScroll", MouseWheelHandler, false);// Firefox
	currentRenderDomElement.addEventListener('contextmenu', function (evt){evt.preventDefault();}, false);
	currentRenderDomElement.addEventListener('mousedown', function (evt) {
	    mouseIsDown=evt.which;
	    mouseDownPosition.x = evt.pageX;
	    mouseDownPosition.y = evt.pageY;        
	    switch (evt.which) {
	        case 1://left mouse
	            
	            break;
	        case 2://middle mouse
	        	
	            //alert('Middle mouse button presed');
	            break;
	        case 3://right mouse
	            break;
	        default://something wierd
	            alert('You have a strange mouse');
	    }
	},false);

	currentRenderDomElement.addEventListener('mousemove', function (evt) {
		if (mouseIsDown==3){
			//turn camera
			CameraReposition(0,
				0.03*(evt.pageX - mouseDownPosition.x),
				0.03*(evt.pageY - mouseDownPosition.y)
			);
		mouseDownPosition.x = evt.pageX;
	    mouseDownPosition.y = evt.pageY;
		}
	},false);

	currentRenderDomElement.addEventListener('mouseup', function (evt) {
		if (mouseIsDown==1 && evt.pageX == mouseDownPosition.x && evt.pageY == mouseDownPosition.y)
			{ findObjectByProyection(evt,this);}

		mouseIsDown=0;

	    
	    
	},false);

}
function getCanvasStats(scope){
	var canvasStat = [] ;
	canvasStat.Offset = jQuery(scope).offset();
  	canvasStat.width =jQuery(scope).width(); 
  	canvasStat.height =jQuery(scope).height();
  	canvasStat.paddingtop = 5;
  	canvasStat.paddingleft = 15;
  	return canvasStat; 
}	
function findObjectByProyection(evt,scope){

	var projector = new THREE.Projector();
	var directionVector = new THREE.Vector3();
  	var CanvasStats = getCanvasStats(scope);

    var clickx = evt.pageX - CanvasStats.Offset.left - CanvasStats.paddingleft;
    var clicky = evt.pageY - CanvasStats.Offset.top - CanvasStats.paddingtop ;
    directionVector.x = ( clickx / CanvasStats.width ) * 2 - 1;
    directionVector.y = -( clicky / CanvasStats.height ) * 2 + 1;

    var ray = projector.pickingRay(directionVector,CurrentCamera);
	var intersects = ray.intersectObjects(TargeteableElementsList, true);
	if (intersects.length) {
		var target = intersects[0].object.parent; 
			target.updateHtml();
		//target.scale.set(0.6,0.6,0.6);
		CameraReposition(0,0,0,target)  ;
	} 
}

function MouseWheelHandler(e) {
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	CameraReposition(delta*5,0,0)  ;
}  


function SetupOnClick(currentRenderDomElement) {
				
				currentRenderDomElement.addEventListener('click', function (evt) {
			  	var projector = new THREE.Projector();
    			var directionVector = new THREE.Vector3();
			  	var Offset = jQuery(this).offset();
			  	var width =jQuery(this).width(); 
			  	var height =jQuery(this).height(); 
			    var clickx = evt.pageX - Offset.left - 15;
			    var clicky = evt.pageY - Offset.top - 5;
			    directionVector.x = ( clickx / width ) * 2 - 1;
			    directionVector.y = -( clicky / height ) * 2 + 1;
			    var ray = projector.pickingRay(directionVector,CurrentCamera);
			
    			var intersects = ray.intersectObjects(escena.children, true);
					if (intersects.length) {
					var target = intersects[0].object; 
					//target.scale.set(0.6,0.6,0.6);
					CameraReposition(0,0,0,target)  ;
					}
			    }, false);	
}


//Camera setup
var Camera_Distance = 150;
var Camera_Horizonatl_Angle = 0;
var Camera_Vertical_Angle = Math.PI/3;
var Camera_lookAt;

function CameraReposition(distance_inc,hoizontalAngle_inc,verticalAngle_inc,targetObject){
	Camera_lookAt = targetObject = targetObject !== undefined ? targetObject : Camera_lookAt;
	CurrentCamera= cameraAtScene;
	Camera_Distance = Math.max(Camera_Distance+distance_inc,5);
	Camera_Horizonatl_Angle += hoizontalAngle_inc;
	Camera_Vertical_Angle += verticalAngle_inc;
	Camera_Vertical_Angle = Math.max(0,Math.min(Math.PI,Camera_Vertical_Angle));
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

