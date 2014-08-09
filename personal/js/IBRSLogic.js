var IBRS = { VERSION: '1' };
//Enum declaraciones

IBRS.depurarAyax = false;
IBRS.IDAcount = 0;

IBRS.getID = function(){
	IBRS.IDAcount +=1;
	return IBRS.IDAcount;
};



IBRS.GameArea =  function (){
	
	var gameArea =  this;
	this.sceneryElementList = []; // llenado con IBR.SceneryLogic
	this.name = "no name";
	this.table = new IBRS.TableLogic();

	
	this.getElementList = function(){
		var elementList = [];
		for (var i = 0; i < gameArea.sceneryElementList.length; i++) {
			elementList.push(gameArea.sceneryElementList[i].scenery);
		};
		elementList.push(gameArea.table.table);
		return elementList;
	};
	this.loadGameAreaFromDataBase = function(gameAreaID){
		
		jQuery.getJSON("DataBase/GameArea/"+gameAreaID+".json",function(data){
			if(IBRS.depurarAyax){console.info("Ajax cargando DataBase/GameArea/"+gameAreaID+".json");}
			gameArea.name = data.name;
			gameArea.table.insertFromData(data.table);
			for (var i = data.sceneryList.length - 1; i >= 0; i--) {
				var sceneryElement = new IBRS.SceneryLogic(data.sceneryList[i].sceneryModelID);
				sceneryElement.insertFromData(data.sceneryList[i]);
				gameArea.sceneryElementList.push(sceneryElement);
			};
		});
	};

	this.toJson = function (key) {
		salida= {};
		salida.name = gameArea.name;
		salida.table = gameArea.table;
		salida.sceneryList = [];
		for (var i = gameArea.sceneryElementList.length - 1; i >= 0; i--) {
				salida.sceneryList.push(gameArea.sceneryElementList[i]);
		};
		return salida;
	}
};
IBRS.GameArea.prototype = Object.create(THREE.Object3D.prototype);


IBRS.UnitLogic =  function (tacticalGroup) {
	var unitLogic = this;
	this.tacticalGroup = tacticalGroup;
	this.id = IBRS.getID();
	this.unitNumber = -1;
	this.isMarker = false;
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
	this.status = this.unitGraphic.status;
	this.name = "no name";
	this.statusIcon = "img/NORMAL.png";

	this.container = jQuery('<tr id="'+this.id+'"></tr>');

	//this.deleteButton = jQuery('<td><button type="button" class="btn btn-default"><span class="pull-right glyphicon glyphicon-remove-sign"></span></button></td>');
	this.deleteButton = jQuery('<span class="pull-right glyphicon glyphicon-remove-sign"></span>');
	

	this.setHtmlInteractions = function(){

		unitLogic.deleteButton.click(function(){
		unitLogic.tacticalGroup.removeUnit(unitLogic);
		unitLogic.tacticalGroup.updateHtml();
			IBRS.refreshObjects();

		return false});

	    unitLogic.container.click(function(){   
	         unitLogic.unitGraphic.selectorOpacity(1);
	   	
	   		//que hacer cuando se hace click en la tupla de cada miniatura
	    return false;});

	    unitLogic.container.mouseenter(function(){   
	        unitLogic.unitGraphic.selectorOpacity(0.5);
	    //que hacer cuando se hace click en la tupla de cada miniatura
	    return false;});

	    unitLogic.container.mouseleave(function(){   
	        unitLogic.unitGraphic.selectorOpacity(0);
	    //que hacer cuando se hace click en la tupla de cada miniatura
	    return false;});
    }

	this.updateHtml = function (){

        unitLogic.container.empty().append('<td>'+unitLogic.name+
		'</td><td>'+parseInt(unitLogic.position.x)+':'+parseInt(unitLogic.position.y)+':'+parseInt(unitLogic.position.z)+
		'</td><td>'+'<img src="'+unitLogic.statusIcon+'" alt="" border=3 height=20 width=20></img>'+'</td>').append(unitLogic.deleteButton);
		unitLogic.setHtmlInteractions();
	};

		this.setPosition = function(x,y,z){
			unitLogic.position.set(x,y,z);
			unitLogic.unitGraphic.position.set(x,y,z);
			unitLogic.updateHtml();
		};


		this.setRotation = function(x,y,z){
			unitLogic.rotation.set(x,y,z);
			unitLogic.unitGraphic.rotation.set(x,y,z);
			unitLogic.updateHtml();
		};

		this.setStatus = function(newStatus){
			unitLogic.status = newStatus;
			unitLogic.unitGraphic.status = newStatus;
			unitLogic.updateStatusIcon();
			unitLogic.updateHtml();
		};

/*		this.updateHtml = function(){
			unitLogic.unitGraphic.updateHtml();
		}
*/
		this.updateStatusIcon = function(){
			var actualStatus = unitLogic.status;
			console.log(actualStatus);
			switch( actualStatus){
				case IBRS.STAT.NORMAL:
					unitLogic.statusIcon = "img/NORMAL.png";
					break;
				case IBRS.STAT.DEATH:
					unitLogic.statusIcon = "img/DEATH.png";
					unitLogic.unitGraphic.scale.set(1,0.1,1);
					break;
				default:
					unitLogic.statusIcon = "img/NORMAL.png";
					break;
			}
		}

		this.asCamo = function(type){
			if (type == 1){
				unitGraphic.tempTexture =  new THREE.ImageUtils.loadTexture("img/Camo.png");
			}
			else if (type == 2){
				unitGraphic.tempTexture =  new THREE.ImageUtils.loadTexture("img/TO.png");
			}
			unitGraphic.BaseTextureMap = unitGraphic.tempTexture;
			
		}

	this.loadModelFromDataBase = function(modelID){
		//carga mediante ayax
		jQuery.getJSON("DataBase/Model/"+modelID+".json",function(unitModel){
			if(IBRS.depurarAyax){console.info("Ajax cargando DataBase/Model/"+modelID+".json");}
			unitLogic.bodyTexture = unitModel.bodyTexture;
			unitLogic.baseTexture = unitModel.baseTexture;
			unitLogic.height = unitModel.height;
			unitLogic.width = unitModel.width;
			unitLogic.regular = unitModel.regular;
			unitLogic.fury = unitModel.fury;
			unitLogic.unitGraphic.name = modelID;
			unitLogic.name = modelID;
			unitLogic.unitGraphic.refactor(unitModel.height,unitModel.width,unitModel.bodyTexture,unitModel.baseTexture);

		});
	};


	this.insertFromData = function(data){
		unitLogic.unitNumber = data.unitNumber;
		unitLogic.loadModelFromDataBase(data.modelID);
		unitLogic.setPosition(data.position.x,data.position.y,data.position.z);
		unitLogic.setRotation(data.rotation.x,data.rotation.y,data.rotation.z);	
	};


	this.toJson = function(key) {
		var salida = {}
		salida.unitNumber = unitLogic.unitNumber;
		salida.modelID = unitLogic.name;
		salida.position = {x:unitLogic.position.x,y:unitLogic.position.y,z:unitLogic.position.z};
		salida.rotation = {x:unitLogic.rotation.x,y:unitLogic.rotation.y,z:unitLogic.rotation.z};	
		return salida;
	};

	
};

