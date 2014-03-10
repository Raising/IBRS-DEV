var IBRS = { VERSION: '1' };


IBRS.DECLARATION = new function(descriptor,source,target,aro){
//descriptor: que acccion se define de una lista numeration, 	
//Source, Marcador/miniatura que lo declara, 
//target: lugar de destino, movimiento o miniatura/marcador destino. 
//aro: es una ora o no.
	this.descriptor = descriptor = descriptor !== undefined ? descriptor : "WAIT";
    this.aro = aro = aro !== undefined ? aro : "FALSE";
    this.source = source = source !== undefined ? source : new THREE.Vector3();
	this.target = target = target !== undefined ? target : new THREE.Vector3();
    

};

IBRS.ORDER = new function(){
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

IBRS.SCENERY = new function (){

	this.loadSceneryFromDataBase = function(gameID){
		//cargar mediante ayax
	};

};
IBRS.MODEL = new function () {};

IBRS.TACTICALGROUP = new function () {};

IBRS.ARMY = new function (){

};

IBRS.PLAYER = new function (){

};

IBRS.TURN = new function (){

};

IBRS.GAME = new function(){
	this.scenery = new IBRS.SCENERY();
	this.turns = [];
	this.players = [];
	this.players.add(new IBRS.PLAYER);
	this.players.add(new IBRS.PLAYER);

	this.loadGameFromDataBase = function(gameID){
		//cargar mediante ayax
	};

	this.newGame = function(){
		//
	};
};