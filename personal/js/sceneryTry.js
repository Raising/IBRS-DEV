

var basicElement = new Class({
	
	initialize: function(size){
		THREE.Object3D.call(this);
		this.size = size;
		this.height = 10;
		this.sceneryElement = [];
		
		this.geometry = new THREE.CubeGeometry(this.size,this.height,this.size);
		//this.texture = new THREE.ImageUtils.loadTexture('img/LogoNeoterra2.jpg');
		this.tapeteMaterial = new THREE.MeshLambertMaterial({ color:0x004444, side:THREE.DoubleSide });
		this.material = new THREE.MeshLambertMaterial({color:0x9999CC, side:THREE.FrontSide });
		
    					
				
	}
	
});













