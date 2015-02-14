// IBRS Copyright (C) 2014  Ignacio Medina Castillo
// ignacio.medina.castillo@gmail.com

IBRS.Recorder = function(graphics){
	console.log("hola?");
	var recorder = this;
	this.graphics = graphics;
	this.eventHolder = new IBRS.GameEvents();
	this.actualTurn ={};
	this.actualOrder ={};
	this.actualDeclaration ={};
	this.actualAction = {};
	this.actualResolution ={};


	this.setEvents = function(eventHolder){
		recorder.eventHolder = eventHolder;
	}

	this.addNewTurn = function(){

		
	}

	this.addNewOrder = function(){

		
	}

	this.addNewDeclaration = function(fase){//fase es la etapa, 1 declaracion 1 ora etc
		
		
	}

	this.addNewAction = function(){

		
	}

	this.addNewResolution = function(){

		
	}
}	