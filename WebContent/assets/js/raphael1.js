$(function () {
	var paper = Raphael("canvas", 500, 500);

	var testpath = paper.path('M100 100L190 190');

	var a = paper.rect(0,0,10,10);
	a.attr('fill', 'silver');

	a.mousedown( function() {

	  var temp = testpath.clone();
	  temp.translate(400,0);
	  testpath.animate({path: temp.attr('path')}, 1000);
	  temp.remove();

	});
});