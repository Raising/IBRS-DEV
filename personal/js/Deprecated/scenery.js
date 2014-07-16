

var scenery = new Class({
	
	initialize: function(size){
		this.size = size;
		this.height = 10;
		this.sceneryElement = [];
		
		this.geometry = new THREE.CubeGeometry(this.size,this.height,this.size);
		//this.texture = new THREE.ImageUtils.loadTexture('img/LogoNeoterra2.jpg');
		this.tapeteMaterial = new THREE.MeshLambertMaterial({ color:0x004444, side:THREE.DoubleSide });
		this.material = new THREE.MeshLambertMaterial({color:0x9999CC, side:THREE.FrontSide });
		
    					
				
	},
	
	
	calculateRepresentation: function(scene){
		this.geometry = new THREE.CubeGeometry(this.size,this.height,this.size);
		this.representation = new THREE.Mesh(this.geometry, this.material);
		this.representation.position.set(0, -(this.height/2),0);
		
		this.tapeteRepresentation = new THREE.Mesh(new THREE.PlaneGeometry(this.size, this.size, 1,1),this.tapeteMaterial);
		this.tapeteRepresentation.rotation.set(-Math.PI/2,0,0);
		this.tapeteRepresentation.position.set(0, 0.1,0);
		this.tapeteRepresentation.ID="tapete";
		this.representation.ID="bloque";
		scene.add(this.representation);
		scene.add(this.tapeteRepresentation);
				
	}
});













