function createNode(name, x, y, image) {
	var node = graph.createNode(name, x, y);
	node.setStyle(Q.Styles.LABEL_FONT_SIZE, 16);
	node.setStyle(Q.Styles.LABEL_FONT_STYLE, "bold");
	if (image) {
		node.image = image;
	}

	return node;
}

function createGroup(name) {
	var group = graph.createGroup();
	if (name) {
		group.name = name;
	}
	group.groupImage = graphs.group_cloud;
	group.padding = 60;
	group.zIndex = -10;
	group.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_TOP);
	group.setStyle(Q.Styles.LABEL_POSITION, Q.Position.LEFT_MIDDLE);
	group.setStyle(Q.Styles.LABEL_ROTATE, Math.PI / 2);
	return group;
}

function createText(name, x, y, fontSize, color, parent) {
	var text = graph.createText(name, x, y);
	text.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
	text.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_MIDDLE);
	text.setStyle(Q.Styles.LABEL_FONT_SIZE, fontSize);
	text.setStyle(Q.Styles.LABEL_COLOR, color);
	text.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, null);
	if (parent) {
		parent.addChild(text);
	}
	return text;
}

function createEdge(a, b, color, arrow, dash) {
	var edge = graph.createEdge("", a, b);
	edge.setStyle(Q.Styles.EDGE_WIDTH, 1);
	edge.setStyle(Q.Styles.EDGE_COLOR, color);
	edge.setStyle(Q.Styles.ARROW_TO, arrow);
	if (dash) {
		edge.setStyle(Q.Styles.EDGE_LINE_DASH, [ 4, 4 ]);
		edge.setStyle(Q.Styles.ARROW_TO_LINE_DASH, [ 2, 1 ]);
	}
	return edge;
}

function createArrow(name, x, y, shape, color) {
	var arrow = graph.createNode(name, x, y);
	arrow.setStyle(Q.Styles.SHAPE_FILL_COLOR, color);
	arrow.image = Q.Shapes.getShape(shape, -10, -5, 30, 20);
	arrow.zIndex = 20;
	arrow.setStyle(Q.Styles.SHAPE_STROKE_STYLE, color);
	return arrow;
}

function createToolBar() {
	var content = "<div  id='toolbar' class='btn-toolbar'><div class='btn-group'>";
	content += "<div id='redcloud' class='btn btn-danger' type='button'><a href='redcloud.html'>红云</a></div>";
	content += "<div id='whitecloud' class='btn btn-default' type='button'><a href='whitecloud.html'>白云</a></div>";
	content += "<div id='blackcloud' class='btn btn-primary' style='color:#fff;background-color:#000' type='button'><a href='blackcloud.html'>黑云</a></div>";
	content += "</div></div>";
	var toolbar = $(content)[0];
	Q.css(toolbar, {
		position : "absolute",
		top : "0px",
		left : "50%"

	});
	graph.html.parentNode.appendChild(toolbar);
}

function updateBodySize() {
    document.body.style.width = window.innerWidth + "px";
    document.body.style.height = window.innerHeight + "px";
    if (graph) {
        graph.moveToCenter();
    }
}

function refreshController(){
    $.ajax({ 
    	url: "server.xml", 
    	success: function(xml){
    		var content = "<table class='table table-bordered table-hover'>";
    		content += "<thead><th>服务器</th><th>动态IP</th></thead>";
	    	$(xml).find("server").each(function(i){
    	    	var name = $(this).children("name").text();
    	    	var ip = $(this).children("ip").text();
    	    	  var rip1=parseInt(Math.random()*10000%255+1,10);
    	          var rip2=parseInt(Math.random()*10000%255+1,10);
    	          var rip3=parseInt(Math.random()*10000%255+1,10);
    	          var rip4=parseInt(Math.random()*10000%255+1,10);
    	    	ip = rip1 + "." + rip2 + "." + rip3 + "." + rip4;
    	    	
    	    	if(i%2){
    	    		content += "<tr>";
    	    	}else{
    	    		content += "<tr class='success'>";
    	    	}
    	    	
    	    	content += "<td>" + name + "</td><td>" +ip + "</td><tr>"; 
	    	});
	    	content += "</tbody></table>";
	    	$("#controller").empty().append(content);
    	}
    });			
}

function refreshRouter(){
    $.ajax({ 
    	url: "router.xml", 
    	success: function(xml){
    		var content = "<table class='table table-bordered table-hover'>";
    		content += "<thead><th>Ingress Port</th><th>Ether Source</th><th>Ether Dst</th><th>Ether Type</th><th>Vlan id</th>" +
    				"<th>Vlan Priority</th><th>IP src</th><th>IP dst</th><th>IP proto</th><th>IP ToS bits</th>" +
    				"<th>TCP/UDP Src Port</th><th>TCP/UDP Dst Port</th><th>Counter</th><th>Action</th></thead>";
    		content +=	"<tbody>";
	    	$(xml).find("row").each(function(i){
    	    	var ingressport = $(this).children("ingressport").text();
    	    	var ethersource = $(this).children("ethersource").text();
    	    	var etherdst = $(this).children("etherdst").text();
    	    	var ethertype = $(this).children("ethertype").text();
    	    	var vlanid = $(this).children("vlanid").text();
    	    	var vlanpriority = $(this).children("vlanpriority").text();
    	    	var ipsrc = $(this).children("ipsrc").text();
    	    	var ipdst = $(this).children("ipdst").text();
    	       	var ipproto = $(this).children("ipproto").text();
    	     	var iptosbits = $(this).children("iptosbits").text();
    	    	var srcport = $(this).children("srcport").text();
    	    	var dstport = $(this).children("dstport").text();
    	    	var counter = $(this).children("counter").text();
    	    	var action = $(this).children("action").text();
    	    	
    	    	  var rip1=parseInt(Math.random()*10000%255+1,10);
    	          var rip2=parseInt(Math.random()*10000%255+1,10);
    	          var rip3=parseInt(Math.random()*10000%255+1,10);
    	          var rip4=parseInt(Math.random()*10000%255+1,10);
    	          ipdst = rip1 + "." + rip2 + "." + rip3 + "." + rip4;
    	    	
    	    	if(i%2){
    	    		content += "<tr>";
    	    	}else{
    	    		content += "<tr class='success'>";
    	    	}
    	    	content += "<td>" + ingressport+ "</td><td>"+ethersource+"</td><td>"+etherdst+"</td><td>"+ethertype+"</td><td>"+vlanid+"</td><td>"
    	    	+vlanpriority+"</td><td>"+ipsrc+"</td><td>"+ipdst+"</td><td>"+ipproto+"</td><td>"+iptosbits+"</td><td>"+srcport+"</td><td>"+dstport
    	    	+"</td><td>"+counter+"</td><td>"+action+"</td></tr>"; 
	    	});
	    	content += "</tbody></table>";
	    	$("#switch").empty().append(content);
    	}
    });			
}