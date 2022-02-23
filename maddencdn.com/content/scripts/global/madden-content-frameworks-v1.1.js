/**
 *
 ********************************************************************
 *
 * DEPRECATED - USE V1.2 INSTEAD
 *
 ********************************************************************* 
 *
 * v1.1 - Copyright 2014 Madden Media - All rights reserved.
 *
 * Global frameworks functions for all content - nothing in this file should be
 *	specific to a given layout outside of known and expected items - this incldues:
 *
 * Layout types: #isMobile, #isTablet, #doParallax - CSS sets based on medium
 * Chapters: DOM elements with an ID pattern of "c[CHAPTER]" - i.e. "c1"
 * Chapter links: Link DOM elements with a "chapterLink" class and a hash HREF - for
 *				  example, <a id="c1Link" class="chapterLink" href="#1">
 * Non-responsive images: Images that might be in both layouts but have a different
 *						  source for the non-responsive layout (".nonResImage")
 */

// just logging this to console for developers to see
if (typeof console != "undefined") { console.log("%c NOTICE: madden-content-frameworks-v1.1.js is deprecated - please use the latest version.", "background:orange; color:black"); }

// sticky top bar variables
var _stickyTopBarHeight = 0;
var _stickyTopBarOffset = 0;
var _stickyTopBarProgressBarEl = "";

// chapter data
var _chapterTops = new Array();
var _onChapter = 0;
var _customChapterTop;
var _setChapterLinkCallback;
var _chapterSetCompleteCallback;


// default elements (underscore items can be overridden/set)
var _stickyTopBarEl = "#topBar";
var DEFAULT_CHAPTER_EL_PREFIX = "#c";
var DEFAULT_CHAPTER_LINK_EL = ".chapterLink";
var DEFAULT_NON_RESPONSIVE_EL = ".nonResImage";

// for layout
var DEFAULT_MOBILE_TEST_EL = "#isMobile";
var DEFAULT_TABLET_TEST_EL = "#isTablet";
var DEFAULT_PARALLAX_TEST_EL = "#doParallax";
var IS_RESPONSIVE = document.addEventListener;
var _isMobile = false;
var _isTablet = false;
var _doParallax = false;

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// STOCK EVENT FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Called on ready
//
// topBarEl: A custom DOM element (ID or class) of a sticky top bar (if present)
//
// See initLayout() below for additional parameter descriptions
//
frameworksOnReady = function (customChapterLinkCallback, readMoreEls,
			calulateChapterHeights, topBarEl, customChapterLinkClass,
			customChapterSetCompleteCallback) {

	// figure out mobile, tablet, desktop, parallax
	initViewTypes();
					
	// init layout
	initLayout(customChapterLinkCallback, readMoreEls,
			calulateChapterHeights, topBarEl,
			customChapterLinkClass,
			customChapterSetCompleteCallback);
}

//
// Called on scroll
//
frameworksOnScroll = function () {
	// adjust the scroll bar progress
	adjustScrollProgress();
}

