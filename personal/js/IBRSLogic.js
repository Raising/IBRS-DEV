var IBRS = { VERSION: '1' };
//Enum declaraciones
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

IBRS.unitAcount = 0;

IBRS.getNextUnitID = function(){
	IBRS.unitAcount +=1;
	return IBRS.unitAcount;
};

IBRS.Declaration = function(descriptor,source,target,aro){
//descriptor: que acccion se define de una lista numeration, 	
//Source, Marcador/miniatura que lo declara, 
//target: lugar de destino, movimiento o miniatura/marcador destino. 
//aro: es una ora o no.
	this.descriptor = descriptor = descriptor !== undefined ? descriptor : "WAIT";
    this.aro = aro = aro !== undefined ? aro : "FALSE";
    this.source = source = source !== undefined ? source : new THREE.Vector3();
	this.target = target = target !== undefined ? target : new THREE.Vector3();
    

};

IBRS.Order =  function(){
	this.firstDeclaration = [];
	this.secondDeclaration = [];
	this.firstAro = [];
	this.secondAro = [];

	this.addFirstDeclaration= function( declaration){
		this.firstDeclaration.push(declaration);
	}

	this.addSecondDeclaration= function( declaration){
		this.secondDeclaration.push(declaration);
	}

	this.addFirstAro= function( declaration){
		this.firstAro.push(declaration);
	}

	this.addSecondAro= function( declaration){
		this.SecondAro.push(declaration);
	}
};

IBRS.GameArea =  function (){
	THREE.Object3D.call(this);

	
	var mesa = new IBRS.TableGraphic(new THREE.Vector3(120,20,120),'img/terrain01.png');
  
    new sceneryElement(3, new coordinate(-20,13.0,2.5,0,Math.PI/2,0), new dimension(5,5,10)).calculateRepresentation(this);
    new sceneryElement(3, new coordinate(-20,6.5,0,0,Math.PI/2,0), new dimension(10,5,10)).calculateRepresentation(this);
    new sceneryElement(3, new coordinate(-20,0,0,0,Math.PI/2,0), new dimension(20,5,10)).calculateRepresentation(this);
    
    new sceneryElement(3, new coordinate(40,0,20,0,Math.PI/2,0), new dimension(25,5,25)).calculateRepresentation(this);
    new sceneryElement(3, new coordinate(40,5,20,0,Math.PI/2,0), new dimension(18,5,18)).calculateRepresentation(this);
    new sceneryElement(3, new coordinate(40,10,20,0,Math.PI/2,0), new dimension(10,5,10)).calculateRepresentation(this);
   
    this.add(mesa);





	this.loadSceneryFromDataBase = function(sceneryID){
		//cargar mediante ayax
	};
};
IBRS.GameArea.prototype = Object.create(THREE.Object3D.prototype);


IBRS.UnitLogic =  function (unitID) {
	var unitLogic = this;
	this.isMarker = false;
	this.id = unitID = unitID !== undefined ? unitID : 0;
	this.bodyTexture = 'img/empty.jpg';
	this.baseTexture = 'img/empty.jpg'; // por decidir el formato de almacenamiento
	this.position = new THREE.Vector3();
	this.rotation = new THREE.Vector3();
	this.height = 3;
	this.width = 2.5;
	this.regular = true; // true la miniatura es regular, false irregular
	this.fury = false; // true la  es impetuosa, false no
	this.active = true; // si aporta o no su orden al grupo
	this.unitGraphic = new IBRS.UnitGraphic(this.height,this.width,this.bodyTexture,this.baseTexture,this);


		this.setPosition = function(x,y,z){
			unitLogic.position.set(z,y,z);
			unitLogic.unitGraphic.position.set(x,y,z);
		};


		this.setRotation = function(x,y,z){
			unitLogic.rotation.set(z,y,z);
			unitLogic.unitGraphic.rotation.set(x,y,z);
		};



	this.loadModelFromDataBase = function(modelID){
		//carga mediante ayax
		jQuery.getJSON("DataBase/Model/"+modelID+".json",function(unitModel){
			//alert("succes");
			unitLogic.bodyTexture = unitModel.bodyTexture;
			unitLogic.baseTexture = unitModel.baseTexture;
			unitLogic.height = unitModel.height;
			unitLogic.width = unitModel.width;
			unitLogic.regular = unitModel.regular;
			unitLogic.fury = unitModel.fury;
			unitLogic.unitGraphic.refactor(unitModel.height,unitModel.width,unitModel.bodyTexture,unitModel.baseTexture);

		});
	};

	this.insertFromData = function(data){
		
		unitLogic.loadModelFromDataBase(data.modelID);
		unitLogic.setPosition(data.position.x,data.position.y,data.position.z);
		unitLogic.setRotation(data.rotation.x,data.rotation.y,data.rotation.z);	
	};
};

