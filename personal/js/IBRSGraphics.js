// IBRS Copyright (C) 2014  Ignacio Medina Castillo
// ignacio.medina.castillo@gmail.com



IBRS.refreshObjects = function (){
        IBRS.actualGraphics.refreshSceneObjects(IBRS.actualGame);
}

IBRS.Graphics = function(){
    var graphics = this;
    IBRS.actualGraphics = this;
    this.render = new THREE.WebGLRenderer({premultipliedAlpha:false, alpha:true, antialias: true });
    this.render.autoClear = false;
    this.render.setClearColor(new THREE.Color(0xff0000),0);


    this.canvasWidth = jQuery("#canvas").width();
    this.canvasHeight = jQuery("#canvas").height();
    this.render.setSize(this.canvasWidth, this.canvasHeight);

   

    this.scene = new THREE.Scene();

   // this.scene.fog = new THREE.Fog( 0x000000, 200, 1200 );
    this.camera = new THREE.PerspectiveCamera(45, this.canvasWidth / this.canvasHeight, 0.1, 1000);
    this.cameraOrtho = new THREE.OrthographicCamera(-this.canvasWidth/2,this.canvasWidth/2,this.canvasHeight/2,-this.canvasHeight/2,1,10);
    this.cameraOrtho.position.z = 10;
    this.sceneOrtho  = new THREE.Scene();

    this.scene.add(this.camera);
    //this.recorder = new IBRS.Recorder(this);
    //this.reproductor = new IBRS.Reproductor(this);
    this.htmlHandler = new IBRS.CanvasHtml(this);
    this.htmlHandler.setDragAndDrop();
    this.cameraMoved = true;
   
     window.addEventListener("resize", function(){
         IBRS.actualGraphics.canvasWidth = jQuery("#canvas").width();
         IBRS.actualGraphics.canvasHeight = jQuery("#canvas").height();
         IBRS.actualGraphics.render.setSize( IBRS.actualGraphics.canvasWidth,  IBRS.actualGraphics.canvasHeight);
         IBRS.actualGraphics.camera.aspect   = IBRS.actualGraphics.canvasWidth/ IBRS.actualGraphics.canvasHeight;
         IBRS.actualGraphics.camera.updateProjectionMatrix();
         IBRS.actualGraphics.cameraOrtho.left   = -IBRS.actualGraphics.canvasWidth/2;
         IBRS.actualGraphics.cameraOrtho.right   = IBRS.actualGraphics.canvasWidth/2;
         IBRS.actualGraphics.cameraOrtho.top  = IBRS.actualGraphics.canvasHeight/2;
         IBRS.actualGraphics.cameraOrtho.bottom   = -IBRS.actualGraphics.canvasHeight/2;
         IBRS.actualGraphics.cameraOrtho.updateProjectionMatrix();
        IBRS.actualGraphics.selectorCamera.setPosition(0,0);
    
         console.log("resized");
    });
    


    //luces
    var light = new THREE.PointLight(0xFF88FF);
    light.position.set(-20,15,20);
    this.scene.add(light);
     var light = new THREE.PointLight(0xFFFF88);
    light.position.set(20,2,20);
    this.scene.add(light); 
    var light = new THREE.PointLight(0x88FF88);
    light.position.set(20,15,-20);
    this.scene.add(light); 
    var light = new THREE.PointLight(0x8888FF);
    light.position.set(-20,2,-20);
    this.scene.add(light);

    var globalLight = new THREE.AmbientLight(0x333333);
    this.scene.add(globalLight);
    this.referenceTime = 0;

    this.selectorCamera = new IBRS.SelectorCamera(this);
    this.selectorCamera.setPosition(0,0);
    //this.selectorCamera.putInScene(this.sceneOrtho);



    this.contextualMenu = new IBRS.ContextualMenu(this);
   //this.scene.add(this.contextualMenu.getMenu());
   

    //Puntero LEAP MOTION
  
  /*  //cambiar la opacidad para activar el puntero del leap motion
    var spherePointer = new THREE.Mesh(new THREE.SphereGeometry( 1, 12, 12 ),new THREE.MeshBasicMaterial( {color: 0xff5500,wireframe:false,opacity: 0.7,transparent: true}));
    var cylinderPointer = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,300),new THREE.MeshBasicMaterial( {color: 0xff5500,wireframe:false,opacity: 0.7,transparent: true}));
    this.pointer = new THREE.Object3D();
    this.pointer.add(spherePointer);
    this.pointer.add(cylinderPointer);
    this.scene.add(this.pointer);
    */    
    this.bulletList = [];
    this.tageteableElementsList = [];//tienen uqe ser objetos 3d de THREE
    this.sceneryElementsList = [];

    this.camera_Distance = 150;
    this.camera_Horizonatl_Angle = 0;
    this.camera_Vertical_Angle = Math.PI/3;
    this.camera_target = new THREE.Object3D();
    this.camera_target.position.set(0,0,0);
    this.scene.add( this.camera_target); 
    
    this.sceneObjects = new THREE.Object3D();
    this.scene.add(this.sceneObjects);
    this.keyPresed = {tab:false,ctrl:false,alt:false,F1:false,F2:false,F3:false,F4:false};

    this.refreshSceneObjects = function(game){
        graphics.scene.remove(graphics.sceneObjects);
        graphics.sceneObjects = new THREE.Object3D();
        graphics.scene.add(graphics.sceneObjects);
        graphics.addListToScene(game.getMiniatures(),"targeteable");
        graphics.addListToScene(game.getSceneryElementList(),"scenery");
        graphics.addListToScene(game.getBullets(),"bullet");
        
        console.log(graphics);
    };

    this.addListToScene= function(list,kind){
        for (var i=0;i<list.length;i++){
            graphics.sceneObjects.add(list[i]);
            switch (kind){
                case "targeteable":
                    graphics.tageteableElementsList.push(list[i]);
                    list[i].setEnviroment(graphics);
                break;
                case "scenery":
                    graphics.sceneryElementsList.push(list[i]);
                break;
                case "bullet":
                    graphics.bulletList.push(list[i]);
                break;
            }

        }
    };

    this.startScene = function(){
        graphics.SetupUpMouseInteraction(graphics.render.domElement);
        graphics.setupKeyboardInteraction(graphics.render.domElement);
        
        //graphics.contextualMenu.start();
        //graphics.SetupUpLeapInteraction();
        graphics.CameraReposition(0,0,0);
        graphics.selectorCamera.CameraReposition(0,0,0);

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
        //graphics.reproductor.update();
        graphics.selectorCamera.update();
       // graphics.contextualMenu.update();
        
         graphics.traceMiniature();
      
      //  if (graphics.tageteableElementsList[0] && graphics.cameraMoved){
      //      graphics.traceMiniature(graphics.tageteableElementsList[0]);  
       //     graphics.cameraMoved = false;
       // }
        graphics.renderScene();
       
        requestAnimationFrame(graphics.animateScene);
    };
    this.webGLStart= function () {
        graphics.startScene();
        graphics.animateScene();        
    };

    this.traceMiniature = function(){
        if (IBRS.elementSelected &&  IBRS.elementSelected.traced == true && (graphics.cameraMoved || IBRS.elementSelected.traceNew)){
             console.log("tracing");
            var pos2d =  graphics.findScreenPositionByProyection(IBRS.elementSelected.unitGraphic); 
            jQuery("#trace").css("top",pos2d.y).css("left",pos2d.x);
            
            IBRS.elementSelected.traceNew = false;
        }
        graphics.cameraMoved = false;
            
    }



    this.hideTrace = function(){
        jQuery("#trace").opacity(0);
    }


    this.insertGameData= function(newGame){
       graphics.refreshSceneObjects(newGame);
       graphics.initAnimations(newGame.events);
       // graphics.addListToScene(newGame.getMiniatures(),true);
       // graphics.addListToScene(newGame.getSceneryElementList(),false);
        //graphics.reproductor.setEvents(newGame.events);
       // graphics.recorder.setEvents(newGame.events);

        var stringJson = JSON.stringify(newGame.events,null,'\t');
        var blob = new Blob([stringJson], {type: "application/json"});
        var urll  = URL.createObjectURL(blob);
        jQuery("#getJson").attr("href",urll);
    };

    var  updateSlider= function() {
            jQuery("#slider").slider("value", graphics.animation.progress() *100);
        }
    jQuery("#slider").slider({
        range: false,
        min: 0,
        max: 100,
        step:0.1,
        slide: function ( event, ui ) {
            graphics.animation.pause();
            graphics.animation.progress( ui.value/100 );
             }   
        });
    this.initAnimations = function(events){
        graphics.animation = events.animation(updateSlider);
      // graphics.animation.resume();
    }

    this.setTargeteableElements=function(newList){
        graphics.tageteableElementsList = newList;
    };

    this.playGame = function(){
        graphics.animation.resume();
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
    this.OpenContextualMenu = function(targetObject){
        



        /*
        var current_target_position = new THREE.Vector3();
        current_target_position.setFromMatrixPosition(targetObject.matrixWorld );
        graphics.contextualMenu.setPosition(current_target_position.x,current_target_position.y,current_target_position.z);
        graphics.contextualMenu.show();
        var option1 = new IBRS.CharacterOption(1);
        var option2 = new IBRS.CharacterOption(2);
        var option3 = new IBRS.CharacterOption(3);
        var option4 = new IBRS.CharacterOption(4);
        var testOptions =[option1,option2,option3,option4];
         graphics.contextualMenu.setOptions(testOptions);*/
     };

    this.CloseContextualMenu = function(){
         graphics.contextualMenu.hide();

    };


    this.CameraReposition = function(distance_inc,hoizontalAngle_inc,verticalAngle_inc,targetObject){
            graphics.camera_target = targetObject = targetObject !== undefined ? targetObject : graphics.camera_target;
             


            graphics.camera_Distance = Math.max(graphics.camera_Distance+distance_inc,10);
            graphics.camera_Horizonatl_Angle += hoizontalAngle_inc;
            graphics.camera_Vertical_Angle += verticalAngle_inc;
            graphics.camera_Vertical_Angle = Math.max(Math.PI/4,Math.min(Math.PI*3/7,graphics.camera_Vertical_Angle));
            
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
     
        var options = { enableGestures: false };
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
                            IBRS.elementSelected = graphics.GetClosestTargeteableElement(graphics.pointer.position).logicModel;
                            IBRS.elementSelected.onElementClick();
                            console.log("eligiendo elemento")
                            graphics.CameraReposition(0,0,0,IBRS.elementSelected.unitGraphic);
                            lastTimeSelection = frame.id;
                        }
                    }
                }
                // Gestos
                //plaY/pause, juntar muñecas
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
                    }            
                }
                if(!izqPresente){
                    izqDisplay.css( "background-color", "lightgrey" ).empty();
                }
                if(!derPresente){
                   derDisplay.css( "background-color", "lightgrey" ).empty();
                }   
            }
        });
    }
    this.SetupUpMouseInteraction = function(currentRenderDomElement){
        var mouseIsDown = 0;
        var mouseDownPosition = new THREE.Vector3(0,0,0);
       
        var contextualMenuOpened = false; 
        var mouseSigleClick = true;

        var mouseDragable = false;
        currentRenderDomElement.addEventListener("mousewheel", graphics.MouseWheelHandler, false);// IE9, Chrome, Safari, Opera  
        currentRenderDomElement.addEventListener("DOMMouseScroll", graphics.MouseWheelHandler, false);// Firefox
        currentRenderDomElement.addEventListener('contextmenu', function (evt){evt.preventDefault();}, false);
        currentRenderDomElement.addEventListener('mousedown', function (evt) {
        mouseIsDown=evt.which;
        mouseSigleClick = true;
        mouseDragable = false;
        mouseDownPosition.x = evt.pageX;
        mouseDownPosition.y = evt.pageY;       
      
            switch (evt.which) {
                case 1://left mouse
                    if (IBRS.actionActive  != true)
                    {
                         var elementClicked = graphics.findObjectByProyection(evt,this,graphics.tageteableElementsList);
                         if (elementClicked != undefined){
                            elementClicked = elementClicked.parent;
                            IBRS.elementSelected.unSelect();
                            IBRS.elementSelected = elementClicked.logicModel;
                            graphics.actualiceSelection();
                            IBRS.elementSelected.select();
                            mouseDragable = true;
                          
                         }
                    }else{
                        //localizar punto
                        var position = graphics.findPointByProyection(evt,this,graphics.sceneryElementsList);
                            if (position != undefined){
                                console.log(position);

                               IBRS.Current.Action.setEndPosition(position);                
                            } 
                    }
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
            //Mover el raton sin pulsar nada
            mouseSigleClick = false;
                
            if(mouseIsDown===0 && contextualMenuOpened === true){

             
            }
            //giro de camara
            else if (mouseIsDown==3){
                //turn camera
                 
                 mouseSigleClick = false;
                
                if (graphics.keyPresed.F4 === false){
                    graphics.CameraReposition(0,
                        0.03*(evt.pageX - mouseDownPosition.x),
                        0.02*(evt.pageY - mouseDownPosition.y)
                    );
                }else{
                    graphics.selectorCamera.CameraReposition(0,
                        0.03*(evt.pageX - mouseDownPosition.x),
                        0.02*(evt.pageY - mouseDownPosition.y)
                    );
                }
            mouseDownPosition.x = evt.pageX;
            mouseDownPosition.y = evt.pageY;
            graphics.cameraMoved = true;
            }
             else if (mouseIsDown===1 ){
                mouseSigleClick = false;
                 switch (IBRS.actualStage){
                    case "defineAction":
                    break;
                    case "deployElements":
                        if (graphics.keyPresed.alt){
                            var position = graphics.findPointByProyection(evt,this,graphics.sceneryElementsList);
                            if (position != undefined){
                                var angle = Math.atan2(position.x- IBRS.elementSelected.position.x,position.z-IBRS.elementSelected.position.z);
                                IBRS.elementSelected.setRotation(0,angle,0);
                                mouseDragable = false;
                            }
                        }else if (mouseDragable===true){
                        //intime reposition miniature
                         var position = graphics.findPointByProyection(evt,this,graphics.sceneryElementsList);
                             if (position != undefined){
                                IBRS.elementSelected.setPosition(position.x,position.y,position.z);
                                IBRS.elementSelected.traceNew = true;                        
                                mouseDragable = true;
                            }
                        }
                    break;
                    case "animateElements":
                    break;


                 }
            }
        },false);




        currentRenderDomElement.addEventListener('mouseup', function (evt) {
           //console.log(mouseIsDown,mouseSigleClick);
            if (mouseIsDown==1 && mouseSigleClick==true){ 
                if (contextualMenuOpened === false){
                   
                }
                else{/*
                    //console.log(graphics.contextualMenu.getClickableOptions());
                    var elementClicked = ion(evt,thigraphics.findObjectByProyects,graphics.contextualMenu.show());
                    if (elementClicked != undefined){
                      
                        elementClicked.onClick();
                    }
                    else{
                        console.log("click en el aire");
                    }*/
                }
            }
            
            else if(mouseIsDown==3 && mouseSigleClick==true){ // menu contextual
                 console.log(contextualMenuOpened);
                  
                if (contextualMenuOpened === false){
                    var elementClicked = graphics.findObjectByProyection(evt,this,graphics.tageteableElementsList);
                    console.log(elementClicked.parent.logicModel,IBRS.elementSelected);
                    if (elementClicked != undefined){
                        elementClicked=elementClicked.parent;
                        //elementClicked.onElementClick();
       
                        if (elementClicked.logicModel === IBRS.elementSelected){
                             graphics.contextualMenu.show();
                             contextualMenuOpened = true;
                         }else{
                           
                             graphics.contextualMenu.hide();
                             contextualMenuOpened = false;
                         }
                       
                        //graphics.OpenContextualMenu(elementClicked);
                        //contextualMenuOpened = true;
                    }else{
                         graphics.contextualMenu.hide();
                         contextualMenuOpened = false;
                    }
                }
                else{
                         graphics.contextualMenu.hide();
                         contextualMenuOpened = false;
                    }
            }
            else if(mouseSigleClick===false ){
                //arrastrar miniatura
                if (mouseIsDown===1  && mouseDragable===true){
                    switch (IBRS.actualStage){
                        case "defineAction":
                        break;
                        case "deployElements":
                            var position = graphics.findPointByProyection(evt,this,graphics.sceneryElementsList);
                             if (position != undefined){
                                IBRS.elementSelected.setPosition(position.x,position.y,position.z);
                                mouseDragable = false;
                            }
                        break;
                        case "animateElements":
                        break;
                    }
                }
            }
            mouseSigleClick = false;
            mouseIsDown=0;

            
            
        },false);
    }
    this.setupKeyboardInteraction = function(currentRenderDomElement){
       currentRenderDomElement.setAttribute('tabindex','0');
      

       currentRenderDomElement.addEventListener("keydown",function(evt){
           console.log(evt.keyCode);
            switch(evt.keyCode){
                case 9:
                    graphics.keyPresed.tab = true;

                    
                    for (var i =0; i<graphics.tageteableElementsList.length;i++){

                        graphics.tageteableElementsList[i].selectorOpacity(1);
                    }


                break;
                case 17:
                    graphics.keyPresed.ctrl = true;
                break;
                case 18:
                    graphics.keyPresed.alt = true;
                break;
                case 115://F4
                    graphics.keyPresed.F4 = true;
                    graphics.selectorCamera.putInScene(graphics.sceneOrtho);
                break;

                 case 112://F1
                    graphics.keyPresed.F4 = true;
                     for (var i =0; i<graphics.tageteableElementsList.length;i++){
                        var highLight = graphics.tageteableElementsList[i]
                        if (true){
                            highLight.selectorOpacity(1);
                        }
                        
                    }
                   
                break;
                case 113://F2
                    graphics.keyPresed.F4 = true;
                    
                    graphics.selectorCamera.removeFromScene(graphics.sceneOrtho);
                break;
                case 37:
                    graphics.arrowLEFT = true;
                    var sinA =  Math.sin(graphics.camera_Horizonatl_Angle);
                    var cosA =  Math.cos(graphics.camera_Horizonatl_Angle);
                     graphics.camera_target.position.set(
                        graphics.camera_target.position.x+cosA*0+sinA*(-1),
                        graphics.camera_target.position.y,
                        graphics.camera_target.position.z-(cosA*(-1)-sinA*0));
                     console.log(graphics.camera_target.position);
                     graphics.CameraReposition(0,0,0,graphics.camera_target);
                        
                break;
                case 38:
                    graphics.arrowUP = true;
                    var sinA =  Math.sin(graphics.camera_Horizonatl_Angle);
                    var cosA =  Math.cos(graphics.camera_Horizonatl_Angle);
                     graphics.camera_target.position.set(
                        graphics.camera_target.position.x+cosA*(-1)+sinA*(0),
                        graphics.camera_target.position.y,
                        graphics.camera_target.position.z-(cosA*(0)-sinA*(-1)));
                     console.log(graphics.camera_target.position);
                     graphics.CameraReposition(0,0,0,graphics.camera_target);
                break;
                case 39:
                    graphics.arrowRIGHT = true;
                    var sinA =  Math.sin(graphics.camera_Horizonatl_Angle);
                    var cosA =  Math.cos(graphics.camera_Horizonatl_Angle);
                     graphics.camera_target.position.set(
                        graphics.camera_target.position.x+cosA*0+sinA*(1),
                        graphics.camera_target.position.y,
                        graphics.camera_target.position.z-(cosA*(1)-sinA*0));
                     console.log(graphics.camera_target.position);
                     graphics.CameraReposition(0,0,0,graphics.camera_target);
                break;
                case 40:
                    graphics.arrowDOWN = true;
                    var sinA =  Math.sin(graphics.camera_Horizonatl_Angle);
                    var cosA =  Math.cos(graphics.camera_Horizonatl_Angle);
                     graphics.camera_target.position.set(
                        graphics.camera_target.position.x+cosA*(1)+sinA*(0),
                        graphics.camera_target.position.y,
                        graphics.camera_target.position.z-(cosA*(0)-sinA*(1)));
                     console.log(graphics.camera_target.position);
                     graphics.CameraReposition(0,0,0,graphics.camera_target);
                break;
                default:
                    console.log("na que ver");
                break;
            }
           
        }, false);  


       currentRenderDomElement.addEventListener("keyup", function(evt){
             switch(evt.keyCode){
                case 9:
                    graphics.keyPresed.tab = false;
                    
                      for (var i =0; i<graphics.tageteableElementsList.length;i++){
                        graphics.tageteableElementsList[i].selectorOpacity(0);
                    }
                    
                break;
                case 17:
                    graphics.keyPresed.ctrl = false;
                break;
                case 18:
                    graphics.keyPresed.alt = false;
                break;
                 case 115://F4
                    graphics.keyPresed.F4 = false;
                    
                    graphics.selectorCamera.removeFromScene(graphics.sceneOrtho);
                break;
                 case 112://F1
                    graphics.keyPresed.F4 = false;
                    
                    graphics.selectorCamera.removeFromScene(graphics.sceneOrtho);
                break;
                case 113://F2
                    graphics.keyPresed.F4 = false;
                    
                    graphics.selectorCamera.removeFromScene(graphics.sceneOrtho);
                break;
                 case 37:
                    graphics.arrowLEFT = false;
                break;
                case 38:
                    graphics.arrowUP = false;
                break;
                case 39:
                    graphics.arrowRIGHT =false;
                break;
                case 40:
                    graphics.arrowDOWN = false;
                break;
                default:
                    console.log("na que ver");
                break;
            }
            
        }, false); 

       
    }


    this.actualiceSelection = function(){

        graphics.selectorCamera.CameraReposition(0,0,0,IBRS.elementSelected.unitGraphic);
    }
   

    this.getCanvasStats = function(scope){
        
        var canvasStat = {} ;
        canvasStat.Offset = jQuery(scope).offset();
        canvasStat.width =jQuery(scope).width(); 
        canvasStat.height =jQuery(scope).height();
        canvasStat.paddingtop = 0;
        canvasStat.paddingleft = 0;
        return canvasStat; 
    }   
    this.findObjectByProyection = function(evt,scope,list){

        var projector = new THREE.Projector();
        var directionVector = new THREE.Vector3();
        var CanvasStats = graphics.getCanvasStats(scope);

        var clickx = evt.pageX - CanvasStats.Offset.left - CanvasStats.paddingleft;
        var clicky = evt.pageY - CanvasStats.Offset.top - CanvasStats.paddingtop ;
        directionVector.x = ( clickx / CanvasStats.width ) * 2 - 1;
        directionVector.y = -( clicky / CanvasStats.height ) * 2 + 1;

        var ray = projector.pickingRay(directionVector,graphics.camera);
        var intersects = ray.intersectObjects(list, true);
        if (intersects.length) {
            var target = intersects[0]; 
            return target.object;
            
        } else{
            return undefined;
        }
    }
    

    this.findPointByProyection = function(evt,scope,list){

        var projector = new THREE.Projector();
        var directionVector = new THREE.Vector3();
        var CanvasStats = graphics.getCanvasStats(scope);

        var clickx = evt.pageX - CanvasStats.Offset.left - CanvasStats.paddingleft;
        var clicky = evt.pageY - CanvasStats.Offset.top - CanvasStats.paddingtop ;
        directionVector.x = ( clickx / CanvasStats.width ) * 2 - 1;
        directionVector.y = -( clicky / CanvasStats.height ) * 2 + 1;

        var ray = projector.pickingRay(directionVector,graphics.camera);
        var intersects = ray.intersectObjects(list, true);
        if (intersects.length) {
            var target = intersects[0]; 
            return target.point;
            
        } else{
            return undefined;
        }
    }

    this.findScreenPositionByProyection = function(element){
        element.matrixWorld.getPosition().clone();
        var projector = new THREE.Projector();
        var CanvasStats = graphics.getCanvasStats(jQuery("#canvas").children());
        var pos = element.matrixWorld.getPosition().clone();
        var projScreen = projector.projectVector(pos,graphics.camera);

        var percX = (projScreen.x + 1) / 2;
        var  percY = (-projScreen.y + 1) / 2;
        var left = percX * CanvasStats.width;
        var top = percY * CanvasStats.height;
      
        return { x: left + CanvasStats.Offset.left,
             y: top + CanvasStats.Offset.top};
    }


    this.MouseWheelHandler = function(e) {
         var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (graphics.keyPresed.F4 === true){
        
        }
        else{
        graphics.CameraReposition(delta*(-5),0,0)  ;
        }
        graphics.cameraMoved = true;
        return false;
    } 


};

