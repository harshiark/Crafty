var MAX_SUB_DIVISIONS=6,MAX_OBJECTS=6,results=[],OBJECT="object",NULL=null,mc=Math.ceil;function RTree(){this.root=new Box(0,0,Crafty.window.width,Crafty.window.height,null,0)}RTree.prototype={get:function(a,e,c,d){if(typeof a===OBJECT){e=a.y;c=a.w;d=a.h;a=a.x}results=[];var b=this.root.get(a,e,c,d);return b||results},put:function(a,g,b,c,f){var e;if(typeof a===OBJECT){f=a;c=a.h;b=a.w;g=a.y;a=a.x}e=this.root.get(a,g,b,c);if(e){var d=new Box(a,g,b,c,e,e.lvl+1);d.obj=f;e.children.push(d);create(a,g,b,c);if(e.children.length>=MAX_OBJECTS&&e.lvl<MAX_SUB_DIVISIONS){e.divide()}}},destroy:function(){this.root.destroy()}};function Box(a,g,b,f,e,d,c){this.x=a;this.y=g;this.w=b;this.h=f;this.parent=e;this.lvl=d;this.children=[];this.obj=null;create(a,g,b,f,true,c)}Box.prototype={divide:function(){var f=0,e=this.children.length,n=mc(e/2),d,k,h,g,m,j,c=[[],[]],a=[{},{}];if(!e){return}for(;f<e;f++){d=this.children[f];k=+(f>=n);c[k].push(d);if(d.x<a[k].x||!("x" in a[k])){a[k].x=d.x}if(d.y<a[k].y||!("y" in a[k])){a[k].y=d.y}if(d.x+d.w>a[k].x+a[k].w||!("w" in a[k])){a[k].w=d.w+d.x-a[k].x}if(d.y+d.h>a[k].y+a[k].h||!("h" in a[k])){a[k].h=d.h+d.y-a[k].y}}m=a[0];j=a[1];console.log(a);h=new Box(m.x,m.y,m.w,m.h,this,this.lvl+1,"green");h.children=c[0];g=new Box(j.x,j.y,j.w,j.h,this,this.lvl+1,"yellow");g.children=c[1];if(h.children.length>=MAX_OBJECTS&&h.lvl<MAX_SUB_DIVISIONS){h.divide()}if(g.children.length>=MAX_OBJECTS&&g.lvl<MAX_SUB_DIVISIONS){g.divide()}this.children=[h,g]},update:function(a,d,b,c){if(this.x>a){this.x=a}if(this.y>d){this.y=d}if(this.x+this.w<a+b){this.w=a+b-this.x}if(this.y+this.h<d+c){this.h=d+c-this.y}if(this.parent!==null){this.parent.update(a,d,b,c)}},get:function(a,g,c,e){var d=0,b=this.children.length,f;if(this.x<a+c&&this.x+this.w>a&&this.y<g+e&&this.h+this.y>g){if(!b){return this}for(;d<b;d++){f=this.children[d].get(a,g,c,e);if(f){return f}}}else{return false}},};