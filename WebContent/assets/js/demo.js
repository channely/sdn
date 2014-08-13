function updateBodySize() {
    document.body.style.width = window.innerWidth + "px";
    document.body.style.height = window.innerHeight + "px";
    if (graph) {
        graph.moveToCenter();
    }
}
var graph;
$(function () {
    document.body.style.margin = "0px";
    document.body.style.overflow = "hidden";
    window.onresize = updateBodySize;
    updateBodySize();
  	graph = new Q.Graph('canvas');
  	graph.visibleFilter = function(d){return d.visible !== false;};
  	
	function createNode(name, x, y, image){
	    var node = graph.createNode(name, x, y);
	    node.setStyle(Q.Styles.LABEL_FONT_SIZE, 16);
	    node.setStyle(Q.Styles.LABEL_FONT_STYLE, "bold");
	    if(image){
	        node.image = image;
	    }

	    return node;
	}
	
	function createGroup(name){
		var group = graph.createGroup();
		if(name){
			group.name=name;
		}
		group.groupImage = graphs.group_cloud;
		group.padding = 60;
		group.zIndex = -10;
		group.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_TOP);
		group.setStyle(Q.Styles.LABEL_POSITION, Q.Position.LEFT_MIDDLE);
		group.setStyle(Q.Styles.LABEL_ROTATE, Math.PI / 2);
		return group;
	}
	
	function createText(name, x, y, fontSize, color, parent){
	    var text = graph.createText(name, x, y);
	    text.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
	    text.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
	    text.setStyle(Q.Styles.LABEL_FONT_SIZE, fontSize);
	    text.setStyle(Q.Styles.LABEL_COLOR, color);
	    text.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, null);
	    if(parent){
	        parent.addChild(text);
	    }
	    return text;
	}
	
	function createEdge(a, b, color, arrow, dash){
	    var edge = graph.createEdge("", a, b);
	    edge.setStyle(Q.Styles.EDGE_WIDTH, 1);
	    edge.setStyle(Q.Styles.EDGE_COLOR, color);
	    edge.setStyle(Q.Styles.ARROW_TO, arrow);
	    if(dash){
	    	edge.setStyle(Q.Styles.EDGE_LINE_DASH, [4, 4]);
	    	edge.setStyle(Q.Styles.ARROW_TO_LINE_DASH, [2, 1]);
	    }
	    return edge;
	}
	
	function createArrow( name, x, y, shape, color ){
		var arrow = graph.createNode(name, x, y);
		arrow.setStyle(Q.Styles.SHAPE_FILL_COLOR, color);
		arrow.image = Q.Shapes.getShape(shape, -10, -5, 30, 20);
		arrow.zIndex = 20;
		arrow.setStyle(Q.Styles.SHAPE_STROKE_STYLE, color);
		return arrow;
	}
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
			var visible = $(this).children("visible").text();
			var node = createNode(name, x, y, img);
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
			var html = $(this).html().trim();
			var contain = html.split(",");
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
