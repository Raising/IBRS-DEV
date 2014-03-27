var IBRS = { VERSION: '1' };
//Enum declaraciones


IBRS.IDAcount = 0;

IBRS.getID = function(){
	IBRS.IDAcount +=1;
	return IBRS.IDAcount;
};



IBRS.GameArea =  function (){
	
	gameArea =  this;
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
			gameArea.name = data.name;
			gameArea.table.insertFromData(data.table);
			for (var i = data.sceneryList.length - 1; i >= 0; i--) {
				var sceneryElement = new IBRS.SceneryLogic(data.sceneryList[i].sceneryModelID);
				sceneryElement.insertFromData(data.sceneryList[i]);
				gameArea.sceneryElementList.push(sceneryElement);
			};
		});
	};
};
IBRS.GameArea.prototype = Object.create(THREE.Object3D.prototype);


IBRS.UnitLogic =  function (tacticalGroup) {
	var unitLogic = this;
	this.tacticalGroup = tacticalGroup;
	this.id = IBRS.getID();
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
			unitLogic.unitGraphic.name = modelID;
			unitLogic.unitGraphic.refactor(unitModel.height,unitModel.width,unitModel.bodyTexture,unitModel.baseTexture);

		});
	};

	this.insertFromData = function(data){
		
		unitLogic.loadModelFromDataBase(data.modelID);
		unitLogic.setPosition(data.position.x,data.position.y,data.position.z);
		unitLogic.setRotation(data.rotation.x,data.rotation.y,data.rotation.z);	
	};
};

IBRS.TacticalGroup =  function (army,number) {
	var tacticalGroup = this;
	this.id = IBRS.getID();
	this.army = army;
	this.unitList = []; // lista llena de objetos IBRS.Unit
	this.regularAmount = 0;
	this.irregularAmount = 0;
	this.furyAmount = 0;
	
	this.container = jQuery('<table id="'+ this.id+'" class="table table-hover h6 "></table>')
	jQuery('#inBoardElements').append(this.container);
	this.container.append('<tr>	<th>'+this.army.player.name+'</th><th>Group</th><th>'+number+'</th></tr>');

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
			var newUnit = new IBRS.UnitLogic(tacticalGroup);
			newUnit.insertFromData(data.unitList[i]);
			tacticalGroup.unitList.push(newUnit);
		}
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
	this.addGroup = function(group){
		army.tacticalGroupList.push(group);
	}

	this.insertFromData = function (data) {
		army.faction = data.faction;
		for (var i=0;i<data.tacticalGroupList.length;i++){
			var newTacticalGroup = new IBRS.TacticalGroup(army,i+1);
			newTacticalGroup.insertFromData(data.tacticalGroupList[i]);
			army.addGroup(newTacticalGroup);
		}
	};
	
	this.getMiniatures = function(){
		var miniatures = [];
		for (var i = 0; i<army.tacticalGroupList.length;i++){
			miniatures.push(army.tacticalGroupList[i].getMiniatures());
			}
		return miniatures;
	};
};


IBRS.Player = function (){
	var player = this;
	this.playerID = 0;
	this.id = IBRS.getID();
	this.name = "no name";
	this.army = new IBRS.Army();

	this.loadPlayerfromDataBase = function (playerID){
		//cargar
	};

	this.insertFromData = function (data) {
		player.name = data.name;
		player.playerID = data.playerID;
		var newArmy = new IBRS.Army(this);
		newArmy.insertFromData(data.army);
		player.army = newArmy;
		
	};
	
	this.getMiniatures = function(){
		return player.army.getMiniatures();
	};

};


//a turn is a set of orders that define the events of the game.


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
		game.gameArea.loadGameAreaFromDataBase(data.gameAreaID);			
		});
	};
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
	this.sceneryGraphic = new IBRS.SceneryGraphic(new THREE.Vector3(10,10,10));
	
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
		sceneryLogic.dimension.set(data.dimension.x,data.dimension.y,data.dimension.z);
		sceneryLogic.sceneryGraphic.refactor(sceneryLogic.ID,sceneryLogic.dimension);
		sceneryLogic.setPosition(data.position.x,data.position.y,data.position.z);
		sceneryLogic.setRotation(data.rotation.x,data.rotation.y,data.rotation.z);
		
				
		//sceneryLogic.sceneryGraphic.dimension.set(x,y,z);
	};



};

IBRS.TableLogic = function(TableModelID){
	var tableLogic = this;
	this.ID = TableModelID = TableModelID !== undefined ? TableModelID : 0;
	this.dimension = new THREE.Vector3();
	this.position = new THREE.Vector3();
	this.rotation = new THREE.Vector3();
	this.tableGraphic = new IBRS.TableGraphic(new THREE.Vector3(120,3,120),"img/terrain01.png");
	
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
	}

};