// IBRS Copyright (C) 2014  Ignacio Medina Castillo
// ignacio.medina.castillo@gmail.com


IBRS.DEC = {ENUM : 'tipo de ordenes'};
IBRS.DEC.MOVE = 0;
IBRS.DEC.DODGE = 1;
IBRS.DEC.JUMP = 2;
IBRS.DEC.CLIMB = 3;
IBRS.DEC.LAND = 4;
IBRS.DEC.WAKEUP = 5;
IBRS.DEC.DISCOVER = 6;
IBRS.DEC.FACE = 7;
IBRS.DEC.OPENCLOSE = 8;
IBRS.DEC.DISMOUNT = 9;
IBRS.DEC.MOUNT = 10;
IBRS.DEC.SWIM =  11;
IBRS.DEC.ALERT =  12;
IBRS.DEC.SENSOR =  13;
IBRS.DEC.CD =  14;
IBRS.DEC.CC =  15;
IBRS.DEC.SEPSITOR =  16;
IBRS.DEC.HACK =  17;
IBRS.DEC.OBSERVER =  18;
IBRS.DEC.COMA =  19;
IBRS.DEC.ENGINEER =  20;
IBRS.DEC.DOCTOR =  21;
IBRS.DEC.REGEN =  22;
IBRS.DEC.RESET =  23;
IBRS.DEC.MEDIKIT =  24;
IBRS.DEC.AUTOMEDIKIT =  25;
IBRS.DEC.CO =  26;
IBRS.DEC.INTUITIVE =  27;
IBRS.DEC.SPECULATIVE =  28;
IBRS.DEC.SUPRESIONFIRE =  29;
IBRS.DEC.CAUTIOUSMOVE =  30;
IBRS.DEC.DA =  31;
IBRS.DEC.HACKDA =  32;
IBRS.DEC.REGULAR = 69;
IBRS.DEC.IRREGULAR = 70;
IBRS.DEC.FURY = 71;
IBRS.DEC.STATUS = 99;
IBRS.DEC.PERMSTATUS = 98;
IBRS.DEC.DEATH = 100;
IBRS.DEC.UNCONS = 101;


IBRS.STAT = {ENUM : 'tipo de estados'};
IBRS.STAT.DEATH = 100;
IBRS.STAT.UNCONS = 101;
IBRS.STAT.IMM1 = 102;
IBRS.STAT.IMM2 = 103;
IBRS.STAT.CAMO = 104;
IBRS.STAT.TO = 105;
IBRS.STAT.UNCAMO = 106;
IBRS.STAT.UNDEPLOYED = 107;
IBRS.STAT.NORMAL = 150;
/*IBRS.STAT.DEATH = 9;
IBRS.STAT.DEATH = 10;
IBRS.STAT.DEATH = 11;
IBRS.STAT.DEATH = 12;
*/

IBRS.EFX = {ENUM: 'tipo de efecto'};
IBRS.EFX.ICON = 0;
IBRS.EFX.MOVE  = 1 ;
IBRS.EFX.SHOOT  = 2 ;
IBRS.EFX.TERMINAL  = 3 ;
IBRS.EFX.ZONE  = 4 ;
IBRS.EFX.TEMPLATE  = 5 ;
IBRS.EFX.GUIDED  = 6 ;
IBRS.EFX.PARABOLIC = 7 ;



IBRS.ANIM = {ENUM: 'tipo de animacion'};
IBRS.ANIM.REGULAR = 69;
IBRS.ANIM.IRREGULAR = 70;
IBRS.ANIM.FURY = 71;
IBRS.ANIM.DECLARATION = 0;
IBRS.ANIM.MOVE = 1 ;
IBRS.ANIM.SHOOT = 2;
IBRS.ANIM.STATUS = 99;
IBRS.ANIM.PERMSTATUS = 98;






