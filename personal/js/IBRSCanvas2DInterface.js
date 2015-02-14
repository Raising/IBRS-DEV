
IBRS.Canvas2DInterface = function (graphics){

	var C2DI = this;
	this.graphics = graphics;
	this.targeteableElementsList = [];
	this.htmlLayer = $("#C2DI_referenceLayer");


	this.SetupUpMouseInteraction = function(){
        var mouseIsDown = 0;
        var mouseDownPosition = new THREE.Vector3(0,0,0);
        var mouseSigleClick = false;
        var contextualMenuOpened = false; 
      
        var mouseDragable = false;
        C2DIhtmlLayer.addEventListener("mousewheel", C2DI.MouseWheelHandler, false);// IE9, Chrome, Safari, Opera  
        C2DIhtmlLayer.addEventListener("DOMMouseScroll", C2DI.MouseWheelHandler, false);// Firefox
        C2DIhtmlLayer.addEventListener('contextmenu', function (evt){evt.preventDefault();}, false);
        C2DIhtmlLayer.addEventListener('mousedown', function (evt) {
        mouseIsDown=evt.which;
        mouseSigleClick = true;
        mouseDragable = false;
        mouseDownPosition.x = evt.pageX;
        mouseDownPosition.y = evt.pageY;       
      
            switch (evt.which) {
                case 1://left mouse
                     var elementClicked = C2DI.findObjectByProyection(evt,this,C2DI.targeteableElementsList);
                     if (elementClicked != undefined){
                        elementClicked = elementClicked.parent;
                        IBRS.elementSelected.unSelect();
                        IBRS.elementSelected = elementClicked.logicModel;
                        C2DI.actualiceSelection();
                        IBRS.elementSelected.select();
                         mouseDragable = true;
                        //C2DI.selectorCamera.CameraReposition(0,0,0,elementClicked)  ;  
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





        C2DIhtmlLayer.addEventListener('mousemove', function (evt) {

            mouseSigleClick = false;
            //hover sobre opciones
            if(mouseIsDown===0 && contextualMenuOpened === true){
                var elementHover = C2DI.findObjectByProyection(evt,this,C2DI.contextualMenu.getClickableOptions());
                if (elementHover != undefined){
                    C2DI.contextualMenu.highLight(elementHover.position.x,elementHover.position.y,elementHover.position.z);
                }else{
                    C2DI.contextualMenu.stopHighLight();
                }
            }
            //giro de camara
            else if (mouseIsDown==3){
                //turn camera
                if (C2DI.keyPresed.F4 === false){
                    C2DI.graphics.CameraReposition(0,
                        0.03*(evt.pageX - mouseDownPosition.x),
                        0.02*(evt.pageY - mouseDownPosition.y)
                    );
                }else{
                    C2DI.graphics.selectorCamera.CameraReposition(0,
                        0.03*(evt.pageX - mouseDownPosition.x),
                        0.02*(evt.pageY - mouseDownPosition.y)
                    );
                }
            mouseDownPosition.x = evt.pageX;
            mouseDownPosition.y = evt.pageY;
            C2DI.cameraMoved = true;
            }
             else if (mouseIsDown===1 ){
                if (C2DI.keyPresed.alt){
                    var position = C2DI.findPointByProyection(evt,this,C2DI.sceneryElementsList);
                    if (position != undefined){
                        var angle = Math.atan2(position.x- IBRS.elementSelected.position.x,position.z-IBRS.elementSelected.position.z);
                        IBRS.elementSelected.setRotation(0,angle,0);
                        mouseDragable = false;
                    }
                }else if (mouseDragable===true){
                //intime reposition miniature
                 var position = C2DI.findPointByProyection(evt,this,C2DI.sceneryElementsList);
                     if (position != undefined){
                        IBRS.elementSelected.setPosition(position.x,position.y,position.z);
                        mouseDragable = true;
                    }
                }
            }
        },false);




        C2DIhtmlLayer.addEventListener('mouseup', function (evt) {
            if (mouseIsDown==1 && mouseSigleClick==true){ 
                if (contextualMenuOpened === false){
                   
                }
                else{
                    //console.log(C2DI.contextualMenu.getClickableOptions());
                    var elementClicked = C2DI.findObjectByProyection(evt,this,C2DI.contextualMenu.getClickableOptions());
                    if (elementClicked != undefined){
                      
                        elementClicked.onClick();
                    }
                    else{
                        console.log("click en el aire");
                    }
                }
            }
            
            else if(mouseIsDown==3 && mouseSigleClick==true){
                if (contextualMenuOpened ===false){
                    var elementClicked = C2DI.findObjectByProyection(evt,this,C2DI.targeteableElementsList);

                    if (elementClicked != undefined){
                        elementClicked=elementClicked.parent;
                        //elementClicked.onElementClick();
                        C2DI.OpenContextualMenu(elementClicked);
                        contextualMenuOpened = true;
                    }else{
                        C2DI.CloseContextualMenu();
                         contextualMenuOpened = false;
                    }
                }
                else{
                        C2DI.CloseContextualMenu();
                         contextualMenuOpened = false;
                    }
            }
            else if(mouseSigleClick===false ){
                //arrastrar miniatura
                if (mouseIsDown===1  && mouseDragable===true){
                    var position = C2DI.findPointByProyection(evt,this,C2DI.sceneryElementsList);
                     if (position != undefined){
                        IBRS.elementSelected.setPosition(position.x,position.y,position.z);
                        mouseDragable = false;
                    }
                }
            }
            mouseSigleClick = false;
            mouseIsDown=0;

            
            
        },false);
    };
    this.setupKeyboardInteraction = function(C2DIhtmlLayer){
       C2DIhtmlLayer.setAttribute('tabindex','0');
      

       C2DIhtmlLayer.addEventListener("keydown",function(evt){
           console.log(evt.keyCode);
            switch(evt.keyCode){
                case 9:
                    C2DI.keyPresed.tab = true;

                    
                    for (var i =0; i<C2DI.targeteableElementsList.length;i++){

                        C2DI.targeteableElementsList[i].selectorOpacity(1);
                    }


                break;
                case 17:
                    C2DI.keyPresed.ctrl = true;
                break;
                case 18:
                    C2DI.keyPresed.alt = true;
                break;
                case 115://F4
                    C2DI.keyPresed.F4 = true;
                    C2DI.selectorCamera.putInScene(C2DI.sceneOrtho);
                break;

                 case 112://F1
                    C2DI.keyPresed.F4 = true;
                     for (var i =0; i<C2DI.targeteableElementsList.length;i++){
                        var highLight = C2DI.targeteableElementsList[i]
                        if (true){
                            highLight.selectorOpacity(1);
                        }
                        
                    }
                   
                break;
                case 113://F2
                    C2DI.keyPresed.F4 = true;
                    
                    C2DI.selectorCamera.removeFromScene(C2DI.sceneOrtho);
                break;
                case 37:
                    C2DI.arrowLEFT = true;
                    var sinA =  Math.sin(C2DI.camera_Horizonatl_Angle);
                    var cosA =  Math.cos(C2DI.camera_Horizonatl_Angle);
                     C2DI.camera_target.position.set(
                        C2DI.camera_target.position.x+cosA*0+sinA*(-1),
                        C2DI.camera_target.position.y,
                        C2DI.camera_target.position.z-(cosA*(-1)-sinA*0));
                     console.log(C2DI.camera_target.position);
                     C2DI.CameraReposition(0,0,0,C2DI.camera_target);
                        
                break;
                case 38:
                    C2DI.arrowUP = true;
                    var sinA =  Math.sin(C2DI.camera_Horizonatl_Angle);
                    var cosA =  Math.cos(C2DI.camera_Horizonatl_Angle);
                     C2DI.camera_target.position.set(
                        C2DI.camera_target.position.x+cosA*(-1)+sinA*(0),
                        C2DI.camera_target.position.y,
                        C2DI.camera_target.position.z-(cosA*(0)-sinA*(-1)));
                     console.log(C2DI.camera_target.position);
                     C2DI.CameraReposition(0,0,0,C2DI.camera_target);
                break;
                case 39:
                    C2DI.arrowRIGHT = true;
                    var sinA =  Math.sin(C2DI.camera_Horizonatl_Angle);
                    var cosA =  Math.cos(C2DI.camera_Horizonatl_Angle);
                     C2DI.camera_target.position.set(
                        C2DI.camera_target.position.x+cosA*0+sinA*(1),
                        C2DI.camera_target.position.y,
                        C2DI.camera_target.position.z-(cosA*(1)-sinA*0));
                     console.log(C2DI.camera_target.position);
                     C2DI.CameraReposition(0,0,0,C2DI.camera_target);
                break;
                case 40:
                    C2DI.arrowDOWN = true;
                    var sinA =  Math.sin(C2DI.camera_Horizonatl_Angle);
                    var cosA =  Math.cos(C2DI.camera_Horizonatl_Angle);
                     C2DI.camera_target.position.set(
                        C2DI.camera_target.position.x+cosA*(1)+sinA*(0),
                        C2DI.camera_target.position.y,
                        C2DI.camera_target.position.z-(cosA*(0)-sinA*(1)));
                     console.log(C2DI.camera_target.position);
                     C2DI.CameraReposition(0,0,0,C2DI.camera_target);
                break;
                default:
                    console.log("na que ver");
                break;
            }
           
        }, false);  


       C2DIhtmlLayer.addEventListener("keyup", function(evt){
             switch(evt.keyCode){
                case 9:
                    C2DI.keyPresed.tab = false;
                    
                      for (var i =0; i<C2DI.targeteableElementsList.length;i++){
                        C2DI.targeteableElementsList[i].selectorOpacity(0);
                    }
                    
                break;
                case 17:
                    C2DI.keyPresed.ctrl = false;
                break;
                case 18:
                    C2DI.keyPresed.alt = false;
                break;
                 case 115://F4
                    C2DI.keyPresed.F4 = false;
                    
                    C2DI.selectorCamera.removeFromScene(C2DI.sceneOrtho);
                break;
                 case 112://F1
                    C2DI.keyPresed.F4 = false;
                    
                    C2DI.selectorCamera.removeFromScene(C2DI.sceneOrtho);
                break;
                case 113://F2
                    C2DI.keyPresed.F4 = false;
                    
                    C2DI.selectorCamera.removeFromScene(C2DI.sceneOrtho);
                break;
                 case 37:
                    C2DI.arrowLEFT = false;
                break;
                case 38:
                    C2DI.arrowUP = false;
                break;
                case 39:
                    C2DI.arrowRIGHT =false;
                break;
                case 40:
                    C2DI.arrowDOWN = false;
                break;
                default:
                    console.log("na que ver");
                break;
            }
            
        }, false); 

       
    }


       this.actualiceSelection = function(){

        C2DI.selectorCamera.CameraReposition(0,0,0,IBRS.elementSelected.unitGraphic);
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
        var CanvasStats = C2DI.getCanvasStats(scope);

        var clickx = evt.pageX - CanvasStats.Offset.left - CanvasStats.paddingleft;
        var clicky = evt.pageY - CanvasStats.Offset.top - CanvasStats.paddingtop ;
        directionVector.x = ( clickx / CanvasStats.width ) * 2 - 1;
        directionVector.y = -( clicky / CanvasStats.height ) * 2 + 1;

        var ray = projector.pickingRay(directionVector,C2DI.camera);
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
        var CanvasStats = C2DI.getCanvasStats(scope);

        var clickx = evt.pageX - CanvasStats.Offset.left - CanvasStats.paddingleft;
        var clicky = evt.pageY - CanvasStats.Offset.top - CanvasStats.paddingtop ;
        directionVector.x = ( clickx / CanvasStats.width ) * 2 - 1;
        directionVector.y = -( clicky / CanvasStats.height ) * 2 + 1;

        var ray = projector.pickingRay(directionVector,C2DI.camera);
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
        var CanvasStats = C2DI.getCanvasStats(jQuery("#canvas").children());
        var pos = element.matrixWorld.getPosition().clone();
        var projScreen = projector.projectVector(pos,C2DI.camera);

        var percX = (projScreen.x + 1) / 2;
        var  percY = (-projScreen.y + 1) / 2;
        var left = percX * CanvasStats.width;
        var top = percY * CanvasStats.height;
      
        return { x: left + CanvasStats.Offset.left,
             y: top + CanvasStats.Offset.top};
    }


    this.MouseWheelHandler = function(e) {
         var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (C2DI.keyPresed.F4 === true){
        
        }
        else{
        C2DI.CameraReposition(delta*(-5),0,0)  ;
        }
        C2DI.cameraMoved = true;
        return false;
    } 



}