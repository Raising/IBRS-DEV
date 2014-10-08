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
				currentGame.loadGameFromDataBase("game01");

				

				setTimeout(function(){
						GraphicEnviroment.insertGameData(currentGame);
				},4000);

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
				var tl = new TimelineLite();
				IBRS.stage = {
				searchGame :function(){
					//visibles


					IBRS.actualStage = "searchGame";
					

					tl.set(jQuery("#canvas"),{visibility:'hidden'});
					tl.to(jQuery("#canvas"),1,{opacity:'0'},"+=0");
					tl.to(jQuery("#leftTroop_tray"),1,{left:'-25%'},"-=1" );		
					tl.to(jQuery("#rightTroop_tray"),1,{right:'-25%'},"-=1" );
					tl.to(jQuery("#scenery_tray"),1,{top:'-25%'} ,"-=1");
					tl.to(jQuery("#editorTools"),1,{bottom:'-25%'} ,"-=1");
					tl.to(jQuery("#reproductorTools"),1,{bottom:'-25%'} ,"-=1");
					tl.to(jQuery("#deployTools"),1,{bottom:'-25%'},"-=1");
					tl.to(jQuery("#timeTracker"),1,{top:'-15%'},"-=1" );
					

					tl.to(jQuery("#frontalSelector"),2,{top:'-180%'},"-=1");
					

					
					tl.to(jQuery("#leftGameFilter"),1,{left:'-1%'},"-=0.5" );

					tl.to(jQuery("#rightGameFilter"),1,{right:'-1%'} ,"-=1");
					tl.to(jQuery("#searchTools"),1,{bottom:'-1%'} ,"-=0");	
					tl.to(jQuery("#top_left_corner"),1,{top:'-1%',left:'-1%'},"-=0.5");
					tl.to(jQuery("#top_right_corner"),1,{top:'-1%',right:'-1%'} ,"-=1");
					
						//no visibles
					
					
				} ,
				selectElements : function(){
					//visibles
					IBRS.actualStage = "selectElements";
					
					tl.set(jQuery("#canvas"),{visibility:'hidden'});
					tl.to(jQuery("#canvas"),1,{opacity:'0'},"+=0");
					tl.to(jQuery("#leftGameFilter"),1,{left:'-25%'},"-=1" );		
					tl.to(jQuery("#rightGameFilter"),1,{right:'-25%'},"-=1" );
					tl.to(jQuery("#searchTools"),1,{bottom:'-25%'},"-=1" );
					tl.to(jQuery("#editorTools"),1,{bottom:'-25%'} ,"-=1");
					tl.to(jQuery("#reproductorTools"),1,{bottom:'-25%'} ,"-=1");
					tl.to(jQuery("#deployTools"),1,{bottom:'-25%'} ,"-=1");
					tl.to(jQuery("#timeTracker"),1,{top:'-15%'} ,"-=1");
					
					


					tl.to(jQuery("#frontalSelector"),2,{top:'30%'},"-=1" );		
					tl.to(jQuery("#leftTroop_tray"),1,{left:'-1%'} );	
					tl.to(jQuery("#rightTroop_tray"),1,{right:'-1%'},"-=1" );
					tl.to(jQuery("#scenery_tray"),1,{top:'-1%'} ,"-=1");
						
					tl.to(jQuery("#top_left_corner"),1,{top:'-1%',left:'-1%'},"-=0.5");
					tl.to(jQuery("#top_right_corner"),1,{top:'-1%',right:'-1%'},"-=1" );
				
						//quitadas de en medio
					
					retracted_right = false;
					retracted_left = false;
					retracted_top = false;
				    },
				deployElements : function(){
						//visibles
					IBRS.actualStage = "deployElements";
					

					tl.to(jQuery("#editorTools"),1,{bottom:'-25%'} );
					tl.to(jQuery("#leftGameFilter"),1,{left:'-25%'},"-=1" );		
					tl.to(jQuery("#rightGameFilter"),1,{right:'-25%'},"-=1" );
					tl.to(jQuery("#searchTools"),1,{bottom:'-25%'},"-=1" );
					tl.to(jQuery("#reproductorTools"),1,{bottom:'-25%'},"-=1" );
					tl.to(jQuery("#timeTracker"),1,{top:'-15%'} ,"-=1");
					tl.to(jQuery("#frontalSelector"),1,{top:'130%'},"-=1" );	


					tl.to(jQuery("#leftTroop_tray"),1,{left:'-16%'} );		
					tl.to(jQuery("#rightTroop_tray"),1,{right:'-16%'},"-=1" );
					tl.to(jQuery("#scenery_tray"),1,{top:'-16%'} ,"-=1");
					tl.to(jQuery("#deployTools"),1,{bottom:'-1%'},"-=1");
					tl.to(jQuery("#top_right_corner"),1,{top:'-1%',right:'-1%'},"-=0.5");
					tl.to(jQuery("#top_left_corner"),1,{top:'-1%',left:'-1%'},"-=1" );
					
					tl.set(jQuery("#canvas"),{visibility:'visible'});
					tl.to(jQuery("#canvas"),1,{opacity:'1'},"+=0");
						
						//quitadas de en medio
					

					retracted_right = true;
					retracted_left = true;
				    retracted_top = true;

					},
				animateElements : function(){
					
					IBRS.actualStage = "animateElements";
					
						//quitadas de en medio
						tl.to(jQuery("#deployTools"),1,{bottom:'-25%'});
						tl.to(jQuery("#scenery_tray"),1,{top:'-25%'} ,"-=1" );
						tl.to(jQuery("#frontalSelector"),1,{top:'130%'},"-=1" );		
						tl.to(jQuery("#leftGameFilter"),1,{left:'-25%'} ,"-=1" );		
						tl.to(jQuery("#rightGameFilter"),1,{right:'-25%'} ,"-=1" );
						tl.to(jQuery("#searchTools"),1,{bottom:'-25%'},"-=1"  );
						tl.to(jQuery("#reproductorTools"),1,{bottom:'-25%'},"-=1"  );

						//visibles

						tl.to(jQuery("#leftTroop_tray"),1,{left:'-16%'} );		
						tl.to(jQuery("#rightTroop_tray"),1,{right:'-16%'},"-=1"  );
						tl.to(jQuery("#editorTools"),1,{bottom:'-9%'}, "-=1");
						tl.to(jQuery("#timeTracker"),1,{top:'-1%'},"-=1"  );
						tl.to(jQuery("#top_right_corner"),1,{top:'-1%',right:'-1%'},"-=0.5" );
						tl.to(jQuery("#top_left_corner"),1,{top:'-1%',left:'-1%'},"-=1" );
						tl.set(jQuery("#canvas"),{visibility:'visible'});
						tl.to(jQuery("#canvas"),1,{opacity:'1'},"+=0");
						
					

					retracted_right = true;
					retracted_left = true;
				   

					},
				playGame : function(){
						
					IBRS.actualStage = "playGame";
						

						//quitadas de en medio
					tl.to(jQuery("#top_right_corner"),1,{top:'-25%',right:'-25%'});
					tl.to(jQuery("#deployTools"),1,{bottom:'-25%'},"-=1"  );
					tl.to(jQuery("#scenery_tray"),1,{top:'-25%'},"-=1"  );
					tl.to(jQuery("#frontalSelector"),1,{top:'-310%'} ,"-=1" );		
					tl.to(jQuery("#leftGameFilter"),1,{left:'-25%'} ,"-=1" );		
					tl.to(jQuery("#rightGameFilter"),1,{right:'-25%'} ,"-=1" );
					tl.to(jQuery("#searchTools"),1,{bottom:'-25%'} ,"-=1" );
					tl.to(jQuery("#editorTools"),1,{bottom:'-25%'} ,"-=1" );


					//visibles
					tl.to(jQuery("#leftTroop_tray"),1,{left:'-16%'} );		
					tl.to(jQuery("#rightTroop_tray"),1,{right:'-16%'},"-=1" );
					tl.to(jQuery("#reproductorTools"),1,{bottom:'-9%'} );
					tl.to(jQuery("#timeTracker"),1,{top:'-1%'},"-=1"  );
					tl.to(jQuery("#top_left_corner"),1,{top:'-1%',left:'-1%'} );
					tl.set(jQuery("#canvas"),{visibility:'visible'});
					tl.to(jQuery("#canvas"),1,{opacity:'1'},"+=0");
						

					retracted_right = true;
					retracted_left = true;
				   
					},
				playEditableGame : function(){
						//visibles
					IBRS.actualStage = "playEditableGame";
						
					tl.to(jQuery("#top_right_corner"),1,{top:'-25%',right:'-25%'});
					tl.to(jQuery("#deployTools"),1,{bottom:'-25%'},"-=1"  );
					tl.to(jQuery("#scenery_tray"),1,{top:'-25%'},"-=1"  );
					tl.to(jQuery("#frontalSelector"),1,{top:'130%'} ,"-=1" );		
					tl.to(jQuery("#leftGameFilter"),1,{left:'-25%'} ,"-=1" );		
					tl.to(jQuery("#rightGameFilter"),1,{right:'-25%'} ,"-=1" );
					tl.to(jQuery("#searchTools"),1,{bottom:'-25%'} ,"-=1" );
					tl.to(jQuery("#editorTools"),1,{bottom:'-25%'} ,"-=1" );


					//visibles
					tl.to(jQuery("#leftTroop_tray"),1,{left:'-16%'} );		
					tl.to(jQuery("#rightTroop_tray"),1,{right:'-16%'},"-=1" );
					tl.to(jQuery("#reproductorTools"),1,{bottom:'-9%'} );
					tl.to(jQuery("#timeTracker"),1,{top:'-1%'},"-=1"  );
					tl.to(jQuery("#top_left_corner"),1,{top:'-1%',left:'-1%'} );
					tl.set(jQuery("#canvas"),{visibility:'visible'});
					tl.to(jQuery("#canvas"),1,{opacity:'1'},"+=0");


					retracted_right = true;
					retracted_left = true;
				   
					},

				startMenu : function(){
					IBRS.actualStage = "startMenu";
					
						//no visibles
					tl.set(jQuery("#canvas"),{visibility:'visible'});
					tl.to(jQuery("#canvas"),1,{opacity:'0'},"+=0");
					tl.to(jQuery("#leftTroop_tray"),1,{left:'-25%'}, "-=1" );		
					tl.to(jQuery("#rightTroop_tray"),1,{right:'-25%'},"-=1" );
					tl.to(jQuery("#scenery_tray"),1,{top:'-25%'},"-=1" );
					tl.to(jQuery("#top_right_corner"),1,{top:'-25%',right:'-25%'} ,"-=1" );
					tl.to(jQuery("#top_left_corner"),1,{top:'-25%',left:'-25%'},"-=1"  );
					tl.to(jQuery("#editorTools"),1,{bottom:'-25%'},"-=1"  );
					tl.to(jQuery("#deployTools"),1,{bottom:'-25%'} ,"-=1" );
					
						
					tl.to(jQuery("#leftGameFilter"),1,{left:'-25%'} ,"-=1" );		
					tl.to(jQuery("#rightGameFilter"),1,{right:'-25%'} ,"-=1" );
					tl.to(jQuery("#searchTools"),1,{bottom:'-25%'} ,"-=1" );
					tl.to(jQuery("#reproductorTools"),1,{bottom:'-25%'} ,"-=1" );
					tl.to(jQuery("#timeTracker"),1,{top:'-10%'},"-=1"  );
					tl.to(jQuery("#canvas"),1,{opacity:'0'},"-=1" );
					
					tl.to(jQuery("#frontalSelector"),1,{top:'-80%'} );	
					}
				}


				// Relacion html con los elementos en el canvas 
				
				jQuery("#buton_search").click(function(){IBRS.stage.searchGame();});

				
				jQuery("#buton_create_new").click(function(){IBRS.stage.selectElements();});
				

				

				jQuery("#back_button").click(function(){
					switch(IBRS.actualStage){
						case "playEditableGame":
							//IBRS.stage.animateElements();
							IBRS.stage.startMenu();
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
						tl.to(jQuery("#leftTroop_tray"),1,{left:'-1%'} );
						retracted_left = false;		
					}else{
					tl.to(jQuery("#leftTroop_tray"),1,{left:'-16%'} );		
						retracted_left = true;
					}
					return false;
				});


				jQuery("#retract_scenery").click(function(){		
					if (retracted_top){ 
						tl.to(jQuery("#scenery_tray"),1,{top:'-1%'} );
						retracted_top = false;		
					}else{
						tl.to(jQuery("#scenery_tray"),1,{top:'-16%'} );		
						retracted_top = true;
					}
					return false;
				});

				jQuery("#retract_troop_right").click(function(){		
					if (retracted_right){ 
						tl.to(jQuery("#rightTroop_tray"),1,{right:'-1%'} );
						retracted_right = false;		
					}else{
						tl.to(jQuery("#rightTroop_tray"),1,{right:'-16%'} );		
						retracted_right = true;
					}
					return false;
				});



			});