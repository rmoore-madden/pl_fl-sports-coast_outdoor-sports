/**
 * v1.0 - Copyright 2018 Madden Media - All rights reserved.
 *
 * Content-specific layout functionality. These functions
 *    make many assumptions about content contained in the page.
 *
 * NOTE: Assumes that madden-content-frameworks-v1.0.js has been loaded and
 *    that the initial view types (mobile, tablet, etc.) have been defined.
 */

// mobile can call resize during scroll - we can cache width
//    and check if an actual resize happens
var _winWidth = 0;

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// STOCK EVENT FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////



//
// Called on document ready
//
contentOnReady = function () {
    // set the window width
    _winWidth = $(window).width();

    customAdjustLayout(true);

    // Recommended Reads links
    var relatedLinks = [
        { "title": "Dive into Your Next Adventures", "link": "https://flsportscoast.com/dive-into-your-next-adventure-on-floridas-sports-coast/" },
        { "title": "Fishing on Florida’s Sports Coast", "link": "https://flsportscoast.com/fishing-on-floridas-sports-coast/" },
        { "title": "5 Ways to Have a Safe Spring Break", "link": "https://flsportscoast.com/5-ways-to-plan-a-safe-spring-break-on-floridas-sports-coast/" }
    ];

    // footer links
    buildRelatedLinks(relatedLinks);

    // ipad pro will use large size, but needs backgrounds set to scroll, not fixed
    unFixBGImagesForIPads();

    customAdjustLayout(true);

	$("#navDE1").parallaxAnimateElement({
		frames: 13, startOffset: "10%", endOffset: "90%", elementClass: "artwork floatingElement"
	});	

	$("#navDE2").parallaxAnimateElement({
		frames: 13, startOffset: "20%", endOffset: "80%", elementClass: "artwork floatingElement"
	});	

	$("#navDE3").parallaxAnimateElement({
		frames: 13, startOffset: "20%", endOffset: "80%", elementClass: "artwork floatingElement"
	});	

	$("#navDE4").parallaxAnimateElement({
		frames: 13, startOffset: "20%", endOffset: "80%", elementClass: "artwork floatingElement"
	});	

	$("#hero1").parallaxAnimateElement({
		frames: 9, startOffset: "20%", endOffset: "80%", elementClass: "hero floatingElement"
	});	

	$("#hero2").parallaxAnimateElement({
		frames: 9, startOffset: "20%", endOffset: "80%", elementClass: "hero floatingElement"
	});	
	
	// story chooser
    $(".storyChooser").on("click", function (e) {
		let goto = $(this).data("goto");
        $("html, body").animate({
            scrollTop: ($("#" + goto).offset().top - ($(".top").height() * 1.25))
        }, 1000);
    });

}

//
// Called on document scroll
//
contentOnScroll = function () {
    $(".fadeIn").each(function() {
        if (getItemInViewport($(this))) $(this).removeClass("fadeIn");
    });

    moveWave($('.chapterNav'));
}

//
// Called on a touch move on mobile
//
contentOnTouchMove = function () { }

//
// Called on document resize
//
contentOnResize = function () {
    customAdjustLayout();
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// CUSTOM FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// The frameworks was given this function to handle setting chapter buttons
//    when the chapter is set
//
// chapterEl: The chapter link DOM element
// on: Is it being turned on? (true|false)
//
customChapterLinkAdjust = function (chapterEl, on) {
    $(chapterEl).attr("class", ((on) ? "navLink chapterLink noGA on" : "navLink chapterLink noGA"));
}

//
// Adjust this specific layout after a load or resize event
//
// isLoad: Is this being called by a load or resize event?
//
customAdjustLayout = function (isLoad) {

    var localNotJustTouchScroll = isLoad;

    equalizeElementHeightsToTallest($(".linkTitleWrapper"));

    // is it really a resize?
    if ($(window).width() != _winWidth) {
        // yes
        localNotJustTouchScroll = true;
        _winWidth = $(window).width();
    }

    if ( (localNotJustTouchScroll) || (isLoad) ) {
        // resize footer links to be equal height of the tallest one
        //equalizeRelatedLlinks();
    }
}


function moveWave(element) {
	var scrollTop     = $(window).scrollTop();
	var elementOffset = element.offset().top;
	var distance      = (elementOffset - scrollTop);
	var winHeight = $(window).height();
	var percentFromTop = distance / winHeight;

	if (percentFromTop < 1 && percentFromTop > 0) {
		var x = (percentFromTop * 100) / 2;
		element.find(".wave.wTop").css('transform', 'translateY(0) translateX(-'+x+'%)');
	}
}
