IBRS.Reproductor = function(graphicEnviroment){
	var reproductor = this;
	this.graphicEnviroment = graphicEnviroment;
	this.effectsContainer = new IBRS.EffectsContainer(this);
	this.graphicEnviroment.scene.add(this.effectsContainer);


	




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
				for (var k =0; k< selectOrder.firstAro.length ; k++) {
					var selectDeclaration = selectOrder.firstAro[k];
					reproductor.instertActionsFromDeclaration(selectDeclaration,timeFilled);
				};
				if (selectOrder.firstAro.length>0){
					timeFilled += reproductor.timePerAction;
				}

				for (var k =0; k< selectOrder.secondDeclaration.length ; k++) {
					var selectDeclaration = selectOrder.secondDeclaration[k];
					reproductor.instertActionsFromDeclaration(selectDeclaration,timeFilled);
				};
				if (selectOrder.secondDeclaration.length>0){
					timeFilled += reproductor.timePerAction;
				}
			};	
		};
	}

	this.instertActionsFromDeclaration = function(declaration,timeOrigin){
		var target = declaration.source;
		var iconDeclaration = new IBRS.Animation(reproductor,target,0,
													timeOrigin,
													timeOrigin+reproductor.timePerAction,	
													declaration.descriptor,0);
		reproductor.animationList.push(iconDeclaration);
		for (var i = 0; i< declaration.actions.length;i++){
			var action = declaration.actions[i];
			var tempAnimation = new IBRS.Animation(reproductor,target,action.type,
													timeOrigin+reproductor.timePerAction*action.startTime,
													timeOrigin+reproductor.timePerAction*action.endTime,	
													action.startPosition,
													action.endPosition);
			reproductor.animationList.push(tempAnimation);
		}
	
	}


	this.update= function(){
		
		if (reproductor.playing){

			var actualTime = Date.now() - reproductor.referenceTime;
			reproductor.effectsContainer.update(actualTime);
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


IBRS.Animation = function(reproductor,target,type,startTime,endTime,startValue,endValue){
	var animation = this;
	this.reproductor = reproductor;
	this.target = target;
	this.type = type; // 0 = not defined, 1 = movement
	this.startTime = startTime;
	this.endTime = endTime;
	this.duration = endTime-startTime;
	this.startValue = startValue;
	this.endValue = endValue;
	this.started = false;
	this.finished = false;

	//creacio nde EFX si compete
	switch(type){
		case 0:
			var descriptor = 0;//startValue; //anti intuitivo, lo se;
			this.efx = reproductor.effectsContainer.createEffect(0,descriptor,this.startTime,this.endTime);
			break;
		case 2:
			this.efx = reproductor.effectsContainer.createEffect(1,this.target,this.startTime,this.endTime);
			break;
		default:

			break;
	}
	

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
			var directionVector = new THREE.Vector3();
			directionVector.subVectors(animation.endValue,animation.startValue);
			switch(animation.type){
				case 0: //icono
					animation.efx.position.x = animation.target.position.x;
					animation.efx.position.z = animation.target.position.z;
					animation.efx.position.y = animation.target.position.y+ Math.max(1,1/(percentileComplete*2+0.1))*8;
					console.log (animation.target.position.x+"  "+animation.target.position.y+"  "+animation.target.position.z);
					break;
				case 1://movimiento
					var tempX = animation.startValue.x+percentileComplete*directionVector.x;
					var tempY = animation.startValue.y+percentileComplete*directionVector.y;
					var tempZ = animation.startValue.z+percentileComplete*directionVector.z;
					animation.target.setPosition(tempX,tempY,tempZ);
					break;
				case 2: //CD, cuando se crea el disparo se  determina el pequeño desplazamiento aleatorio del disparo
					var random = (animation.startValue.x+animation.startValue.y+animation.startValue.z)%1;
					var init = (Math.max(0,(percentileComplete-(random)))*5)%1;
					var last = Math.min(1,init+0.03);
					
					var floatingPosition = new THREE.Vector3();
					floatingPosition.copy(directionVector);
					floatingPosition.multiplyScalar(init);
					floatingPosition.add(animation.startValue);
					animation.efx.startPoint.set(floatingPosition.x,floatingPosition.y,floatingPosition.z);

					floatingPosition.copy(directionVector);
					floatingPosition.multiplyScalar(last);
					floatingPosition.add(animation.startValue);
					animation.efx.endPoint.set(floatingPosition.x,floatingPosition.y,floatingPosition.z);
					animation.efx.geometry.verticesNeedUpdate = true;
					
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


IBRS.EffectsContainer = function(reproductor){
    BasicElement.call(this);
    var effectsContainer = this;
    this.reproductor = reproductor;

    this.efxList = [];


    this.createEffect = function(efxType,origin,startTime,endTime){
    	var tempEfx = new IBRS.Effect(efxType,origin,startTime,endTime);
    	effectsContainer.efxList.push(tempEfx);
    	return tempEfx;

    }

	
	
	this.update = function(time){
      		for (var i = effectsContainer.efxList.length - 1; i >= 0; i--) {
      			var actualEfx = effectsContainer.efxList[i];
      			if (time < actualEfx.startTime || time > actualEfx.endTime){
      				if (actualEfx.inScene){
      					effectsContainer.remove(actualEfx);
      					actualEfx.inScene = false;
      				}
      			}

      			else{      				
      				if (!actualEfx.inScene){
      					effectsContainer.add(actualEfx);
      					actualEfx.inScene = true;
      				}
      				
      			}
      		};
    }
};

IBRS.EffectsContainer.prototype = Object.create(BasicElement.prototype);

IBRS.Effect = function(efxType,aux,startTime,endTime){
	 BasicElement.call(this);
	var effect = this;
	this.efxType = efxType;
	this.aux = aux;
	this.startTime = startTime;
	this.endTime = endTime;
	this.efxColor = 0x000000;
	this.inScene = false;
	

    this.getSprite = function(code){
    	var mapS;
    	switch(code){
    		case 0: //mover
    		mapS = THREE.ImageUtils.loadTexture("img/Orden_regular.png");
    			break;
    		case 1: //cd
    			
    			break;
    		case 2: //descubrir
    			
    			break;
    		case 3: //camo
    			
    			break;
    		default:

    			break;
    	}
    	var materialS = new THREE.SpriteMaterial( { map: mapS , color: 0xffffff } );
    	var sprite = new THREE.Sprite( materialS );
    	sprite.scale.set(2.5,2.5, 1.0 );

    	return sprite;
    };





	switch(efxType){
			case 0: // Icono
				this.icon = effect.getSprite(this.aux); 
				this.add(this.icon);


				break;		
			case 1: //linea de disparo
    	


    			this.startPoint = new THREE.Vector3(0,0,0);
				this.endPoint = new THREE.Vector3(0,0,0);
				this.material = new THREE.LineBasicMaterial({color:this.efxColor , linewidth: 5	});
    			this.geometry = new THREE.Geometry();
    			this.geometry.vertices.push(this.startPoint);
    			this.geometry.vertices.push(this.endPoint);
    			this.geometry.dynamic = true;
				this.geometry.verticesNeedUpdate = true;
    			this.line = new THREE.Line(this.geometry, this.material);
    			this.add(this.line);
				break;
    		case 2: // armas de plantilla
    			console.error("EFX "+efxType+" no definido aun");
    			break;
    		case 3: // iconos
    			console.error("EFX "+efxType+" no definido aun");
    			break;
    		case 4: //areas como sensor o hacking
    			console.error("EFX "+efxType+" no definido aun");
    			break;
    		default:
    			console.error("tipo de efecto no definido");
    			break;
    }


};
IBRS.Effect.prototype = Object.create(BasicElement.prototype);


