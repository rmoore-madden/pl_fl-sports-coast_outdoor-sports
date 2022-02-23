/**
 *
 ********************************************************************
 *
 * DEPRECATED - USE V1.2 INSTEAD
 *
 ********************************************************************* 
 *
 * v1.0 - Copyright 2014 Madden Media - All rights reserved.
 *
 * Global frameworks functions for all content - nothing in this file should be
 *	specific to a given layout outside of known and expected items - this incldues:
 *
 * Layout types: #isMobile, #isTablet, #doParallax - CSS sets based on medium
 * Chapters: DOM elements with an ID pattern of "c[CHAPTER]" - i.e. "c1"
 * Chapter links: Link DOM elements with a "chapterLink" class and a hash HREF - for
 *				  example, <a id="c1Link" class="chapterLink" href="#1">
 */

// just logging this to console for developers to see
if (typeof console != "undefined") { console.log("%c NOTICE: madden-content-frameworks-v1.0.js is deprecated - please use the latest version.", "background:orange; color:black"); }

// sticky top bar variables
var _stickyTopBarHeight = 0;
var _stickyTopBarOffset = 0;
var _stickyTopBarProgressBarEl = "";

// chapter data
var _chapterTops = new Array();
var _onChapter = 0;
var _setChapterLinkCallback;

// for layout
var mobileTestEl = "#isMobile";
var tabletTestEl = "#isTablet";
var parallaxTestEl = "#doParallax";
var _isResponsive = document.addEventListener;
var _isMobile = false;
var _isTablet = false;
var _doParallax = false;

// locked content uses this for tracking
var _lockedContentStatuses = new Array();

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// STOCK EVENT FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Called on ready
//
// customChapterLinkCallback: The function that will be called when a chapter link
//	needs to be adjusted (this frameworks cannot assume what will happen)
// readMoreEls: The DOM element(s) (ID or classes) of a "read more" button (if present)
//
frameworksOnReady = function (customChapterLinkCallback, readMoreEls) {
	// figure out mobile, tablet, desktop, parallax
	initViewTypes();				
	// init layout
	initLayout("#topBar", readMoreEls, customChapterLinkCallback);
}

//
// Called on scroll
//
frameworksOnScroll = function () {
	// adjust the scroll bar progress
	adjustScrollProgress();
}

