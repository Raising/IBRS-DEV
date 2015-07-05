IBRS.Server = {};
IBRS.searcher = new IBRS.TroopSearcher();

IBRS.Server.GetFactionList = function(){

	jQuery.ajax({ url: '/IBRS-DEV/personal/php/actions.php',
         data: {action: 'getFactionList'},
         type: 'post',
         success: function(output) {
         			console.log(output);
         			IBRS.searcher.loadAvaiableFactions( JSON.parse(output.replace("\\/","/")));
        }
	});
}


IBRS.Server.GetModelsOfFaction = function(factionID){
	console.log(factionID);
	jQuery.ajax({ url: '/IBRS-DEV/personal/php/actions.php',
         data: {action: 'getFactionModels',factionID:factionID},
         type: 'post',
         success: function(output) {
         			console.log(output);
         			IBRS.searcher.loadAvaiableTroops( JSON.parse(output.replace("\\/","/")));
         }
	});
}

IBRS.Server.GetSingleModel = function(modelID,callback){
	
	jQuery.ajax({ url: '/IBRS-DEV/personal/php/actions.php',
         data: {action: 'getModel',modelID:modelID},
         type: 'post',
         success: function(output) {
         			//console.log(output);
         			callback(JSON.parse(output.replace("\\/","/")));
         }
	});
}

IBRS.Server.GetGameList = function(params){//params son variables para ser usadas de filtros
   jQuery.ajax({ url: '/IBRS-DEV/personal/php/actions.php',
         data: {action: 'getGameList'},
         type: 'post',
         success: function(output) {
                  //console.log(output);
                  callback(JSON.parse(output.replace("\\/","/")));
         }
   });
}


IBRS.Server.SaveCurrentGame = function(){//params son variables para ser usadas de filtros

}

IBRS.Server.GetGame = function(gameID){

}



IBRS.Server.GetEscenery = function(){

}

IBRS.Server.GetGameArea = function(gameAreaID){

}

IBRS.Server.SaveCurrentGameArea = function(){
	
}

IBRS.Server.UserLogin = function(user,password,callback){// ej: {usuario:r23nf2, password:23f249gun4}
	jQuery.ajax({ url: '/IBRS-DEV/personal/php/actions.php',
         data: {action: 'login',user:user,pasword:password},
         type: 'post',
         success: function(output) {
                  //console.log(output);
                  callback(output);
         }
   });
}

IBRS.Server.UserRegister = function(user,password,email,callback){
	jQuery.ajax({ url: '/IBRS-DEV/personal/php/actions.php',
         data: {action: 'register',user:user,pasword:password, email:email},
         type: 'post',
         success: function(output) {
                  //console.log(output);
                  callback(output);
         }
   });
}


IBRS.Server.UserActualice = function(params){

}


