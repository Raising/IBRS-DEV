///
IBRS.tageteableElementsList = [];
IBRS.Graphics = function(){
    var graphics = this;
    alert ("iniciar_canvas_IBRRS is deprecated, use iniciar_IBRSGraphics.js instead ");
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


    this.referenceTime = 0;
    this.scenery = new IBRS.Scenery();
    this.scene.add(this.scenery);
    this.tageteableElementsList = [];//tienen uqe ser objetos 3d de THREE


    this.camera_Distance = 150;
    this.camera_Horizonatl_Angle = 0;
    this.camera_Vertical_Angle = Math.PI/3;
    this.camera_target = this.scene;

    this.addListToScene= function(list){
        for (var i=0;i<list.length;i++){
            graphics.scene.add(list[i]);
        }
    };



    this.startScene = function(){
        graphics.SetupUpMouseInteraction(graphics.render.domElement);
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
               

        graphics.camera_Distance = Math.max(graphics.camera_Distance+distance_inc,10);
        graphics.camera_Horizonatl_Angle += hoizontalAngle_inc;
        graphics.camera_Vertical_Angle += verticalAngle_inc;
        graphics.camera_Vertical_Angle = Math.max(0,Math.min(Math.PI,graphics.camera_Vertical_Angle));
        var current_target_position = new THREE.Vector3();
        current_target_position.setFromMatrixPosition( graphics.camera_target.matrixWorld );
        graphics.camera.position.set(
            current_target_position.x + graphics.camera_Distance*Math.cos(graphics.camera_Horizonatl_Angle)*Math.sin(graphics.camera_Vertical_Angle),
            current_target_position.y + graphics.camera_Distance*Math.cos(graphics.camera_Vertical_Angle),
            current_target_position.z + graphics.camera_Distance*Math.sin(graphics.camera_Horizonatl_Angle)*Math.sin(graphics.camera_Vertical_Angle)
        );
        var current_target_position = new THREE.Vector3();
        current_target_position.setFromMatrixPosition( graphics.camera_target.matrixWorld );
        graphics.camera.lookAt(current_target_position);

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
    var intersects = ray.intersectObjects(IBRS.tageteableElementsList, true);
    if (intersects.length) {
        var target = intersects[0].object.parent; 
            target.updateHtml();
        //target.scale.set(0.6,0.6,0.6);
        graphics.CameraReposition(0,0,0,target)  ;
    } 
}

this.MouseWheelHandler = function(e) {
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    graphics.CameraReposition(delta*5,0,0)  ;
} 


};
