/*************************************
Native Components for Crafty Library

TODO:
	- Collision
	- Inventory
	- Items
	- Lighting
	- Controls
	- Particles
	- TerrainGen
	- Map
	- Animation
	- Sound
	
*************************************/
Crafty.c("2D", {
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	
	area: function() {
		return this.w * this.h;
	},
	
	/**
	* Does a rect intersect this
	*/
	intersect: function(rect) {
		//rect must have x,y,w,h
		//if(!rect.x || !rect.y || !rect.w || !rect.h) return undefined;
		
		return this.x < rect.x + rect.w && this.x + this.w > rect.x &&
			   this.y < rect.y + rect.h && this.h + this.y > rect.y;
	},
	
	/**
	* Is object at point
	*/
	isAt: function(x,y) {
		return this.x <= x && this.x + this.w >= x &&
			   this.y <= y && this.y + this.h >= y;
	},
	
	/**
	* Basic collision for rects. Can be used on
	* large collection of elements.
	*/
	hit: function(obj, fn) {
		this.each(function() {
			console.log("init", this[0]);
			this.bind("hit", fn);
			this.bind("enterframe", function() {
				if(this.intersect(Crafty(obj))) {
					this.trigger("hit");
				}
			});
		});
	}
});

Crafty.c("gravity", {
	_gravity: 1.1,
	
	init: function() {
		if(!this.has("2D")) this.addComponent("2D");
		this.bind("enterframe", function() {
			this.y *= this._gravity;
		});
	}
});

Crafty.c("DOM", {
	_element: null,
	
	DOM: function(elem) {
		if(!this.has("2D")) this.addComponent("2D");
		this._element = elem;
		return this;
	}
});

Crafty.c("DOMDraw", {
	
	DOMDraw: function() {
		if(!this.has("DOM")) this.addComponent("DOM");
		this._element.style.position = 'absolute';
		this.bind("enterframe", function() {
			this._element.style.top = Math.ceil(this.y) + "px";
			this._element.style.left = Math.ceil(this.x) + "px";
		});
	}
});


Crafty.extend({
	tile: 16,
	context: null,
	
	/**
	* Sprite generator.
	*
	* Extends Crafty for producing components
	* based on sprites and tiles
	*/
	sprite: function(tile, url, map) {
		var pos, temp, x, y, w, h;
		
		//if no tile value, default to 16
		if(typeof tile === "string") {
			map = url;
			url = tile;
			tile = 16;
		}
		this.tile = tile;
		
		for(pos in map) {
			if(!map.hasOwnProperty(pos)) continue;
			
			temp = map[pos];
			x = temp[0] * tile;
			y = temp[1] * tile;
			w = temp[2] * tile || tile;
			h = temp[3] * tile || tile;
			
			//create a component
			Crafty.c(pos, {
				__image: url,
				__coord: [x,y,w,h]
			});
		}
		
		return this;
	},
	
	/**
	* Set the canvas element and 2D context
	*/
	canvas: function(elem) {
		if(!('getContext' in elem)) return;
		this.context = elem.getContext('2d');
	},
	
	/**
	* Window Events credited to John Resig
	* http://ejohn.org/projects/flexible-javascript-events
	*/
	addEvent: function(obj, type, fn) {
		if ( obj.attachEvent ) {
			obj['e'+type+fn] = fn;
			obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
			obj.attachEvent( 'on'+type, obj[type+fn] );
		} else obj.addEventListener( type, fn, false );
	},
	
	removeEvent: function(obj, type, fn) {
		if (obj.detachEvent) {
			obj.detachEvent('on'+type, obj[type+fn]);
			obj[type+fn] = null;
		} else obj.removeEventListener(type, fn, false);
	},
	
	window: {
		width: window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
		height: window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight)
	},
	
	/**
	* Map key names to key codes
	*/
	keys: {'BSP':8, 'TAB':9, 'ENT':13, 'SHF':16, 'CTR':17, 'ALT':18, 'PAU':19, 'CAP':20, 'ESC':27, 'SP':32, 'PGU':33, 'PGD':34, 'END':35, 'HOM':36, 'LA':37, 'UA':38, 'RA':39, 'DA':40, 'INS':45, 'DEL':46, 'D0':48, 'D1':49, 'D2':50, 'D3':51, 'D4':52, 'D5':53, 'D6':54, 'D7':55, 'D8':56, 'D9':57, 'SEM':59, 'EQL':61, 'A':65, 'B':66, 'C':67, 'D':68, 'E':69, 'F':70, 'G':71, 'H':72, 'I':73, 'J':74, 'K':75, 'L':76, 'M':77, 'N':78, 'O':79, 'P':80, 'Q':81, 'R':82, 'S':83, 'T':84, 'U':85, 'V':86, 'W':67, 'X':88, 'Y':89, 'Z':90, 'LWN':91, 'RWN':92, 'SEL':93, 'N0':96, 'N1':97, 'N2':98, 'N3':99, 'N4':100, 'N5':101, 'N6':102, 'N7':103, 'N8':104, 'N9':105, 'MUL':106, 'ADD':107, 'SUB':109, 'DEC':110, 'DIV':111, 'F1':112, 'F2':113, 'F3':114, 'F4':115, 'F5':116, 'F6':117, 'F7':118, 'F8':119, 'F9':120, 'F10':121, 'F11':122, 'F12':123, 'NUM':144, 'SCR':145, 'COM':188, 'PER':190, 'FSL':191, 'ACC':192, 'OBR':219, 'BSL':220, 'CBR':221, 'QOT':222}
});

Crafty.c("canvas", {
	init: function() {
		this.img = new Image();
		this.img.src = this.__image;
		this.w = this.__coord[2];
		this.h = this.__coord[3];
	},
	
	append: function() {
	
	},
	
	draw: function() {
		var co = this.__coord;
		
		//draw the image on the canvas element
		Crafty.context.drawImage(this.img, //image element
								 co[0], //x position on sprite
								 co[1], //y position on sprite
								 co[2], //width on sprite
								 co[3], //height on sprite
								 Math.ceil(this.x), //x position on canvas
								 Math.ceil(this.y), //y position on canvas
								 this.w, //width on canvas
								 this.h //height on canvas
		);
	}
});

Crafty.c("controls", {
		
	init: function() {
		var self = this;
		Crafty.addEvent(document, "keydown", function(e) {
			e = e || window.event;
			self.trigger("keydown", e);
		});
		
		Crafty.addEvent(document, "keydown", function(e) {
			e = e || window.event;
			self.trigger("keyup", e);
		});
		
		return this;
	}
});