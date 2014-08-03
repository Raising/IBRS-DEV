IBRS.TOOLS = {};

IBRS.TOOLS.JsonLoadedBuilding = function(descriptor){
    BasicElement.call(this);

    var element = this;
    

     jQuery.getJSON("DataBase/SceneryElement/"+descriptor+".json",function(data){     
        for (var i = 0; i < data.planes.length; i++){
            var plane = data.planes[i];
              
            var planeGeo = new THREE.CubeGeometry(plane.width+100,plane.height+100,plane.height+100);
           
            var texture = new THREE.ImageUtils.loadTexture("img/"+plane.texture);
            var material = new THREE.MeshBasicMaterial({ map: texture,side: THREE.DoubleSide});
            var mesh = new THREE.Mesh(planeGeo,material);
            mesh.position.set(plane.position.x,plane.position.y,plane.position.z);
            mesh.rotation.set(plane.rotation.x,plane.rotation.y,plane.rotation.z);
            element.add(mesh);
                   
        }

        element.heightOffset = data.heightOffset;
     });
    
    var geometry = new THREE.PlaneGeometry( 500, 50 );
            var material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
            var mesh= new THREE.Mesh( geometry, material ); 
            element.add(mesh);
        
 }

IBRS.TOOLS.JsonLoadedBuilding.prototype = Object.create(BasicElement.prototype);