//
// Called on resize
//
frameworksOnResize = function () {
	// adjust the layout
	adjustLayoutAfterResize();
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// LAYOUT PREP
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Figure out at the core what all we're doing
//
initViewTypes = function () {
	_isMobile = ( ($(mobileTestEl).length != 0) && ($(mobileTestEl).css("float") != "none") ) ? true : false;
	_isTablet = ( ($(tabletTestEl).length != 0) && ($(tabletTestEl).css("float") != "none") ) ? true : false;
	_doParallax = ( ($(parallaxTestEl).length != 0) && ($(parallaxTestEl).css("float") != "none") ) ? true : false;
}

//
// Initializes the layout for the content. This tests for a few HTML5 data attributes
//	for offsets related to read more jumps and a sticky nav bar height
//
// topBarEl: The DOM element (ID or class) of a sticky top bar (if present)
// readMoreEls: The DOM element(s) (ID or classes) of a "read more" button (if present)
// customChapterLinkCallback: When this frameworks sets the chapter, it needs to call
//							  back out to the main content to have that parent manage
//							  what happens to chapter links. It's assumed that the 
//							  function will take a true|false param for on|off status.
//
initLayout = function (topBarEl, readMoreEls, customChapterLinkCallback) {

	// store this for later
	_setChapterLinkCallback = customChapterLinkCallback;
	
	// if we're not in responsive mode, find and load all images that are for the
	//	non-responsive layout and set their sources from their data attributes (if
	//	they have that - some images are used in both designs)
	if (! _isResponsive) {
		$(".nonResImage").each(function() {  
			if ($(this).data("src") != undefined) {
				// swap in the source
				$(this).attr("src", $(this).data("src"));
			}
		});
		
		// MAY EXIT THIS BLOCK
		return;
	}
	
	// is there a top bar? if so, note the height
	if (topBarEl != undefined) {
		_stickyTopBarHeight = $(topBarEl).height();
		// see if there is an offset el to find
		if ( ($(topBarEl).data("offset-el") != undefined) && ($($(topBarEl).data("offset-el")).length != 0) ) {
			_stickyTopBarOffset = $($(topBarEl).data("offset-el")).offset().top;
		}		
		// see if there is a progress bar el
		if ( ($(topBarEl).data("progress-bar-el") != undefined) && ($($(topBarEl).data("progress-bar-el")).length != 0) ) {
			_stickyTopBarProgressBarEl = $(topBarEl).data("progress-bar-el");
		}		
	}
	
	// note our chapter offsets
	initChapterTops();

	// make the top "read more" arrow and intro story links clickable
	if (readMoreEls != undefined) {	
		if (! $.isArray(readMoreEls)) {
			readMoreEls = [ readMoreEls ];
		}
		$.each(readMoreEls, function( index, value ) {
			$(value).click(function () {
				var readMoreOffset = 0;
				// see if there is an offset el to find
				if ( ($(value).data("offset-el") != undefined) && ($($(value).data("offset-el")).length != 0) ) {
					readMoreOffset = $($(value).data("offset-el")).offset().top;
				}
				// scroll
				$('html, body').animate({ scrollTop: readMoreOffset }, 300);  
			});
		});		
	}
				
	// figure out and set the chapter
	// _onChapter = adjustScrollProgress();
	// adjustChapterLinks(_onChapter);
	adjustScrollProgress();

	// smooth scroll for our name links
	$(".chapterLink").click(function() {  
		// animate the scroll
		var target = $(this.hash);
		// set target
		goToChapter(this.hash.substr(1));		

		return false;  
	});  
}

//
// Gets the current chapter tops
//
initChapterTops = function () {

	var tops = new Array();
	
	$(".chapter").each(function (index) {
		tops[index] = Math.floor($(this).offset().top - _stickyTopBarHeight);
	});

	_chapterTops = tops;
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// LAYOUT ANALYSIS
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

// 
// Returns the visible viewport (factors in the top bar height)
//
// includePx: include the "px" value?
//
getVisibleViewport = function (includePx) {

	if (includePx) {
		return ((window.innerHeight - _stickyTopBarHeight) + "px");
	} else {
		return parseInt(window.innerHeight - _stickyTopBarHeight);
	}
}

//
// Returns the scroll top of the given item 
//
// el: The DOM element (ID or class) to scroll
// includePx: include the "px" value?
//
getViewportOffset = function (el, includePx) {

	if (includePx) {
		return ( ($(el).offset().top - $(window).scrollTop() - _stickyTopBarHeight) + "px");
	} else {
		return parseInt($(el).offset().top - $(window).scrollTop() - _stickyTopBarHeight);
	}
}

//
// Returns if the passed item is in the viewport or not
//
// el: The DOM element (ID or class) to scroll
//
getItemInViewport = function (el) {
	var elOT = $(el).offset().top;
	return ( (elOT + $(el).outerHeight()) <= $(window).scrollTop()) || (elOT >= ($(window).scrollTop() + $(window).height()) )
		? false : true;
}

//
// Are we on mobile? (up to layout to set this - we just return that setting)
//
getIsMobile = function () {
	return _isMobile;
}

//
// Are we on a tablet? (up to layout to set this - we just return that setting)
//
getIsTablet = function () {
	return _isTablet;
}

//
// Are we doing parallax effects?(up to layout to set this - we just return that setting)
//
getDoParallax = function () {
	return _doParallax;
}

//
// Is this desktop? (not up to layout - user agent test)
//
getIsDesktop = function () {
	return (! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

//
// Is this desktop? (not up to layout - javascript test)
//
getIsResponsive = function () {
	return _isResponsive;
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// LAYOUT ADJUSTMENTS
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Adjusts the layout of content after/during a resize event
//
adjustLayoutAfterResize = function () {
	initChapterTops();
	adjustScrollProgress();
}

//
// Adjusts the height of an art element to the related text element
//
// artEl: The DOM element (ID or class) for the art to change
// textEl: The DOM element (ID or class) for the text to match to
//
adjustChapterLinksArtHeight = function (artEl, textEl) {
	$(artEl).css("height", $(textEl).outerHeight());
}

//
// Maximizes the passed item's size to the width of the parent and the height of the viewport
//
// itemEl: The DOM element (ID or class) for the item to alter
// parentEl: The DOM element (ID or class) of the parent element
//
adjustSizeToParentAndViewport = function (itemEl, parentEl) {

	$(itemEl).css("height", getVisibleViewport(true));
	$(itemEl).css("width", $(parentEl).width());
}

//
// Updates the current scroll progress
//
adjustScrollProgress = function () {

	// first we see if the progress div exists
	if ($(_stickyTopBarProgressBarEl).length == 0) {
		// MAY EXIT THIS BLOCK
		return;
	}
	
	var chapter = 1;
	var wh = $(document).height();
	var h = $("body").height();
	var scrollHeight = (wh - h - _stickyTopBarOffset);
	var scrollPercent;

	// calculate
	scrollPercent = Math.round((($(document).scrollTop() - _stickyTopBarOffset) / scrollHeight) * 100);
	
	// update the bar
	$(_stickyTopBarProgressBarEl).css("width", (scrollPercent + "%"));

	// which chapter?
	for (i=_chapterTops.length; i >= 0; i--) {
		if ($(document).scrollTop() >= _chapterTops[i]) {
			chapter = (i + 1);
			break;
		}
	}

	// note this
	adjustChapterLinks(chapter);
		
	return chapter;
}

//
// Sets the class for the current chapter that the reader is on
//
// NOTE: see initLayout above for note on the _setChapterLinkCallback
//
// chapter: The current chapter
//
adjustChapterLinks = function (chapter) {

	// turn all others off
	$(".chapterLink").each(function () {
		if ($(this).attr("href") != ("#" + chapter) ) {
			// turn it off
			if (typeof(_setChapterLinkCallback) == "function") {
				_setChapterLinkCallback(this, false);
			}			
		} else {
			// turn it on
			if (typeof(_setChapterLinkCallback) == "function") {
				_setChapterLinkCallback(this, true);
			}			
			// and note it
			_onChapter = chapter;
		}
	});
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// USER INTERACTION
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Scrolls nicely back to the top
//
toTop = function () {
	$('html, body').animate({ scrollTop: 0 }, 600);  
}

//
// Toggles the passed mobile menu
//
// menuEl: The DOM element (ID or class) for the menu
// expEl: The DOM element (ID or class) for the menu expand icon
//
toggleMobileMenu = function (menuEl, expEl) {
	$(menuEl).toggle("fast");
	$(expEl).toggle("fast");
}

//
// Scrolls to the requested chapter
//
// chapter: The chapter to go to
//
goToChapter = function (chapter) {

	var target = $(("#c" + chapter));  
	
	// factor in top bar height (+1 pixel just to tuck it underneath the top bar)
	var oTop = (target.offset().top - _stickyTopBarHeight + 1);

	// create a delay that is inversely proportional to the number of chapters jumping
	var chaptersTraveled = (_onChapter > chapter) ? (_onChapter - chapter) : (chapter - _onChapter);
	var delay = Math.floor(1000 / (_chapterTops.length - (_chapterTops.length - chaptersTraveled)));

	// and go
	$('html, body').animate({ scrollTop: oTop }, delay, function() {
		// set the chapter
		adjustChapterLinks(chapter);
	});  
	
	// update this
	_onChapter = chapter;
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// ANIMATION / MANIPULATION
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Scrolls the images in the passed element
//
// el: The DOM element (ID or class) to scroll
// xAdjust: How much X to adjust (can be negative or a string)
// yAdjust: How much Y to adjust (can be negative or a string)
// timeout: The timeout to pause between changes
// scrollChapter: Run the scroll when on this chapter
//
animateOverflowContent = function (el, xAdjust, yAdjust, timeout, scrollChapter) {

	// set it if we're on the desired chapter
	if (scrollChapter == _onChapter) {
		var bPos = $(el).css("background-position").split(" ");
		var newXPos = (isNaN(xAdjust)) ? xAdjust : (xAdjust + parseInt(bPos[0]) + "px");
		var newYPos = (isNaN(yAdjust)) ? yAdjust : (yAdjust + parseInt(bPos[1]) + "px");
	
		// set
		$(el).css({
	  		"background-position": (newXPos + " " + newYPos)
		});
	}
	
	// loop regardless
	window.setTimeout(function() {
		animateOverflowContent(el, xAdjust, yAdjust, timeout, scrollChapter);
	}, timeout);
}

//
// Locks a bit of content as the user scrolls by and then sets it free when they are past
//
// lockEl: The DOM element (ID or class) for the art to change
// textEl: The DOM element (ID or class) for the related text content
// additionalCSS: Custom CSS to add to the settings
//
lockElement = function (lockEl, textEl, additionalCSS) {
		
	var textElTopViewOffset = getViewportOffset(textEl, false);
	var textElBottomViewOffset = (textElTopViewOffset + parseInt($(textEl).height()));

	_lockedContentStatuses[lockEl] = (_lockedContentStatuses[lockEl] == undefined)
			? false : _lockedContentStatuses[lockEl];
		
	if (textElTopViewOffset <= 0 ) {
		// it's in range - are we beneath where it should be locked, though?
		if (textElBottomViewOffset <= 0) { 
			// yes - set it free
			if (_lockedContentStatuses[lockEl]) {
				$(lockEl).css({ "display": "none" });
				_lockedContentStatuses[lockEl] = false;
			}
		} else {
			// no - lock it
			$(lockEl).css({
				"display": "block", "position": "fixed",
				"top": (_stickyTopBarHeight + "px"), "margin-top": "0px"
			});
			_lockedContentStatuses[lockEl] = true;
		}
	} else {
		$(lockEl).css({ "position": "relative", "top": "auto" });
		_lockedContentStatuses[lockEl] = false;
	}

	// anything else to set?
	if (additionalCSS != undefined) {
		$(lockEl).css(additionalCSS);
	}
}

