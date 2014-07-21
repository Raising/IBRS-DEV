IBRS.Reproductor = function(graphicEnviroment){
	var reproductor = this;
	this.graphicEnviroment = graphicEnviroment;
	this.animationList = [];	//lista de elementos tipo animacion
	this.referenceTime = 0;
	this.pausedTime = 0;

	this.playing = false;
	this.timePerAction = 5000;//5 segundos

	this.insertEvents = function(data){
		//TODO Aqui la magia
		var timeFilled = 0;
		//poner la declaración y deepus las acciones
		for (var i = data.turnList.length - 1; i >= 0; i--) { 
			var selectTurn = data.turnList[i];
			for (var j = selectTurn.orderList.length - 1; j >= 0; j--) {
				var selectOrder = selectTurn.orderList[j];
				
				for (var k =0; k< selectOrder.firstDeclaration.length ; k++) {
					var selectDeclaration = selectOrder.firstDeclaration[k];
					reproductor.instertActionsFromDeclaration(selectDeclaration,timeFilled);
				};
				if (selectOrder.firstDeclaration.length>0){
					timeFilled += reproductor.timePerAction;
				}
			};	
		};
	}

	this.instertActionsFromDeclaration = function(declaration,timeOrigin){
		var target = declaration.source;
		for (var i = 0; i< declaration.actions.length;i++){
			var action = declaration.actions[i];
			var tempAnimation = new IBRS.Animation(target,action.type,
													timeOrigin+reproductor.timePerAction*action.startTime,
													timeOrigin+reproductor.timePerAction*action.endTime,	
													action.startPosition,
													action.endPosition);
			reproductor.animationList.push(tempAnimation);
		}
	
	}


	this.update= function(){
		
		if (reproductor.playing){
			//console.log("Playing");
			var actualTime = Date.now() - reproductor.referenceTime;
			//console.log(actualTime);
			for (var i = 0;i<reproductor.animationList.length; i++) {
				var actualAnimation = reproductor.animationList[i];
				actualAnimation.update(actualTime);
			};		
		}
	}

	this.start = function(){
		reproductor.referenceTime = Date.now();
		this.playing = true;
	}
	
	this.continue = function(){

		var timeDiference = Date.now() - reproductor.pausedTime;
		reproductor.referenceTime += timeDiference;
		this.playing = true;
	}	

	this.pause = function(){
		reproductor.pausedTime = Date.now();
		this.playing = false;
	}


};


IBRS.Animation = function(target,type,startTime,endTime,startValue,endValue){
	var animation = this;
	this.target = target;
	this.type = type; // 0 = not defined, 1 = movement
	this.startTime = startTime;
	this.endTime = endTime;
	this.duration = endTime-startTime;
	this.startValue = startValue;
	this.endValue = endValue;
	this.started = false;
	this.finished = false;

	this.update = function(time){
		if (animation.endTime > time && animation.finished == true){
			animation.finished = false;
		}
		
		if (animation.startTime > time && animation.started == true){
			animation.started = false;
		}
		if (animation.startTime < time && animation.started == false){
			animation.started = true;
		}

		if (animation.finished == false && animation.started==true){
			var percentileComplete = Math.max(0,Math.min(1,(time - animation.startTime)/animation.duration));
			switch(animation.type){
				case 0:
					console.error("animation not defined in use");
					break;
				case 1://movimiento
					var tempX = animation.startValue.x+percentileComplete*(animation.endValue.x-animation.startValue.x);
					var tempY = animation.startValue.y+percentileComplete*(animation.endValue.y-animation.startValue.y);
					var tempZ = animation.startValue.z+percentileComplete*(animation.endValue.z-animation.startValue.z);
					animation.target.setPosition(tempX,tempY,tempZ);
					break;
				default:
					console.error("animacion no reconocida, codigo de animación invalido");
					break;
			};
			if (animation.endTime < time){
				animation.finished = true;
			}
		}
	};

};