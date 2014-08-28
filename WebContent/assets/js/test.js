$(function () {
    var graph = new Q.Graph('canvas');

    var node1 = graph.createNode("001", -230, -150);
    var node2 = graph.createNode("002", 200, -150);
    var node3 = graph.createNode("003", 0, 0);
    
    graph.createEdge("", node1, node2);
    graph.createEdge("", node2, node3);
    graph.createEdge("", node1, node3);

    var path = new Q.Path();
    path.moveTo(node1.location.x, node1.location.y);
    path.lineTo(node2.location.x, node2.location.y);
    path.lineTo(node3.location.x, node3.location.y);
    path.lineTo(node1.location.x, node1.location.y);
    path.validate();
    
    var arrow =  graph.createNode("",node1.location.x, node1.location.y);
    arrow.image = Q.Shapes.getShape("arrow.7", -10, -5, 30, 20);
    var L = path.length;
    var step = 40;
    var x = 0;
	var timer = setTimeout(function MOVE(){
	    x += step;
	    x %= L;
	    var p = path.getLocation(x);
	    arrow.location = new Q.Point(p.x, p.y);
	    arrow.rotate = p.rotate;
	    timer = setTimeout(MOVE, 200);
	}, 0);
});
