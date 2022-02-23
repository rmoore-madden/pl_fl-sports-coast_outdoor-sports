// CLICKABLE MAP

var MAP_DATA = [
	{ "key": "dd", "img": "desert-dome-active.png" },
	{ "key": "kn", "img": "kingdoms-of-the-night-active.png" },
	{ "key": "bi", "img": "butterfly-insect-pavilion-active.png" },
	{ "key": "aq", "img": "aquarium-active.png" },
	{ "key": "lj", "img": "lied-jungle-active.png" },
	{ "key": "em", "img": "expedition-madagascar-active.png" },
	{ "key": "db", "img": "durhams-bear-canyon-active.png" },
	{ "key": "rb", "img": "red-barn-park-active.png" },
	{ "key": "li", "img": "lozier-IMAX-theater-active.png" },
	{ "key": "sl", "img": "sea-lion-pavilion-active.png" },
	{ "key": "cc", "img": "cat-complex-active.png" },
	{ "key": "sb", "img": "stingray-beach-active.png" },
	{ "key": "gv", "img": "gorilla-valley-active.png" },
	{ "key": "of", "img": "orangutan-forest-active.png" },
	{ "key": "wk", "img": "wild-kingdom-pavilion-active.png" },
	{ "key": "sa", "img": "simmons-aviary-active.png" }
];

// track the mouse
// var mapMouseX;
// var mapMouseY;

contentOnReady = function () {

	if (! getIsMobile()) {
		// hide map meta if mouse leaves it after triggered
		$("#MapOverlay").bind("click", function(e){ 
			$(this).css("display", "none");
		});
		// responsively-sized image map
		$("#Map[usemap]").rwdImageMaps();	

		// $("#Map").bind("mousemove", function(e){ 
		// 	mapMouseX = e.pageX;
		// 	mapMouseY = e.pageY; 
		// });
	} else { 
		// make map pinch-zoomable for mobile
		// loop? sure.
		$("#MapWrap").each(function () {
			new RTP.PinchZoom($(this), {});
		});
	}

}


//
// Custom map meta show/hide
//
// meta: The meta data item to show
//
toggleMapMeta = function (meta) {

	// which data?
	for (var md in MAP_DATA) {
		if (MAP_DATA[md]["key"] == meta) {
			img = ("//maddencdn.com/content/images/2015/omaha/animal_adventures/map_pinpoints/" + MAP_DATA[md]["img"]);
			$("#MapOverlay").attr("src", img);
			$("#MapOverlay").css("display", "block");
			break;
		}
	}
}