IBRS.bulletGraphic = function(unitLogic){
    BasicElement.call(this);
    this.bulletGeometry = new THREE.SphereGeometry( 0.5, 12, 12 ); 
    //opacity: 0.8,transparen2t: true
    console.log("bulletCreated");
    this.bulletMaterial = new THREE.MeshBasicMaterial( {color: 0xFF0000,wireframe:false} ); 
    this.bullet = new THREE.Mesh( this.bulletGeometry, this.bulletMaterial );
    this.bullet.position.set(0,2.5,0);
    this.position.set(0,-10,0);
    this.add(this.bullet);
}

IBRS.bulletGraphic.prototype = Object.create(BasicElement.prototype);

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
            unitGraphic.selector.scale.set(baseDiameter/2,height+baseHeight/2,baseDiameter/2);
            unitGraphic.selector.position.set(0,(height+baseHeight)/2+height*1.2,0);
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
                        var material = new THREE.MeshLambertMaterial({ map: texture});
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


IBRS.ContextMenu = function(graphics){
    var contextMenu = this;
   
   this.targeteableOptions = [];
   
    this.plane= new THREE.Object3D();
    this.planeContainer = new THREE.Object3D();

    this.optionsNumber = 0;
    this.angularStep = Math.PI/8;
    
    var highMaterial = new THREE.MeshBasicMaterial({color:0xFFFF00, transparent:true,opacity:1});
    var highGeometry = new THREE.CircleGeometry( 1.4, 16);
    this.highLighter = new THREE.Mesh(highGeometry,highMaterial);     
  
    this.plane.add(this.highLighter);

    this.highLight = function(x,y,z){
        contextMenu.highLighter.position.set(x,y,z+0.2);
        highMaterial.opacity = 0.5;
    };

    this.stopHighLight = function(){
        
        highMaterial.opacity = 0;
    };
    this.scaleMenu = function (x,y,z){
       // contextmenu.planeGeometry.scale.set(20*x,20*y,z);
    };

    this.start = function(){
         contextMenu.SetupUpMouseInteraction();
    };

    this.update = function(){
      //  graphics.render.render(contextMenu.sceneOrtho, contextMenu.cameraOrtho );
         contextMenu.setRotation(graphics.camera_Vertical_Angle-Math.PI/2,-graphics.camera_Horizonatl_Angle+Math.PI/2,0);

      //   graphics.render.render(contextMenu.sceneOrtho, contextMenu.cameraOrtho, finalRenderTarget,true );
         //graphics.render.render(graphics.scene,graphics.camera, finalRenderTarget,true );
         
       
    };

    this.SetupUpMouseInteraction = function () {
        // body...
    };

    this.getMenu = function(){
        //return contextMenu.sprite;
        return contextMenu.planeContainer;
    };
   
    this.addToMenu = function(element){
        // console.log( contextMenu.sceneOrtho.children);
        contextMenu.plane.add(element);
       
        
    };

    this.getClickableOptions = function(){
        return contextMenu.targeteableOptions;
    };

    this.setOptions = function(options){
        contextMenu.targeteableOptions = [];
        contextMenu.plane.remove(contextMenu.plane.children);
        contextMenu.optionsNumber = options.length;
        for (i = 0;i< options.length;i++){
          //  console.log( contextMenu.sceneOrtho);
           
            var angle = -contextMenu.angularStep*(options.length-1)/2+i*contextMenu.angularStep;
            options[i].setPosition(Math.sin(angle),Math.cos(angle),0,7);

            contextMenu.targeteableOptions.push(options[i].clickable());
            contextMenu.addToMenu(options[i].clickable());
        }
     
    };

    this.setPosition = function(x,y,z){
        contextMenu.planeContainer.position.set(x,y,z);
    };

    this.setRotation = function(x,y,z){
        contextMenu.planeContainer.rotation.set(0,y,0);
        contextMenu.plane.rotation.set(x,0,0);
    };

    this.show = function(){
        //TODO animation
        contextMenu.planeContainer.add( this.plane);
    
    };

    this.hide = function(){
        //TODO animation
        contextMenu.planeContainer.remove( this.plane);
    
    };

};


