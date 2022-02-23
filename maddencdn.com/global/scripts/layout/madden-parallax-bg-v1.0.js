/**
 * v1.0
 *
 * Simple parallax effect for background content in a div
 *
 * Based on an original script by Heather Corey. Added offsets
 *	for Y axis and position for X axis for background element
 */

(function($) {

	$.fn.parallaxBG = function (options) {

		var windowHeight = $(window).height();

		// 
		// speed: the speed to adjust the scroll by
		// bgYAdjust: how far down to on the Y axis offset the placement of the bg
		// bgXPosition: where to put the background on the X axis
		//
		var settings = $.extend({
			speed: 0.15,
			bgYAdjust: 0,
			bgXPosition: "100%"
		}, options);

		return this.each( function() {

			var $this = $(this);

			// handle the scroll
			$(window).scroll(function() {

				var scrollTop = $(window).scrollTop();
				var offsetTop = $this.offset().top;
				var height = $this.outerHeight();

				// don't scroll if we're outside the viewport
				if ( ( (offsetTop + height) <= scrollTop) || (offsetTop >= (scrollTop + windowHeight) ) ) {
					return;
				}

				// calculate and apply
				var y = Math.round((offsetTop - scrollTop) * settings.speed);
				$this.css("background-position", (settings.bgXPosition + " " + (y + settings.bgYAdjust) + "px") );				
			});
		});
	}
}(jQuery));
