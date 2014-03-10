var IBRS = { VERSION: '1' };

IBRS.Tuple3D = function(x,y,z){
	this.x = x = x !== undefined ? x : 0;
	this.y = y = y !== undefined ? y : 0;
	this.z = z = z !== undefined ? z : 0;
	this.set = function(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

IBRS.DECLARATION =  function(descriptor,source,target,aro){
//descriptor: que acccion se define de una lista numeration, 	
//Source, Marcador/miniatura que lo declara, 
//target: lugar de destino, movimiento o miniatura/marcador destino. 
//aro: es una ora o no.
	this.descriptor = descriptor = descriptor !== undefined ? descriptor : "WAIT";
    this.aro = aro = aro !== undefined ? aro : "FALSE";
    this.source = source = source !== undefined ? source : new THREE.Vector3();
	this.target = target = target !== undefined ? target : new THREE.Vector3();
    

};

IBRS.ORDER =  function(){
	this.firstDeclaration = [];
	this.secondDeclaration = [];
	this.firstAro = [];
	this.secondAro = [];

	this.addFirstDeclaration( declaration){
		this.firstDeclaration.add(declaration);
	}

	this.addSecondDeclaration( declaration){
		this.secondDeclaration.add(declaration);
	}

	this.addFirstAro( declaration){
		this.firstAro.add(declaration);
	}

	this.addSecondAro( declaration){
		this.SecondAro.add(declaration);
	}
};

IBRS.SCENERY =  function (){
	THREE.Object3D.call(this);
	this.loadSceneryFromDataBase = function(sceneryID){
		//cargar mediante ayax
	};
};
IBRS.SCENERY.prototype = Object.create(THREE.Object3D.prototype);


IBRS.MODEL =  function (modelID) {
	
	this.isMarker = FALSE;
	this.id = modelID = modelID !== undefined ? modelID : 0;
	this.modelTexture = 'img/empty.jpg';
	this.baseTexture = 'img/empty.jpg'; // por decidir el formato de almacenamiento
	this.position = new IBRS.Tuple3D();
	this.rotation = new IBRS.Tuple3D();
	this.heigth = 3;
	this.width = 2.5;
	this.regular = true; // true la miniatura es regular, false irregular
	this.fury = false; // true la  es impetuosa, false no
	this.active = true; // si aporta o no su orden al grupo
	this.miniature = new Miniature(this.heigth,this.width,'this.modelTexture','this.baseTexture',this);

	this.setPosition = function(x,y,z){
		this.position.set(z,y,z);
		this.miniature.position.set(x,y,z);
	};


	this.setRotation = function(x,y,z){
		this.rotation.set(z,y,z);
		this.miniature.rotation.set(x,y,z);
	};

	

	this.loadModelFromDataBase = function(modelID){
		//carga mediante ayax
	};
};

IBRS.TACTICALGROUP =  function () {
	this.modelList = []; // lista llena de objetos IBRS.MODEL
	this.regularAmount = 0;
	this.irregularAmount = 0;
	this.furyAmount = 0;
	
	// resstart order counting
	this.actualizeOrders =  function(){
		this.furyAmount = this.regularAmount = this.irregularAmount = 0;
		for (var i = 0; i<modelList.length();i++){
			var countingModel = modelList[i];
			if (countingModel.active){
				if (countingModel.regular){			this.regularAmount +=1;}
				else{								this.irregularAmount +=1;}
				if (countingModel.fury){			this.furyAmount +=1;}
			}
		}
	};


};


IBRS.ARMY = function(){
	this.tacticalGroupList = [];
};


IBRS.PLAYER = function (){
	this.playerID = 0;
	this.faction; // Faction is an ENUM
	this.name = "no name";
	this.army = new IBRS.ARMY ();

	this.loadPlayerfromDataBase = function (playerID){
		//cargar mediante ayax
	};
};


//a turn is a set of orders that define the events of the game.
IBRS.TURN =  function(){
	this.orderList=[];

	this.addOrder = function (newOrder) {
		this.orderList.add(newOrder);
	};

};

IBRS.GAME = function(){
	this.scenery = new IBRS.SCENERY();
	this.turnList = [];
	this.playersList = [];
	this.playersList.add(new IBRS.PLAYER);
	this.playersList.add(new IBRS.PLAYER);

	this.loadGameFromDataBase = function(gameID){
		//cargar mediante ayax
	};

	this.newGame = function(){
		//
	};
};