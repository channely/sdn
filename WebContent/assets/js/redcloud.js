var graph;
$(function () {
    document.body.style.margin = "0px";
    document.body.style.overflow = "hidden";
    window.onresize = updateBodySize;
    updateBodySize();
    
  	graph = new Q.Graph('canvas');
  	graph.visibleFilter = function(d){return d.visible !== false;};
  	
	createToolBar();
	var nodes = {};
	var edges = {};
	var groups = {};
	var paths = {};
	var timers = [];
	$.get("config.xml", function(xml){
		
		// create node
		$(xml).find("node").each(function(i){
			var id=$(this).attr("id");
			var name = $(this).children("name").text();
			var x = parseInt($(this).children("x").text(),10);
			var y = parseInt($(this).children("y").text(),10);
			var img = $(this).children("img").text();
			var type = $(this).children("type").text();
			var visible = $(this).children("visible").text();
			var node = createNode(name, x, y, img);
			node.type = type;
			if(visible == "false"){
				setTimeout(function (){
					node.visible = false;
					node.invalidateVisibility();
					graph.invalidate();
				}, 0);
			}
			nodes[id]=node;
		});
		
		// create edge
		$(xml).find("edge").each(function(i){
			var id=$(this).attr("id");
			var start = nodes[$(this).children("start").text()];
			var end = nodes[$(this).children("end").text()];
			var color = $(this).children("color").text();
			var arrow = $(this).children("arrow").text() == "true" ? true: false;
			var dash = $(this).children("dash").text() == "true" ? true: false;
			var edge = createEdge(start, end, color, arrow, dash);
			if(id != undefined){
				edges[id] = edge;
			}
		});
		
		// create group
		$(xml).find("group").each(function(i){
			var id=$(this).attr("id");
			var html = $(this).children("contain").text();
			var contain = html.toString().split(",");
			var group = createGroup("");
			$.each(contain, function(index, value){
				var node = nodes[value];
				group.addChild(node);
			});
			groups[id] = group;
		});
		
		// create text
		$(xml).find("text").each(function(i){
			var name = $(this).children("name").text();
			var x = parseInt($(this).children("x").text(),10);
			var y = parseInt($(this).children("y").text(),10);
			var fontSize = parseInt($(this).children("fontSize").text(),10);
			var color = $(this).children("color").text();
			createText(name, x, y, fontSize, color);
		});
		
		// create label
		$(xml).find("label").each(function(i){
			var data = $(this).children("data").text();
			var color = $(this).children("color").text();
			var group = groups[$(this).children("belong").text()];
			var fontSize = parseInt($(this).children("fontSize").text(),10);
			var interval = parseInt($(this).children("interval").text(),10);
			
			var label = new Q.LabelUI();
			label.position = Q.Position.CENTER_TOP;
			label.anchorPosition = Q.Position.CENTER_BOTTOM;
			label.border = 1;
			label.data = data;
			label.padding = new Q.Insets(12, 15);
			label.offsetY = -10;
			label.backgroundColor = color;
			label.borderColor = color;
			label.fontSize = fontSize;
			group.addUI(label);
			
			var showLabel = 0;
		    var timer = setTimeout(function MOVE(){
				if (showLabel % interval == 0) {
					group.removeUI(label);
				} else {
					group.addUI(label);
				}
				showLabel += 200;
				
		        timer = setTimeout(MOVE, 200);
			}, 200);
		    timers.push(timer);
		});
		
		// create path
		$(xml).find("path").each(function(i){
			var id=$(this).attr("id");
			var route = $(this).children("route").text().trim().split(",");
			var start = parseInt($(this).children("start").text(),10);
			var step = parseInt($(this).children("step").text(),10);
			var router = nodes[$(this).children("router").text()];
			var server = nodes[$(this).children("server").text()];
			var threshold = $(this).children("threshold").text();
			var path = new Q.Path();
			var arrow;
			var startnode = null;
			$.each(route, function(index, value){
				var node = nodes[value];
				if(index == 0){
					startnode = node;
					path.moveTo(node.location.x, node.location.y);
					setTimeout(function MOVE(){
						arrow = createArrow( "", node.location.x, node.location.y, "arrow.7", "#4ECDC4");
					}, start);
				}else{
					path.lineTo(node.location.x, node.location.y);
				}
			});
			path.validate();
			paths[id] = path;

			var L = path.length;
			if( threshold == "" ){
				threshold = step / 2;
			}else{
				threshold = parseInt(threshold, 10);
			}
			var x = 0;
			var timer = setTimeout(function MOVE(){
			    x += step;
			    x %= L;
			    var p = path.getLocation(x);
			    if(Math.abs(p.x - router.location.x) < threshold){
			    	server.visible = server.visible === false;
			    	server.invalidateVisibility();
			    	graph.invalidate();
			    }else if(Math.abs(p.x - startnode.location.x) < threshold){
			    	x = 0;
			    }
			    arrow.location = new Q.Point(p.x, p.y);
			    arrow.rotate = p.rotate;
			    timer = setTimeout(MOVE, 200);
			}, start);
			
			timers.push(timer);
		});
	});

	graph.onclick = function(evt){
		var node = evt.getData();
		if( node == undefined || node == null) return;
		var type = node.type;
		console.log(type);
	    if(type == "controller"){
	    	setTimeout(refreshController, 0);
	    	var controllerTimer = setInterval(refreshController, 1000);
	    	
		    bootbox.dialog({
		    	title: "<h2>Server</h2>",
		    	message: "<div id='controller'></div>",
		    	buttons: {
		    		main: {
		    			label: "关闭",
			    		className: "btn-success",
			    	    callback: function() {
					    	clearTimeout(controllerTimer);
					    	return true;
					    }
			    	}
		    	}
		   });
	    	
	    }else if(type == "router"){
	    	setTimeout(refreshRouter, 0);
	    	var routerTimer = setInterval(refreshRouter, 1000);
	    	
		    bootbox.dialog({
		    	title: "<h2>Flow Table</h2>",
		    	message: "<div id='switch'></div>",
		    	buttons: {
		    		main: {
		    			label: "关闭",
			    		className: "btn-success",
			    	    callback: function() {
					    	clearTimeout(routerTimer);
					    	return true;
					    }
			    	}
		    	}
		   }).find("div.modal-dialog").addClass("largeWidth");
		    
	    }
	};

	var index = 0;
    var timer = setTimeout(function MOVE(){
	    index++;
	    index = index%20;
	    $.each(edges,function(name, edge) { 
	    	edge.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.02 * (20 - index));
	    });

        timer = setTimeout(MOVE, 200);
	}, 200);
    timers.push(timer);

	function destroy(){
		for(var timer in timers){
			 clearTimeout(timer);
		}
	}	
});