IBRS.SelectorCamera = function(graphics){


    var selectorCamera = this;
    this.canvasWidth = 460;
    this.canvasHeight = 230;

    this.camera= new THREE.PerspectiveCamera(60, this.canvasWidth / this.canvasHeight, 0.1, 1000);
    
    this.scene = graphics.scene;
    this.scene.add(this.camera);

    
    var finalRenderTarget = new THREE.WebGLRenderTarget( 512, 512, { format: THREE.RGBAFormat } );
    this.spriteMaterial = new THREE.SpriteMaterial( {map:new THREE.ImageUtils.loadTexture("img/CA.png") });
    this.borderMaterial = new THREE.SpriteMaterial( {color:0xA7CCE8});
   
    this.sprite = new THREE.Sprite(this.spriteMaterial);
    this.border = new THREE.Sprite(this.borderMaterial);
    this.sprite.scale.set(460,230,1.0);
    this.border.scale.set(466,236,1.0);
   

    this.camera_Distance =-0.05;
    this.camera_Horizonatl_Angle = 0;
    this.camera_Vertical_Angle = Math.PI/3;
    this.camera_target = graphics.scene;


    this.setPosition = function(x,y){
        selectorCamera.sprite.position.set(x,y,1);
        selectorCamera.border.position.set(x,y,0);
    }

    this.putInScene = function(scene){
        scene.add( selectorCamera.sprite);
        scene.add( selectorCamera.border);
    }

    this.removeFromScene = function(scene){
        scene.remove( selectorCamera.sprite);
        scene.remove( selectorCamera.border);
    }

    this.scaleMenu = function (x,y,z){
        selectorCamera.sprite.scale.set(5*x,5*y,z);
    };

    this.start = function(){
         selectorCamera.SetupUpMouseInteraction();
    };

    this.update = function(){
      //  graphics.render.render(contextMenu.sceneOrtho, contextMenu.cameraOrtho );
         
         //graphics.render.render(contextMenu.sceneOrtho, contextMenu.cameraOrtho, finalRenderTarget,true );
         selectorCamera.CameraReposition(0,0,0);
         graphics.render.render(this.scene,selectorCamera.camera, finalRenderTarget,true );
         selectorCamera.spriteMaterial.map.__webglTexture = finalRenderTarget.__webglTexture;
       
    };

    this.SetupUpMouseInteraction = function () {
        // body...
    };

    this.getImage = function(){
        //return contextMenu.sprite;
        return selectorCamera.sprite;
    };
   
       this.getCamera = function(){
        //return contextMenu.sprite;
        return selectorCamera.camera;
    };
   
    this.addToMenu = function(element){
        selectorCamera.scene.add(element);
        
    };

    this.CameraReposition = function(distance_inc,hoizontalAngle_inc,verticalAngle_inc,targetObject){
            selectorCamera.camera_target = targetObject = targetObject !== undefined ? targetObject : selectorCamera.camera_target;
                   

            selectorCamera.camera_Distance = Math.min(selectorCamera.camera_Distance+distance_inc,5);
            selectorCamera.camera_Horizonatl_Angle += hoizontalAngle_inc;
            selectorCamera.camera_Vertical_Angle += verticalAngle_inc;
            selectorCamera.camera_Vertical_Angle = Math.max(0.05,Math.min(Math.PI*99/100,selectorCamera.camera_Vertical_Angle));
            var current_target_position = new THREE.Vector3();
            current_target_position.setFromMatrixPosition( selectorCamera.camera_target.matrixWorld );
            selectorCamera.camera.position.set(
                current_target_position.x + selectorCamera.camera_Distance*Math.cos(selectorCamera.camera_Horizonatl_Angle)*Math.sin(selectorCamera.camera_Vertical_Angle),
                current_target_position.y + 3 + selectorCamera.camera_Distance*Math.cos(selectorCamera.camera_Vertical_Angle),
                current_target_position.z + selectorCamera.camera_Distance*Math.sin(selectorCamera.camera_Horizonatl_Angle)*Math.sin(selectorCamera.camera_Vertical_Angle)
            );
            var current_target_position = new THREE.Vector3();
            current_target_position.setFromMatrixPosition( selectorCamera.camera_target.matrixWorld );
            current_target_position.y +=3;
            selectorCamera.camera.lookAt(current_target_position);
            

    }
    this.CameraPosition = function(distance,hoizontalAngle,verticalAngle,targetObject){
            selectorCamera.camera_target = targetObject = targetObject !== undefined ? targetObject : selectorCamera.camera_target;
                   

            selectorCamera.camera_Distance = Math.max(distance,7);
            selectorCamera.camera_Horizonatl_Angle = hoizontalAngle;
            selectorCamera.camera_Vertical_Angle = verticalAngle;
            selectorCamera.camera_Vertical_Angle = Math.max(0.1,Math.min(Math.PI,selectorCamera.camera_Vertical_Angle));
            
            var current_target_position = new THREE.Vector3();
            current_target_position.setFromMatrixPosition( selectorCamera.camera_target.matrixWorld );
            selectorCamera.camera.position.set(
                current_target_position.x + selectorCamera.camera_Distance*Math.cos(selectorCamera.camera_Horizonatl_Angle)*Math.sin(selectorCamera.camera_Vertical_Angle),
                current_target_position.y + 3 + selectorCamera.camera_Distance*Math.cos(selectorCamera.camera_Vertical_Angle),
                current_target_position.z + selectorCamera.camera_Distance*Math.sin(selectorCamera.camera_Horizonatl_Angle)*Math.sin(selectorCamera.camera_Vertical_Angle)
            );
            var current_target_position = new THREE.Vector3();
            current_target_position.setFromMatrixPosition( selectorCamera.camera_target.matrixWorld );
            current_target_position.y +=3;
            selectorCamera.camera.lookAt(current_target_position);
    }
  
    this.reFocus = function(){
        var current_target_position = new THREE.Vector3();
        current_target_position.setFromMatrixPosition( selectorCamera.camera_target.matrixWorld );
        selectorCamera.camera.lookAt(current_target_position);
    }

}


