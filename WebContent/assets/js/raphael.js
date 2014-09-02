Raphael.fn.connection = function (obj1, obj2, color, dashed) {
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        x1 = bb1.x + bb1.width/2,
        y1 = bb1.y + bb1.height/2,
        x2 = bb2.x + bb2.width/2,
        y2 = bb2.y + bb2.height/2;
    var attrs = null;
    if(dashed){
    	attrs = { stroke: color, "stroke-dasharray": "- "};
    }else{
    	attrs = { stroke: color };
    }
    var c = this.path("M"+x1+" "+y1+"L"+x2+" "+y2).attr(attrs);
    c.toBack();
    return c;
};

Raphael.fn.label = function (x, y, text, fontSize, color) {
	var label = this.text(x, y, text);
	label.attr({
		"font-size": fontSize,
		"fill" : color
	});
	function hide() {
		label.hide();
		setTimeout(show, 1000);
	}
		 
	function show() {
		label.show();
		setTimeout(hide, 1000);
	}
		 
	setTimeout(hide, 1000);

    return label;
};

Raphael.fn.node = function (image, x, y, width, height, text) {
	var node = this.image(image, x, y, width, height);
	
	if(text){
		var tx = x + width/2;
		var ty = y + height + 10;
		var tt = this.text(tx, ty, text).attr({"font-size": 16});
		node.text = tt;
	}
    return node;
};

Raphael.fn.line = function (node1, node2, color, dashed) {
	var line = this.connection(node1, node2, color, dashed);
	var box1 = node1.getBBox(),
	box2= node2.getBBox(),
	x1 = box1.x + box1.width/2,
	y1 = box1.y + box1.height/2,
	x2 = box2.x + box2.width/2,
	y2 = box2.y + box2.height/2;
	var angle = Raphael.angle(x2, y2, x1, y1);
	var len = line.getTotalLength();
	
	function run(paper) {
		var arrow = paper.path(["M", x1, y1] + "l-8,-8 8,8 -8,8").attr({fill: "none", stroke: color});
		arrow.transform("r" + angle);
		var path = arrow.attr("path");
		var _forwardPath = Raphael.transformPath(path+"", 'T'+len+',0');
		arrow.animate({path: _forwardPath}, len*10, function(){
			arrow.remove();
			run(paper);
		});
	}
	
	run(this);
    return line;
};

Raphael.fn.http = function (node1, node2, color) {
	var box1 = node1.getBBox(),
	box2= node2.getBBox(),
	x1 = box1.x + box1.width/2,
	y1 = box1.y + box1.height/2,
	x2 = box2.x + box2.width/2,
	y2 = box2.y + box2.height/2;
	var arrow = this.path(["M", x1, y1] + "m0,-4l-10,0,0,8,10,0,0,4,16,-8,-16,-8,4,0z").attr({fill: color, stroke: "none", "stroke-dasharray": "-"});
	var angle = Raphael.angle(x2, y2, x1, y1);
	arrow.transform("r" + angle);
    return arrow;
};

Raphael.fn.cloud = function (nodes) {
	if(nodes == undefined ) return;
	var box1 = nodes[0].getBBox();
	var minX = box1.x,
	minY = box1.y,
	maxX = box1.x + box1.width,
	maxY = box1.y + box1.height;

	$.each(nodes, function(index, node) { 
		var box = node.getBBox();
		if(box.x < minX){
			minX = box.x;
		}
		if(box.y < minY){
			minY = box.y;
		}
		if(box.x + box.width > maxX){
			maxX = box.x + box.width;
		}
		
		if(box.y + box.height > maxY){
			maxY = box.y + box.height;
		}
	}); 
	var x = (minX + maxX)/2;
	var y = (minY + maxY)/2;
	var width = maxX - minX;
	var height = maxY - minY;
	
	
	var cloud = this.ellipse(x,y,width/2,height/2).attr({fill: "#fff", stroke: "#666",  "stroke-width": 6});
	cloud.toBack();
	return cloud;
};

function updateBodySize() {
    document.body.style.width = window.innerWidth + "px";
    document.body.style.height = window.innerHeight + "px";
}

