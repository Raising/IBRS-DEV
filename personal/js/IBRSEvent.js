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

IBRS.Turn =  function(){
	var turn = this;
	this.orderList=[];

	this.addOrder = function (newOrder) {
		turn.orderList.push(newOrder);
	};

	

};