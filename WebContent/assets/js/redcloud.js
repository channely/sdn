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
	
	$.get("config/redcloud.xml", function(xml){
		
		configNode(xml);
		
		configEdge(xml);
		
		configGroup(xml);
		
		configText(xml);
		
		configLabel(xml);
		
		configPath(xml);
	});

	graphClickAction();
	
});
