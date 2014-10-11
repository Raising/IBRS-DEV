IBRS.CanvasHtml = function(graphics){
	var canvasHtml = this;
	this.graphics = graphics;

	this.getPoint = function(event){

        var projector = new THREE.Projector();
        var directionVector = new THREE.Vector3();
        var CanvasStats = canvasHtml.graphics.getCanvasStats(jQuery( canvasHtml.graphics.render.domElement));

        var clickx = event.originalEvent.pageX - CanvasStats.Offset.left - CanvasStats.paddingleft;
        var clicky = event.originalEvent.pageY - CanvasStats.Offset.top - CanvasStats.paddingtop ;
        directionVector.x = ( clickx / CanvasStats.width ) * 2 - 1;
        directionVector.y = -( clicky / CanvasStats.height ) * 2 + 1;

        var ray = projector.pickingRay(directionVector,graphics.camera);
        var intersects = ray.intersectObjects(IBRS.actualGame.getSceneryElementList()[0], true);
        console.log(intersects);
        if (intersects.length) {
        	
            var target = intersects[0];
            console.log(target); 
            return target.object;
            
        } else{
            return undefined;
        }
    }



	


	this.setDrop = function(){
		jQuery(canvasHtml.graphics.render.domElement).bind("dragover",function(event){
		event.preventDefault();
		console.log("intento de hovering");
		});


		jQuery(canvasHtml.graphics.render.domElement).bind("drop" , function(event){
	 	event.preventDefault();
		
		switch (IBRS.dragCatcher.kind){

			case "UnitLogic":
					var position = canvasHtml.getPoint(event);
					//IBRS.dragCatcher.tacticalGroup.removeUnit( IBRS.dragCatcher);
					//IBRS.dragCatcher.tacticalGroup = tacticalGroup;
					//tacticalGroup.unitList.push(IBRS.dragCatcher);
					//army.updateHtml();

			break;
			default:
			break;
			}
			return false;
		});
	}
 }