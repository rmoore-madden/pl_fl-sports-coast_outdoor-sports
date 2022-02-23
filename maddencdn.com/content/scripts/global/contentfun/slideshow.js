// SLIDESHOW

customAdjustLayout = function (isLoad) {

	// reset?
	if (! getIsMobile()) {
		
		if (! isLoad) {
			// destroy
			$("#slideshow").cycle("destroy");
		}

		// restart
		$("#slideshow").cycle({
			slideExpr: "img.slideImage",
			fx: "fade",
			timeout: 4000,
			speed: 2000,
			prev: "#slideshowPrev",
			next: "#slideshowNext"
		});

		// adjust height of parent to images
		window.setTimeout(
			function(){
				if (parseInt($("#slideshow").css("height")) != $("#slideshow > img").outerHeight()) {
					$("#slideshow").css("height", $("#slideshow > img").outerHeight()).delay(1000);
				}
			}, 500
		);
	}
	
}
