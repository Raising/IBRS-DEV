function SetupOnClick(currentRenderDomElement) {
				currentRenderDomElement.addEventListener('click', function (evt) {
			  	var projector = new THREE.Projector();
    			var directionVector = new THREE.Vector3();
			  	var Offset = jQuery(this).offset();
			  	var width =jQuery(this).width(); 
			  	var height =jQuery(this).height(); 
			    var clickx = evt.pageX - Offset.left - 15;
			    var clicky = evt.pageY - Offset.top - 5;
			    directionVector.x = ( clickx / width ) * 2 - 1;
			    directionVector.y = -( clicky / height ) * 2 + 1;
			    var ray = projector.pickingRay(directionVector,camara);
			
    			var intersects = ray.intersectObjects(escena.children, true);
					if (intersects.length) {
					var target = intersects[0].object; 
					target.scale.set(0.2,0.2,0.2);
					}
			    }, false);	
}

function SetupOnScroll(currentRenderDomElement){
        var scrollStatus=0; 
		var lastScrollPosition=0;
        var ScrollDirection;
	currentRenderDomElement.addEventListener('scroll', function() {
		scrollStatus = currentRenderDomElement.pageYOffset;
		if (scrollStatus > lastScrollTop) {ScrollDirection = "down";} else {ScrollDirection = "up";}
        lastScrollTop = scrollStatus;
        console.log(ScrollDirection);    
    },false);
}