IBRS.Action = function(declaration){
	var action = this;
	this.declaration = declaration;
	this.type= 0;
	this.startTime = 0;
	this.endTime = 1;
	this.startPosition = {x:0,y:0,z:0};
	this.endPosition = {x:0,y:0,z:0};
	this.insertFromData = function(data){
		action.type= data.type;
		action.startTime = data.startTime;
		action.endTime = data.endTime;
		action.startPosition = data.startPosition;
		action.endPosition = data.endPosition;
	}

	this.animation = function(){
		var tlAction = new TimelineMax({paused:false});


		switch (action.type){
			case IBRS.ANIM.DECLARATION: //icono
			break;
			case IBRS.ANIM.MOVE://movimiento
				tlAction.to(action.declaration.source.unitGraphic.position,action.endTime-action.startTime,action.endPosition,action.startTime);
			break;
			case IBRS.ANIM.SHOOT: 
			break;
			case IBRS.ANIM.REGULAR:
			break;
			case IBRS.ANIM.STATUS:
			break;
			case 5:
			break;
			case 6:
			break;
			case 7:
			break;
			case 8:
			break;
			case 9:
			break;
			default:
				console.error("animacion no reconocida, codigo de animación invalido");
			break;
		}
		return tlAction;
	}

	this.toJSON = function(key){
		var salida = {};
		salida.type= action.type;
		salida.startTime = action.startTime ;
		salida.endTime = action.endTime ;
		salida.startPosition = action.startPosition;
		salida.endPosition = action.endPosition;
		return salida;
	}
}



IBRS.Resolution = function(order){
//descriptor: que acccion se define de una lista numeration, 	
//Source, Marcador/miniatura que lo declara, 
//target: lugar de destino, movimiento o miniatura/marcador destino. 
//aro: es una ora o no.
	var resolution = this;
	this.order = order;
	this.type = -1;
    this.target = 0;
	this.status = -1;
	
	this.locateUnit = function (data){
		return resolution.order.turn.gameEvents.game.getUnitLogicFromArmyPosition(data);
	}
	 this.animation = function(){
	 	//animaciones de cambio de estado ( muerto etc)
	 	return "hey";
    }

    this.insertFromData = function(data){
    	resolution.type = data.type;
    	resolution.target = resolution.locateUnit(data.target);
    	resolution.status= data.status;
    }

    this.toJSON = function(key){
    	var salida = {};
    	salida.type =  resolution.type;
    	salida.status = resolution.status;
    	salida.target = {groupNumber : resolution.target.tacticalGroup.groupNumber,
    					playerID : resolution.target.tacticalGroup.army.player.playerID,
    					unitNumber : resolution.target.unitNumber};
    	return salida;

    }

};

IBRS.Declaration = function(order){
//descriptor: que acccion se define de una lista numeration, 	
//Source, Marcador/miniatura que lo declara, 
//target: lugar de destino, movimiento o miniatura/marcador destino. 
//aro: es una ora o no.
	var declaration = this;
	this.order = order;
	this.descriptor = 0;
    this.source = 0;
	this.actions = [];
	
	this.locateUnit = function (data){
		return declaration.order.turn.gameEvents.game.getUnitLogicFromArmyPosition(data);
	}

    this.insertFromData = function(data){
    	declaration.descriptor = data.descriptor;
    	declaration.source= declaration.locateUnit(data.source);
    	for (var i = 0; i< data.actions.length; i++){
    		var tempAction = new IBRS.Action(declaration);
   			tempAction.insertFromData(data.actions[i]);
   			declaration.actions.push(tempAction); 
    	}
    }

    this.animation = function(){
    	var tlDeclaration = new TimelineMax();
		// Añadir animacion de icono de la orden
		for (var i=0;i < declaration.actions.length;i++){
			tlDeclaration.add(declaration.actions[i].animation(),"Action_"+i);
		}
		tlDeclaration.addLabel("EndDeclaration");
		return tlDeclaration;
    }


    this.toJSON = function(key){
    	var salida = {};
    	salida.descriptor = declaration.descriptor;
    	salida.actions =  declaration.actions;
    	salida.source = {groupNumber :declaration.source.tacticalGroup.groupNumber,
    					playerID : declaration.source.tacticalGroup.army.player.playerID,
    					unitNumber : declaration.source.unitNumber};
    	return salida;

    }

};

 

