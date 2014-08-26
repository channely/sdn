$(function () {
	
	function makeLine(coords) {
		return new fabric.Line(coords, {
			fill : 'red',
			stroke : 'red',
			strokeWidth : 5,
			selectable : false
		});
	}

	 
	var canvas = new fabric.Canvas('canvas', {
		backgroundColor: '#ccc',
		width: window.innerWidth,
		height: window.innerHeight
		
	});
	var controller = null;
	new fabric.Image.fromURL('assets/images/controller.png', function(oImg) {
		  controller = oImg;
		  canvas.add(oImg);
	},{
		width: 128,
		height: 160,
		left: 1000,
		top: 50
	});
	var router = null;
	new fabric.Image.fromURL('assets/images/router.png', function(oImg) {
		router = oImg;
		  canvas.add(oImg);
	},{
		width: 80,
		height: 64,
		left: 900,
		top: 300
	});
	var line = makeLine([controller.left, controller.top, router.left, router.top]);
	//var line = makeLine([ 1000,  50, 900,300 ]);
	canvas.add(line);
});