IBRS.TacticalGroup =  function (army) {
	var tacticalGroup = this;
	this.id = IBRS.getID();
	this.groupNumber = 0;
	this.army = army;
	this.unitList = []; // lista llena de objetos IBRS.Unit
	this.regularAmount = 0;
	this.irregularAmount = 0;
	this.furyAmount = 0;
	
	this.container = jQuery('<table id="'+ this.id+'" class="table table-hover h6 "></table>')
	this.army.container.append(this.container);
	//jQuery('#inBoardElements').append(this.container);
	
	this.updateHtml = function(){
			tacticalGroup.container.empty().append('<tr><th>Group  '+this.groupNumber+'</th></tr>');	
			
			for (var j = 0 ; j<tacticalGroup.unitList.length;j++){
				var unit = tacticalGroup.unitList[j];
				tacticalGroup.container.append(unit.container);
				unit.updateHtml();
			}

	
		};
	// restart order counting
	this.removeUnit = function(deletedUnit){
		var alternateUnitList = [];
		for (var i = 0; i< tacticalGroup.unitList.length; i++){
			if (deletedUnit === tacticalGroup.unitList[i]){

			}
			else{
				alternateUnitList.push(tacticalGroup.unitList[i]);
			}
		}
		tacticalGroup.unitList=null;
		tacticalGroup.unitList=alternateUnitList;
	};

	this.actualizeOrders =  function(){
		tacticalGroup.furyAmount = tacticalGroup.regularAmount = tacticalGroup.irregularAmount = 0;
		for (var i = 0; i<unitList.length;i++){
			var countingUnit = tacticalGroup.unitList[i];
			if (countingUnit.active){
				if (countingUnit.regular){		tacticalGroup.regularAmount +=1;}
				else{							tacticalGroup.irregularAmount +=1;}
				if (countingUnit.fury){			tacticalGroup.furyAmount +=1;}
			}
		}
	};

	this.insertFromData = function(data) {
		tacticalGroup.groupNumber = data.groupNumber;
			
		tacticalGroup.updateHtml();
		for (var i=0;i<data.unitList.length;i++){
			var newUnit = new IBRS.UnitLogic(tacticalGroup);
			newUnit.insertFromData(data.unitList[i]);
			tacticalGroup.unitList.push(newUnit);
		}
	};

	this.toJson = function(key) {
		var salida = {}
		salida.groupNumber = tacticalGroup.groupNumber;
		salida.unitList = [];	
		for (var i=0;i<data.unitList.length;i++){
			salida.unitList.push(tacticalGroup.unitList[i]);
		}
		return salida;
	};
	
	
	
	this.getMiniatures = function(){
		var miniatures = [];
		for (var i = 0; i<unitList.tacticalGroupList.length;i++){
			miniatures.push(army.unitList[i].unitGraphic);
			}
		return miniatures;
	};


};


