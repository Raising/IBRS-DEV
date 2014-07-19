jQuery(function(){
				//webGLStart();
				jQuery( document ).ajaxError(function() {
					console.log("fallo de ayax");
				});


				var GraphicEnviroment = new IBRS.Graphics();
				GraphicEnviroment.webGLStart();
				
				var currentGame = new IBRS.Game();
				// esa instrucccion debe ser llamada usando los menus del sistema
				currentGame.loadGameFromDataBase("game01");

				

				setTimeout(function(){
					var miniaturesListhere = currentGame.getMiniatures();
					var sceneryElementsListhere = currentGame.getSceneryElementList();

					GraphicEnviroment.addListToScene(miniaturesListhere,true);
					GraphicEnviroment.addListToScene(sceneryElementsListhere,false);

				},2000);

				
				

				jQuery(GraphicEnviroment.render.domElement).attr("id","render").addClass(" canvas-look col-md-12 col-sm-12 col-xs-12");
				jQuery("#canvas").append(jQuery(GraphicEnviroment.render.domElement));
			
				//boton ampliar canvas	
				jQuery("#fullscreen-canvas").click(function(){
					jQuery(this).hide();		
					jQuery("#resize-canvas").show();
					jQuery("#cabecera").slideUp();
					jQuery("#tabs").slideUp();
					jQuery("#menu_area").children().slideUp( function(){jQuery("#canvas").queue(function(){jQuery( this ).removeClass("col-md-6").addClass("col-md-12").dequeue();}).slideDown("slow");});
					return false;
				});
				//boton reducir canvas
				jQuery("#resize-canvas").click(function(){	
					jQuery(this).hide();		
					jQuery("#fullscreen-canvas").show();
					jQuery("#menu_area").children().slideDown();
					jQuery("#tabs").slideDown("slow");
					jQuery("#cabecera").slideDown("slow");
				
					
					jQuery("#canvas").slideUp(function() {	jQuery( "#canvas").removeClass("col-md-12").addClass("col-md-6");}).slideDown();
					return false;
				});
				//boton acceso a register
				jQuery("#button_register_menu").click(function(){
					jQuery("#menu_area").slideUp(function(){
					jQuery("#menu_area > div").appendTo(jQuery("#hidden_storage"));
					jQuery("#menu_user_register").appendTo(jQuery("#menu_area"));
						}).slideDown();
				});
				// Script de Pestañas, para añadir una nueva simplemente crear el li con su a correspondiente en la parte html y ponerle de href el nombre del div a cargar 
				jQuery("ul.nav > li > a").click(function(){	
					var thisMenu =jQuery(this);
					thisMenu.parent().parent().children().removeClass("active");
					thisMenu.parent().addClass("active");
					var displaying_menu = thisMenu.attr("href");
					jQuery("#menu_area").slideUp(function(){
					jQuery("#menu_area > div").appendTo(jQuery("#hidden_storage"));
					jQuery(displaying_menu).appendTo(jQuery("#menu_area"));
					if (displaying_menu == "#menu_initial" || displaying_menu == "#menu_events" ){jQuery("#canvas").appendTo(jQuery("#menu_area"));}
						}).slideDown();
					return false;
				});
				
				// Relacion html con los elementos en el canvas 
				



			});