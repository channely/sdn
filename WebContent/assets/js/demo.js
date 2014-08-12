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
	$.get("config.xml", function(xml){
		
		// create node
		$(xml).find("node").each(function(i){
			var id=$(this).attr("id");
			var name = $(this).children("name").text();
			var x = parseInt($(this).children("x").text(),10);
			var y = parseInt($(this).children("y").text(),10);
			var img = $(this).children("img").text();
			var router = createNode(name, x, y, img);
			nodes[id]=router;
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
		
		// create path
		$(xml).find("path").each(function(i){
			var id=$(this).attr("id");
			var route = $(this).children("route").text().trim().split(",");
			var path = new Q.Path();
			$.each(route, function(index, value){
				var node = nodes[value];
				if(index == 0){
					path.moveTo(node.location.x, node.location.y);
				}else{
					path.lineTo(node.location.x, node.location.y);
				}
			});
			paths[id] = path;
		});
	});
	
//	var controllerPNG = "assets/images/controller.png";
//	var hubPNG = "assets/images/router.png";
//	var firewallPNG = "assets/images/firewall.png";
//	var webPNG = "assets/images/web.png";
//	var mailPNG = "assets/images/mail.png";
//	var databasePNG = "assets/images/database.png";
//	var internetPNG = "assets/images/internet.png";
//	createText("CloudWAF Based on SDN", -500, -350, 30, "#000");
//	
//	var controller = createNode("Controller", 300, -350, controllerPNG);
//	var cloudGroup = createGroup("CloudWAF Based on SDN");
//	var hub1 = createNode("OpenFlow Switch 1", -400, 0, hubPNG, cloudGroup);
//	var hub2 = createNode("OpenFlow Switch 2", -200, 100, hubPNG, cloudGroup);
//	var hub3 = createNode("OpenFlow Switch 3", -50, 200, hubPNG, cloudGroup);
//	var hub4 = createNode("OpenFlow Switch 4", 200, 200, hubPNG, cloudGroup);
//	var hub5 = createNode("OpenFlow Switch 5", 350, 50, hubPNG, cloudGroup);
//	var hub6 = createNode("OpenFlow Switch 6", 0, -100, hubPNG, cloudGroup);
//	var hub7 = createNode("OpenFlow Switch 7", 200, -200, hubPNG, cloudGroup);
//	
//	createEdge(hub1, hub2, "#2898E0", true);
//	createEdge(hub2, hub3, "#2898E0", true);
//	createEdge(hub3, hub4, "#2898E0", true);
//	createEdge(hub4, hub5, "#2898E0", true);
//	createEdge(hub5, hub6, "#2898E0", true);
//	createEdge(hub6, hub7, "#2898E0", true);
//	createEdge(hub6, hub1, "#2898E0", true);
//	createEdge(hub2, hub6, "#2898E0", true);
//	createEdge(hub2, hub5, "#2898E0", true);
//	createEdge(hub3, hub5, "#2898E0", true);
//	createEdge(hub5, hub7, "#2898E0", true);
//	
//	var edge1 = createEdge(controller, hub1, "#FF6B6B", false, true);
//	var edge2 = createEdge(controller, hub2, "#FF6B6B", false, true);
//	var edge3 = createEdge(controller, hub3, "#FF6B6B", false, true);
//	var edge4 = createEdge(controller, hub4, "#FF6B6B", false, true);
//	var edge5 = createEdge(controller, hub5, "#FF6B6B", false, true);
//	var edge6 = createEdge(controller, hub6, "#FF6B6B", false, true);
//	var edge7 = createEdge(controller, hub7, "#FF6B6B", false, true);
//	
//	var internet1 = createNode("", -700, -150, internetPNG);
//	var internet2 = createNode("", -700, 0, internetPNG);
//	var internet3 = createNode("Internet", -700, 150, internetPNG);
//	createEdge(internet1, hub1, "#2898E0", true);
//	createEdge(internet2, hub1, "#2898E0", true);
//	createEdge(internet3, hub1, "#2898E0", true);
//	
//	var server1 = createNode("Firewall", -450, -150, firewallPNG, cloudGroup);
//	var server2 = createNode("IPS", -100, -200, firewallPNG, cloudGroup);
//	var server3 = createNode("Anti-DDoS", -350, 250, firewallPNG, cloudGroup);
//	var server4 = createNode("WAF", -150, 350, firewallPNG, cloudGroup);
//	var server5 = createNode("AV-FW", 300, 350, firewallPNG, cloudGroup);
//	
//	var webGroup = createGroup("");
//	var server6 = createNode("Web Server", 650, -180, webPNG, webGroup);
//	var server7 = createNode("Mail Server", 650, 0, mailPNG, webGroup);
//	var server8 = createNode("DB Server", 650, 180, databasePNG, webGroup);
//	
//	createEdge(hub1, server1, "#2898E0", true);
//	createEdge(hub6, server2, "#2898E0", true);
//	createEdge(hub2, server3, "#2898E0", true);
//	createEdge(hub3, server4, "#2898E0", true);
//	createEdge(hub4, server5, "#2898E0", true);
//	createEdge(hub5, server8, "#2898E0", true);
//	createEdge(hub5, server7, "#2898E0", true);
//	createEdge(hub7, server6, "#2898E0", true);
//	
//	var path1 = new Q.Path();
//	path1.moveTo(internet1.location.x, internet1.location.y);
//	path1.lineTo(hub1.location.x, hub1.location.y);
//	path1.lineTo(server1.location.x, server1.location.y);
//	path1.lineTo(hub1.location.x, hub1.location.y);
//	path1.lineTo(hub2.location.x, hub2.location.y);
//	path1.lineTo(server3.location.x, server3.location.y);
//	path1.lineTo(hub2.location.x, hub2.location.y);
//	path1.lineTo(hub6.location.x, hub6.location.y);
//	path1.lineTo(server2.location.x, server2.location.y);
//	path1.lineTo(hub6.location.x, hub6.location.y);
//	path1.lineTo(hub5.location.x, hub5.location.y);
//	path1.lineTo(server7.location.x, server7.location.y);
//	path1.lineTo(hub5.location.x, hub5.location.y);
//	path1.lineTo(hub6.location.x, hub6.location.y);
//	path1.lineTo(hub1.location.x, hub1.location.y);
//	path1.lineTo(internet1.location.x, internet1.location.y);
//	path1.validate();
//	
//	var path2 = new Q.Path();
//	path2.moveTo(internet2.location.x, internet2.location.y);
//	path2.lineTo(hub1.location.x, hub1.location.y);
//	path2.lineTo(server1.location.x, server1.location.y);
//	path2.lineTo(hub1.location.x, hub1.location.y);
//	path2.lineTo(hub6.location.x, hub6.location.y);
//	path2.lineTo(server2.location.x, server2.location.y);
//	path2.lineTo(hub6.location.x, hub6.location.y);
//	path2.lineTo(hub7.location.x, hub7.location.y);
//	path2.lineTo(server6.location.x, server6.location.y);
//	path2.lineTo(hub7.location.x, hub7.location.y);
//	path2.lineTo(hub6.location.x, hub6.location.y);
//	path2.lineTo(hub2.location.x, hub2.location.y);
//	path2.lineTo(hub1.location.x, hub1.location.y);
//	path2.lineTo(internet2.location.x, internet2.location.y);
//	path2.validate();
//
//	var path3 = new Q.Path();
//	path3.moveTo(internet3.location.x, internet3.location.y);
//	path3.lineTo(hub1.location.x, hub1.location.y);
//	path3.lineTo(server1.location.x, server1.location.y);
//	path3.lineTo(hub1.location.x, hub1.location.y);
//	path3.lineTo(hub2.location.x, hub2.location.y);
//	path3.lineTo(server3.location.x, server3.location.y);
//	path3.lineTo(hub2.location.x, hub2.location.y);
//	path3.lineTo(hub3.location.x, hub3.location.y);
//	path3.lineTo(server4.location.x, server4.location.y);
//	path3.lineTo(hub3.location.x, hub3.location.y);
//	path3.lineTo(hub4.location.x, hub4.location.y);
//	path3.lineTo(server5.location.x, server5.location.y);
//	path3.lineTo(hub4.location.x, hub4.location.y);
//	path3.lineTo(hub5.location.x, hub5.location.y);
//	path3.lineTo(server8.location.x, server8.location.y);
//	path3.lineTo(hub5.location.x, hub5.location.y);
//	path3.lineTo(hub4.location.x, hub4.location.y);
//	path3.lineTo(hub3.location.x, hub3.location.y);
//	path3.lineTo(hub2.location.x, hub2.location.y);
//	path3.lineTo(hub1.location.x, hub1.location.y);
//	path3.lineTo(internet3.location.x, internet3.location.y);
//	path3.validate();
//	
//	setTimeout(function (){
//		server6.visible = false;
//		server6.invalidateVisibility();
//		server7.visible = false;
//		server7.invalidateVisibility();
//		server8.visible = false;
//		server8.invalidateVisibility();
//		graph.invalidate();
//	}, 0);
//	
//	var shapename = "arrow.7";
//	var arrow1 = createArrow( "", internet1.location.x, internet1.location.y, shapename, "#4ECDC4");
//	
//	var step = 40;
//	var step1 = step/2;
//	var L1 = path1.length;
//	var x1 = 0;
//	var timer1 = setTimeout(function MOVE(){
//	    x1 += step;
//	    x1 %= L1;
//	    var p = path1.getLocation(x1);
//	    if(Math.abs(p.x - hub5.location.x) < step1){
//	    	server7.visible = server7.visible === false;
//	    	server7.invalidateVisibility();
//	    	graph.invalidate();
//	    }else if(Math.abs(p.x - internet1.location.x) < step1){
//	    	x1 = 0;
//	    }
//	    arrow1.location = new Q.Point(p.x, p.y);
//	    arrow1.rotate = p.rotate;
//	    timer1 = setTimeout(MOVE, 200);
//	}, 200);
//	
//	var arrow2;
//	setTimeout(function MOVE(){
//		arrow2 = createArrow( "", internet2.location.x, internet2.location.y, shapename, "#4ECDC4");
//	}, 20000);
//	
//	var L2 = path2.length;
//	var x2 = 0;
//	var timer2 = setTimeout(function MOVE(){
//	    x2 += step;
//	    x2 %= L2;
//	    var p = path2.getLocation(x2);
//	    if(Math.abs(p.x - hub7.location.x) < step1){
//	    	server6.visible = server6.visible === false;
//	    	server6.invalidateVisibility();
//	    	graph.invalidate();
//	    }else if(Math.abs(p.x - internet2.location.x) < step1){
//	    	x2 = 0;
//	    }
//	    arrow2.location = new Q.Point(p.x, p.y);
//	    arrow2.rotate = p.rotate;
//	    timer2 = setTimeout(MOVE, 200);
//	}, 20000);
//	
//	var arrow3;
//	setTimeout(function MOVE(){
//		arrow3 = createArrow( "", internet3.location.x, internet3.location.y, shapename, "#4ECDC4");
//	}, 5000);
//	
//	var L3 = path3.length;
//	var x3 = 0;
//	var timer3 = setTimeout(function MOVE(){
//	    x3 += step;
//	    x3 %= L3;
//	    var p = path3.getLocation(x3);
//	    if(Math.abs(p.x - hub5.location.x) < 16){
//	    //	console.log(Math.abs(p.x - hub5.location.x) + " " + p.x+" " +p.y +" " +hub5.location.x + " "+hub5.location.y);
//	    	server8.visible = server8.visible === false;
//	    	server8.invalidateVisibility();
//	    	graph.invalidate();
//	    }else if(Math.abs(p.x - internet3.location.x) < step1){
//	    	x3 = 0;
//	    }
//	    arrow3.location = new Q.Point(p.x, p.y);
//	    arrow3.rotate = p.rotate;
//	    timer3 = setTimeout(MOVE, 200);
//	}, 5000);
//	
//	var index = 0;
//	var showLabel1 = 0;
//    var timer = setTimeout(function MOVE(){
//	    index++;
//	    index = index%20;
//	    edge1.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.02 * (20 - index));
//	    edge2.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.02 * (20 - index));
//	    edge3.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.02 * (20 - index));
//	    edge4.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.02 * (20 - index));
//	    edge5.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.03 * (20 - index));
//	    edge6.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.03 * (20 - index));
//	    edge7.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.03 * (20 - index));
//		if (showLabel1 % 4000 == 0) {
//			cloudGroup.removeUI(label);
//		} else {
//			cloudGroup.addUI(label);
//		}
//		showLabel1 += 200;
//        timer = setTimeout(MOVE, 150);
//	}, 150);
//	
//	function destroy(){
//	    clearTimeout(timer1);
//	    clearTimeout(timer2);
//	    clearTimeout(timer3);
//	    clearTimeout(timer);
//	}
//	
//	var label = new Q.LabelUI();
//	label.position = Q.Position.CENTER_TOP;
//	label.anchorPosition = Q.Position.CENTER_BOTTOM;
//	label.border = 1;
//	label.data = "Controller send Flow Table to OpenFlow Switchs";
//	label.padding = new Q.Insets(12, 15);
//	label.offsetY = -10;
//	label.backgroundColor = "#D9EDF7";
//	label.borderColor = "#D9EDF7";
//	label.fontSize = 16;
//	cloudGroup.addUI(label);
	
});
