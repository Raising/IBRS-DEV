var primitiveElement = new Class({

    initialize: function(type,coord,dimen){
        this.type = type;//1 = cubico, 2 = cilincrico, 3 = rampa?
		this.coordinates = coord;
		this.dimensions = dimen;
		
    },
	
	calculateRepresentation: function( textura){
		
		switch(this.type){
			case 1: //Cubo plano
				this.geometry = new THREE.CubeGeometry(this.dimensions.x_radio,this.dimensions.z_heith,this.dimensions.y_radio);
			break;
			case 2: //Cilindro plano
				this.geometry = new THREE.CylinderGeometry(this.dimensions.x_radio,this.dimensions.y_radio,this.dimensions.z_heith,20,1,false);
				break;
			default:
				this.geometry = new THREE.CubeGeometry(this.dimensions.x_radio,this.dimensions.z_heith,this.dimensions.y_radio);
		}
		if (textura == 0){
		var texture =  0x782288;
		}
		else{
		var texture = 0x44FF66;
			}
		this.representation = new THREE.Mesh(this.geometry,new THREE.MeshLambertMaterial({color:texture,	side:THREE.FrontSide}));
		this.representation.rotation.set(this.coordinates.rotx,this.coordinates.rotz,this.coordinates.roty);
		this.representation.position.set(this.coordinates.x,this.coordinates.z+(this.dimensions.z_heith/2),this.coordinates.y);
		return this.representation;
	}
});

