IBRS.Reproductor = function(graphicEnviroment){
	var reproductor = this;
	this.graphicEnviroment = graphicEnviroment;
	this.effectsContainer = new IBRS.EffectsContainer(this);
	this.graphicEnviroment.scene.add(this.effectsContainer);


	



	this.animationOrderList = [];
	this.animationList = [];	//lista de elementos tipo animacion
	this.ordersContainer = new IBRS.OrdersContainer(this);
	this.graphicEnviroment.sceneOrtho.add(this.ordersContainer);
	this.referenceTime = 0;
	this.pausedTime = 0;

	this.playing = false;
	this.timePerAction = 4000;//4 segundos
	this.declarationInterval = 1.2;
	this.insertEvents = function(data){
		//TODO Aqui la magia
		var timeFilled = 0;
		//poner la declaración y deepus las acciones

		for (var i = 0 ;i<data.turnList.length ; i++) { 
			var selectTurn = data.turnList[i];
			var startTurnTime = timeFilled;
			var numRegularOrders = 0;
			for (var j = 0; j< selectTurn.orderList.length; j++) {
				var selectOrder = selectTurn.orderList[j];
				var startOrderTime= timeFilled;
				if (selectOrder.orderType == 0){numRegularOrders++;}
				timeFilled += reproductor.timePerAction/2;

				timeFilled = reproductor.instertDeclarationsFromSubGroup( selectOrder.firstDeclaration,timeFilled);
				timeFilled = reproductor.instertDeclarationsFromSubGroup( selectOrder.firstAro,timeFilled);
				timeFilled = reproductor.instertDeclarationsFromSubGroup( selectOrder.secondDeclaration,timeFilled);
				timeFilled = reproductor.instertDeclarationsFromSubGroup( selectOrder.secondAro,timeFilled);
				
				/// RESOLUCIONES



				/// Token Ordenes
				reproductor.insterOrderSpent(selectOrder,startOrderTime,timeFilled,reproductor.timePerAction);

			
			};
			var endTurnTime = timeFilled;
			reproductor.actualiceOrderSpent(numRegularOrders,startTurnTime,endTurnTime);	
		};

	}
	this.instertDeclarationsFromSubGroup = function(list,time){
		for (var k =0; k< list.length ; k++) {
			var selectDeclaration = list[k];
			reproductor.instertActionsFromDeclaration(selectDeclaration,time,reproductor.timePerAction);
		};
		if (list.length>0){
			time += reproductor.timePerAction*reproductor.declarationInterval;
		}
		return time;
	};


	
	this.insterOrderSpent = function(order,startTime,endTime){
			if (order.orderType == 0 ){//es regular
				var orderAnimation = new IBRS.Animation(reproductor,order.orderType,69,startTime,endTime,0,0); 
				reproductor.animationOrderList.push(orderAnimation);
			}
	};
	this.actualiceOrderSpent = function(cant,startTurnTime,endTurnTime){
			var size = reproductor.animationOrderList.length;
			for (i=1;i<=cant;i++){
				var actualOrder = reproductor.animationOrderList[size-i];
				actualOrder.token.startTime = startTurnTime;
				actualOrder.token.endTime = endTurnTime;
				actualOrder.token.position.set(i*55-reproductor.graphicEnviroment.canvasWidth/2 ,reproductor.graphicEnviroment.canvasHeight/2-40,1);
			}

	};

	this.instertActionsFromDeclaration = function(declaration,timeOrigin,timePerAction){
		var target = declaration.source;

		var iconDeclaration = new IBRS.Animation(reproductor,target,0,
													timeOrigin,
													timeOrigin+timePerAction,	
													declaration.descriptor,0);
		reproductor.animationList.push(iconDeclaration);

		for (var i = 0; i< declaration.actions.length;i++){
			var action = declaration.actions[i];
			var tempAnimation = new IBRS.Animation(reproductor,target,action.type,
													timeOrigin+timePerAction*action.startTime,
													timeOrigin+timePerAction*action.endTime,	
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
			reproductor.ordersContainer.update(actualTime);
			for (var i = 0;i<reproductor.animationOrderList.length; i++) {
				var actualAnimation = reproductor.animationOrderList[i];
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
		case 69:// regular order
			this.token = reproductor.ordersContainer.createOrder(target,startTime,endTime);
			break;
		case 0:
			var descriptor = startValue; //anti intuitivo, lo se;
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
					animation.efx.position.y = animation.target.position.y+ Math.max(1,1/(percentileComplete*3+0.1))*8;
					break;
				case 1://movimiento
					var tempX = animation.startValue.x+percentileComplete*directionVector.x;
					var tempY = animation.startValue.y+percentileComplete*directionVector.y;
					var tempZ = animation.startValue.z+percentileComplete*directionVector.z;
					animation.target.setPosition(tempX,tempY,tempZ);
					break;
				case 2: //CD, cuando se crea el disparo se  determina el pequeño desplazamiento aleatorio del disparo
					//var random = (animation.startValue.x+animation.startValue.y+animation.startValue.z)%1;
					var init = (Math.max(0,(percentileComplete)*5)%1);
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
				case 69: //token de ordenes
					if (percentileComplete > 0.95){
					animation.token.materialT.opacity =  1- (percentileComplete-0.95)*10 ;
					animation.token.scaleSprite(percentileComplete,1,1);
					
					}
					else{animation.token.scaleSprite(Math.sin(percentileComplete*12),1,1);
					}
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

IBRS.OrdersContainer = function(reproductor){
    BasicElement.call(this);
    var ordersContainer = this;
    this.reproductor = reproductor;

    this.orderList = [];

    

    this.createOrder = function(orderType,startTime,endTime){
    	
    	var tempOrder = new IBRS.Token(orderType,startTime,endTime);
    	ordersContainer.orderList.push(tempOrder);
    	return tempOrder;

    }

	
	
	this.update = function(time){
      		for (var i = ordersContainer.orderList.length - 1; i >= 0; i--) {
      			var actualOrder = ordersContainer.orderList[i];
      			if (time < actualOrder.startTime || time > actualOrder.endTime){
      				if (actualOrder.inScene){
      					ordersContainer.remove(actualOrder);
      					actualOrder.inScene = false;
      				}
      			}

      			else{      				
      				if (!actualOrder.inScene){
      					ordersContainer.add(actualOrder);
      					actualOrder.inScene = true;
      				}
      				
      			}
      		};
    }
};

IBRS.OrdersContainer.prototype = Object.create(BasicElement.prototype);




IBRS.Token = function(orderType,startTime,endTime){
	 BasicElement.call(this);
	var token = this;
	this.orderType = orderType;
	this.map;
	this.startTime = startTime;
	this.endTime = endTime;
	this.tokenColor = 0xFFFFFF;
	this.inScene = false;
	

	
    switch(orderType){
    		case 0:
    			this.map = THREE.ImageUtils.loadTexture("img/Orden_regular.png");
    			break;
    		case 1:
    			this.map = THREE.ImageUtils.loadTexture("img/Orden_regular.png");
    			break;
    		case 2:
    			this.map = THREE.ImageUtils.loadTexture("img/Orden_regular.png");
    			break;
    		default:
    			this.map = THREE.ImageUtils.loadTexture("img/Orden_regular.png");
    			break;
    }
    this.materialT = new THREE.SpriteMaterial( { map: this.map , color: this.tokenColor,transparent: true,opacity:1 } );
    
    this.sprite = new THREE.Sprite(this.materialT);
    this.sprite.scale.set(50,50,1.0);
    this.add(this.sprite);

    this.scaleSprite = function (x,y,z){
    	token.sprite.scale.set(50*x,50*y,z);
    };
};
IBRS.Token.prototype = Object.create(BasicElement.prototype);





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
    		case IBRS.DEC.MOVE: //mover
    			mapS = THREE.ImageUtils.loadTexture("img/MOVE.png");
    			break;
    		case IBRS.DEC.CD: //cd
    			mapS = THREE.ImageUtils.loadTexture("img/CD.png");
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