IBRS.CharacterOption = function(code,onOptionClick){

    var characterOption = this;
    this.optionGeometry = new THREE.PlaneGeometry( 2.7, 2.7, 1, 1 );

    switch (code){
        case 1:
            var image = "img/MOVE.png";
        break;
        case 2:
              var image = "img/CD.png";
        break;
        case 3:
              var image = "img/DA.png";
        break;
        case 4:
              var image = "img/NORMAL.png";
        break;
        default:
              var image = "img/Orden_regular.png";
        break;
    }
    this.optionMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture(image), color:0xFFFFFF ,transparent:true} );
    this.optionPlane = new THREE.Mesh( this.optionGeometry, this.optionMaterial );


    this.optionPlane.onMouseOn = function(){
        characterOption.optionMaterial.color = 0xFFFFFF;
        console.log("colochange");
    };

    this.optionPlane.onMouseOff = function(){
        characterOption.optionMaterial.color = 0xffffff;
    };

     this.optionPlane.onClick = function(){
       console.log("youclicked it");
       //onOptionClick();
    };

    this.setPosition = function(x,y,z,radius){
        characterOption.optionPlane.position.set(x*radius,y*radius,z);
    };

    this.clickable = function(){
        return characterOption.optionPlane;
    }
}


IBRS.ContextualMenu = function(){
    var menu = this;
    this.html = jQuery("<div class='menuContainer'></div>");

    this.calculateMenu = function(){
        console.log("QRVWEtvrwTBERYNERYNERYNE/NYBVER");
        console.log(IBRS.actualStage);
        switch (IBRS.actualStage) {
            case "animateElements":
                
                var actionList = [];
                var activeTeam = false;
                if (IBRS.elementSelected.getPlayer().playerID === IBRS.Current.Turn.playerID){
                    activeTeam = true;
                }
                console.log(IBRS.Current.DeclarationType);
                switch(IBRS.Current.DeclarationType){
                    case "firstDeclaration":

                        actionList = 
                        [IBRS.DEC.MOVE,
                        IBRS.DEC.DISCOVER,
                        IBRS.DEC.OPENCLOSE,
                        IBRS.DEC.DA];

                    break;
                    case "secondDeclaration":
                        actionList = 
                        [IBRS.DEC.MOVE,
                        IBRS.DEC.DISCOVER,
                        IBRS.DEC.OPENCLOSE,
                        IBRS.DEC.CD,
                        IBRS.DEC.DODGE,
                        IBRS.DEC.CC];
                        
                    break;
                    case "firstAro":
                        actionList = 
                        [IBRS.DEC.CD,
                        IBRS.DEC.DODGE,
                        IBRS.DEC.CC,
                        IBRS.DEC.DISCOVER];
                   
                    break;
                    case "secondAro":
                        actionList = 
                        [IBRS.DEC.CD,
                        IBRS.DEC.DODGE,
                        IBRS.DEC.CC,
                        IBRS.DEC.DISCOVER];
                   
                    break;
                    case "resolutions":

                    break;
                }
            menu.html.empty();
            var tlMenu = new TimelineMax({paused:false});
            for (var i = 0; i< actionList.length;i++){
                var tempActionselectior = new IBRS.ActionSelector(IBRS.Current.Order,IBRS.elementSelected,actionList[i],menu);
                var selectorHtml = tempActionselectior.getHtml();
                menu.html.append(selectorHtml);
                tlMenu.from(selectorHtml,0.6,{left:'300px',opacity:0,ease:Back.easeOut},i*0.2);
            }

            break;

            default:
            break;
        }
    }

    this.hide = function(){
        jQuery("#contextualMenu").empty();
    }
    this.show = function () {
        console.log("contextual show");
        menu.calculateMenu();
        jQuery("#contextualMenu").append(menu.html);
        //anuimations
    }
}


