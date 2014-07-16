///
IBRS.Graphics = function(){
    var graphics = this;
    this.render = new THREE.WebGLRenderer({premultipliedAlpha:false, alpha:true});
    this.render.setClearColor(new THREE.Color(0xff0000),0);
    var canvasWidth = 1280;
    var canvasHeight = 720;
    this.render.setSize(canvasWidth, canvasHeight);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);
    this.scene.add(this.camera);
    
    var light = new THREE.PointLight(0xffffff);
    light.position.set(40,10,40);
    this.scene.add(light);

    var globalLight = new THREE.AmbientLight(0x444444);
    this.scene.add(globalLight);
    this.referenceTime = 0;
    //this.scene.add(this.gameArea);
    this.tageteableElementsList = [];//tienen uqe ser objetos 3d de THREE



    this.camera_Distance = 150;
    this.camera_Horizonatl_Angle = 0;
    this.camera_Vertical_Angle = Math.PI/3;
    this.camera_target = this.scene;

    this.addListToScene= function(list,targeteable){
        for (var i=0;i<list.length;i++){
            graphics.scene.add(list[i]);
            if (targeteable){
                graphics.tageteableElementsList.push(list[i]);
            }
        }
    };




    this.startScene = function(){
        graphics.SetupUpMouseInteraction(graphics.render.domElement);
        graphics.SetupUpLeapInteraction();
        graphics.CameraReposition(0,0,0);
    };

    this.renderScene = function(){
        
        graphics.render.render(graphics.scene, graphics.camera);

    };
    this.animateScene= function(){
       // var delta=(Date.now()- this.referenceTime )/1000;
       // this.referenceTime =Date.now();
        graphics.renderScene();

        requestAnimationFrame(graphics.animateScene);
    };
    this.webGLStart= function () {
        graphics.startScene();
        graphics.animateScene();        
    };

    this.setupGame= function(newGame){


    };
    this.setTargeteableElements=function(newList){
        graphics.tageteableElementsList = newList;
    };


/* CANVAS INTERACTION
THIS METODS PURPOSE IS TO HANDLE THE USER INTERACTION OVER THE CANVAS
*/
this.CameraReposition = function(distance_inc,hoizontalAngle_inc,verticalAngle_inc,targetObject){
        graphics.camera_target = targetObject = targetObject !== undefined ? targetObject : graphics.camera_target;
               

        graphics.camera_Distance = Math.max(graphics.camera_Distance+distance_inc,0.2);
        graphics.camera_Horizonatl_Angle += hoizontalAngle_inc;
        graphics.camera_Vertical_Angle += verticalAngle_inc;
        graphics.camera_Vertical_Angle = Math.max(0,Math.min(Math.PI,graphics.camera_Vertical_Angle));
        var current_target_position = new THREE.Vector3();
        current_target_position.setFromMatrixPosition( graphics.camera_target.matrixWorld );
        graphics.camera.position.set(
            current_target_position.x + graphics.camera_Distance*Math.cos(graphics.camera_Horizonatl_Angle)*Math.sin(graphics.camera_Vertical_Angle),
            current_target_position.y + 3 + graphics.camera_Distance*Math.cos(graphics.camera_Vertical_Angle),
            current_target_position.z + graphics.camera_Distance*Math.sin(graphics.camera_Horizonatl_Angle)*Math.sin(graphics.camera_Vertical_Angle)
        );
        var current_target_position = new THREE.Vector3();
        current_target_position.setFromMatrixPosition( graphics.camera_target.matrixWorld );
        current_target_position.y +=3;
        graphics.camera.lookAt(current_target_position);

    };

