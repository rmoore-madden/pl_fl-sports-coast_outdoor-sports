// CAROUSEL SLIDESHOW

$(document).ready(function() {
	
	// prep the carousel
	if ( (! getIsTablet()) && (! getIsMobile()) ) {
		var carousel = $("#carousel");
		var panelCount = 5;
		var theta = 0;
		var showing = 1;
		var move = 1;

		// ie can't do the css3 schmancy - give them a lightbox slideshow instead
		if (customBrowserIsIE()) {
			$("#carouselWrapper").css("display", "none");
			$("#lightbox").css("display", "block");
			$("#lightbox").magnificPopup({
				items: [ 
					{ src: '//maddencdn.com/content/images/2015/omaha/nightlife/ch3-slideshow1-lg.jpg' },
					{ src: '//maddencdn.com/content/images/2015/omaha/nightlife/ch3-slideshow2-lg.jpg' },
					{ src: '//maddencdn.com/content/images/2015/omaha/nightlife/ch3-slideshow3-lg.jpg' },
					{ src: '//maddencdn.com/content/images/2015/omaha/nightlife/ch3-slideshow4-lg.jpg' },
					{ src: '//maddencdn.com/content/images/2015/omaha/nightlife/ch3-slideshow5-lg.jpg' }
				],
				gallery: {
					enabled: true
				},
				type: 'image'
			});
		} else {

			// start off with some styles
			customAdjustCarouselPanelStyles(showing);

			// nav listeners
			$(".carouselNav").bind("click touchstart", function (e) {
				// rotate the carousel
				var increment = (move * parseInt($(this).data("increment")));
				theta += ((360 / panelCount ) * increment * -1);
				carousel.css("transform", ("rotateY(" + theta + "deg)"));
				// which one are we on?
				showing += (move * increment);
				// at start or end?
				showing = (showing == 0) ? panelCount : showing;
				showing = (showing > panelCount) ? 1 : showing;
				// adjust panel styles
				customAdjustCarouselPanelStyles(showing);
			});	
		}
	} else {
		// time crunch - mobile will get lightbox :-/
		$("#lightbox").magnificPopup({
			items: [ 
				{ src: '//maddencdn.com/content/images/2015/omaha/nightlife/ch3-slideshow1-lg.jpg' },
				{ src: '//maddencdn.com/content/images/2015/omaha/nightlife/ch3-slideshow2-lg.jpg' },
				{ src: '//maddencdn.com/content/images/2015/omaha/nightlife/ch3-slideshow3-lg.jpg' },
				{ src: '//maddencdn.com/content/images/2015/omaha/nightlife/ch3-slideshow4-lg.jpg' },
				{ src: '//maddencdn.com/content/images/2015/omaha/nightlife/ch3-slideshow5-lg.jpg' }
			],
			gallery: {
				enabled: true
			},
			type: 'image'
		});
		
	}
	
	// adjust the layout
	customAdjustLayout(true);

	// add the complete class to the loader
	$('#loading').addClass('complete');
})