IBRS.ActionSelector = function(order,element,tipo,menuContextual){
    var selector = this;
    this.elemento = element;
    this.order = order;
    this.html = jQuery("<div class='ActionSelector'></div>");
    this.iconPath = "";
    var params = {};
    console.log(tipo);
    switch(tipo){
        case IBRS.DEC.MOVE:
            this.iconPath = "img/MOVE.png";
            this.html.click(function(){
                params.descriptor = IBRS.DEC.MOVE;
                params.source = selector.elemento;
                params.actions = [
                {type:IBRS.ANIM.MOVE,startTime:0,
                    endTime:1,
                    startPosition:{x:selector.elemento.getPosition().x,
                                y:selector.elemento.getPosition().y,
                                z:selector.elemento.getPosition().z},
                    endPosition:{x:selector.elemento.getPosition().x,
                                y:selector.elemento.getPosition().y+10,
                                z:selector.elemento.getPosition().z}}];
                selector.order.createDeclaration(params,IBRS.Current.DeclarationType);
                IBRS.actualDeclarationHandler.getHtml();
                menuContextual.hide();
            });
        break;
        case IBRS.DEC.DISCOVER:
            this.iconPath = "img/DISCOVER.png";
        break;
        case IBRS.DEC.OPENCLOSE:
            this.iconPath = "img/OPENCLOSE.png";
        break;
        case IBRS.DEC.CD:
            console.log("icon = CD.png");
            this.iconPath = "img/CD.png";
        break;
        case IBRS.DEC.DODGE:
            this.iconPath = "img/DODGE.png";
        break;
        case IBRS.DEC.CC:
           this.iconPath = "img/CC.png";
        break;
        case IBRS.DEC.DA:
            this.iconPath = "img/DA.png";
        break;
    }
    this.icon = jQuery("<img class='ActionSelectorIcon' src='"+this.iconPath+"' ></img>");
    this.html.append(this.icon);

    this.getHtml = function(){
        return selector.html;
    }   
    

}