IBRS.Order =  function(turn){
	var order = this;
	this.firstDeclaration = [];
	this.secondDeclaration = [];
	this.firstAro = [];
	this.secondAro = [];
	this.resolutions = [];// TODO
	this.turn = turn;
	this.groupNumber = -1;
	this.orderType = 0; //0 = regular, 1 = irregular, 2 = impetuosa.
	this.icon ="img/Orden_regular.png";
	this.container = jQuery('<img class="order" src="img/Orden_regular.png"></img>');


	this.updateHtml = function(){
		order.container.attr("src", turn.icon);
		order.setHtmlInteractions();
	}

	this.setHtmlInteractions = function(){

	}
	this.animation = function(){
		var tlOrder = new TimelineMax();
		for (var i=0;i < order.firstDeclaration.length;i++){
			tlOrder.add(order.firstDeclaration[i].animation(),"firstDeclaration");
		}
		for (var i=0;i < order.firstAro.length;i++){
			tlOrder.add(order.firstAro[i].animation(),"firstAro");
		}
		for (var i=0;i < order.secondDeclaration.length;i++){
			tlOrder.add(order.secondDeclaration[i].animation(),"secondDeclaration");
		}
		for (var i=0;i < order.secondAro.length;i++){
			tlOrder.add(order.secondAro[i].animation(),"secondAro");
		}
		for (var i=0;i < order.resolutions.length;i++){
			tlOrder.add(order.resolutions[i].animation(),"resolutions");
		}
		tlOrder.addLabel("EndOrder");
		return tlOrder;

	}


	this.addFirstDeclaration= function( declaration){
		order.firstDeclaration.push(declaration);
	};

	this.addSecondDeclaration= function( declaration){
		order.secondDeclaration.push(declaration);
	};

	this.addFirstAro= function( declaration){
		order.firstAro.push(declaration);
	};

	this.addSecondAro= function( declaration){
		order.SecondAro.push(declaration);
	};

	this.addResolution = function( resolution){
		order.resolutions.push(resolution);
	};

	this.insertFromData = function(data){
	
		order.groupNumber = data.groupNumber;
		order.orderType = data.orderType;
		switch (order.orderType) {
			case 0:
				order.icon = "img/Orden_regular.png";
			break;
			case 1:
				order.icon = "img/Orden_irregular.png";
			break;
			case 2:
				order.icon = "img/Orden_impetuosa.png";
			break;
		}
		
		for (var i = 0; i < data.firstDeclaration.length; i++) {
			var newDeclaration = new IBRS.Declaration(order);
			newDeclaration.insertFromData(data.firstDeclaration[i]);
			order.addFirstDeclaration(newDeclaration);
		}

		for (var i = 0; i < data.secondDeclaration.length; i++) {
			var newDeclaration = new IBRS.Declaration(order);
			newDeclaration.insertFromData(data.secondDeclaration[i]);
			order.addSecondDeclaration(newDeclaration);
		}

		for (var i = 0; i < data.firstAro.length; i++) {
			var newDeclaration = new IBRS.Declaration(order);
			newDeclaration.insertFromData(data.firstAro[i]);
			order.addFirstAro(newDeclaration);
		}
		
		for (var i = 0; i < data.secondAro.length; i++) {
			var newDeclaration = new IBRS.Declaration(order);
			newDeclaration.insertFromData(data.secondAro[i]);
			order.addSecondAro(newDeclaration);
		}

		for (var i = 0; i < data.resolutions.length; i++) {
			var newResolution = new IBRS.Resolution(order);
			newResolution.insertFromData(data.resolutions[i]);
			order.addResolution(newResolution);
		}

	};


	this.toJSON = function(key){
		var salida = {};
		salida.groupNumber = order.groupNumber;
		salida.orderType = order.orderType;
		salida.firstDeclaration = [];
		salida.secondDeclaration = [];
		salida.firstAro = [];
		salida.secondAro = [];
		salida.resolutions = []
		
		for (var i = 0; i < order.firstDeclaration.length; i++) {			
			salida.firstDeclaration.push(order.firstDeclaration[i]);		
		}

		for (var i = 0; i < order.secondDeclaration.length; i++) {			
			salida.secondDeclaration.push(order.secondDeclaration[i]);			
		}

		for (var i = 0; i < order.firstAro.length; i++) {			
			salida.firstAro.push(order.firstAro[i]);		
		}
		
		for (var i = 0; i < order.secondAro.length; i++) {
			salida.secondAro.push(order.secondAro[i]);
		}

		for (var i = 0; i < order.resolutions.length; i++) {
			salida.resolutions.push(order.resolutions[i]);
		}
		return salida;
	}


};