IBRS.TacticalGroup =  function () {
	var tacticalGroup = this;
	this.unitList = []; // lista llena de objetos IBRS.Unit
	this.regularAmount = 0;
	this.irregularAmount = 0;
	this.furyAmount = 0;
	
	// restart order counting
	this.actualizeOrders =  function(){
		tacticalGroup.furyAmount = tacticalGroup.regularAmount = tacticalGroup.irregularAmount = 0;
		for (var i = 0; i<unitList.length;i++){
			var countingUnit = tacticalGroup.unitList[i];
			if (countingUnit.active){
				if (countingUnit.regular){			tacticalGroup.regularAmount +=1;}
				else{								tacticalGroup.irregularAmount +=1;}
				if (countingUnit.fury){			tacticalGroup.furyAmount +=1;}
			}
		}
	};

	this.insertFromData = function(data) {
		for (var i=0;i<data.unitList.length;i++){
			var newUnit = new IBRS.UnitLogic(IBRS.getNextUnitID());
			newUnit.insertFromData(data.unitList[i]);
			tacticalGroup.unitList.push(newUnit);
		}
	};


};


IBRS.Army = function(){
	var army = this;
	this.tacticalGroupList = [];
	this.faction = "no faction";
	this.addGroup = function(group){
		army.tacticalGroupList.push(group);
	}

	this.insertFromData = function (data) {
		army.faction = data.faction;
		for (var i=0;i<data.tacticalGroupList.length;i++){
			var newTacticalGroup = new IBRS.TacticalGroup();
			newTacticalGroup.insertFromData(data.tacticalGroupList[i]);
			army.addGroup(newTacticalGroup);
		}
	};
};


IBRS.Player = function (){
	var player = this;
	this.playerID = 0;
	this.name = "no name";
	this.army = new IBRS.Army();

	this.loadPlayerfromDataBase = function (playerID){
		//cargar
	};

	this.insertFromData = function (data) {
		player.name = data.name;
		player.playerID = data.playerID;
		var newArmy = new IBRS.Army();
		newArmy.insertFromData(data.army);
		player.army = newArmy;
		
	};

};


//a turn is a set of orders that define the events of the game.
IBRS.Turn =  function(){
	var turn = this;
	this.orderList=[];

	this.addOrder = function (newOrder) {
		turn.orderList.push(newOrder);
	};

	

};

IBRS.Game = function(gameID){
	var game = this;
	this.ID = 0 || gameID;
	this.name ="no name";
	this.gameArea = new IBRS.GameArea();
	this.turnList = [];
	this.playerList = [];

	this.loadGameFromDataBase = function(gameID){
		//cargar mediante ayax
	
		jQuery.getJSON("DataBase/Game/"+gameID+".json",function(data){
			
			game.name = data.name;
			for (var i = 0;i<2;i++){
				var newPlayer = new IBRS.Player();
				newPlayer.insertFromData(data.playerList[i]);
				game.playerList.push(newPlayer);
			}
		//	game.scenery.loadSceneryFromDataBase(data.sceneryID);			
		});
	};

	this.getMiniatures = function(){
		var unitGraphicList = [];
		for (var i = game.playerList.length - 1; i >= 0; i--) {
			for (var j = game.playerList[i].army.tacticalGroupList.length - 1; j >= 0; j--) {
				for (var k = game.playerList[i].army.tacticalGroupList[j].unitList.length - 1; k >= 0; k--) {
				unitGraphicList.push(game.playerList[i].army.tacticalGroupList[j].unitList[k].unitGraphic)
				}
			}
			
		}
		return unitGraphicList;
	};

	this.newTurn = function(){
		game.turnList.push(new IBRS.Turn());

	};

	this.newGame = function(){
		//
	};
};

IBRS.SceneryLogic = function(sceneryModelID){
	var sceneryLogic = this;
	this.ID = sceneryModelID = sceneryModelID !== undefined ? sceneryModelID : 0;
	this.dimension = new THREE.Vector3();
	this.position = new THREE.Vector3();
	this.rotation = new THREE.Vector3();
	this.scenery = new IBRS.SceneryGraphic(sceneryModelID);
	
	this.setPosition = function(x,y,z){
		sceneryLogic.position.set(z,y,z);
		sceneryLogic.scenery.position.set(x,y,z);
	};

	this.setRotation = function(x,y,z){
		sceneryLogic.rotation.set(z,y,z);
		sceneryLogic.scenery.rotation.set(x,y,z);
	};

	this.setDimension = function(x,y,z){
		sceneryLogic.position.set(z,y,z);
		sceneryLogic.scenery.position.set(x,y,z);
	};


};