//
// Called on a touch move on mobile
//
frameworksOnTouchMove = function () {
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
	_isMobile = ( ($(DEFAULT_MOBILE_TEST_EL).length != 0) && ($(DEFAULT_MOBILE_TEST_EL).css("float") != "none") ) ? true : false;
	_isTablet = ( ($(DEFAULT_TABLET_TEST_EL).length != 0) && ($(DEFAULT_TABLET_TEST_EL).css("float") != "none") ) ? true : false;
	_doParallax = ( ($(DEFAULT_PARALLAX_TEST_EL).length != 0) && ($(DEFAULT_PARALLAX_TEST_EL).css("float") != "none") ) ? true : false;
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
// customChapterLinkClass: A optional custom CSS class to use to identify chapter points
// calulateChapterHeights: Should this process calculate the chapter heights? If callers
//						   will be adjusting the height of the page for any reason during
//						   a load process *after* this function is called, this should be
//						   set to false and then the caller should call initChapterTops()
//						   manually on their own when they are ready
// customChapterSetCompleteCallback: If the main content wants to know when the chapter
//									 setting is all offically complete (including scrolling),
//									 it can be notified by giving this function name
//
initLayout = function (customChapterLinkCallback, readMoreEls,
			calulateChapterHeights, topBarEl, customChapterLinkClass,
			customChapterSetCompleteCallback) {

	// store this for later
	_setChapterLinkCallback = customChapterLinkCallback;

	// any custom function for chapter setting completion?
	if (customChapterSetCompleteCallback != undefined) {
		_chapterSetCompleteCallback = customChapterSetCompleteCallback;
	}
	
	// figure out our custom chapter link class
	if (customChapterLinkClass != undefined) {
		_customChapterTop = customChapterLinkClass;	
	}

	// figure out our top bar element
	if (topBarEl != undefined) {
		_stickyTopBarEl = topBarEl;
	}
	
	// if we're not in responsive mode, find and load all images that are for the
	//	non-responsive layout and set their sources from their data attributes (if
	//	they have that - some images are used in both designs)
	if (! IS_RESPONSIVE) {
		$(DEFAULT_NON_RESPONSIVE_EL).each(function() {  
			if ($(this).data("src") != undefined) {
				// swap in the source
				$(this).attr("src", $(this).data("src"));
			}
		});
		
		// MAY EXIT THIS BLOCK
		return;
	}
		
	// is there a top bar? if so, note the height
	if ($(_stickyTopBarEl).length) {
		_stickyTopBarHeight = $(_stickyTopBarEl).height();
		// see if there is an offset el to find
		if ( ($(_stickyTopBarEl).data("offset-el") != undefined) && ($($(_stickyTopBarEl).data("offset-el")).length != 0) ) {
			_stickyTopBarOffset = $($(_stickyTopBarEl).data("offset-el")).offset().top;
		}		
		// see if there is a progress bar el
		if ( ($(_stickyTopBarEl).data("progress-bar-el") != undefined) && ($($(_stickyTopBarEl).data("progress-bar-el")).length != 0) ) {
			_stickyTopBarProgressBarEl = $(_stickyTopBarEl).data("progress-bar-el");
		}		
	}
		
	// make any "read more" arrow and intro story links clickable
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
				
	// note our chapter offsets if we are responsible for this
	if (calulateChapterHeights) {
		initChapterTops(true);
	}

	// smooth scroll for our name links
	$(DEFAULT_CHAPTER_LINK_EL).click(function() {  
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
// adjustScroll: Adjust the scroll progress after chapter tops are found?
//
initChapterTops = function (adjustScroll) {

	var tops = new Array();
	var el = (_customChapterTop != undefined) ? _customChapterTop : ".chapter";

	// find each chapter top
	$(el).each(function (index) {
		tops[index] = Math.floor($(this).offset().top - _stickyTopBarHeight);
	});
	// store the results
	_chapterTops = tops;
	
	// adjust scroll progress now?
	if (adjustScroll) {
		adjustScrollProgress();
	}
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// LAYOUT ANALYSIS
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Returns the current chapter
//
getCurrentChapter = function () {
	return _onChapter;
}

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
// What's the height of the sticky bar?
//
getStickyTopBarHeight = function () {
	return _stickyTopBarHeight;
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
// Will the design be responsive? (not up to layout - javascript test)
//
getIsResponsive = function () {
	return IS_RESPONSIVE;
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
	initChapterTops(true);
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
	
	var chapter = -1;
	var wh = $(document).height();
	var h = $("body").height();
	var scrollHeight = (wh - h - _stickyTopBarOffset);
	var scrollPercent;

	// calculate
	scrollPercent = Math.round((($(document).scrollTop() - _stickyTopBarOffset) / scrollHeight) * 100);
	
	// update the bar
	$(_stickyTopBarProgressBarEl).css("width", (scrollPercent + "%"));

	// which chapter?
	for (var i=(_chapterTops.length-1); i >= 0; i--) {
		if ($(document).scrollTop() >= _chapterTops[i]) {
			chapter = (i + 1);
			break;
		}
	}

	// adjust the links if we found a match
	if (chapter != -1) {
		adjustChapterLinks(chapter);
	}
	
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

	// loop through the links
	$(DEFAULT_CHAPTER_LINK_EL).each(function () {
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

	var target = $((DEFAULT_CHAPTER_EL_PREFIX + chapter));  
	
	// factor in top bar height (+1 pixel just to tuck it underneath the top bar)
	var oTop = (target.offset().top - _stickyTopBarHeight + 1);

	// create a delay that is inversely proportional to the number of chapters jumping
	var chaptersTraveled = (_onChapter > chapter) ? (_onChapter - chapter) : (chapter - _onChapter);
	var delay = Math.floor(1000 / (_chapterTops.length - (_chapterTops.length - chaptersTraveled)));

	// and go
	$('html, body').animate({ scrollTop: oTop }, delay, function() {
		// set the chapter
		adjustChapterLinks(chapter);
		// and chapter setting is done - is there a custom function we should call?
		if (typeof(_chapterSetCompleteCallback) == "function") {
			_chapterSetCompleteCallback(chapter);
		}			
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
// Scrolls the background position of the passed element in a slideshow manner
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
// Super-basic cross-fade loop
//
// Credit: http://www.simonbattersby.com/blog/simple-jquery-image-crossfade/
//
// el: The DOM element (ID or class) to scroll
// delay: The delay between fades
//
cycleImages = function (el, delay) {
	var $active = $(el + " .active");
	var $next = ($active.next().length > 0) ? $active.next() : $(el + " img:first");
	$next.css("z-index", 2); // move the next image up the pile
	$active.fadeOut(delay, function() {
		// fade out the top image
		$active.css("z-index", 1).show().removeClass("active"); // reset the z-index and unhide the image
		$next.css("z-index", 3).addClass("active"); // make the next image the top one
	});
}
