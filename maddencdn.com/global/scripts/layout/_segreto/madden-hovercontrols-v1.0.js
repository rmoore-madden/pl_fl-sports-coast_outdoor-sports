/**
 * v1.0
 *
 * Hover controls - shows or hides controls based on mouse location
 */

(function($) {

	var delayCount = 0;
	var delayInterval;
	var checkDelayTimeout = 500;
	var overControls = false;
	
	// main function
	$.fn.HoverControls = function (options) {

		// 
		// delay: How long to leave controls visible (in ms)?
		// parentElement: The element that triggers the hover (e.g. document or a cssClass)
		// showClass: CSS class to add/remove to element
		// triggerOnScroll: Trigger the menu to show when user scrolls? (helpful for mobile)
		//
		var settings = $.extend({
			delay: 5000,
			parentElment: document, 
			cssClass: "",
			triggerOnScroll: true
		}, options);
		
		var $hoverControls = $(this);
		var onEvent = (settings.triggerOnScroll) ? "mouseenter mousemove scroll" : "mouseenter mousemove";
		
		$(settings.parentElment).on(onEvent, function() {
			if (overControls) {
				// MAY EXIT THIS BLOCK
				return;
			}
			
			$hoverControls.addClass(settings.cssClass);
			resetDelayInterval($hoverControls, settings.delay, settings.cssClass);
		});
		
		$(settings.parentElment).on("mouseleave", function() {
			$hoverControls.removeClass(settings.cssClass);
			clearInterval(delayInterval);
		});
		
		$hoverControls.on("mouseover", function() { 
			// don't do timing when user is using controls
			overControls = true;
			clearInterval(delayInterval);
		});
		
		$hoverControls.on("mouseleave", function() { 
			// kick timing off again
			overControls = false;
			resetDelayInterval($hoverControls, settings.delay, settings.cssClass);
		});
	}
	
	/**
	 * Resets the delay interval
	 *
	 * el:	 		The calling element to act upon
	 * delay: 		How long to check against
	 * cssClass: 	The CSS class to remove when done
	 */
	 var resetDelayInterval = function (el, delay, cssClass) {
		delayCount = 0;
		clearInterval(delayInterval);
		delayInterval = setInterval(function() { 
			if (! mouseHasNotMovedSince(delay)) {
				el.removeClass(cssClass);
			}
		}, checkDelayTimeout);
	 }
	 
	/**
	 * Tracks mouse movement and returns if it has not moved since the delay
	 *
	 * delay: How long to check against
	 */
	var mouseHasNotMovedSince = function (delay) {

		var rhett = true;
		
		if (delayCount == delay) {
			delayCount = 0;
			rhett = false;
		}

		delayCount+= checkDelayTimeout;
		
		return rhett;
	}

}(jQuery));
