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
    	declaration.actions= data.actions;
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
	this.orderType = -1; //0 = regular, 1 = irregular, 2 = impetuosa.
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

	this.addOrder = function (newOrder) {
		turn.orderList.push(newOrder);
	};

	this.insertFromData = function(data) {
		
		turn.playerID = data.playerID;
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

		});
	};

	this.toJSON = function(key){
		var salida = {};
		salida.turnList = [];
		for (var i = 0; i< gameEvents.turnList.length;i++){
			salida.turnList.push(gameEvents.turnList[i]);
		}
		return salida;
	}
};