/**
 * v1.2
 *
 * A set of parallax design functionality. Includes:
 *
 * - Background parallax effect
 * - Locking an element as the page scrolls by
 * - Floating widgets
 */

(function($) {

	"use strict";

	//
	// Simple parallax effect for background content in a div
	//
	// Based on an original script by Heather Corey. Added full control
	//	over both X and Y positioning
	//
	$.fn.parallaxBG = function (options) {

		var windowHeight = $(window).height();
		var lastScrollTop = 0;
		var scrollTop = $(window).scrollTop();
		var offsetTop = 0;
		var height = 0;

		// 
		// adjustX: the amount to adjust the X scroll by (float - higher = more movement)
		// adjustY: the amount to adjust the Y scroll by (float - higher = more movement)
		// bgXAdjust: how far over on the Y axis offset the placement of the bg
		// bgXOffset: offset all X axis calculations by this much
		// bgYOffset: offset all Y axis calculations by this much
		// bgYAdjust: how far down to on the Y axis offset the placement of the bg
		// bgXPosition: where to put the background on the X axis
		// bgYPosition: where to put the background on the Y axis
		//
		var settings = $.extend({
			adjustX: 0,
			adjustY: 0,
			bgXOffset: 0,
			bgYOffset: 0,
			bgXPosition: "100%",
			bgYPosition: "100%"
		}, options);

		return this.each( function() {

			var $this = $(this);

			// handle the scroll
			$(window).scroll(function() {

				// cache these first to use locally
				var bgXAdjustPos = settings.bgXAdjust;
				var bgPos = $this.css("backgroundPosition").split(" ");
				var bgXPos = parseInt(bgPos[0]);

				// update these
				scrollTop = $(window).scrollTop();
				offsetTop = $this.offset().top;
				height = $this.outerHeight();
				
				// reverse the direction of the adjustment on the x axis based on scroll direction
				if ( (scrollTop < lastScrollTop) && (bgXAdjustPos != 0) ) {
					bgXAdjustPos = (bgXAdjustPos * -1);
				}

				// note the last scroll top
				lastScrollTop = scrollTop;		

				// don't scroll if we're outside the viewport of this item
				if ( ( (offsetTop + height) <= scrollTop) || (offsetTop >= (scrollTop + windowHeight) ) ) {
					return;
				}

				// calculate
				var x = (settings.adjustX == 0)
					? settings.bgXPosition
					: ((Math.round((offsetTop - scrollTop) * settings.adjustX) + 0) + settings.bgXOffset + "px");
				var y = (settings.adjustY == 0)
					? settings.bgYPosition
					: ((Math.round((offsetTop - scrollTop) * settings.adjustY) + 0) + settings.bgYOffset + "px");

				// and apply
				$this.css("background-position", (x + " " + y));				
			});
		});
	}
	
	//
	// Locks a bit of content as the user scrolls by and then sets it free when they are past
	//
	$.fn.parallaxLockElement = function (options) {

		var elLocked = false;

		// 
		// parentEl: The DOM element (ID or class) for the related parent content
		// offsetTop: Offset for the top (for a fixed top bar, for example)
		// additionalCSS: Custom CSS to add to the settings
		// onLock: A function to allow additional code when element is locked
		// onRelease: A function to allow additional code when element is released
		//
		var settings = $.extend({
			parentEl: "",
			offsetTop: 0,
			additionalCSS: undefined,
			onLock: undefined,
			onRelease: undefined
		}, options);

		// handle the logic
		return this.each( function() {

			var $this = $(this);
			var $parentEl = $(settings.parentEl);
									
			// handle the scroll
			$(window).scroll(function() {

				var parentElTopViewOffset = parseInt($parentEl.offset().top - $(window).scrollTop() - settings.offsetTop);
				var parentElBottomViewOffset = ($parentEl.offset().top + $parentEl.outerHeight());
				var lockElHeight = parseInt($this.outerHeight());
				var parentThisBottomDiff = (($parentEl.offset().top + $parentEl.outerHeight()) - ($this.offset().top + $this.outerHeight()));
		
				if (parentElTopViewOffset <= 0 ) {
					// it's in range - are we beneath where it should be locked, though?
					if ((parentElBottomViewOffset + parentThisBottomDiff) <= ($(window).scrollTop() + $(window).innerHeight())) { 
						// yes - set it free
						if (elLocked) {
							elLocked = false;
							// before we set it free, figure out where it is to lock it to that point
							// now position it there
							$this.css({ "position": "absolute", "top": "inherit", "bottom": (parentThisBottomDiff + "px") });
							// call the requested function?
							if (typeof(settings.onRelease) == "function") {
								settings.onRelease(this);
							}						
						}

					} else {
						// no - lock it
						$this.css({
							"position": "fixed", "top": (settings.offsetTop + "px"), "bottom": "auto"
						});
						// call the requested function?
						if (typeof(settings.onLock) == "function") {
							settings.onLock(this);
						}						
						elLocked = true;
					}
				} else {
					$this.css({ "position": "relative", "top": "auto" });
					// call the requested function?
					if (typeof(settings.onRelease) == "function") {
						settings.onRelease(this);
					}						
					elLocked = false;
				}
		
				// anything else to set?
				if (settings.additionalCSS != undefined) {
					$this.css(settings.additionalCSS);
				}

			});
		});
	}

	//
	// Calculates frames for animation of a floating element within a section. Each frame
	//	is a percentage of the total frames available (specified by the caller), and
	//	the the frame is set via CSS class name. The caller can then animate transitions
	//	on properties in CSS. All animation will happen within the span of the parent element.
	//
	$.fn.parallaxAnimateElement = function (options) {

		var positions = new Array();
		var startOffsetLoc = 0;
		var endOffsetLoc = 0;
		var applyAdditionalCSSHere = false;
		
		// 
		// frames: The number of frames in the animation
		// elementClass: The CSS class for the element
		// elementFrameClassRoot: The CSS class root for the frames (i.e. if "frame1" - "frame9", make this "frame")
		// startOffset: The percentage (i.e. "50%") or px value to offset the start of the animation
		// endOffset: The percentage (i.e. "50%") or px value to offset the end of the animation
		// showWhenCentered: Instead of an offset, just animate when the item is centered in the visible viewport
		// centerOffsetAnimationRange: The percentage of the element height (i.e. "150%") on either side of the
		//							   viewport center to run the animation frames. Use in conjunction with 
		//							   showWhenCentered. Default is 100% (i.e. height of element).		
		// lock: Lock the element as other content goes by?
		// parentEl: The DOM element (ID or class) for the art to change
		// offsetTop: Offset for the top (for a fixed top bar, for example)
		// additionalCSS: Custom CSS to add to the settings for locking
		// onLock: A function to allow additional code when element is locked
		// onRelease: A function to allow additional code when element is released
		//
		var settings = $.extend({
			frames: 1,
			elementClass: "floatingElement",
			elementFrameClassRoot: "frame",
			startOffset: null,
			endOffset: null,
			showWhenCentered: false,
			centerOffsetAnimationRange: null,
			lock: false,
			parentEl: "",
			offsetTop: 0,
			additionalCSS: undefined,
			onLock: undefined,
			onRelease: undefined
		}, options);

		// are we locking it?
		if (settings.lock) {
			$(this).parallaxLockElement({
				parentEl: settings.parentEl, offsetTop: settings.offsetTop, additionalCSS: settings.additionalCSS,
				onLock: settings.onLock, onRelease: settings.onRelease
			});		
		} else {
			// the css settings are for us
			applyAdditionalCSSHere = true;
		}
		
		// prep the element - first adjust the height to use for the calculation based on offsets
		var parentHeight = parseInt($(this).parent().height());
		
		if (settings.showWhenCentered) {
			// figure out the animation range
			if (settings.centerOffsetAnimationRange == null) {
				settings.centerOffsetAnimationRange = 1;
			} else if (settings.centerOffsetAnimationRange.indexOf("%") != -1) {
				// user-supplied percentage
				settings.centerOffsetAnimationRange = (parseInt(settings.centerOffsetAnimationRange) / 100);
			} else {
				// ignore it
				settings.centerOffsetAnimationRange = 1;
			}
		} else {
			// start
			if (settings.startOffset != null) {
				// percent or px?
				if (settings.startOffset.indexOf("%") != -1) {
					// percent
					var parsedSO = (parseInt(settings.startOffset) / 100);
					startOffsetLoc = Math.floor(parentHeight * parsedSO);
				} else {
					// px
					var parsedSO = parseInt(settings.startOffset);
					startOffsetLoc = parsedSO;
				}
			}
			
			// end
			if (settings.endOffset != null) {
				// percent or px?
				if (settings.endOffset.indexOf("%") != -1) {
					// percent
					var parsedSO = (parseInt(settings.endOffset) / 100);
					endOffsetLoc = Math.floor(parentHeight - (parentHeight * parsedSO));
				} else {
					// px
					var parsedSO = parseInt(settings.endOffset);
					endOffsetLoc = parsedSO;
				}
			}

			// now figure out the adjusted viewport
			if ( (startOffsetLoc != 0) || (endOffsetLoc != 0) ) {
				parentHeight = (parentHeight - endOffsetLoc - startOffsetLoc);
			}
		
			// and the frame height now - calculate and assign to an array
			var fHeight = (parentHeight / settings.frames);
			for (var x=1; x <= settings.frames; x++) {
				positions.push(Math.floor(startOffsetLoc + (fHeight * x)));
			}
			
			// anything else to set?
			if (applyAdditionalCSSHere) {
				if (settings.additionalCSS != undefined) {
					$(this).css(settings.additionalCSS);
				}
			}
		}
		
		// DEBUG
		// if (settings.showWhenCentered) {
		// 	console.log($(this).attr("id") + ": " + $(this).parent().height() + " / " + parentHeight + " (" + startOffsetLoc + " / " + endOffsetLoc + ") = " + positions);
		// }
		
		// handle the logic
		return this.each( function() {

			var $this = $(this);
			var showFrame = positions.length;
			var selfHeight = (settings.showWhenCentered)
				? ($(this).height() * settings.centerOffsetAnimationRange)
				: $(this).height();

			// handle the scroll
			$(window).scroll(function() {

				var elOT = $this.offset().top;
				var inViewport = ( (elOT + $this.outerHeight()) <= $(window).scrollTop())
								|| (elOT >= ($(window).scrollTop() + $(window).height()) )
					? false : true;

				if (inViewport) {

					// showtime
					if (settings.showWhenCentered) {

						// we are showing the item when it is centered in the viewport - the range of
						//	our animation will be 2x the height of the element centered around the
						//	viewport middle

						var selfViewportOffset = parseInt($this.offset().top - $(window).scrollTop());
						var selfCenter = parseInt(selfViewportOffset + (selfHeight / 2));
						var windowCenter = parseInt($(window).innerHeight() / 2);
						var selfEnter = parseInt(selfCenter - selfHeight);
						var selfExit = parseInt(selfCenter + selfHeight);

						// are we in range?
						if (windowCenter < selfEnter) {
							// no - too early
							showFrame = 1;
						} else if ( (windowCenter >= selfEnter) && (windowCenter <= selfExit) ) {
							// yes - figure out the percent inside the range (capping at 0/1)
							var percentIn = Math.max(0, Math.min(1, (1 - ((selfEnter + (selfCenter - windowCenter)) / selfCenter))));
							showFrame = Math.ceil(settings.frames * percentIn);
						} else {
							// no - too late
							showFrame = settings.frames;
						}
					} else {

						// we are showing the item in relation to the offsets

						var parentViewportOffset = parseInt($this.parent().offset().top - $(window).scrollTop());
						var pOff = ((parentViewportOffset * -1) + (selfHeight / 2));
						for (var n=0; n < positions.length; n++) {
							if (pOff <= positions[n]) {
								// we're on this frame
								showFrame = (n + 1);
								break;
							}
						}
					}

					// set the frame
					$this.attr("class", (settings.elementClass + " " + settings.elementFrameClassRoot + showFrame));
				}
			});
		});
	}
}(jQuery));