IBRS.Army = function(player){
	var army = this;
	this.player = player;
	this.id = IBRS.getID();
	this.tacticalGroupList = [];
	this.faction = "no faction";

	this.container = jQuery('<div id="'+ this.id+'" class="panel panel-default "></div>')
	
	this.player.game.container.append(this.container);

	/*this.updateHtml = function(){

		army.container.empty().append('<div class="panel-heading">'+army.player.name+'   '+army.faction+'</div>');
	};*/

	this.updateHtml = function(){
		army.container.empty().append('<div class="panel-heading">'+army.player.name+'   '+army.faction+'</div>');
			for (var j = 0 ; j<army.tacticalGroupList.length;j++){
				var group = army.tacticalGroupList[j];
				army.container.append(group.container);
				group.updateHtml();
			}
		
	};

	this.addGroup = function(group){
		army.tacticalGroupList.push(group);
	}

	this.insertFromData = function (data) {
		army.faction = data.faction;
		army.updateHtml();
		for (var i=0;i<data.tacticalGroupList.length;i++){
			var newTacticalGroup = new IBRS.TacticalGroup(army);
			newTacticalGroup.insertFromData(data.tacticalGroupList[i]);
			army.addGroup(newTacticalGroup);
		}
	};


	this.toJson = function(key) {
		var salida = {};
		salida.faction = army.faction;
		salida.tacticalGroupList = [];
		for (var i=0;i<army.tacticalGroupList.length;i++){
			var newTacticalGroup = new IBRS.TacticalGroup(army);
			salida.tacticalGroupList.push(army.tacticalGroupList[i]);
		}
		return salida;

	}
	
	this.getMiniatures = function(){
		var miniatures = [];
		for (var i = 0; i<army.tacticalGroupList.length;i++){
			miniatures.push(army.tacticalGroupList[i].getMiniatures());
			}
		return miniatures;
	};
};


IBRS.Player = function (game){
	var player = this;
	this.playerID = 0;
	this.game = game;
	this.id = IBRS.getID();
	this.name = "no name";
	this.army = 0;

	this.loadPlayerfromDataBase = function (playerID){
		//cargar perfil de jugador
	};

	this.insertFromData = function (data) {
		player.name = data.name;
		player.playerID = data.playerID;
		var newArmy = new IBRS.Army(player);
		newArmy.insertFromData(data.army);
		player.army = newArmy;
		
	};
	this.toJson = function(key) {
		var salida = {};
		salida.name = player.name;
		salida.playerID = player.playerID;
		salida.army = player.army;
		return salida;
	}


	this.getMiniatures = function(){
		return player.army.getMiniatures();
	};

};


//a turn is a set of orders that define the events of the game.


