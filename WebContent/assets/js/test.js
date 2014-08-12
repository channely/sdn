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
  	
	function createNode(name, x, y, image, group){
	    var node = graph.createNode(name, x, y);
	    if(image){
	        node.image = image;
	    }
	    if(group){
	        group.addChild(node);
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
	
	function createEdge(a, b, color, noarrow, name){
	    var edge = graph.createEdge(name, a, b);
	    edge.setStyle(Q.Styles.EDGE_WIDTH, 1);
	    edge.setStyle(Q.Styles.EDGE_COLOR, color);
	    if(noarrow){
	    	 edge.setStyle(Q.Styles.ARROW_TO, false);
	    }
	    edge.setStyle(Q.Styles.EDGE_LINE_DASH, [2, 1]);
	    edge.setStyle(Q.Styles.ARROW_TO_LINE_DASH, [2, 1]);
	    return edge;
	}
	var VV = "?v="+ Q.randomInt(20);
	var controllerPNG = "assets/images/controller.png" + VV;
	var hubPNG = "assets/images/router.png" + VV;
	var serverPNG = "assets/images/server.png" + VV;
	var webPNG = "assets/images/web.png" + VV;
	var internetPNG = "assets/images/internet.png" + VV;
	createText("基于SDN的CloudWAF", -500, -450, 30, "#F00");
	
	var controller = createNode("Controller", -250, -300, controllerPNG);
	var hubGroup = createGroup("Date Plane");
	var hub1 = createNode("OpenFlow Switch", -350, -100, hubPNG, hubGroup);
	var hub2 = createNode("OpenFlow Switch", -200, -100, hubPNG, hubGroup);
	var hub3 = createNode("OpenFlow Switch", -350, 0, hubPNG, hubGroup);
	var hub4 = createNode("OpenFlow Switch", -200, 0, hubPNG, hubGroup);
	
	var edge1 = createEdge(controller, hub1, "#F00");
	var edge2 = createEdge(controller, hub2, "#F00");
	var edge3 = createEdge(controller, hub3, "#F00");
	var edge4 = createEdge(controller, hub4, "#F00");
	createEdge(hub1, hub2, "#2898E0", true);
	createEdge(hub1, hub3, "#2898E0", true);
	createEdge(hub1, hub4, "#2898E0", true);
	createEdge(hub2, hub3, "#2898E0", true);
	createEdge(hub2, hub4, "#2898E0", true);
	createEdge(hub3, hub4, "#2898E0", true);
	createText("OpenFlow protocal", -260, -150, 12, "#000", serverGroup);
	
	var internet = createNode("Internet", -700, -50, internetPNG);
	internet.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
	internet.setStyle(Q.Styles.LABEL_FONT_STYLE, "bold");
	
	var wafGroup = createGroup();
	var managerServer = createNode("管理节点", 150, -160, serverPNG, wafGroup);
	var storageServer = createNode("存储节点", 250, -160, serverPNG, wafGroup);
	var serverGroup = graph.createGroup();
	serverGroup.groupImage = graphs.group_cloud;
	serverGroup.setStyle(Q.Styles.RENDER_COLOR, "#5bc0de");
	serverGroup.padding = 20;
	wafGroup.addChild(serverGroup);
	var server1 = createNode("", 100, 0, serverPNG, serverGroup);
	var server2 = createNode("", 160, 0, serverPNG, serverGroup);
	var server3 = createNode("", 220, 0, serverPNG, serverGroup);
	var server4 = createNode("", 280, 0, serverPNG, serverGroup);
	createText("虚拟WAF", 200, 60, 14, "#000", serverGroup);
	
	var edge5 = createEdge(managerServer, serverGroup, "#58F");
	var edge6 = createEdge(storageServer, serverGroup, "#58F");
	
	var webGroup = createGroup();
	createNode("网站1", 600, -120, webPNG, webGroup);
	var web2 = createNode("网站2", 700, -120, webPNG, webGroup);
	var web3 = createNode("网站n-1", 600, 20, webPNG, webGroup);
	createNode("网站n", 700, 20, webPNG, webGroup);
	createText("……", 650, -50, 30, "#000", webGroup);

	var pathArray=new Array();
	var path1 = new Q.Path();
	path1.moveTo(internet.location.x, internet.location.y);
	path1.lineTo(hub1.location.x, hub1.location.y);
	path1.lineTo(controller.location.x, controller.location.y);
	path1.lineTo(hub2.location.x, hub2.location.y);
	path1.lineTo(server2.location.x, server2.location.y);
	path1.lineTo(web3.location.x, web3.location.y);
	path1.lineTo(server3.location.x, server3.location.y);
	path1.lineTo(hub4.location.x, hub4.location.y);
	path1.lineTo(internet.location.x, internet.location.y);
	path1.validate();
	pathArray.push(path1);
	
	var path2 = new Q.Path();
	path2.moveTo(internet.location.x, internet.location.y);
	path2.lineTo(hub3.location.x, hub3.location.y);
	path2.lineTo(controller.location.x, controller.location.y);
	path2.lineTo(hub4.location.x, hub4.location.y);
	path2.lineTo(server4.location.x, server4.location.y);
	path2.lineTo(web2.location.x, web2.location.y);
	path2.lineTo(server1.location.x, server1.location.y);
	path2.lineTo(hub1.location.x, hub1.location.y);
	path2.lineTo(internet.location.x, internet.location.y);
	path2.validate();
	pathArray.push(path2);

//	var line = graph.createNode(null, 0, 0);
//	line.setStyle(Q.Styles.SHAPE_STROKE, 1);
//	line.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#58F");
//	line.image = path2;
//	line.setStyle(Q.Styles.EDGE_WIDTH, 2);
//	line.zIndex = -5;
//	line.anchorPosition = null;
	
	var shapename = "arrow.7";
	var arrow = graph.createNode("HTTP Request", internet.location.x, internet.location.y);
	arrow.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#2898E0");
	arrow.image = Q.Shapes.getShape(shapename, -10, -5, 30, 20);
	arrow.zIndex = 20;

	var L = path1.length;
	var x = 0;
	var INTERVAL = 200;

	var timer1 = setTimeout(function MOVE(){
	    x += 10;
	    x %= L;
	    var p = path1.getLocation(x);
	    arrow.location = new Q.Point(p.x, p.y);
	    arrow.rotate = p.rotate;
	    timer1 = setTimeout(MOVE, INTERVAL);
	}, INTERVAL);
	
	var index = 0;
	var showLabel1 = 0;
    var timer2 = setTimeout(function MOVE(){
//	var timer2 = setInterval(function MOVE(){
	    index++;
	    index = index%20;
	    edge1.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.02 * (20 - index));
	    edge2.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.02 * (20 - index));
	    edge3.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.02 * (20 - index));
	    edge4.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.02 * (20 - index));
	    edge5.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.03 * (20 - index));
	    edge6.setStyle(Q.Styles.ARROW_TO_OFFSET, -0.3 -0.03 * (20 - index));
		if (showLabel1 % 2000 == 0) {
			wafGroup.removeUI(label);
		} else {
			wafGroup.addUI(label);
		}
		showLabel1 += 200;
        timer2 = setTimeout(MOVE, 150);
	}, 150);
	
	function destroy(){
	    clearTimeout(timer1);
	    clearTimeout(timer2);
	}
	
	var label = new Q.LabelUI();
	label.position = Q.Position.CENTER_TOP;
	label.anchorPosition = Q.Position.CENTER_BOTTOM;
	label.border = 1;
	label.data = "CloudWAF 正在防护您的网站";
	label.padding = new Q.Insets(12, 15);
	label.offsetY = -10;
	label.backgroundColor = "#D9EDF7";
	label.borderColor = "#D9EDF7";
	label.fontSize = 16;
	wafGroup.addUI(label);
	
//	var showLabel1 = true;
//	var timer = setInterval(function() {
//		if (showLabel1) {
//			wafGroup.removeUI(label);
//		} else {
//			wafGroup.addUI(label);
//		}
//		showLabel1 = !showLabel1;
//	}, 1000);
//	
//	function destroy(){
//	    clearTimeout(timer);
//	}
	
});
