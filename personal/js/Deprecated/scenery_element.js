var sceneryElement = new Class({

    initialize: function(type,coord,dimen){
        this.type = type;//1 = cubico, 2 = cilincrico, 3 = rampa?
		this.coordinates = coord;
		this.dimensions = dimen;
		
    },
	
	calculateRepresentation: function(scene){
		
		switch(this.type){
			case 1: //Cubo plano
				scene.add(new primitiveElement(1,this.coordinates,this.dimensions).calculateRepresentation());
			break;
			case 2: //Cilindro plano
				scene.add(new primitiveElement(2,this.coordinates,this.dimensions).calculateRepresentation());
			break;
			
			
			case 3:// edificio basico, dimensines ancho alto largo, rotaciones y posicion aplicados a posteriori.
				var group = new THREE.Object3D();//create an empty container
				//techo
				group.add(new primitiveElement(1,new coordinate(0,this.dimensions.z_heith,0,0,0,0), new dimension(this.dimensions.x_radio+3,0.3,this.dimensions.y_radio)).calculateRepresentation(1));//techo
				//paredes limpias
				group.add(new primitiveElement(1,new coordinate(0,0,-((this.dimensions.y_radio/2)+0.15),0,0,0), new dimension(this.dimensions.x_radio,this.dimensions.z_heith+1.5,0.3)).calculateRepresentation(0));
				group.add(new primitiveElement(1,new coordinate(0,0, ((this.dimensions.y_radio/2)+0.15),0,0,0), new dimension(this.dimensions.x_radio,this.dimensions.z_heith+1.5,0.3)).calculateRepresentation(0));
				//paredes de enganche
				group.add(new primitiveElement(1,new coordinate(-((this.dimensions.x_radio/2)+0.15),0,0,0,0,0), new dimension(0.3,this.dimensions.z_heith,this.dimensions.y_radio)).calculateRepresentation(0));
				group.add(new primitiveElement(1,new coordinate( ((this.dimensions.x_radio/2)+0.15),0,0,0,0,0), new dimension(0.3,this.dimensions.z_heith,this.dimensions.y_radio)).calculateRepresentation(0));
				group.add(new primitiveElement(1,new coordinate(-((this.dimensions.x_radio/2)+0.15),this.dimensions.z_heith,((this.dimensions.y_radio/2)-1.25),0,0,0), new dimension(0.3,1.5,2.5)).calculateRepresentation(0));
				group.add(new primitiveElement(1,new coordinate(-((this.dimensions.x_radio/2)+0.15),this.dimensions.z_heith,-((this.dimensions.y_radio/2)-1.25),0,0,0), new dimension(0.3,1.5,2.5)).calculateRepresentation(0));
				group.add(new primitiveElement(1,new coordinate(((this.dimensions.x_radio/2)+0.15),this.dimensions.z_heith,((this.dimensions.y_radio/2)-1.25),0,0,0), new dimension(0.3,1.5,2.5)).calculateRepresentation(0));
				group.add(new primitiveElement(1,new coordinate(((this.dimensions.x_radio/2)+0.15),this.dimensions.z_heith,-((this.dimensions.y_radio/2)-1.25),0,0,0), new dimension(0.3,1.5,2.5)).calculateRepresentation(0));
				//colocacion
				group.rotation.set(this.coordinates.rotx,this.coordinates.rotz,this.coordinates.roty);
				group.position.set(this.coordinates.x,this.coordinates.z,this.coordinates.y);
				
				scene.add( group );//when done, add the group to the scene
			break;
			
			case 4:
				
			break;
		
			
			default:
				this.geometry = new THREE.CubeGeometry(this.dimensions.x_radio,this.dimensions.z_heith,this.dimensions.y_radio);
		}
			
	}
});

var coordinate = new Class({

	initialize: function(x,z,y,rotx,rotz,roty){
		this.x = x;
		this.y = y;
		this.z = z;
		this.rotx = rotx;
		this.roty = roty;
		this.rotz = rotz;
	}

});



var dimension = new Class({

	initialize: function(x_radio,z_heith,y_radio){
		this.x_radio = x_radio;
		this.y_radio = y_radio;
		this.z_heith = z_heith;
	}

});

