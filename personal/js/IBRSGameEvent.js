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



IBRS.Declaration = function(order){
//descriptor: que acccion se define de una lista numeration, 	
//Source, Marcador/miniatura que lo declara, 
//target: lugar de destino, movimiento o miniatura/marcador destino. 
//aro: es una ora o no.
	var declaration = this;
	this.order = order;
	this.descriptor = 0;
    this.source = 0;
	this.target = 0;
	this.spaceLocation = 0;
	this.locateUnit = function (data){
		return declaration.order.turn.gameEvents.game.getUnitLogicFromArmyPosition(data);
	}

    this.insertFromData = function(data){
    	console.log( data.descriptor);
    	declaration.descriptor = data.descriptor;
    	declaration.source= declaration.locateUnit(data.source);
    	declaration.target= declaration.locateUnit(data.target);
    	declaration.location = data.location;
    }

};

 

IBRS.Order =  function(turn){
	var order = this;
	this.firstDeclaration = [];
	this.secondDeclaration = [];
	this.firstAro = [];
	this.secondAro = [];
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

	this.insertFromData = function(data){
		console.log(data.orderType);
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

	};


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
		console.log("insterTunr");
		turn.playerID = data.playerID;
		for (var i = 0; i < data.orderList.length; i++) {
			var newOrder = new IBRS.Order(turn);
			newOrder.insertFromData(data.orderList[i]);
			turn.addOrder(newOrder);
		};

	};

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
			console.log(gameEventsID+".json leido");
			for (var i = 0;i<data.turnList.length;i++){
				console.log("turnList["+i+"]");
				var newTurn = new IBRS.Turn(gameEvents);
				newTurn.insertFromData(data.turnList[i]);
				gameEvents.addTurn(newTurn);
			}		
		});
	};
};