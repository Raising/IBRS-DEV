var CurrentCamera ;

function SetunOpMouseDown(currentRenderDomElement){
			jQuery('#canvas').mousedown(function(event) {
			    switch (event.which) {
			        case 1://left mouse
			            alert('Left mouse button pressed');
			            break;
			        case 2://middle mouse
			            alert('Middle mouse button pressed');
			            break;
			        case 3://right mouse
			            alert('Right mouse button pressed');
			            break;
			        default://something wierd
			            alert('You have a strange mouse');
			    }
			    return false;
			});
}
function SetupOnClick(currentRenderDomElement) {
				currentRenderDomElement.addEventListener('contextmenu', function (evt){evt.preventDefault();}, false);
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

function SetupOnScroll(currentRenderDomElement){
        var scrollStatus=0; 
		var lastScrollPosition=0;
        var ScrollDirection;
		// IE9, Chrome, Safari, Opera
		currentRenderDomElement.addEventListener("mousewheel", MouseWheelHandler, false);
		// Firefox
		currentRenderDomElement.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
		
	function MouseWheelHandler(e) {
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	CameraReposition(delta*10,0,0)  ;
	}   
}
//Camera setup
var Camera_Distance = 150;
var Camera_Horizonatl_Angle = 0;
var Camera_Vertical_Angle = Math.PI/3;
var Camera_lookAt;

function CameraReposition(distance_inc,hoizontalAngle_inc,verticalAngle_inc,targetObject){
	Camera_lookAt = targetObject = targetObject !== undefined ? targetObject : Camera_lookAt;
	CurrentCamera= cameraAtScene;
	Camera_Distance += distance_inc;
	Camera_Horizonatl_Angle += hoizontalAngle_inc;
	Camera_Vertical_Angle += verticalAngle_inc;
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