IBRS.Turn =  function(gameEvents){
	var turn = this;
	this.gameEvents= gameEvents;
	this.playerID = 0;
	this.orderList=[];
	this.color = "#005700";
	this.container = jQuery('<div class="turn "></div>');
	

	this.addOrder = function (newOrder) {
		turn.orderList.push(newOrder);
		turn.updateHtml();
	};

	this.updateHtml = function(){
		



		turn.container.empty().css("width",turn.orderList.length*30).css("background",turn.color);
		
		for (var i = 0;i<turn.orderList.length;i++){
			turn.orderList[i].updateHtml();
			turn.container.append(turn.orderList[i].container);
		}
		turn.setHtmlInteractions();
	}

	this.setHtmlInteractions = function(){

	}

	this.animation = function(){
		var tlTurn = new TimelineMax();
		for (var i=0;i < turn.orderList.length;i++){
			tlTurn.add(turn.orderList[i].animation(),"Order_"+i);
		}
		tlTurn.addLabel("EndTurn");
		return tlTurn;
	}

	this.insertFromData = function(data) {
		
		turn.playerID = data.playerID;
		if (turn.playerID%2 == 0){
			turn.color ="linear-gradient(to bottom, #308630 0%,#005600 70%,#005600 80%)";
		}else{
			turn.color = "linear-gradient(to bottom, #963030 0%,#560000 75%,#560000 80%)";	
		}
		for (var i = 0; i < data.orderList.length; i++) {
			var newOrder = new IBRS.Order(turn);
			newOrder.insertFromData(data.orderList[i]);
			turn.addOrder(newOrder);
		};

	};

	this.toJSON = function(key){
		var salida = {};
		salida.playerID = turn.playerID;
		salida.orderList = [];
		for (var i = 0; i < turn.orderList.length; i++) {
			salida.orderList.push(turn.orderList[i]);
		};
		return salida;
	}

};
 
 
IBRS.GameEvents =  function(game){
	var gameEvents = this;
	this.turnList=[];
	this.game = game;
	this.turnContainer = jQuery('<div id="00900" class="turn_container"></div>');
	this.declarationContainer = jQuery('<div id="declaration_container" class="event_container"></div>');

	this.addTurn = function (newTurn) {
		gameEvents.turnList.push(newTurn);
	};
	
	this.loadGameEventsFromDataBase = function(gameEventsID){
		jQuery.getJSON("DataBase/GameEvents/"+gameEventsID+".json",function(data){
			if(IBRS.depurarAyax){console.info("Ajax Cargando DataBase/GameEvents/"+gameEventsID+".json");}
			for (var i = 0;i<data.turnList.length;i++){
				var newTurn = new IBRS.Turn(gameEvents);
				newTurn.insertFromData(data.turnList[i]);
				gameEvents.addTurn(newTurn);
			}
			gameEvents.updateHtml();
		});

	};
	this.animation = function(onupdateCall){
		var tlgameEvents = new TimelineMax({paused:true,onUpdate:onupdateCall});
		for (var i=0;i < gameEvents.turnList.length;i++){
			tlgameEvents.add(gameEvents.turnList[i].animation(),"Turn_"+i);
		}
		tlgameEvents.addLabel("EndGame");
		return tlgameEvents;
	}

	this.updateHtml = function(){
		jQuery("#turn_container").empty().append(gameEvents.turnContainer);//.append(gameEvents.declarationContainer);
		
		gameEvents.declarationContainer.empty();
		for (var i = 0;i<gameEvents.turnList.length;i++){
			gameEvents.turnList[i].updateHtml();
			gameEvents.turnContainer.append(gameEvents.turnList[i].container);
		}
		gameEvents.setHtmlInteractions();
	}

	this.setHtmlInteractions = function(){

	}


	this.toJSON = function(key){
		var salida = {};
		salida.turnList = [];
		for (var i = 0; i< gameEvents.turnList.length;i++){
			salida.turnList.push(gameEvents.turnList[i]);
		}
		return salida;
	}
};