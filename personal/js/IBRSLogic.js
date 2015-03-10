// IBRS Copyright (C) 2014  Ignacio Medina Castillo
// ignacio.medina.castillo@gmail.com


var IBRS = { VERSION: '1' };
//Enum declaraciones

IBRS.depurarAyax = false;
IBRS.IDAcount = 0;




IBRS.getID = function(){
	IBRS.IDAcount +=1;
	return IBRS.IDAcount;
};


IBRS.elementSelected = {};
IBRS.elementSelected.unSelect=function(){};
IBRS.Current = {};
IBRS.Current.Game = {unSelect:function(){}};
IBRS.Current.GameEvents ={unSelect:function(){}};
IBRS.Current.Turn = {unSelect:function(){}};
IBRS.Current.Order = {unselect:function(){}};
IBRS.Current.DeclarationType = "";
IBRS.Current.Declaration_Resolution ={unSelect:function(){}};
IBRS.Current.Action ={unSelect:function(){}};





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
	this.traced= false;
	this.traceNew = false;
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
	this.bullet = new IBRS.bulletGraphic(this);
	this.contextualMenu = new IBRS.ContextualMenu(this);
	this.status = this.unitGraphic.status;
	this.name = "no name";
	this.unitIcon =  "img/NORMAL.png"
	this.statusIcon = "img/NORMAL.png";
	this.kind= "UnitLogic";
	this.container = jQuery('<div id="'+this.id+'" class="troop" draggable="true"></div>');

	//this.deleteButton = jQuery('<td><button type="button" class="btn btn-default"><span class="pull-right glyphicon glyphicon-remove-sign"></span></button></td>');
	this.deleteButton = jQuery('<span >B</span>');
	//cambiar el glyficon
	this.modifyButton = jQuery('<span> E</span>');

	this.getPlayer = function () {
		return unitLogic.tacticalGroup.army.player;
	}

	

	this.select =function(){
		unitLogic.unitGraphic.selected=true;
		//unitLogic.unitGraphic.selector.material.color.set(0x33FF33);
		//unitLogic.unitGraphic.selectorOpacity(1);
		unitLogic.traced= true;
		unitLogic.traceNew = true;
	}

	this.unSelect =function(){
		unitLogic.unitGraphic.selected=false;
		//unitLogic.unitGraphic.selector.material.color.set(0xFFFF00);

		//unitLogic.unitGraphic.selectorOpacity(0);
		unitLogic.traced= false;
		unitLogic.traceNew = false;
	}


	this.delete = function(){
		unitLogic.tacticalGroup.removeUnit(unitLogic);
		unitLogic.tacticalGroup.updateHtml();
	}

	this.getPosition = function(){
		return unitLogic.position;
	}

	this.resetPosition = function(){
		var positionActual = unitLogic.getPosition();
		unitLogic.setPosition(positionActual.x,positionActual.y,positionActual.z);
	}

	this.setHtmlInteractions = function(){

		//click en el boton de eliminar
		unitLogic.container.unbind("dragstart" );
		unitLogic.container.unbind("click" );
		unitLogic.container.unbind("mouseleave" );
		unitLogic.container.unbind("mouseenter" );
		unitLogic.container.bind("dragstart" ,function(event){
			event.stopPropagation();
			event.originalEvent.dataTransfer.setData("text/html", event.target.id);
			IBRS.dragCatcher = unitLogic;					
			console.log(IBRS.dragCatcher);
			event.stopPropagation();
		
		});

		unitLogic.deleteButton.click(function(){
			unitLogic.delete();
			IBRS.refreshObjects();
		return false});


		//click en el boton de modificar
		unitLogic.modifyButton.click(function(){
			//TO
		return false});


	   	//que hacer cuando se hace click en la tupla de cada miniatura
	    unitLogic.container.click(function(){   
	    	
	        unitLogic.unitGraphic.onElementClick();
	    return false;});

	    //que hacer cuando entra el raton en la tupla de cada miniatura
	    unitLogic.container.mouseenter(function(){   
	        unitLogic.unitGraphic.selectorOpacity(0.8);
	    return false;});

	   	//que hacer cuando se SALE EL RATON DE  la tupla de cada miniatura
	    unitLogic.container.mouseleave(function(){   
	        unitLogic.unitGraphic.selectorOpacity(0);
	    return false;});
    }

	this.updateHtml = function (){

     
 		unitLogic.container.empty().append('<div class="troopElement troopIcon"><img src="'+unitLogic.unitIcon+
 			'" border=0 height=20 width=20></img></div>'+
 			'<div class="troopElement troopName">'+ unitLogic.name+'</div>'
 			 );
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
	this.insertNewModel = function(name){
		unitLogic.unitNumber = IBRS.getID();
		unitLogic.loadModelFromDataBase(name);
		unitLogic.setPosition(0,-10,0);
		unitLogic.setRotation(0,0,0);	
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
	
	this.container = jQuery('<div id="'+ this.id+'" class="tacticalGroup inerShadow"   draggable="true" ></div>');

	this.army.container.append(this.container);
	this.groupHeader = jQuery('<div class="tacticalGroupHeader" >Group '+this.groupNumber+'</div>');
	
	this.troopTray = jQuery('<div class="tacticalGroupTroop "></div>');

	this.kind ="TacticalGroup";

	




	this.deleteButton = jQuery('<span class="pull-right glyphicon glyphicon-remove-sign">del</span>');
	this.addTroopButton = jQuery('<span class="pull-right glyphicon glyphicon-remove-sign">add</span>');

	this.updateHtml = function(){
			tacticalGroup.container.empty();
			
			tacticalGroup.groupHeader = jQuery('<div class="tacticalGroupHeader ">Group '+this.groupNumber+'</div>');
			//tacticalGroup.groupHeader.append(tacticalGroup.deleteButton);
			tacticalGroup.container.append(tacticalGroup.groupHeader).append(tacticalGroup.troopTray).css("height",25+(tacticalGroup.unitList.length+1)*22); ;
			

			for (var j = 0 ; j<tacticalGroup.unitList.length;j++){
				var unit = tacticalGroup.unitList[j];
				tacticalGroup.troopTray.append(unit.container);
				unit.updateHtml();
			}
			tacticalGroup.setHtmlInteractions();
	
		};

	this.delete = function(){

			for (var i =0;i< tacticalGroup.unitList.length;i++){
				var unitSelected = tacticalGroup.unitList[i];
				unitSelected.delete();
			}
			tacticalGroup.army.removeGroup(tacticalGroup);
			tacticalGroup.army.updateHtml();
	}	
	
	this.container.bind("dragstart" ,function(event){
		
			event.originalEvent.dataTransfer.setData("text/html", event.target.id);
			IBRS.dragCatcher = tacticalGroup;					
			console.log(IBRS.dragCatcher);
	});





	this.setHtmlInteractions = function(){

		//click en el boton de eliminar
		tacticalGroup.deleteButton.click(function(){
			tacticalGroup.delete();
			tacticalGroup.army.removeGroup(tacticalGroup);
			tacticalGroup.army.updateHtml();
			IBRS.refreshObjects();
		return false});

		//click en el boton de modificar
		tacticalGroup.addTroopButton.click(function(){
			//TODO
		return false});

	    //que hacer cuando entra el raton en la tupla de cada miniatura
	    tacticalGroup.groupHeader.mouseenter(function(){
	    	for (var i = tacticalGroup.unitList.length - 1; i >= 0; i--) {
	    	   	tacticalGroup.unitList[i].unitGraphic.selectorOpacity(0.8);
	    	   };   
	       
	    return false;});

	   	//que hacer cuando se SALE EL RATON DE  la tupla de cada miniatura
	    tacticalGroup.groupHeader.mouseleave(function(){   
	        for (var i = tacticalGroup.unitList.length - 1; i >= 0; i--) {
	    	   	tacticalGroup.unitList[i].unitGraphic.selectorOpacity(0);
	    	   };   
	    return false;});


	    tacticalGroup.troopTray.bind("drop" , function(event){
	 	event.preventDefault();
		
		switch (IBRS.dragCatcher.kind){
			case "TroopThumb":
					var newUnit = new IBRS.UnitLogic(tacticalGroup);
					newUnit.insertNewModel(IBRS.dragCatcher.name);
					tacticalGroup.unitList.push(newUnit);
					tacticalGroup.updateHtml();
			break;
			case "UnitLogic":
					
					IBRS.dragCatcher.tacticalGroup.removeUnit( IBRS.dragCatcher);
					IBRS.dragCatcher.tacticalGroup = tacticalGroup;
					tacticalGroup.unitList.push(IBRS.dragCatcher);
					army.updateHtml();

			break;
			default:
			break;
			}
			return false;
		});


	    tacticalGroup.troopTray.bind("dragover", function(event){
			  event.preventDefault();
			
			return false;
		});


		



    }	

	

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
	if (this.player.num === 1){
		this.side = "left";	
	}else{
    	this.side = "right";
    }
    this.header = jQuery('<div class="armyHeader '+this.side+'">'+ this.faction +' '+ this.player.name+'</div>');
	this.container = jQuery('<div id="'+ this.id+'" class="army '+this.side+' inerShadow"></div>');
	

	
	this.container.bind("drop" ,function(event){
		event.preventDefault();
		console.log(IBRS.dragCatcher.kind);
		switch (IBRS.dragCatcher.kind){
			case "TroopThumb":
					
					
					var newGroup = new IBRS.TacticalGroup(army);
					var newUnit = new IBRS.UnitLogic(newGroup);
					newUnit.insertNewModel(IBRS.dragCatcher.name);
					newGroup.groupNumber = army.tacticalGroupList.length+1;
					newGroup.unitList.push(newUnit);
					army.addGroup(newGroup);
					army.updateHtml();
					
			break;
			case  "UnitLogic":
		
					var newGroup = new IBRS.TacticalGroup(army);
					
					IBRS.dragCatcher.tacticalGroup.removeUnit( IBRS.dragCatcher);
					IBRS.dragCatcher.tacticalGroup = newGroup;
					newGroup.groupNumber = army.tacticalGroupList.length+1;
					newGroup.unitList.push(IBRS.dragCatcher);
					army.addGroup(newGroup);
					army.updateHtml();
			break;
			default:
			break;
			}
			return false;
	});



	this.container.bind("dragover",function(event){
		event.preventDefault();
		console.log("intento de hovering");
	});







	this.updateHtml = function(){
			
			for (var j = 0 ; j<army.tacticalGroupList.length;j++){
				var group = army.tacticalGroupList[j];
				army.container.append(group.container);
				group.updateHtml();
			}
		
	};

	this.removeGroup = function(deletedGroup){
		var alternateGroupList = [];
		for (var i = 0; i< army.tacticalGroupList.length; i++){
			if (deletedGroup === army.tacticalGroupList[i]){

			}
			else{
				alternateGroupList.push(army.tacticalGroupList[i]);
			}
		}
		army.tacticalGroupList=null;
		army.tacticalGroupList=alternateGroupList;
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


IBRS.Player = function (game,name,playerId){
	var player = this;
	this.playerID = playerId ? playerId : 0;
	this.game = game;
	this.id = IBRS.getID();
	this.name = name ? name : "no name";
	this.army = 0;
	this.num = -1;

	this.loadPlayerfromDataBase = function (playerID){
		//cargar perfil de jugador
	};

	this.insertFromData = function (data,num) {
		player.name = data.name;
		player.playerID = data.playerID;
		player.num = num;
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
	this.playerList = [new IBRS.Player(game,"player0",0),new IBRS.Player(game,"player1",1)];
	this.gameArea = new IBRS.GameArea();
	this.events = new IBRS.GameEvents(game);
	
	this.container = [jQuery("#left_army_container"),jQuery("#right_army_container")];

	this.updateHtml = function(){
		//game.container.empty();
		for (var i = 0 ; i<2;i++){
			var army = game.playerList[i].army;
			game.container[i].empty().append(army.header).append(army.container);
			army.updateHtml();
		}
		game.events.updateHtml();
	}

	this.loadGameFromDataBase = function(gameID){
		//cargar mediante ayax
	
		jQuery.getJSON("DataBase/Game/"+gameID+".json",function(data){
			if(IBRS.depurarAyax){console.info("Ajax Cargando DataBase/Game/"+gameID+".json");}	
			game.name = data.name;
			game.playerList = [];
			for (var i = 0;i<2;i++){
				var newPlayer = new IBRS.Player(game);
				newPlayer.insertFromData(data.playerList[i],i);
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
				unitGraphicList.push(game.playerList[i].army.tacticalGroupList[j].unitList[k].unitGraphic);
					}
			}
			
		}
		return unitGraphicList;
	};
		this.getBullets = function(){
		var unitGraphicList = [];
		for (var i = game.playerList.length - 1; i >= 0; i--) {
			for (var j = game.playerList[i].army.tacticalGroupList.length - 1; j >= 0; j--) {
				for (var k = game.playerList[i].army.tacticalGroupList[j].unitList.length - 1; k >= 0; k--) {
					unitGraphicList.push(game.playerList[i].army.tacticalGroupList[j].unitList[k].bullet);
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
		/* TODO
		game.turnList.push(new IBRS.Turn());*/

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

IBRS.TroopThumb = function(troopID){

    var troopThumb = this;
    this.id = IBRS.getID();
   
   	this.name = troopID;
   	this.kind = "TroopThumb";
   	

	this.instertInTo = function(container){
		jQuery.getJSON("DataBase/Model/"+troopThumb.name+".json",function(data){  
    		troopThumb.htmlVersion = jQuery('<img id="'+IBRS.getID()+'" href="'+troopThumb.name+'" class="thumb"  src="'+data.bodyTexture +'" draggable="true"></img>');
			troopThumb.htmlVersion.bind("dragstart" ,function(event){
			IBRS.dragCatcher =troopThumb;					
			console.log(IBRS.dragCatcher);
			});
	}).success(function(){container.append(troopThumb.htmlVersion);  } );
	}
}

IBRS.TroopSearcher = function(){
	var troopSearcher = this;
	this.troops = [];
	

	this.loadAvaiableTroops = function(){
		jQuery.getJSON("DataBase/dataAvaiable.json",function(data){  
		   jQuery("#element_tray").empty();
			for (var i =0;i<data.ModelAvaiable.length;i++){
				troopSearcher.troops.push(new IBRS.TroopThumb(data.ModelAvaiable[i]));
				var troop = troopSearcher.troops[i];
				troop.instertInTo(jQuery("#element_tray"));
			
			}
			
			
	    });
	};

	this.insertTroops = function(){
		var container = jQuery("#element_tray");
	
		for (var i = 0; i<troopSearcher.troops.length;i++){
			container.append(troopSearcher.troops[i].getHTML);
		}
	}


}












IBRS.allowDrop =function(ev) {
	console.log("allowDrop");
    ev.preventDefault();
	};

IBRS.drag =function(event) {
		console.log("drag");
		event.dataTransfer.setData("text/html", event.target.id);
		
		//IBRS.dragCatcher = ev.target.element;
		//console.log(IBRS.dragCatcher);
	 
	};

IBRS.drop=function(ev) {
		console.log("drop");



	    ev.preventDefault();
	    var data = ev.dataTransfer.getData("text/html");
	    ev.target.appendChild(document.getElementById(data));
	};


drag =function(ev) {
		console.log("drag");
		
	    ev.dataTransfer.setData("text/html", ev.target.id);
	};


