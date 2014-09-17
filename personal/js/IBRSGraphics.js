///
IBRS.refreshObjects = function (){
        IBRS.actualGraphics.refreshSceneObjects(IBRS.actualGame);
}

IBRS.Graphics = function(){
    var graphics = this;
    IBRS.actualGraphics = this;
    this.render = new THREE.WebGLRenderer({premultipliedAlpha:false, alpha:true, antialias: true });
    this.render.autoClear = false;
    this.render.setClearColor(new THREE.Color(0xff0000),0);
    this.canvasWidth = 1280;
    this.canvasHeight = 720;
    this.render.setSize(this.canvasWidth, this.canvasHeight);

    this.scene = new THREE.Scene();

    //this.scene.fog = new THREE.Fog( 0x000000, 1500, 2100 );
    this.camera = new THREE.PerspectiveCamera(45, this.canvasWidth / this.canvasHeight, 0.1, 1000);
    this.cameraOrtho = new THREE.OrthographicCamera(-this.canvasWidth/2,this.canvasWidth/2,this.canvasHeight/2,-this.canvasHeight/2,1,10);
    this.cameraOrtho.position.z = 10;
    this.sceneOrtho  = new THREE.Scene();

    this.scene.add(this.camera);
    this.reproductor = new IBRS.Reproductor(this);
    
    //luces
    var light = new THREE.PointLight(0xffffff);
    light.position.set(40,10,40);
    this.scene.add(light);

    var globalLight = new THREE.AmbientLight(0x444444);
    this.scene.add(globalLight);
    this.referenceTime = 0;


   

    //Puntero LEAP MOTION
    //cambiar la opacidad para activar el puntero del leap motion
    var spherePointer = new THREE.Mesh(new THREE.SphereGeometry( 1, 12, 12 ),new THREE.MeshBasicMaterial( {color: 0xff5500,wireframe:false,opacity: 0.7,transparent: true}));
    var cylinderPointer = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,300),new THREE.MeshBasicMaterial( {color: 0xff5500,wireframe:false,opacity: 0.7,transparent: true}));
    this.pointer = new THREE.Object3D();
    this.pointer.add(spherePointer);
    this.pointer.add(cylinderPointer);
    this.scene.add(this.pointer);
        

    this.tageteableElementsList = [];//tienen uqe ser objetos 3d de THREE


    this.camera_Distance = 150;
    this.camera_Horizonatl_Angle = 0;
    this.camera_Vertical_Angle = Math.PI/3;
    this.camera_target = this.scene;
    this.sceneObjects = new THREE.Object3D();
    this.scene.add(this.sceneObjects);

    this.refreshSceneObjects = function(game){
        graphics.scene.remove(graphics.sceneObjects);
        graphics.sceneObjects = new THREE.Object3D();
        graphics.scene.add(graphics.sceneObjects);
        graphics.addListToScene(game.getMiniatures(),true);
        graphics.addListToScene(game.getSceneryElementList(),false);
        
    };

    this.addListToScene= function(list,targeteable){
        for (var i=0;i<list.length;i++){
            graphics.sceneObjects.add(list[i]);
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
      
        graphics.render.clear();
        graphics.render.render(graphics.scene, graphics.camera );
        graphics.render.clearDepth();
        graphics.render.render(graphics.sceneOrtho, graphics.cameraOrtho );


    };
    this.animateScene= function(){
        //var delta=(Date.now()- this.referenceTime )/1000;
        // this.referenceTime =Date.now();
        graphics.reproductor.update();
        graphics.renderScene();
        requestAnimationFrame(graphics.animateScene);
    };
    this.webGLStart= function () {
        graphics.startScene();
        graphics.animateScene();        
    };

    this.insertGameData= function(newGame){
       graphics.refreshSceneObjects(newGame);
       // graphics.addListToScene(newGame.getMiniatures(),true);
       // graphics.addListToScene(newGame.getSceneryElementList(),false);
        graphics.reproductor.insertEvents(newGame.events);
        var stringJson = JSON.stringify(newGame.events,null,'\t');
        var blob = new Blob([stringJson], {type: "application/json"});
        var urll  = URL.createObjectURL(blob);
        jQuery("#getJson").attr("href",urll);
    };

    this.setTargeteableElements=function(newList){
        graphics.tageteableElementsList = newList;
    };

    this.playGame = function(){
        graphics.reproductor.start();
    };
    this.pauseGame = function(){
        if (graphics.reproductor.playing){
            graphics.reproductor.pause();
        }
        else{
            graphics.reproductor.continue();
            }

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
    }
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
    }
    this.GetClosestTargeteableElement = function(position){
        var closest = graphics.tageteableElementsList[0];
        var bestDistance = 800;
        for (var i = graphics.tageteableElementsList.length - 1; i >= 0; i--) {
            var actualPosition = graphics.tageteableElementsList[i].position;
            var distance = Math.sqrt((actualPosition.x-position.x)*(actualPosition.x-position.x)+(actualPosition.y-position.y)*(actualPosition.y-position.y)+(actualPosition.z-position.z)*(actualPosition.z-position.z));
            if (distance < bestDistance){
                bestDistance = distance;
                closest = graphics.tageteableElementsList[i];
            }
        }
        return closest;
    }
    var carpDistance =  function(frame){
        return Math.sqrt(Math.pow(frame.fingers[0].mcpPosition[0]-frame.fingers[5].mcpPosition[0],2)+
                                        Math.pow(frame.fingers[0].mcpPosition[1]-frame.fingers[5].mcpPosition[1],2)+
                                        Math.pow(frame.fingers[0].mcpPosition[2]-frame.fingers[5].mcpPosition[2],2));
    }
    var distance3D = function(pointA,pointB){
        return Math.sqrt(Math.pow(pointA[0]-pointB[0],2)+
                                        Math.pow(pointA[1]-pointB[1],2)+
                                        Math.pow(pointA[2]-pointB[2],2));
   }

    this.SetupUpLeapInteraction = function(){
     
        var options = { enableGestures: false }
        var lastPosition = [0,0,0];
       

var lastTimeSelection = -100;
var playTreshold = -100;
var izqPresente = false;
var derPresente = false;
var izqDisplay = jQuery("#leap_hand_izq");
var derDisplay = jQuery("#leap_hand_der");
var menuArray = ["#menu_search","#menu_initial","#menu_events","#reproductor"];
var tabArray =["#tab0","#tab1","#tab2","#tab3"];
var actualMenu = 0;
var fullScreen = false;
     Lctrl = Leap.loop(options, function(frame) {
            /*if (lastTimeSelection === undefined){
                var lastTimeSelection = -100;   
            }*/
            izqPresente = false;
            derPresente = false;


            if (frame.id%2 == 0){


                for (var i = frame.hands.length - 1; i >= 0; i--) {
                    var hand = frame.hands[i];
           
                    if (hand.type == "left"){//mano de manipulacion de camara
                        izqPresente = true; 
                        izqDisplay.css( "background-color", "green" ).empty().append(Math.round(hand.confidence * 100) / 100 );
                        var actualPosition =  hand.fingers[0].dipPosition;
                        if (hand.confidence > 0.4 && hand.pinchStrength<0.9){ //&& hand.grabStrength < 0.9){
                            lastPosition =  actualPosition;
                        }
                        else if (hand.confidence > 0.4 && hand.pinchStrength>0.9){
                          graphics.CameraReposition((actualPosition[2]-lastPosition[2]),(lastPosition[0]-actualPosition[0])/100,(lastPosition[1]-actualPosition[1])/100);
                          lastPosition =  actualPosition;
                        }
                    
                    }
                    else if(hand.type = "right"){//mano de puntero, se podria partir el espacio de interaccion y suponer que la mano derecha está solo en ese eje
                        derPresente = true;
                            derDisplay.css( "background-color", "green" ).empty().append(Math.round(hand.confidence * 100) / 100 );
                       
                            var indicePos = hand.fingers[0].dipPosition;
                            var sinA =  Math.sin(graphics.camera_Horizonatl_Angle);
                            var cosA =  Math.cos(graphics.camera_Horizonatl_Angle);
                            graphics.pointer.position.set((cosA*indicePos[2]+sinA*(indicePos[0]-80))*0.005*graphics.camera_Distance,indicePos[1]*0.2-20,-(cosA*(indicePos[0]-80)-sinA*indicePos[2])*0.005*graphics.camera_Distance);
                        
                        if (hand.confidence > 0.4 && hand.pinchStrength>0.9 && lastTimeSelection < (frame.id-20)){
                                   var elementSelected = graphics.GetClosestTargeteableElement(graphics.pointer.position);
                            elementSelected.onElementClick();
                            console.log("eligiendo elemento")
                            graphics.CameraReposition(0,0,0,elementSelected);
                            lastTimeSelection = frame.id;
                        }
                    }
                }
                // Gestos
                //plaY/pause, juntar muñecas
               /* if (playTreshold == undefined || playTreshold < 0){
                    var playTreshold = -100;   
                }*/
                if (playTreshold < Lctrl.frame(0).id-50){
                    frame0 = Lctrl.frame(0);
                      if (frame0.hands.length == 2 &&  Lctrl.frame(10).hands.length == 2){
                        
                        cistance = carpDistance(frame0);
                           if (cistance<40 && playTreshold < (frame0.id-50)){
                            
                            if(carpDistance(Lctrl.frame(10))>80){
                                playTreshold = frame0.id; 
                                graphics.pauseGame();    
                            }
                        }
                    } 
                       if (frame0.hands.length > 0 && 
                        Lctrl.frame(0).hands.length ==  Lctrl.frame(20).hands.length ){
                       // console.log(frame0);
                        for (var i = 0; i < Math.min(Lctrl.frame(20).hands.length,Lctrl.frame(0).hands.length,Lctrl.frame(10).hands.length,Lctrl.frame(5).hands.length); i++) {
                            if (Lctrl.frame(0).hands[i].fingers[1].tipPosition[2] > -150 && 
                                Lctrl.frame(10).hands[i].fingers[1].tipPosition[2] < -150 && 
                                Lctrl.frame(20).hands[i].fingers[1].tipPosition[2] > -150   ){
                                playTreshold = frame0.id;
                                if (Lctrl.frame(10).hands[i].fingers[1].tipPosition[0] > 0){
                                            actualMenu = (actualMenu+1)%4;
                                        }else{
                                            actualMenu = (actualMenu+3)%4;
                                        }
                                        ////
                                        var thisMenu =jQuery(tabArray[actualMenu]);
                                        thisMenu.parent().parent().children().removeClass("active");
                                        thisMenu.parent().addClass("active");
                                        ///
                                        jQuery("#menu_area").slideUp(function(){
                                        jQuery("#menu_area > div").appendTo(jQuery("#hidden_storage"));
                                        jQuery(menuArray[actualMenu]).appendTo(jQuery("#menu_area"));
                                        if (menuArray[actualMenu] == "#menu_initial" || menuArray[actualMenu] == "#menu_events" ){jQuery("#canvas").appendTo(jQuery("#menu_area"));}
                                            }).slideDown();

                           }
                           //console.log(Lctrl.frame(0).hands[i].fingers[1].tipPosition[1]+"  "+Lctrl.frame(0).hands[i].fingers[2].tipPosition[1]);
                            if (Lctrl.frame(0).hands[i].fingers[1].tipPosition[1] < (Lctrl.frame(0).hands[i].fingers[2].tipPosition[1]-5) &&
                                Lctrl.frame(5).hands[i].fingers[1].tipPosition[1] > (Lctrl.frame(5).hands[i].fingers[2].tipPosition[1]+5) &&
                                Lctrl.frame(10).hands[i].fingers[1].tipPosition[1] < (Lctrl.frame(10).hands[i].fingers[2].tipPosition[1]-5) 
                                ){
                                 playTreshold = frame0.id;
                                graphics.pauseGame(); 
                            }
                          // console.log( distance3D(Lctrl.frame(0).hands[i].fingers[1].tipPosition,Lctrl.frame(0).hands[i].fingers[2].tipPosition));
                            if (distance3D(Lctrl.frame(0).hands[i].fingers[1].tipPosition,Lctrl.frame(0).hands[i].fingers[2].tipPosition) <25 &&
                               distance3D(Lctrl.frame(5).hands[i].fingers[1].tipPosition,Lctrl.frame(5).hands[i].fingers[2].tipPosition) >75){
                                console.log("pause/play");
                                 playTreshold = frame0.id;
                                graphics.pauseGame(); 
                            }

                       }
                   }


                        if (frame0.hands.length == 2 &&  Lctrl.frame(10).hands.length == 2){
                          //  distanceIndices = distance3D(frame0.fingers[1].tipPosition,frame0.fingers[6].tipPosition);
                           // distancePulgares = distance3D(frame0.fingers[0].tipPosition,frame0.fingers[5].tipPosition);
                            distanceCruzado1 = distance3D(frame0.fingers[1].tipPosition,frame0.fingers[5].tipPosition);
                            distanceCruzado2 = distance3D(frame0.fingers[0].tipPosition,frame0.fingers[6].tipPosition);
                           
                            //tap
                         

                            // console.log("distancias, indices: "+ distanceIndices+ "  pulgares: "+ distancePulgares); 
                          /*     if (distanceIndices<30 && distancePulgares<30 && playTreshold < (frame0.id-50)){
                                distanceIndices10 = distance3D(Lctrl.frame(10).fingers[1].tipPosition,Lctrl.frame(10).fingers[6].tipPosition);
                                distancePulgares10 = distance3D(Lctrl.frame(10).fingers[0].tipPosition,Lctrl.frame(10).fingers[5].tipPosition);
                                
                                    if(distanceIndices10>80 && distancePulgares10>80){
                                        playTreshold = frame0.id; 
                                        jQuery("#fullscreen-canvas").hide();        
                                        jQuery("#resize-canvas").show();
                                        jQuery("#cabecera").slideUp();
                                        jQuery("#tabs").slideUp();
                                        jQuery("#menu_area").children().slideUp( function(){jQuery("#canvas").queue(function(){jQuery( this ).removeClass("col-md-6").addClass("col-md-12").dequeue();}).slideDown("slow");});
                                        
                                     }
                                }*/

                                if ((distanceCruzado1<30 || distanceCruzado2<30) && playTreshold < (frame0.id-50)){
                                distanceCruzado1_10 = distance3D(Lctrl.frame(10).fingers[1].tipPosition,Lctrl.frame(10).fingers[5].tipPosition);
                                distanceCruzado2_10 = distance3D(Lctrl.frame(10).fingers[0].tipPosition,Lctrl.frame(10).fingers[6].tipPosition);
                                
                                    if(distanceCruzado1_10>80 || distanceCruzado2_10>80){
                                        playTreshold = frame0.id; 
                                        if (fullScreen){
                                        
                                            jQuery("#resize-canvas").hide();        
                                            jQuery("#fullscreen-canvas").show();
                                            jQuery("#menu_area").children().slideDown();
                                            jQuery("#tabs").slideDown("slow");
                                            jQuery("#cabecera").slideDown("slow");
                                            jQuery("#canvas").slideUp(function() {  jQuery( "#canvas").removeClass("col-md-12").addClass("col-md-6");}).slideDown();
                                            fullScreen = false;
                                        }else{
                                             jQuery("#fullscreen-canvas").hide();        
                                            jQuery("#resize-canvas").show();
                                            jQuery("#cabecera").slideUp();
                                            jQuery("#tabs").slideUp();
                                            jQuery("#menu_area").children().slideUp( function(){jQuery("#canvas").queue(function(){jQuery( this ).removeClass("col-md-6").addClass("col-md-12").dequeue();}).slideDown("slow");});
                                            fullScreen = true;
                                        }

                                     }
                                }
                                 //console.log(frame0);
/*
                                if (frame0.fingers[1].tipPosition[0] < frame0.fingers[6].tipPosition[0] && playTreshold< (frame0.id-50)){
                                   
                                    if (Lctrl.frame(10).fingers[1].tipPosition[0] > Lctrl.frame(10).fingers[6].tipPosition[0]+80){
                                        playTreshold  = frame0;
                                        
                                    }
                                }
*/

                        }            
                }
                if(!izqPresente){
                    izqDisplay.css( "background-color", "lightgrey" ).empty();
                }
                if(!derPresente){
                   derDisplay.css( "background-color", "lightgrey" ).empty();
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
        graphics.CameraReposition(delta*(-5),0,0)  ;
    } 


};



IBRS.UnitGraphic = function(height,baseDiameter,miniatureTexture,baseTexture,logicModel){
       TargeteableElement.call(this);
       var unitGraphic = this;
       this.logicModel = logicModel;
       this.logicModel.tacticalGroup.container.append(this.container);
    
       this.height = height;
       var baseHeight = 0.5;
       this.MiniatureTextureMap = new THREE.ImageUtils.loadTexture(miniatureTexture);
       this.BaseTextureMap = new THREE.ImageUtils.loadTexture(baseTexture);
       var GeoBase = new THREE.BaseGeometry(baseDiameter*0.45,baseDiameter/2,baseHeight,20,1);
       var GeoLapida = new THREE.LapidaGeometry(baseDiameter*0.8,height,0.3);
       this.TopPiece= new THREE.Mesh(GeoLapida,new THREE.MeshLambertMaterial( { map: this.MiniatureTextureMap} ));
       this.BasePiece = new THREE.Mesh(GeoBase,
        new THREE.MeshFaceMaterial([
            new THREE.MeshLambertMaterial( { map: this.BaseTextureMap}),
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

            unitGraphic.MiniatureTextureMap = new THREE.ImageUtils.loadTexture(miniatureTexture);
            unitGraphic.BaseTextureMap = new THREE.ImageUtils.loadTexture(baseTexture);
            var GeoBase = new THREE.BaseGeometry(baseDiameter*0.45,baseDiameter/2,baseHeight,20,1);
            var GeoLapida = new THREE.LapidaGeometry(baseDiameter*0.8,height,0.3);
            unitGraphic.TopPiece= new THREE.Mesh(GeoLapida,new THREE.MeshBasicMaterial( { map: unitGraphic.MiniatureTextureMap} ));
            unitGraphic.BasePiece = new THREE.Mesh(GeoBase,
            new THREE.MeshFaceMaterial([
            new THREE.MeshLambertMaterial( { map:unitGraphic.BaseTextureMap}),
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

        unitGraphic.logicModel.updateHtml();

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
            new THREE.MeshBasicMaterial({ map: CoverTextureMap} )]));
    
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
                new THREE.MeshBasicMaterial({ map: CoverTextureMap} )]));
    
        tableGraphic.TableTop.position.set(0,-dimension.y/2,0);
        tableGraphic.add(tableGraphic.TableTop);
   };



};


IBRS.TableGraphic.prototype = Object.create(BasicElement.prototype);

IBRS.SCENERY = {ENUM : "tipos de escenografia"};
IBRS.SCENERY.BASIC=0;   
IBRS.SCENERY.JSONLOADED = 1;
               


IBRS.SceneryGraphic = function(dimension){
    BasicElement.call(this);
    var sceneryGraphic = this;

    /*this.main_texture =  new THREE.ImageUtils.loadTexture(frontalTexture);
    this.textures = [];
    this.textures.push(this.main_texture);
    for (var i = 1; i< 6;i++){
            this.textures.push(new THREE.ImageUtils.loadTexture("img/edificioFace"+i+tipo+".jpg"));
        }*/
    this.GeoEdificio = new THREE.CubeGeometry(dimension.x,dimension.y,dimension.z);
    
    this.MeshEdificio = new THREE.Mesh(this.GeoEdificio,new THREE.MeshNormalMaterial({color:0x156000}));
    this.MeshEdificio.position.set(0,dimension.y/2,0);
    this.add(this.MeshEdificio);

	
	this.refactor = function(sceneryModelID,dimension){
      
            sceneryGraphic.remove(sceneryGraphic.children[0]);
            switch(sceneryModelID){

                case IBRS.SCENERY.BASIC:
                     sceneryGraphic.GeoEdificio = new THREE.CubeGeometry(dimension.x,dimension.y,dimension.z);
                     sceneryGraphic.MeshEdificio = new THREE.Mesh(sceneryGraphic.GeoEdificio,new THREE.MeshNormalMaterial({color:0x156000}));
                     sceneryGraphic.MeshEdificio.position.set(0,dimension.y/2,0);
                     sceneryGraphic.add(sceneryGraphic.MeshEdificio);
                break;
                case IBRS.SCENERY.JSONLOADED:
                    
                  /*  sceneryGraphic.MeshEdificio = new IBRS.TOOLS.JsonLoadedBuilding(dimension);
                    sceneryGraphic.MeshEdificio.position.set(0,sceneryGraphic.MeshEdificio.heightOffset,0);
                    sceneryGraphic.add(sceneryGraphic.MeshEdificio);


                     var geometry = new THREE.PlaneGeometry( 500, 50 );
                      var material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
                      var mesh = new THREE.Mesh( geometry, material ); 
                    sceneryGraphic.MeshEdificio.add(mesh);
                */

                    var element = new THREE.Object3D();
                 jQuery.getJSON("DataBase/SceneryElement/"+dimension+".json",function(data){     
                    for (var i = 0; i < data.planes.length; i++){
                        var plane = data.planes[i];
                        var planeGeo = new THREE.PlaneGeometry(plane.width,plane.height);
                        var texture = new THREE.ImageUtils.loadTexture("img/"+plane.texture);
                        var material = new THREE.MeshBasicMaterial({ map: texture});
                        var mesh = new THREE.Mesh(planeGeo,material);
                        mesh.position.set(plane.position.x,plane.position.y,plane.position.z);
                        mesh.rotation.set(plane.rotation.x*Math.PI,plane.rotation.y*Math.PI,plane.rotation.z*Math.PI);
                        element.add(mesh);
                               
                            }

                            element.position.set(0,data.heightOffset,0);
                         });
                       
                       sceneryGraphic.add(element);


                /*


                    jQuery.getJSON("DataBase/SceneryElement/"+dimension+".json",function(data){     
                        switch(data.BaseModel){
                            case 0://cubico                     
                                var textures = [];
                                var materials = [];
                            
                                for (var i =0; i< data.texturesPath.length ; i++ ){
                                    textures.push(new THREE.ImageUtils.loadTexture("img/"+data.texturesPath[i]));
                                    materials.push(new THREE.MeshLambertMaterial({ map: textures[i]}));
                                }
                                var keyGeoEdificio =  new THREE.CubeGeometry(data.dimension.x,data.dimension.y,data.dimension.z);
                                sceneryGraphic.MeshEdificio = new THREE.Mesh(keyGeoEdificio,new THREE.MeshFaceMaterial(materials));
                                sceneryGraphic.MeshEdificio.position.set(0,data.dimension.y/2,0);
                                sceneryGraphic.add(sceneryGraphic.MeshEdificio);
                            break;
                            case 1://edificio Ice Storm
                            
                            break;
                            default:
                                console.error("tipo de edificio base no encontrado");
                            break;
                            }
                    });  
                    */



                break;
                default:
                    console.error("tipo de carga de escenografía no valida");
                break;
            }
           
          //  sceneryGraphic.add(sceneryGraphic.MeshEdificio);
           
	   	//implementar cambio de modelo al que se carge por ajax
	}
};

IBRS.SceneryGraphic.prototype = Object.create(BasicElement.prototype);
