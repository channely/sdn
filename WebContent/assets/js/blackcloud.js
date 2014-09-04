var graph;
var nodes = {};
var groups = {};
var paths = {};
var timers = [];

$(function () {
  	graph = new Q.Graph('canvas');
  	graph.visibleFilter = function(d){return d.visible !== false;};
  	
  	updateBodySize();
	createToolBar();
	
	$.get("config/blackcloud.xml", function(xml){
		
		configNode(xml);
		
		configEdge(xml);
		
		configGroup(xml);
		
		configText(xml);
		
		configLabel(xml);
		configPath(xml);
		
		var node = nodes['blackcloud'];
		var x = 0, step = Math.PI/18;
		var timer = setTimeout(function MOVE(){
		    x += step;
		    x %= 2*Math.PI;
		    node.rotate = x;
		    timer = setTimeout(MOVE, 100);
		}, 0);
		
		timers.push(timer);

	});

	graphClickAction();
	
});
