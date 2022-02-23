/*
 * v1.0
 *
 * Automatically track outbound links in Google Analytics. Any link that you do not want tracked
 *	can be assigned a "noGA" class and it will not be skipped here.
 *
 * CREDIT: http://www.sitepoint.com/track-outbound-links-google-analytics/
 *
 * Modified to support ability for links to open in new window w/o triggering a popup warning
 */

// just logging this to console for developers to see
if (typeof console != "undefined") { console.log("%c NOTICE: madden-ga-exit-track-v1.0.js is deprecated - please use the latest version.", "background:orange; color:black"); }

(function($) {
 
	"use strict";
 
 	// default no tracking class
	var defaultNoTrackClass = "noGA";
	
	// current page host
	var baseURI = window.location.host;
 
	// click event on body
	$("body").on("click", function(e) {
 
		// abandon if link already aborted or analytics is not available
		if (e.isDefaultPrevented() || typeof ga !== "function") return;
 
		// abandon if no active link or link within domain
		var link = $(e.target).closest("a");
		if (link.length != 1 || baseURI == link[0].host) return;

		// check the link to see if it should not be tracked
		if ( (link.attr("class") == undefined) || (link.attr("class").indexOf(defaultNoTrackClass) != -1) ) {
			return;
		}
		 
		// cancel event and record outbound link
		e.preventDefault();
		var href = link[0].href;
		var target = link[0].target;
		
		if (target != "") {
			// gets us around popup blocking
			$(link[0]).on("click", function(){
				var w = window.open(href, target);
				trackEvent(href, false);
				return false;
			});
			$(link[0]).click();
		} else {
			trackEvent(href, true);
			// in case hit callback bogs down
			setTimeout(function() { self.location.href = href; }, 1000);
		}
 
		// track the event 
 		function trackEvent (href, runHitCallback) {
			ga('send', {
				'hitType': 'event',
				'eventCategory': 'outbound',
				'eventAction': 'link',
				'eventLabel': href,
				'hitCallback': (runHitCallback)
						? function() { self.location.href = href; }
						: function() { return false; }
			});
		}
	});
 
})(jQuery);