this.CameraPosition = function(distance,hoizontalAngle,verticalAngle,targetObject){
        graphics.camera_target = targetObject = targetObject !== undefined ? targetObject : graphics.camera_target;
               

        graphics.camera_Distance = Math.max(distance,0.2);
        graphics.camera_Horizonatl_Angle = hoizontalAngle;
        graphics.camera_Vertical_Angle = verticalAngle;
        graphics.camera_Vertical_Angle = Math.max(0.1,Math.min(Math.PI,graphics.camera_Vertical_Angle));
        
        var current_target_position = new THREE.Vector3();
        current_target_position.setFromMatrixPosition( graphics.camera_target.matrixWorld );
        graphics.camera.position.set(
            current_target_position.x + graphics.camera_Distance*Math.cos(graphics.camera_Horizonatl_Angle)*Math.sin(graphics.camera_Vertical_Angle),
            current_target_position.y + 3 + graphics.camera_Distance*Math.cos(graphics.camera_Vertical_Angle),
            current_target_position.z + graphics.camera_Distance*Math.sin(graphics.camera_Horizonatl_Angle)*Math.sin(graphics.camera_Vertical_Angle)
        );
        var current_target_position = new THREE.Vector3();
        current_target_position.setFromMatrixPosition( graphics.camera_target.matrixWorld );
        current_target_position.y +=3;
        graphics.camera.lookAt(current_target_position);

    };


this.SetupUpLeapInteraction = function(){
    var options = { enableGestures: false }
    var lastPosition = [0,0,0];
    

    Leap.loop(options, function(frame) {
        if(frame.hands.length == 1 ){
            var hand =  frame.hands[0];
            if (frame.id%2 == 0){
                var actualPosition =  hand.fingers[0].dipPosition;
                if (hand.confidence > 0.7 && hand.pinchStrength<0.90){
                    lastPosition =  actualPosition;
                }
                else if (hand.confidence > 0.7 && hand.pinchStrength>0.90){
                  var actDistance = Math.sqrt(actualPosition[0]*actualPosition[0]+actualPosition[1]*actualPosition[1]+actualPosition[2]*actualPosition[2]);
                  var lastDistance = Math.sqrt(lastPosition[0]*lastPosition[0]+lastPosition[1]*lastPosition[1]+lastPosition[2]*lastPosition[2]);
                  var actHorizontalAngle =  Math.atan2(actualPosition[2],actualPosition[0]);
                  var actVerticalAngle =   Math.acos(actualPosition[1]/actDistance); 
                  var lastHorizontalAngle =  Math.atan2(lastPosition[2],lastPosition[0]);
                  var lastVerticalAngle =   Math.acos(lastPosition[1]/lastDistance);
                  //alert(distance);
                  graphics.CameraReposition(actDistance-lastDistance,lastHorizontalAngle-actHorizontalAngle,actVerticalAngle-lastVerticalAngle);
                   lastPosition =  actualPosition;
                }
            }
        }    
          // Showcase some new V2 features
    });

}

this.SetupUpMouseInteraction = function(currentRenderDomElement){
    var mouseIsDown = 0;
    var mouseDownPosition = new THREE.Vector3(0,0,0);
        
    currentRenderDomElement.addEventListener("mousewheel", graphics.MouseWheelHandler, false);// IE9, Chrome, Safari, Opera  
    currentRenderDomElement.addEventListener("DOMMouseScroll", graphics.MouseWheelHandler, false);// Firefox
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
            graphics.CameraReposition(0,
                0.03*(evt.pageX - mouseDownPosition.x),
                0.03*(evt.pageY - mouseDownPosition.y)
            );
        mouseDownPosition.x = evt.pageX;
        mouseDownPosition.y = evt.pageY;
        }
    },false);

    currentRenderDomElement.addEventListener('mouseup', function (evt) {
        if (mouseIsDown==1 && evt.pageX == mouseDownPosition.x && evt.pageY == mouseDownPosition.y)
            { graphics.findObjectByProyection(evt,this);}

        mouseIsDown=0;

        
        
    },false);

}


this.getCanvasStats = function(scope){
    var canvasStat = [] ;
    canvasStat.Offset = jQuery(scope).offset();
    canvasStat.width =jQuery(scope).width(); 
    canvasStat.height =jQuery(scope).height();
    canvasStat.paddingtop = 5;
    canvasStat.paddingleft = 15;
    return canvasStat; 
}   

