/**
 * v1.0
 *
 * Instagram widget - requires a registered app and client token that
 *	can be set up at http://instagram.com/developer/ 
 *
 * Gets content from Instagram by hashtag and puts it in a slideshow.
 * 
 * REQUIRES jQuery. If it is not present, this just won't work.
 * REQUIRES Cycle (http://jquery.malsup.com/cycle/). If it is not
 *	detected, it will automatically be loaded from the CDN.
 */
 
(function($) {
	
	$.fn.WidgetInstagram = function (options) {

		var $this = $(this);
		var theFeed;
		var instaURL = "https://api.instagram.com/v1/tags/[TAG_NAME]/media/recent?client_id=[API_ID]&callback=instafeedCache[UNIQUE].parse";
		var instaTemplate = "<img src=\"[IMAGE]\" title=\"[CAPTION]\" onclick=\"window.open('[LINK]')\" />";

		// 
		// apiID: The Instragram developer oAuth ID
		// tagName: The Instagram hashtag (sans hash) to load images for
		// widgetID: The ID of the DOM element to put the widget in
		// captionID: The optional ID of the DOM element to put the caption in
		// prevLinkID: The optional ID of the DOM element for the "previous" link
		// nextLinkID: The optional ID of the DOM element for the "next" link
		// fx: The animation type for the slideshow
		// speed: The speed for the slideshow animation transition
		// timeout: The time to sit on each slide
		//
		var settings = $.extend(true, {
			apiID: '',
			tagName: '',
			widgetID: 'widgetInstagram',
			captionID: '',
			fx: 'fade',
			speed: 'slow',
			timeout: 3000,
			navLinks: {
				placement: 'vertical center',
				prevLinkID: '',
				nextLinkID: ''
			}
		}, options);

		//
		// Init the plugin
		//
		var init = function () {

			if ( (settings.tagName == undefined) || (settings.apiID == undefined) ) {
				// MAY EXIT THIS BLOCK
				console.log("missing parameters");
				return;
			}
			
			// prep the url
			instaURL = instaURL.replace("[TAG_NAME]", settings.tagName);
			instaURL = instaURL.replace("[API_ID]", settings.apiID);
			instaURL = instaURL.replace("[UNIQUE]", Math.random().toString(36).slice(2));

			$.ajax({
				url: instaURL,
				jsonp: "callback",
				dataType: "jsonp",
				success: function( response ) {
					// TODO - better error handling, etc. here
					for (i=0; i < response.data.length; i++) {
						// prep the image template
						var img = instaTemplate;
						img = img.replace("[IMAGE]", response.data[i].images.standard_resolution.url);
						if (response.data[i].caption != null) {
							img = img.replace("[CAPTION]", response.data[i].caption.text);
						} else {
							img = img.replace("[CAPTION]", "");
						}						
						img = img.replace("[LINK]", response.data[i].link);
						// and add it
						$($this.selector).append(img);
					}
				},
				complete: function () {
					prepFeedImages();
					positionPrevNext(true);	
				    initCycle();
				}
			});
		}
		
		if (options.constructor == String) {
			switch(options) {
				case 'resize':
					positionPrevNext();
					resetCycle();
					break;
			}
			return $this;
		}
		
		// do we need to load cycle?
		var cycleLoaded = $("script").filter(function () {
			return ( ($(this).attr("src") != undefined) &&
					($(this).attr("src").indexOf("jquery-cycle-all-v2.86-min.js") != -1) );
		}).length;
		if (cycleLoaded) {
			console.log("FOUND CYCLE");
			init();
		} else {
			console.log("LOADING CYCLE");
			// getScript won't cache
			$.when(
				$.ajax({ url: "//maddencdn.com/global/scripts/third_party/jquery-cycle-all-v2.86-min.js", dataType: "script", cache: true })
			).done(function() {
				init();
			});
		}		

		//
		// Sets up the CSS for the feed images
		//
		var prepFeedImages = function () {
		    $($this.selector).css({
				"overflow": "hidden",
				"padding": "0"
			});
		    $($this.selector + " img").css({
				"cursor": "pointer",
				"position": "absolute",
				"top": "0",
				"left": "0",
				"width": "100%",
				"height": "100%",
				"padding": "0"
			});
		}

		//
		// Initializes the Instagram cycle widget
		//
		var initCycle = function () {
			$($this.selector).cycle({
				fx: settings.fx,
				speed: settings.speed,
				timeout: settings.timeout,
				prev: settings.navLinks.prevLinkID,
				next: settings.navLinks.nextLinkID,
				before: function () {
					// change the caption
					if (settings.captionID != "") {
						$("#" + settings.captionID).html(this.title);
					}
				}
			});
		}

		//
		// Positions the previous and next links (if present
		//
		positionPrevNext = function (init) {

			// PENDING: we assume both would be present
			if ( (settings.navLinks.prevLinkID == undefined) || (settings.navLinks.nextLinkID == undefined) ) {
				// MAY EXIT THIS BLOCK
				return;
			}
			// init them?
			if ( (init != undefined) && (init) ) {				
				$(settings.navLinks.prevLinkID).css({
					"position": "absolute",
					"z-index": "100"
				});
				$(settings.navLinks.nextLinkID).css({
					"position": "absolute",
					"z-index": "100"
				});
			}
			
			// TODO: add more options
			switch (settings.navLinks.placement) {
				case 'vertical center':
					var parentOffset = $($this.selector).position();
					var border = (($($this.selector).outerWidth() - $($this.selector).innerWidth()) / 2);
					var vCenter = (parentOffset.top + ($($this.selector).outerHeight() / 2));
					// place prev
					$(settings.navLinks.prevLinkID).css({
						"top": ((vCenter - ($(settings.navLinks.prevLinkID).height() / 2)) + "px"),
						"left": ((parentOffset.left + border) + "px")
					});
					// place next
					$(settings.navLinks.nextLinkID).css({
						"top": ((vCenter - ($(settings.navLinks.nextLinkID).height() / 2)) + "px"),
						"right": (border + "px")
					});

					break;
			}		
		}

		//
		// Resets the cycle plugin (can call on window resize)
		//
		resetCycle = function () {
			$($this.selector).cycle('destroy');
			initCycle();
		}
		
		return $this; 

	}
	
}(jQuery));
	