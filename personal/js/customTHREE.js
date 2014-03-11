//camera wich position is given by sferic coordinated center on the lookat object
IBRS.AngularCamera = function ( fov, aspect, near, far , target){
	THREE.PerspectiveCamera.call( this );

	this.fov = fov !== undefined ? fov : 50;
	this.aspect = aspect !== undefined ? aspect : 1;
	this.near = near !== undefined ? near : 0.1;
	this.far = far !== undefined ? far : 2000;

	this.distance = 150;
	this.horizontalAngle = 0;
	this.verticalAngle = Math.PI/3;
	this.target = target;

	this.updateProjectionMatrix();

	var camera = this;

	this.reposition = function (distance_inc,hoizontalAngle_inc,verticalAngle_inc,targetObject){
		camera.target = targetObject = targetObject !== undefined ? targetObject : camera.target;
		camera.distance = Math.max(camera.distance+distance_inc,5);
		camera.horizontalAngle += hoizontalAngle_inc;
		camera.verticalAngle += verticalAngle_inc;
		camera.verticalAngle = Math.max(0,Math.min(Math.PI,camera.verticalAngle));
		var current_target_position = new THREE.Vector3();
		current_target_position.setFromMatrixPosition( camera.target.matrixWorld );
		camera.position.set(
			current_target_position.x + camera.distance*Math.cos(camera.horizontalAngle)*Math.sin(camera.verticalAngle),
			current_target_position.y + camera.distance*Math.cos(camera.verticalAngle),
			current_target_position.z + camera.distance*Math.sin(camera.horizontalAngle)*Math.sin(camera.verticalAngle)
		);
		var current_target_position = new THREE.Vector3();
		current_target_position.setFromMatrixPosition( camera.target.matrixWorld );
		camera.lookAt(current_target_position);
	}
};
IBRS.AngularCamera.prototype = Object.create( THREE.PerspectiveCamera.prototype );
