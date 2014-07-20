IBRS.Reproductor = function(graphicEnviroment){
	var reproductor = this;
	this.graphicEnviroment = graphicEnviroment;
	this.animationList = [];	//lista de elementos tipo animacion
	this.referenceTime = 0;
	this.pausedTime = 0;
	this.playing = false;

	this.insertEvents = function(data){
		//TODO Aqui la magia
		
	}


	this.update= function(delta){
		if (reproductor.playing){
			var actualTime = Date.Now - reproductor.referenceTime;
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
		
		if (animation.endValue < time){
			animation.finished = false;
		}
		if (animation.startValue > time){
			animation.started = true;
		}

		if (animation.finished == false && animation.started==true){
			var percentileComplete = (time - animation.startTime)/animation.duration;
			switch(animation.type){
				case 0:
					console.error("animation not defined in use");
					break;
				case 1://movimiento
					var tempX = animation.startValue.position.x+percentileComplete*animation.endValue.position.x;
					var tempY = animation.startValue.position.y+percentileComplete*animation.endValue.position.y;
					var tempZ = animation.startValue.position.z+percentileComplete*animation.endValue.position.z;
					animation.target.position.set(tempX,tempY,TempZ);
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