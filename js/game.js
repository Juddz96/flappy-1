var doc = document;
var Hero = function(){
	this.width = 40;
	this.height = 40;
	this.jspeed = 0.4;
	this.yspeed = 0;
	this.acc = 0.001;
	this.dom = doc.getElementById("hero");
	this.jump = function(){
		if(this.getY() > -this.height){
			this.yspeed = -this.jspeed;
		}
	}
	this.getX = function(){return $(this.dom).position().left;}
	this.getY = function(){return $(this.dom).position().top;}
	this.setX = function(a){this.dom.style.left = a+'px';}
	this.setY = function(a){this.dom.style.top = a+'px';}
	this.moveTo = function(x,y){
		this.setX(x);
		this.setY(y);
	}
	this.offset = function(x,y){
		this.moveTo(this.getX()+x,this.getY()+y);
	}
}

var Pipe = function(){
	this.dom = $('<div class="pipe"><div class="pipe-u"></div><div class="pipe-d"></div></div>');
	this.speed = 0.2;
	this.pu = $('.pipe-u',this.dom)[0];
	this.pd = $('.pipe-d',this.dom)[0];
	this.hollowtop = Math.random()*220+25;
	this.hollowheight = 150;
	this.hollowbottom = this.hollowheight+this.hollowtop;

	this.getX = function(){return this.dom.position().left;}
	this.getY = function(){return this.dom.position().top;}
	this.setX = function(a){this.dom[0].style.left = a+'px';}
	this.setY = function(a){this.dom[0].style.top = a+'px';}
	this.moveTo = function(x,y){
		this.dom.offset({top: y,left:x});
	}
	this.offset = function(x,y){
		this.moveTo(this.dom.position().left+x,this.dom.position().top+y);
	}

	this.pu.style.top=0+'px';
	this.pu.style.height=this.hollowtop+'px';
	this.pd.style.top=this.hollowbottom+'px';
	this.pd.style.height=(420-this.hollowbottom)+'px';
	this.moveTo(window.innerWidth,0);
	$('#pipes').append(this.dom);
	Pipe.list.push(this);
};
Pipe.list = [];
Pipe.kill = function(i){
	Pipe.list[i].dom.remove();
	Pipe.list.splice(i,i+1);
}


var hero = new Hero(),
	prevt = (new Date()).getTime(),
	curt = (new Date()).getTime(),
	dt = 0,
	prevpipet = -1;

var game = {
	running: false,
	update: function(){
		hero.yspeed += hero.acc*dt;
		hero.offset(0,hero.yspeed*dt);
		for (var i = 0; i < Pipe.list.length; i++) {
			if(Pipe.list[i].getX()<-70) Pipe.kill(i);
			Pipe.list[i].offset(-Pipe.list[i].speed*dt,0);
		};
		for(var i = 0;i < Pipe.list.length; i++){
			p = Pipe.list[i];
			if((hero.getX()>=p.getX()-hero.width && hero.getX()<= p.getX()+70) && (hero.getY()+hero.height>p.hollowbottom || hero.getY()<p.hollowtop)){
				game.running = false;
			}
		};
		if(curt-prevpipet>1200 || prevpipet==-1){
			new Pipe();
			prevpipet = curt;
		}
	},
	loop: function(){
		if(hero.getY() > 400) game.running = false;
		if(game.running){
			curt = (new Date()).getTime();
			dt = curt-prevt;
			if(dt > 10){
				game.update();
				prevt = curt;
			}
			window.requestAnimationFrame(game.loop);
		}else{
			game.end();
		}
	},
	start: function(){
		$("#getready").fadeOut(400,function(){
			game.running = true;
			prevt = (new Date()).getTime();
			curt = prevt;
			game.loop();
			hero.jump();
			window.onclick = function(e){
				hero.jump();
			};
		});
	},
	end: function(){
		$("#gameover").fadeIn(400,function(){
			window.onclick = function(e){
				while(Pipe.list.length){
					Pipe.kill(0);
				};
				hero.setY(250);
				$("#gameover").fadeOut(400,function(){
					$("#getready").fadeIn(400,function(){
						window.onclick = function(){
							game.start();
						};
					});
				});
			}
		});
	}
}

window.onload = function(){
	window.onclick = function(){
		game.start();
	};
}
