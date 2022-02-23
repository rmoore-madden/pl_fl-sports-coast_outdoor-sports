/**
 * v1.0 - Copyright 2018 Madden Media - All rights reserved.
 *
 * Supports lazy loading of page content based on usage of data attributes. The current
 *	document size used to evaluate which size to load uses the standard Madden Media
 *	floating div test.
 *
 * Tags:
 *	- data-load-onload: if present, this will load on load of page (good for hero image)
 *	- data-load-size: sm|md|lg - what size of asset is it? Based on this, lazy loading
 *		will start earlier rather than later
 *	- data-load-type: image|class|poster - what type of asset is being loaded? 
 *		"img": img tag src
 *		"class": the class to add to the element (useful for bg images)
 *		"poster": video tag poster image
 *	- data-load-alt: If an image, this will be set as the alt tag after load 
 *	- data-load-all: The data for all sizes (usually class name for a bg image) 
 *	- data-load-lg: The data for the large (e.g. desktop) size (class name or img src) 
 *	- data-load-md: The data for the large (e.g. tablet) size (class name or img src) 
 *	- data-load-sm: The data for the small (e.g. mobile) size (class name or img src)
 *
 * NOTE: At least one size is required to have an element be
 *	discovered. If no data attribute is specified for the needed size, the next 
 *	higher size will be used. For example, if a large and small size are specified 
 *	but no medium, tablets will use the large size.
 *
 * Suggested usages:
 *	- Elements by this plugin data type: jQuery("*[data-load-type]").lazyLoad();
 *	- Elements by custom CSS class: jQuery(".[CSS_CLASS_NAME]").lazyLoad();
 */

(function($) {

	"use strict";

	// window size info
	var DEFAULT_SM_TEST_EL = "#isMobile";
	var DEFAULT_MD_TEST_EL = "#isTablet";
	var DEFAULT_LG_TEST_EL = "#doParallax";
	var _isSmall = false;
	var _isMedium = false;
	var _isLarge = false;

	//
	// Primary function
	//
	$.fn.lazyLoad = function (options) {

		var IS_BOT = /bot|google|baidu|bing|msn|duckduckgo|teoma|slurp|yandex/i.test(navigator.userAgent);
		
		var windowHeight = $(window).height();
		var scrollTop = $(window).scrollTop();
	
		var lazyLoadEls = [];
		
		// 
		// preloadDistanceLg: how far ahead of a "large" image should loading start (in px)?
		// preloadDistanceMd: how far ahead of a "medium" image should loading start (in px)?
		// preloadDistanceSm: how far ahead of a "small" image should loading start (in px)?
		// defaultImage: what is the image in use as a placeholder (typically a pixel)?
		// debug: might be handy for this plugin to log when items load (true|false)
		//
		var settings = $.extend({
			preloadDistanceLg: 1000,
			preloadDistanceMd: 600,
			preloadDistanceSm: 250,
			defaultImage: "https://maddencdn.com/global/images/pixel.png",
			debug: false
		}, options);

		// listen for resizing to change size testers
		$(window).resize(function() {
			_isSmall = ( (jQuery(DEFAULT_SM_TEST_EL).length != 0) && (jQuery(DEFAULT_SM_TEST_EL).css("float") != "none") ) ? true : false;
			_isMedium = ( (jQuery(DEFAULT_MD_TEST_EL).length != 0) && (jQuery(DEFAULT_MD_TEST_EL).css("float") != "none") ) ? true : false;
			_isLarge = ( (jQuery(DEFAULT_LG_TEST_EL).length != 0) && (jQuery(DEFAULT_LG_TEST_EL).css("float") != "none") ) ? true : false;
		});
		
		// go through the set and either load now or add to scroll list
		this.each(function () {
			if ( (IS_BOT) || ($(this).data("load-onload")) ) {
				// is a bot or not tied to scroll - load now
				loadContent($(this), settings.defaultImage, settings.debug);
			} else {
				// copy all the rest to a holder array that we can remove items
				//	from as they are loaded
				lazyLoadEls.push($(this));
			}
		});
		
		// now handle the scroll
		$(window).scroll(function() {

			// update current scroll top
			scrollTop = ($(window).scrollTop() + windowHeight);

			// loop through unloaded items
			for (var i=0; i < lazyLoadEls.length; i++) {
				// console.log("CALLING SCROLL " + lazyLoadEls.length);

				var offsetTop = parseInt(lazyLoadEls[i].offset().top);

				// what size is the content? we need this number to calculate how far before we start the loading
				var size = (lazyLoadEls[i].data("load-size")) ? lazyLoadEls[i].data("load-size") : "sm";
				var offset = 0;
				switch (size) {
					case "lg":
						offset = settings.preloadDistanceLg;
					break;
					case "md":
						offset = settings.preloadDistanceMd;
					break;
					case "sm":
						offset = settings.preloadDistanceSm;
					break;
				}
				console.log(offset + ": " + lazyLoadEls[i].data("load-lg"));
				
				// are we ready to load it?
				if (scrollTop >= (offsetTop - offset)) {
					// yes!
					loadContent(lazyLoadEls[i], settings.defaultImage, settings.debug);
					// and remove it from the set
					lazyLoadEls.splice(i, 1);
				}
			}
		});
	}
	
	//
	// Content loader
	//
	// el: The DOM element to work with
	// defaultImage: The default image to replace if present
	// debug: output load info to console?
	//
	function loadContent (el, defaultImage, debug) {
		var sizeData = el.data("load-lg");
		if (el.data("load-all")) {
			// all have the same
			sizeData = el.data("load-all");
		} else {
			// we will use our size, or the next largest size
			if (_isSmall) {
				if (el.data("load-sm")) {
					sizeData = el.data("load-sm");
				} else {
					sizeData = (el.data("load-md")) ? el.data("load-md") : el.data("load-lg");
				}
			} else if (_isMedium) {
				sizeData = (el.data("load-md")) ? el.data("load-md") : el.data("load-lg");
			} 
		}
		
		if (sizeData) {
			// and now what type of content is it?
			if ( (el.data("load-type") == "img") && (el.attr("src") == defaultImage) ) {
				// img src
				el.attr("src", sizeData);
				// alt tag?
				if (el.data("load-alt")) {
					el.attr("alt", el.data("load-alt"));
				}
				if (debug) {
					console.log("LOADING img: " + sizeData);
				}
			} else if ( (el.data("load-type") == "class") && (! el.hasClass(sizeData)) ) {
				// css class
				el.addClass(sizeData);
				if (debug) {
					console.log("LOADING class: " + sizeData);
				}
			} else if ( (el.data("load-type") == "poster") && (el.attr("poster") == defaultImage) ) {
				// video poster
				el.attr("poster", sizeData);
				if (debug) {
					console.log("LOADING poster: " + sizeData);
				}
			}
		} else {
			console.log("LAZY LOAD WARNING: no size found for " + el);
		}
	}
}(jQuery));