$(function () {
    document.body.style.margin = "0px";
    document.body.style.overflow = "hidden";
    window.onresize = updateBodySize;
    updateBodySize();
    
	var paper = Raphael("canvas",  window.innerWidth, window.innerHeight);
	var controller = paper.node("assets/images/controller.png", 1100, 50, 120, 160, "Controller");
	
	var router1 = paper.node("assets/images/router.png", 400, 500, 84, 64, "OpenFlow Switch 1");
	var router2 = paper.node("assets/images/router.png", 600, 600, 84, 64, "OpenFlow Switch 2");
	var router3 = paper.node("assets/images/router.png", 750, 700, 84, 64, "OpenFlow Switch 3");
	var router4 = paper.node("assets/images/router.png", 1000, 700, 84, 64, "OpenFlow Switch 4");
	var router5 = paper.node("assets/images/router.png", 1200, 500, 84, 64, "OpenFlow Switch 5");
	var router6 = paper.node("assets/images/router.png", 750, 400, 84, 64, "OpenFlow Switch 6");
	var router7 = paper.node("assets/images/router.png", 1000, 300, 84, 64, "OpenFlow Switch 7");
	
	paper.line(controller, router1, "#f00", true);
	paper.line(controller, router2, "#f00", true);
	paper.line(controller, router3, "#f00", true);
	paper.line(controller, router4, "#f00", true);
	paper.line(controller, router5, "#f00", true);
	paper.line(controller, router6, "#f00", true);
	paper.line(controller, router7, "#f00", true);
	
	var firewall1 = paper.node("assets/images/firewall.png", 300, 300, 100, 150, "Firewall");
	var firewall2 = paper.node("assets/images/firewall.png", 450, 650, 100, 150, "Anti-DDoS");
	var firewall3 = paper.node("assets/images/firewall.png", 600, 750, 100, 150, "WAF");
	var firewall4 = paper.node("assets/images/firewall.png", 1100, 750, 100, 150, "AV-FW");
	var firewall5 = paper.node("assets/images/firewall.png", 650, 200, 100, 150, "IPS");

	paper.connection(firewall1, router1, "#2898E0");
	paper.connection(firewall2, router2, "#2898E0");
	paper.connection(firewall3, router3, "#2898E0");
	paper.connection(firewall4, router4, "#2898E0");
	paper.connection(firewall5, router6, "#2898E0");
	
	paper.connection(router1, router2, "#2898E0");
	paper.connection(router2, router3, "#2898E0");
	paper.connection(router3, router4, "#2898E0");
	paper.connection(router4, router5, "#2898E0");
	paper.connection(router5, router6, "#2898E0");
	paper.connection(router6, router7, "#2898E0");
	paper.connection(router7, router5, "#2898E0");
	paper.connection(router1, router6, "#2898E0");
	paper.connection(router2, router6, "#2898E0");
	paper.connection(router2, router5, "#2898E0");
	paper.connection(router3, router5, "#2898E0");
	
	var internet1 = paper.node("assets/images/internet.png", 100, 300, 128, 128);
	var internet2 = paper.node("assets/images/internet.png", 100, 500, 128, 128);
	var internet3 = paper.node("assets/images/internet.png", 100, 700, 128, 128);
	
	paper.connection(router1, internet1, "#2898E0");
	paper.connection(router1, internet2, "#2898E0");
	paper.connection(router1, internet3, "#2898E0");
	
	var server1 = paper.node("assets/images/web.png", 1400, 300, 128, 150, "Web Server");
	var server2 = paper.node("assets/images/mail.png", 1400, 500, 128, 128, "Mail Server");
	var server3 = paper.node("assets/images/ftp.png", 1400, 700, 128, 128, "FTP Server");
	
	paper.connection(router7, server1, "#2898E0");
	paper.connection(router5, server2, "#2898E0");
	paper.connection(router5, server3, "#2898E0");
	
	paper.cloud([firewall1, firewall2, firewall3, firewall4, firewall5, router5]);
	paper.cloud([server1, server2, server3]);
	
	paper.label(800, 150, "Controller send Flow Table to OpenFlow Switchs", 24, "#2898E0");
	
	paper.text(300, 100, "CloudWAF based on SDN").attr({
		"font-size": 36
	});
});