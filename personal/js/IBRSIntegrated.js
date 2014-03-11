var IBRS = { VERSION: '1' };


IBRS.Declaration =  function(descriptor,source,target,aro){
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
		this.firstDeclaration.add(declaration);
	}

	this.addSecondDeclaration= function( declaration){
		this.secondDeclaration.add(declaration);
	}

	this.addFirstAro= function( declaration){
		this.firstAro.add(declaration);
	}

	this.addSecondAro= function( declaration){
		this.SecondAro.add(declaration);
	}
};

IBRS.Scenery =  function (){
	THREE.Object3D.call(this);

	var mesa = new TableBoard(new THREE.Vector3(120,20,120),'img/terrain01.png');
  
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
IBRS.Scenery.prototype = Object.create(THREE.Object3D.prototype);


IBRS.Model =  function (modelID) {
	var model = this;
	this.isMarker = FALSE;
	this.id = modelID = modelID !== undefined ? modelID : 0;
	this.modelTexture = 'img/empty.jpg';
	this.baseTexture = 'img/empty.jpg'; // por decidir el formato de almacenamiento
	this.position = new THREE.Vector3();
	this.rotation = new THREE.Vector3();
	this.heigth = 3;
	this.width = 2.5;
	this.regular = true; // true la miniatura es regular, false irregular
	this.fury = false; // true la  es impetuosa, false no
	this.active = true; // si aporta o no su orden al grupo
	this.miniature = new Miniature(this.heigth,this.width,'this.modelTexture','this.baseTexture',this);

	this.setPosition = function(x,y,z){
		model.position.set(z,y,z);
		model.miniature.position.set(x,y,z);
	};


	this.setRotation = function(x,y,z){
		model.rotation.set(z,y,z);
		model.miniature.rotation.set(x,y,z);
	};



	this.loadModelFromDataBase = function(modelID){
		//carga mediante ayax
	};
};

IBRS.TacticalGroup =  function () {
	var tacticalGroup = this;
	this.modelList = []; // lista llena de objetos IBRS.MODEL
	this.regularAmount = 0;
	this.irregularAmount = 0;
	this.furyAmount = 0;
	
	// restart order counting
	this.actualizeOrders =  function(){
		tacticalGroup.furyAmount = tacticalGroup.regularAmount = tacticalGroup.irregularAmount = 0;
		for (var i = 0; i<modelList.length();i++){
			var countingModel = modelList[i];
			if (countingModel.active){
				if (countingModel.regular){			tacticalGroup.regularAmount +=1;}
				else{								tacticalGroup.irregularAmount +=1;}
				if (countingModel.fury){			tacticalGroup.furyAmount +=1;}
			}
		}
	};


};


IBRS.Army = function(){
	var army = this;
	this.tacticalGroupList = [];

	this.addGroup = function(group){
		army.tacticalGroupList.add(group);
	}
};


IBRS.Player = function (){
	var player = this;
	this.playerID = 0;
	this.faction; // Faction is an ENUM
	this.name = "no name";
	this.army = new IBRS.Army();

	this.loadPlayerfromDataBase = function (playerID){
		//cargar mediante ayax
	};
};


//a turn is a set of orders that define the events of the game.
IBRS.Turn =  function(){
	vat turn = this;
	this.orderList=[];

	this.addOrder = function (newOrder) {
		turn.orderList.add(newOrder);
	};

	

};

IBRS.Game = function(){
	var game = this;
	this.scenery = new IBRS.Scenery();
	this.turnList = [];
	this.playersList = [];
	this.playersList.add(new IBRS.Player);
	this.playersList.add(new IBRS.Player);

	this.loadGameFromDataBase = function(gameID){
		//cargar mediante ayax
	};

	this.newTurn = function(){
		game.turnList.add(new IBRS.Turn());

	}

	this.newGame = function(){
		//
	};
};