this.findObjectByProyection = function(evt,scope){

    var projector = new THREE.Projector();
    var directionVector = new THREE.Vector3();
    var CanvasStats = graphics.getCanvasStats(scope);

    var clickx = evt.pageX - CanvasStats.Offset.left - CanvasStats.paddingleft;
    var clicky = evt.pageY - CanvasStats.Offset.top - CanvasStats.paddingtop ;
    directionVector.x = ( clickx / CanvasStats.width ) * 2 - 1;
    directionVector.y = -( clicky / CanvasStats.height ) * 2 + 1;

    var ray = projector.pickingRay(directionVector,graphics.camera);
    var intersects = ray.intersectObjects(graphics.tageteableElementsList, true);
    if (intersects.length) {
        var target = intersects[0].object.parent; 
        target.onElementClick();
        graphics.CameraReposition(0,0,0,target)  ;
    } 
}

this.MouseWheelHandler = function(e) {
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    graphics.CameraReposition(delta*5,0,0)  ;
} 


};



IBRS.UnitGraphic = function(height,baseDiameter,miniatureTexture,baseTexture,logicModel){
       TargeteableElement.call(this);
       var unitGraphic = this;
       this.logicModel = logicModel;
       this.logicModel.tacticalGroup.container.append(this.container);
    
       this.height = height;
       var baseHeight = 0.5;
       var MiniatureTextureMap = new THREE.ImageUtils.loadTexture(miniatureTexture);
       var BaseTextureMap = new THREE.ImageUtils.loadTexture(baseTexture);
       var GeoBase = new THREE.BaseGeometry(baseDiameter*0.45,baseDiameter/2,baseHeight,20,1);
       var GeoLapida = new THREE.LapidaGeometry(baseDiameter*0.8,height,0.3);
       this.TopPiece= new THREE.Mesh(GeoLapida,new THREE.MeshLambertMaterial( { map: MiniatureTextureMap} ));
       this.BasePiece = new THREE.Mesh(GeoBase,
        new THREE.MeshFaceMaterial([
            new THREE.MeshLambertMaterial( { map: BaseTextureMap}),
            new THREE.MeshBasicMaterial( { color:0x000000})]));
        this.BasePiece.position.set(0,baseHeight/2,0);
        this.TopPiece.position.set(0,baseHeight,0);
        
        this.add(this.BasePiece);
        this.add(this.TopPiece);
       
       for (var i = 0; i< this.children.length;i++){
            this.children[i].onClick = this;
        }

        this.refactor = function (height,baseDiameter,miniatureTexture,baseTexture){

            unitGraphic.children = [];

            var MiniatureTextureMap = new THREE.ImageUtils.loadTexture(miniatureTexture);
            var BaseTextureMap = new THREE.ImageUtils.loadTexture(baseTexture);
            var GeoBase = new THREE.BaseGeometry(baseDiameter*0.45,baseDiameter/2,baseHeight,20,1);
            var GeoLapida = new THREE.LapidaGeometry(baseDiameter*0.8,height,0.3);
            unitGraphic.TopPiece= new THREE.Mesh(GeoLapida,new THREE.MeshLambertMaterial( { map: MiniatureTextureMap} ));
            unitGraphic.BasePiece = new THREE.Mesh(GeoBase,
            new THREE.MeshFaceMaterial([
            new THREE.MeshLambertMaterial( { map: BaseTextureMap}),
            new THREE.MeshBasicMaterial( { color:0x000000})]));
            unitGraphic.BasePiece.position.set(0,baseHeight/2,0);
            unitGraphic.TopPiece.position.set(0,baseHeight,0);
        
            unitGraphic.add(unitGraphic.BasePiece);
            unitGraphic.add(unitGraphic.TopPiece);
            unitGraphic.selector.scale.set(baseDiameter,height+baseHeight,baseDiameter);
            unitGraphic.selector.position.set(0,(height+baseHeight)/2,0);
            unitGraphic.add(this.selector);
       
       for (var i = 0; i< unitGraphic.children.length;i++){
            unitGraphic.children[i].onClick = this;
        }

        unitGraphic.updateHtml();

        };

     
}
IBRS.UnitGraphic.prototype = Object.create(TargeteableElement.prototype);