IBRS.Game = function(gameID){
	var game = this;
	this.ID = 0 || gameID;
	IBRS.actualGame = this;
	this.name ="no name";
	this.gameArea = new IBRS.GameArea();
	this.events = new IBRS.GameEvents(this);
	this.playerList = [];
	this.container = jQuery("#inBoardElements");

	this.updateHtml = function(){
		//game.container.empty();
		for (var i = 0 ; i<2;i++){
			var army = game.playerList[i].army;
			game.container.append(army.container);
			army.updateHtml();
		}
	}

	this.loadGameFromDataBase = function(gameID){
		//cargar mediante ayax
	
		jQuery.getJSON("DataBase/Game/"+gameID+".json",function(data){
			if(IBRS.depurarAyax){console.info("Ajax Cargando DataBase/Game/"+gameID+".json");}	
			game.name = data.name;
			for (var i = 0;i<2;i++){
				var newPlayer = new IBRS.Player(game);
				newPlayer.insertFromData(data.playerList[i]);
				game.playerList.push(newPlayer);
			}
			game.events.loadGameEventsFromDataBase(data.gameEventsID);
			game.gameArea.loadGameAreaFromDataBase(data.gameAreaID);
			game.updateHtml();
		});
	};

	this.toJson = function(key){
		var salida = {};
		salida.gameEventsID = "Events_"+game.ID;
		salida.gameAreaID = "GameArea_"+game.ID;
		salida.name = game.name;
		salida.playerList = [];
		for (var i = 0;i<2;i++){
				salida.playerList.push(game.playerList[i]);	
			}
		return salida;
	}
//hacer este metodo de forma que se integre en los objetos
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


	this.getSceneryElementList = function(){
		var sceneryGraphicList = []
		sceneryGraphicList.push(game.gameArea.table.tableGraphic);
		for (var i = game.gameArea.sceneryElementList.length - 1; i >= 0; i--) {
			sceneryGraphicList.push(game.gameArea.sceneryElementList[i].sceneryGraphic);
		};
		return sceneryGraphicList;

	};

	this.getUnitLogicFromArmyPosition = function (unitArmyPosition){
	if(unitArmyPosition==0)
		{return 0;}
		for (var i = game.playerList.length - 1; i >= 0; i--) { 
			var selectPlayer = game.playerList[i];
			if (selectPlayer.playerID == unitArmyPosition.playerID){
				for (var j = selectPlayer.army.tacticalGroupList.length - 1; j >= 0; j--) {
					var selectGroup = selectPlayer.army.tacticalGroupList[j];
					if(selectGroup.groupNumber == unitArmyPosition.groupNumber){
						for (var k = selectGroup.unitList.length - 1; k >= 0; k--) {
							var selectUnit = selectGroup.unitList[k];
							if (selectUnit.unitNumber == unitArmyPosition.unitNumber){
									return selectUnit;
							}
						};
					}
				};
			}
		};
	console.error("unit no encontrada, si no existe la unidad o no compete en el tipo de declaración ha de poner 0 en el campo target/source");
	return 0;
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
	this.sceneryGraphic = new IBRS.SceneryGraphic(new THREE.Vector3(1,1,1));
	
	this.setPosition = function(x,y,z){
		sceneryLogic.position.set(x,y,z);
		sceneryLogic.sceneryGraphic.position.set(x,y,z);
	};

	this.setRotation = function(x,y,z){
		sceneryLogic.rotation.set(x,y,z);
		sceneryLogic.sceneryGraphic.rotation.set(x,y,z);
	};

	this.setDimension = function(x,y,z){
		sceneryLogic.dimension.set(x,y,z);
		//sceneryLogic.sceneryGraphic.dimension.set(x,y,z);
	};

	this.insertFromData = function(data){
		//sceneryLogic.dimension.set(data.dimension.x,data.dimension.y,data.dimension.z);
		sceneryLogic.sceneryGraphic.refactor(sceneryLogic.ID,data.dimension);
		sceneryLogic.setPosition(data.position.x,data.position.y,data.position.z);
		sceneryLogic.setRotation(data.rotation.x,data.rotation.y,data.rotation.z);
		
				
		//sceneryLogic.sceneryGraphic.dimension.set(x,y,z);
	};
	this.toJson = function(key){
		var salida = {};
		salida.sceneryModelID = sceneryLogic.ID;
		salida.dimension = {x:sceneryLogic.dimension.x,y:sceneryLogic.dimension.y,z:sceneryLogic.dimension.z};
		salida.position = {x:sceneryLogic.position.x,y:sceneryLogic.position.y,z:sceneryLogic.position.z};
		salida.rotation = {x:sceneryLogic.rotation.x,y:sceneryLogic.rotation.y,z:sceneryLogic.rotation.z};
		
		return salida;
	}


};

IBRS.TableLogic = function(TableModelID){
	var tableLogic = this;
	this.ID = TableModelID = TableModelID !== undefined ? TableModelID : 0;
	this.dimension = new THREE.Vector3();
	this.position = new THREE.Vector3();
	this.rotation = new THREE.Vector3();
	this.tableGraphic = new IBRS.TableGraphic(new THREE.Vector3(120,3,120),"img/terrain01.png");
	this.coverTexture = 0;
	
	this.setPosition = function(x,y,z){
		tableLogic.position.set(x,y,z);
		tableLogic.tableGraphic.position.set(x,y,z);
	};

	this.setRotation = function(x,y,z){
		tableLogic.rotation.set(x,y,z);
		tableLogic.tableGraphic.rotation.set(x,y,z);
	};

	this.setDimension = function(x,y,z){
		tableLogic.dimension.set(x,y,z);
		//tableLogic.tableGraphic.refactor(tableLogic.ID,tableLogic.dimension);
	};

	this.insertFromData = function(data){
		tableLogic.setDimension(data.dimension.x,data.dimension.y,data.dimension.z);
		tableLogic.tableGraphic.refactor(tableLogic.dimension,data.coverTexture);
		tableLogic.coverTexture = data.coverTexture;
	}

	this.toJson = function(data){
		var salida = {};
		salida.TableModelID = tableLogic.ID;
		salida.dimension = {x:tableLogic.dimension.x,y:tableLogic.dimension.y,z:tableLogic.dimension.z};
		salida.coverTexture = tableLogic.coverTexture;
		return salida;
	}
};

