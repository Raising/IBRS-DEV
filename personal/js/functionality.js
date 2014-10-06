jQuery(function(){
				//webGLStart();
				window.addEventListener("keydown", function(evt){
					if (evt.keyCode ===9 || evt.keyCode === 18){
						evt.preventDefault();
					}
				}  , false); 
				jQuery( document ).ajaxError(function() {
					console.error("fallo de ayax");
				});


				var GraphicEnviroment = new IBRS.Graphics();
				GraphicEnviroment.webGLStart();
				
				var currentGame = new IBRS.Game();
				// esa instrucccion debe ser llamada usando los menus del sistema
				currentGame.loadGameFromDataBase("game02");

				

				setTimeout(function(){
						GraphicEnviroment.insertGameData(currentGame);
				},2000);

			//	GraphicEnviroment.playGame(currentGame.events);
				

				//jQuery(GraphicEnviroment.render.domElement).attr("id","render").addClass(" canvas-look col-md-12 col-sm-12 col-xs-12");
				jQuery("#canvas").append(jQuery(GraphicEnviroment.render.domElement));
				
				//boton comenzar reproduccion "play"
				jQuery("#play_button").click(function(){
					GraphicEnviroment.playGame();
					return false;
				});	
				jQuery("#pause_button").click(function(){
					GraphicEnviroment.pauseGame();
					return false;
				});		
					
				//boton ampliar canvas	


			
				var retracted_right = false;
				var retracted_left = false;
				var retracted_top = false;
				IBRS.actualStage = "startMenu";

				IBRS.stage = {
				searchGame :function(){
					//visibles
					IBRS.actualStage = "searchGame";
					jQuery("#frontalSelector").animate({top:'-180%'} ,1000);		
					jQuery("#leftGameFilter").delay(1000).animate({left:'-1%'} ,1000);		
					jQuery("#rightGameFilter").delay(1000).animate({right:'-1%'} ,1000);
					jQuery("#searchTools").delay(1000).animate({bottom:'-1%'} ,1000);
					jQuery("#top_right_corner").delay(1000).animate({top:'-1%',right:'-1%'} ,1000);
					jQuery("#top_left_corner").delay(1000).animate({top:'-1%',left:'-1%'} ,1000);
					//no visibles
					jQuery("#leftTroop_tray").animate({left:'-20%'} ,1000);		
					jQuery("#rightTroop_tray").animate({right:'-20%'} ,1000);
					jQuery("#scenery_tray").animate({top:'-20%'} ,1000);
					jQuery("#editorTools").animate({bottom:'-20%'} ,1000);
					jQuery("#reproductorTools").animate({bottom:'-20%'} ,1000);
					jQuery("#deployTools").animate({bottom:'-20%'} ,1000);
					jQuery("#timeTracker").animate({top:'-11%'} ,1000);
					jQuery("#canvas").animate({opacity:'0'},500);
					
				} ,
				selectElements : function(){
					//visibles
					IBRS.actualStage = "selectElements";
					jQuery("#frontalSelector").animate({top:'20%'} ,1000);		
					jQuery("#leftTroop_tray").delay(1000).animate({left:'-1%'} ,1000);		
					jQuery("#rightTroop_tray").delay(1000).animate({right:'-1%'} ,1000);
					jQuery("#scenery_tray").delay(1000).animate({top:'-1%'} ,1000);
					jQuery("#top_right_corner").delay(1000).animate({top:'-1%',right:'-1%'} ,1000);
					jQuery("#top_left_corner").delay(1000).animate({top:'-1%',left:'-1%'} ,1000);

					//quitadas de en medio
					jQuery("#leftGameFilter").animate({left:'-20%'} ,1000);		
					jQuery("#rightGameFilter").animate({right:'-20%'} ,1000);
					jQuery("#searchTools").animate({bottom:'-20%'} ,1000);
					jQuery("#editorTools").animate({bottom:'-20%'} ,1000);
					jQuery("#reproductorTools").animate({bottom:'-20%'} ,1000);
					jQuery("#deployTools").animate({bottom:'-20%'} ,1000);
					jQuery("#timeTracker").animate({top:'-11%'} ,1000);
					jQuery("#canvas").animate({opacity:'0'},500);

					retracted_right = false;
					retracted_left = false;
					retracted_top = false;
				    },
				deployElements : function(){
						//visibles
					IBRS.actualStage = "deployElements";
					jQuery("#leftTroop_tray").delay(1000).animate({left:'-16%'} ,1000);		
					jQuery("#rightTroop_tray").delay(1000).animate({right:'-16%'} ,1000);
					jQuery("#scenery_tray").delay(1000).animate({top:'-16%'} ,1000);
					jQuery("#top_right_corner").delay(1000).animate({top:'-1%',right:'-1%'} ,1000);
					jQuery("#top_left_corner").delay(1000).animate({top:'-1%',left:'-1%'} ,1000);
					jQuery("#deployTools").delay(1000).animate({bottom:'-1%'} ,1000);
					jQuery("#canvas").delay(2000).animate({opacity:'1'},1000);
					
					//quitadas de en medio
					jQuery("#editorTools").animate({bottom:'-20%'} ,1000);
					jQuery("#frontalSelector").animate({top:'120%'} ,1000);		
					jQuery("#leftGameFilter").animate({left:'-20%'} ,1000);		
					jQuery("#rightGameFilter").animate({right:'-20%'} ,1000);
					jQuery("#searchTools").animate({bottom:'-20%'} ,1000);
					jQuery("#reproductorTools").animate({bottom:'-20%'} ,1000);
					jQuery("#timeTracker").animate({top:'-11%'} ,1000);
					

					retracted_right = true;
					retracted_left = true;
				    retracted_top = true;

					},
				animateElements : function(){
						//visibles
					IBRS.actualStage = "animateElements";
					jQuery("#leftTroop_tray").delay(1000).animate({left:'-16%'} ,1000);		
					jQuery("#rightTroop_tray").delay(1000).animate({right:'-16%'} ,1000);
					jQuery("#top_right_corner").delay(1000).animate({top:'-1%',right:'-1%'} ,1000);
					jQuery("#top_left_corner").delay(1000).animate({top:'-1%',left:'-1%'} ,1000);
					jQuery("#editorTools").delay(1000).animate({bottom:'-9%'} ,1000);
					jQuery("#timeTracker").delay(1000).animate({top:'-1%'} ,1000);
					jQuery("#canvas").delay(2000).animate({opacity:'1'},1000);
					//quitadas de en medio
					jQuery("#deployTools").animate({bottom:'-20%'} ,1000);
					jQuery("#scenery_tray").animate({top:'-20%'} ,1000);
					jQuery("#frontalSelector").animate({top:'120%'} ,1000);		
					jQuery("#leftGameFilter").animate({left:'-20%'} ,1000);		
					jQuery("#rightGameFilter").animate({right:'-20%'} ,1000);
					jQuery("#searchTools").animate({bottom:'-20%'} ,1000);
					jQuery("#reproductorTools").animate({bottom:'-20%'} ,1000);


					retracted_right = true;
					retracted_left = true;
				   

					},
				playGame : function(){
						//visibles
					IBRS.actualStage = "playGame";
					jQuery("#leftTroop_tray").delay(1000).animate({left:'-16%'} ,1000);		
					jQuery("#rightTroop_tray").delay(1000).animate({right:'-16%'} ,1000);
					jQuery("#top_left_corner").delay(1000).animate({top:'-1%',left:'-1%'} ,1000);
					jQuery("#reproductorTools").delay(1000).animate({bottom:'-9%'} ,1000);
					jQuery("#timeTracker").delay(1000).animate({top:'-1%'} ,1000);
					jQuery("#canvas").delay(2000).animate({opacity:'1'},1000);
					//quitadas de en medio
					jQuery("#top_right_corner").animate({top:'-20%',right:'-20%'} ,1000);
					jQuery("#deployTools").animate({bottom:'-20%'} ,1000);
					jQuery("#scenery_tray").animate({top:'-20%'} ,1000);
					jQuery("#frontalSelector").animate({top:'-300%'} ,1000);		
					jQuery("#leftGameFilter").animate({left:'-20%'} ,1000);		
					jQuery("#rightGameFilter").animate({right:'-20%'} ,1000);
					jQuery("#searchTools").animate({bottom:'-20%'} ,1000);
					jQuery("#editorTools").animate({bottom:'-20%'} ,1000);


					retracted_right = true;
					retracted_left = true;
				   
					},
				playEditableGame : function(){
						//visibles
					IBRS.actualStage = "playEditableGame";
					jQuery("#leftTroop_tray").delay(1000).animate({left:'-16%'} ,1000);		
					jQuery("#rightTroop_tray").delay(1000).animate({right:'-16%'} ,1000);
					jQuery("#top_left_corner").delay(1000).animate({top:'-1%',left:'-1%'} ,1000);
					jQuery("#reproductorTools").delay(1000).animate({bottom:'-9%'} ,1000);
					jQuery("#timeTracker").delay(1000).animate({top:'-1%'} ,1000);
					jQuery("#canvas").delay(2000).animate({opacity:'1'},1000);
					//quitadas de en medio
					jQuery("#top_right_corner").animate({top:'-20%',right:'-20%'} ,1000);
					jQuery("#deployTools").animate({bottom:'-20%'} ,1000);
					jQuery("#scenery_tray").animate({top:'-20%'} ,1000);
					jQuery("#frontalSelector").animate({top:'120%'} ,1000);		
					jQuery("#leftGameFilter").animate({left:'-20%'} ,1000);		
					jQuery("#rightGameFilter").animate({right:'-20%'} ,1000);
					jQuery("#searchTools").animate({bottom:'-20%'} ,1000);
					jQuery("#editorTools").animate({bottom:'-20%'} ,1000);


					retracted_right = true;
					retracted_left = true;
				   
					},

				startMenu : function(){
					IBRS.actualStage = "startMenu";

					jQuery("#frontalSelector").delay(1000).animate({top:'-80%'} ,1000);		

					//no visibles
					jQuery("#leftTroop_tray").animate({left:'-20%'} ,1000);		
					jQuery("#rightTroop_tray").animate({right:'-20%'} ,1000);
					jQuery("#scenery_tray").animate({top:'-20%'} ,1000);
					jQuery("#top_right_corner").animate({top:'-20%',right:'-20%'} ,1000);
					jQuery("#top_left_corner").animate({top:'-20%',left:'-20%'} ,1000);
					jQuery("#editorTools").animate({bottom:'-20%'} ,1000);
					jQuery("#deployTools").animate({bottom:'-20%'} ,1000);
				
					
					jQuery("#leftGameFilter").animate({left:'-20%'} ,1000);		
					jQuery("#rightGameFilter").animate({right:'-20%'} ,1000);
					jQuery("#searchTools").animate({bottom:'-20%'} ,1000);
					jQuery("#reproductorTools").animate({bottom:'-20%'} ,1000);
					jQuery("#timeTracker").animate({top:'-10%'} ,1000);
					jQuery("#canvas").animate({opacity:'0'},500);
					}
				}


				// Relacion html con los elementos en el canvas 
				
				jQuery("#buton_search").click(function(){IBRS.stage.searchGame();});
				jQuery("#buton_create_new").click(function(){IBRS.stage.selectElements();});

				

				jQuery("#back_button").click(function(){
					switch(IBRS.actualStage){
						case "playEditableGame":
							IBRS.stage.animateElements();
						break;
						
						case "playGame":
							IBRS.stage.searchGame();
						break;
						
						case "animateElements":
							IBRS.stage.deployElements();
						break;
						
						case "deployElements":
							IBRS.stage.selectElements();
						break;
						case "selectElements":
							IBRS.stage.startMenu();
						break;
						case "searchGame":
							IBRS.stage.startMenu();
						break;
					}

				});


				jQuery("#next_button").click(function(){
					switch(IBRS.actualStage){
						case "deployElements":
							IBRS.stage.animateElements();
						break;
						case "animateElements":
							IBRS.stage.playEditableGame();
						break;
						case "selectElements":
							IBRS.stage.deployElements();
						break;
						case "searchGame":
							IBRS.stage.playGame();
						break;
					}

				});


				jQuery("#retract_troop_left").click(function(){		
					if (retracted_left){ 
						jQuery("#leftTroop_tray").animate({left:'-1%'} ,1000);
						retracted_left = false;		
					}else{
						jQuery("#leftTroop_tray").animate({left:'-16%'} ,1000);		
						retracted_left = true;
					}
					return false;
				});


				jQuery("#retract_scenery").click(function(){		
					if (retracted_top){ 
						jQuery("#scenery_tray").animate({top:'-1%'} ,1000);
						retracted_top = false;		
					}else{
						jQuery("#scenery_tray").animate({top:'-16%'} ,1000);		
						retracted_top = true;
					}
					return false;
				});

				jQuery("#retract_troop_right").click(function(){		
					if (retracted_right){ 
						jQuery("#rightTroop_tray").animate({right:'-1%'} ,1000);
						retracted_right = false;		
					}else{
						jQuery("#rightTroop_tray").animate({right:'-16%'} ,1000);		
						retracted_right = true;
					}
					return false;
				});



			});