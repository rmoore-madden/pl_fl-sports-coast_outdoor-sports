/**
 * v1.2 - Copyright 2014 Madden Media - All rights reserved.
 *
 * Global frameworks functions for all content.
 *
 * Outside of 3 layout type elements (#isMobile, #isTablet, #doParallax), nothing
 *	in this file is specific to a given layout. There are default building block
 *	elements; however these elements can be overridden. See initLayout() below for more.
 */

// sticky top bar variables
var _stickyTopBarHeight = 0;
var _stickyTopBarOffset = 0;

// chapter data
var _chapterTops = new Array();
var _onChapter = 0;

// default callbacks
var _setChapterLinkCallback;
var _chapterSetCompleteCallback;

// default elements (can be overridden/set during init)
var _stickyTopBarEl = "#topBar";
var _stickyTopBarProgressBarEl;
var _mobileMenuEl = "#mobileMenu";
var _socialMenuTriggerEl = "#socialLinksTrigger";
var _topAndMobileMenuControl = "#controlsTrigger";
var _chapterEl = ".chapter";
var _chapterLinkEl = ".chapterLink";
var _chapterElPrefix = "#c";
var _multiSizeImageEl = ".multiSize";
var _readMoreEl = undefined;

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
// See initLayout() below for additional parameter descriptions
//
frameworksOnReady = function (customCallbacks, customElements, calulateChapterHeights) {

	// figure out mobile, tablet, desktop, parallax
	initViewTypes();
					
	// init layout
	initLayout(customCallbacks, customElements, calulateChapterHeights);
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

	// figure out mobile, tablet, desktop, parallax
	initViewTypes();

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
// customCallbacks: Callback functions to use after some layout adjustments are performed. By
//					default, these are not set. Options are:
//
//						customCallbacks = {
//							"setChapterLinkCallback": YOUR_FUNCTION_NAME,
//							"chapterSetCompleteCallback": YOUR_FUNCTION_NAME
//						};
//
//					setChapterLinkCallback: When this frameworks sets the chapter, it needs to
//						call back out to the main content to have that parent manage
//						what happens to chapter links. It's assumed that the 
//						function will take a true|false param for on|off status.
// 					chapterSetCompleteCallback: If the main content wants to know when the
//						chapter setting is all offically complete (including scrolling),
//						it can be notified by giving this function name
//
// customElements: DOM identifiers (IDs or classes) of items essential to a basic
//				   layout. None, some or all can be provided, and all will have
//				   default values. Options (with current defaults shown) are as follows:
//
//						customElements = {
//							"topBar": "#topBar",
//							"mobileMenuEl": "#mobileMenu",
//							"socialMenuTriggerEl": "#socialLinksTrigger",
//							"topAndMobileMenuControl": "#controlsTrigger",
//							"chapterEl": ".chapter",
//							"chapterLinkEl": ".chapterLink",
//							"chapterElPrefix": "#c",
//							"multiSizeImageEl: ".multiSize"
//							"readMoreEl": undefined,
//						};
//
//				  topBar: CSS ID for the top sticky bar element
//				  mobileMenuEl: CSS ID for the mobile menu element
//				  socialMenuTriggerEl: CSS ID for the social menu trigger element
//				  topAndMobileMenuControl: CSS ID for the top/mobile menu trigger element
//				  chapterEl: CSS class for the content chapter elements
//				  chapterLinkEl: CSS class for the content chapter navigation elements
//				  chapterElPrefix: CSS ID string prefix for the individual chapter IDs
//				  multiSizeImageEl: CSS class for images that have multiple sizes based on
//									size/mode (which will be changed as the mode changes) - images
//									that are this class can have 4 data attributes: "data-src",
//									"data-src-medium", "data-src-small" and "data-src-legacy"
//				  readMoreEl: Can be either single or multiple identifiers - i.e.
//							  ".readMore" or [".readMore", "#introStory1"]
//
// calulateChapterHeights: Should this process calculate the chapter heights? If callers
//						   will be adjusting the height of the page for any reason during
//						   a load process *after* this function is called, this should be
//						   set to false and then the caller should call initChapterTops()
//						   manually on their own when they are ready
//
initLayout = function (customCallbacks, customElements, calulateChapterHeights) {

	// populate custom callbacks
	if (customCallbacks != undefined) {
		_setChapterLinkCallback = customCallbacks["setChapterLinkCallback"] || _setChapterLinkCallback;
		_chapterSetCompleteCallback = customCallbacks["chapterSetCompleteCallback"] || _chapterSetCompleteCallback;
	}
		
	// populate custom layout elements
	if (customElements != undefined) {
		_stickyTopBarEl = customElements["topBar"] || _stickyTopBarEl;
		_mobileMenuEl = customElements["mobileMenuEl"] || _mobileMenuEl;
		_socialMenuTriggerEl = customElements["socialMenuTriggerEl"] || _socialMenuTriggerEl;
		_topAndMobileMenuControl = customElements["topAndMobileMenuControl"] || _topAndMobileMenuControl;
		_chapterEl = customElements["chapterEl"] || _chapterEl;
		_chapterLinkEl = customElements["chapterLinkEl"] || _chapterLinkEl;
		_chapterElPrefix = customElements["chapterElPrefix"] || _chapterElPrefix;
		_multiSizeImageEl = customElements["multiSizeImageEl"] || _multiSizeImageEl;
		_readMoreEl = customElements["readMoreEl"] || _readMoreEl;
	}
	
	// figure out our mobile menu
	if ($(_mobileMenuEl).length) {
		var $mme = $(_mobileMenuEl);
		var mmChaptersEl = $mme.data("chapters");
		var mmToTopEl = $mme.data("top-link");
		var mmCloseTriggerEl = $mme.data("close-trigger");

		// if any data attributes are undefined, we need to know
		try {
			// listen to the close trigger el
			$((mmCloseTriggerEl)).click(function () {
				toggleMobileMenu(_mobileMenuEl, _topAndMobileMenuControl);
			});
			// listen to the mobile top menu el
			$(mmToTopEl).click(function () {
				toTop();
				toggleMobileMenu(_mobileMenuEl, _topAndMobileMenuControl);
			});
			// listen to the chapters
			$(mmChaptersEl).children("div").each(function (index) {
				$(this).click(function() {
					toggleMobileMenu(_mobileMenuEl, _topAndMobileMenuControl);
					goToChapter((index + 1));
				});
			});
		} catch(err) {
			console.log(err);
		}
	}

	// social links menu
	if ($(_socialMenuTriggerEl).length) {
		var $sLink = $(_socialMenuTriggerEl);
		var sLinksClass = $sLink.data("social-links");
		var sLinkClassOff = $sLink.data("social-links-class-off");
		var sLinkClassOn = $sLink.data("social-links-class-on");
		var sTriggerLinkClassOff = $sLink.data("trigger-class-off");
		var sTriggerLinkClassOn = $sLink.data("trigger-class-on");

		// if anything goes wrong, we need to know
		try {
			var $sLinks = $(sLinksClass);
			if (getIsDesktop()) {
				// non-touch devices
				$sLinks.on("mouseenter", function (event) {
					$sLink.attr("class", sTriggerLinkClassOn);
				}).on("mouseleave", function (event) {
					$sLink.attr("class", sTriggerLinkClassOff);
				});
			} else {
				// touch devices
				$(document).on("touchstart", sLinksClass, function (event) {
					$sLinks.attr("class", sLinkClassOn);
					$sLink.attr("class", sTriggerLinkClassOn);
			    }).on("touchend", function(){
					$sLinks.attr("class", sLinkClassOff);
					$sLink.attr("class", sTriggerLinkClassOff);
		    	}).on("touchcancel", function() {
					$sLinks.attr("class", sLinkClassOff);
					$sLink.attr("class", sTriggerLinkClassOff);
				}); 
			}
		} catch(err) {
			console.log(err);
		}
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
	if (_readMoreEl != undefined) {	
		if (! $.isArray(_readMoreEl)) {
			_readMoreEl = [ _readMoreEl ];
		}
		$.each(_readMoreEl, function( index, value ) {
			$(value).click(function () {
				var readMoreOffset = 0;
				// see if there is an offset el to find
				if ( ($(value).data("offset-el") != undefined) && ($($(value).data("offset-el")).length != 0) ) {
					readMoreOffset = $($(value).data("offset-el")).offset().top;
				}
				// scroll
				$('html, body').animate({ scrollTop: (readMoreOffset - _stickyTopBarHeight) }, 300);  
			});
		});		
	}

	// change the image source for any multi-sized image
	adjustMultiSizedImages();
				
	// note our chapter offsets if we are responsible for this
	if (calulateChapterHeights) {
		initChapterTops(true);
	}

	// smooth scroll for our name links
	$(_chapterLinkEl).click(function() {  
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

	// find each chapter top
	$(_chapterEl).each(function (index) {
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
// el: The DOM identifier (ID or class) to scroll
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
// el: The DOM identifier (ID or class) to scroll
//
getItemInViewport = function (el) {
	var elOT = $(el).offset().top;
	return ( (elOT + $(el).outerHeight()) <= $(window).scrollTop()) || (elOT >= ($(window).scrollTop() + $(window).height()) )
		? false : true;
}

//
// Returns if the passed item is at the center of the viewport or not
//
// el: The DOM identifier (ID or class) to scroll
// offset: How far either way from center counts as "center"?
//
getItemInViewportCenter = function (el, offset) {
	var elOT = $(el).offset().top;
	var halfWinHeight = ($(window).height() / 2);
	offset = offset || 0;

	return ( (elOT >= ($(window).scrollTop() + halfWinHeight + offset)) ||
				(elOT <= ($(window).scrollTop() + halfWinHeight - offset)) )
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
// Are we doing parallax effects? (up to layout to set this - we just return that setting)
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
// iOS on iPad has a specific 100% height issue in landscape - this test
//	is here specifically to act on that.
//
getIsIPad = function () {
	return (navigator.userAgent.match(/iPad;.*CPU.*OS/i));
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

	// reset chapter tops
	initChapterTops(true);

	// change the image source for any multi-sized image
	adjustMultiSizedImages();
}

//
// Adjusts the height of an art element to the related text element
//
// artEl: The DOM identifier (ID or class) for the art to change
// textEl: The DOM identifier (ID or class) for the text to match to
//
adjustChapterLinksArtHeight = function (artEl, textEl) {
	$(artEl).css("height", $(textEl).outerHeight());
}

//
// Maximizes the passed item's size to the width of the parent and the height of the viewport
//
// itemEl: The DOM identifier (ID or class) for the item to alter
// parentEl: The DOM identifier (ID or class) of the parent element
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
	$(_chapterLinkEl).each(function () {
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

//
// Finds all images declared to be multi-sized and changes their source
//	according to which view we're in
//
adjustMultiSizedImages = function () {
	var $msImages = $(_multiSizeImageEl);
	if ($msImages.length) {
		$msImages.each(function() {
			if ( (! getIsResponsive()) && ($(this).data("src-legacy") != undefined) ) {
				// legacy
				$(this).attr("src", $(this).data("src-legacy"));
			} else if ( (getIsMobile()) && ($(this).data("src-small") != undefined) ) {
				// mobile
				$(this).attr("src", $(this).data("src-small"));
			} else if ( (getIsTablet()) && ($(this).data("src-medium") != undefined) ) {
				// tablet
				$(this).attr("src", $(this).data("src-medium"));
			} else if ($(this).data("src") != undefined) {
				// desktop
				$(this).attr("src", $(this).data("src"));
			}
		});
	}
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
// The top menu might not always be a top menu - use this to handle that
//
runTopMenuControl = function () {
	if (getIsMobile()) {
		toggleMobileMenu(_mobileMenuEl, _topAndMobileMenuControl);
	} else {
		toTop();
	}
}

//
// Toggles the passed mobile menu
//
// menuEl: The DOM identifier (ID or class) for the menu
// expEl: The DOM identifier (ID or class) for the menu expand icon
//
toggleMobileMenu = function (menuEl, expEl) {
	if (getIsMobile()) {
		$(menuEl).toggle("fast");
		$(expEl).toggle("fast");
	}
}

//
// Scrolls to the requested chapter
//
// chapter: The chapter to go to
//
goToChapter = function (chapter) {

	var target = $((_chapterElPrefix + chapter));  
	
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
// el: The DOM identifier (ID or class) to scroll
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
// el: The DOM identifier (ID or class) to scroll
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
