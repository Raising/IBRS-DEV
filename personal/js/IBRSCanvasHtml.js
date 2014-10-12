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
        //console.log(IBRS.actualGame.getSceneryElementList()[0]);
        graphics.tageteableElementsList
        var intersects = ray.intersectObjects( graphics.sceneryElementsList, true);
        //var intersects = ray.intersectObjects(IBRS.actualGame.getSceneryElementList()[0], true);
       
        if (intersects.length) {
        	
            var target = intersects[0];
          
            return target.point;
            
        } else{
            return undefined;
        }
    }



	


	this.setDragAndDrop = function(){


		jQuery(canvasHtml.graphics.render.domElement).bind("dragover",function(event){
			event.preventDefault();
			switch (IBRS.dragCatcher.kind){

				case "UnitLogic":
						var position = canvasHtml.getPoint(event);
						if (position != undefined){
						IBRS.dragCatcher.setPosition(position.x,position.y,position.z);
						}
						//IBRS.dragCatcher.tacticalGroup.removeUnit( IBRS.dragCatcher);
						//IBRS.dragCatcher.tacticalGroup = tacticalGroup;
						//tacticalGroup.unitList.push(IBRS.dragCatcher);
						//army.updateHtml();

				break;
				default:
				break;
			}
			//console.log("intento de hovering");
		});




		jQuery(canvasHtml.graphics.render.domElement).bind("drop" , function(event){
	 	event.preventDefault();
		
		switch (IBRS.dragCatcher.kind){

			case "UnitLogic":
					var position = canvasHtml.getPoint(event);
					if (position != undefined){
						IBRS.dragCatcher.setPosition(position.x,position.y,position.z);
					}//IBRS.dragCatcher.tacticalGroup.removeUnit( IBRS.dragCatcher);
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