IBRS.TableGraphic = function(dimension,coverTexture){

    BasicElement.call(this);
    var tableGraphic = this;
    var CoverTextureMap =  new THREE.ImageUtils.loadTexture(coverTexture);
    var WoodTextureMap =  new THREE.ImageUtils.loadTexture("img/woodtexture.jpg");
    var GeoTop = new THREE.CubeGeometry(dimension.x,dimension.y,dimension.z);
        for (var i = 0; i<GeoTop.faces.length;i++){ GeoTop.faces[i].materialIndex = 0;}
        GeoTop.faces[4].materialIndex = GeoTop.faces[5].materialIndex = 1;
    var GeoLeg = new THREE.CubeGeometry(dimension.x*0.1,dimension.y*2,dimension.z*0.1);
    
    this.TableTop = new THREE.Mesh(GeoTop,
        new THREE.MeshFaceMaterial([
            new THREE.MeshLambertMaterial({ map: WoodTextureMap}),
            new THREE.MeshLambertMaterial({ map: CoverTextureMap} )]));
    
    this.TableTop.position.set(0,-dimension.y/2,0);
    this.add(this.TableTop);
    this.TableLegs=[];

    for (var i = 0;i<4;i++){
        var leg =new THREE.Mesh(GeoLeg,new THREE.MeshLambertMaterial( { map: WoodTextureMap}));
        leg.position.set((1-(i%2)*2)*dimension.x*0.4,-dimension.y*2,(1-parseInt(i/2)*2)*dimension.z*0.4); 
        
        this.TableLegs.push(leg);
        this.add(this.TableLegs[i]);
        }

    this.refactor = function (dimension,coverTexture){

        tableGraphic.children = [];
        CoverTextureMap =  new THREE.ImageUtils.loadTexture("img/"+coverTexture);
        GeoTop = new THREE.CubeGeometry(dimension.x,dimension.y,dimension.z);
            for (var i = 0; i<GeoTop.faces.length;i++){ GeoTop.faces[i].materialIndex = 0;}
            GeoTop.faces[4].materialIndex = GeoTop.faces[5].materialIndex = 1;
        
        tableGraphic.TableTop = new THREE.Mesh(GeoTop,
            new THREE.MeshFaceMaterial([
                new THREE.MeshLambertMaterial({ map: WoodTextureMap}),
                new THREE.MeshLambertMaterial({ map: CoverTextureMap} )]));
    
        tableGraphic.TableTop.position.set(0,-dimension.y/2,0);
        tableGraphic.add(tableGraphic.TableTop);
   };



};


IBRS.TableGraphic.prototype = Object.create(BasicElement.prototype);

IBRS.SceneryGraphic = function(dimension){
    BasicElement.call(this);
    var sceneryGraphic = this;

    /*this.main_texture =  new THREE.ImageUtils.loadTexture(frontalTexture);
    this.textures = [];
    this.textures.push(this.main_texture);
    for (var i = 1; i< 6;i++){
            this.textures.push(new THREE.ImageUtils.loadTexture("img/edificioFace"+i+tipo+".jpg"));
        }*/
    var GeoEdificio = new THREE.CubeGeometry(dimension.x,dimension.y,dimension.z);
    
    var MeshEdificio = new THREE.Mesh(GeoEdificio,new THREE.MeshNormalMaterial({color:0x156000}));
    MeshEdificio.position.set(0,dimension.y/2,0);
    this.add(MeshEdificio);

	
	this.refactor = function(sceneryModelID,dimension){
      
            sceneryGraphic.children = [];
            GeoEdificio = new THREE.CubeGeometry(dimension.x,dimension.y,dimension.z);
            MeshEdificio = new THREE.Mesh(GeoEdificio,new THREE.MeshNormalMaterial({color:0x156000}));
            MeshEdificio.position.set(0,dimension.y/2,0);
            sceneryGraphic.add(MeshEdificio);
           
	   	//implementar cambio de modelo al que se carge por ajax
	}
};

IBRS.SceneryGraphic.prototype = Object.create(BasicElement.prototype);
