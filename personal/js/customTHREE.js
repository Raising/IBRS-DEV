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

	this.reposition = function (distance_inc,hoizontalAngle_inc,verticalAngle_inc,targetObject){
		this.target = targetObject = targetObject !== undefined ? targetObject : this.target;
		this.distance = Math.max(this.distance+distance_inc,5);
		this.horizontalAngle += hoizontalAngle_inc;
		this.verticalAngle += verticalAngle_inc;
		this.verticalAngle = Math.max(0,Math.min(Math.PI,this.verticalAngle));
		var current_target_position = new THREE.Vector3();
		current_target_position.setFromMatrixPosition( this.target.matrixWorld );
		this.position.set(
			current_target_position.x + this.distance*Math.cos(this.horizontalAngle)*Math.sin(this.verticalAngle),
			current_target_position.y + this.distance*Math.cos(this.verticalAngle),
			current_target_position.z + this.distance*Math.sin(this.horizontalAngle)*Math.sin(this.verticalAngle)
		);
		var current_target_position = new THREE.Vector3();
		current_target_position.setFromMatrixPosition( this.target.matrixWorld );
		this.lookAt(current_target_position);
	}
};
IBRS.AngularCamera.prototype = Object.create( THREE.PerspectiveCamera.prototype );
