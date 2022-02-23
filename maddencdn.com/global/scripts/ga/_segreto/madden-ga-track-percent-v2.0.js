/**
 * v2.0 - Copyright 2018 Madden Media - All rights reserved.
 *
 * Advanced Google Analytics tracking script that tracks scroll distance and fires
 *	the specified distances as analytics events.
 *
 * Requires Google Analytics or Tag Manager. This script will determine which
 *	tracking object (GTM, Universal, Legacy, etc.) appears to be present and will
 *	adjust tracking calls based on this.
 *
 * NOTE: It is preferred that the minified version be used:
 *	https://maddencdn.com/global/scripts/ga/madden-ga-track-percent-v2.0-min.js
 */
(function() {

	//
	// used to track instantiation status
	//
	var _mmgaReadPercentInstantiated = false;

	//
	// A separate function to allow this script to be self-contained. If a page
	//	that has included this script does not call the constructor, this script
	//	will call itself upon window load to kick things off with the defaults.
	//
	function getIfMMGAReadPercentHasBeenInstantiated () {
		return _mmgaReadPercentInstantiated;
	}

	//
	// Constructor
	//
	MMGAReadPercent = function () {

		//
		// debug mode
		//
		this.DEBUG_MODE = false;

		//
		// default time delay before checking location
		//
		this.CALLBACK_DELAY = 100;

		//
		// internal tracking variables
		//
		this.timer = 0;
		this.readerLastPassed = 0;
		this.isScrolling = false;
		this.endContent = false;
		this.didComplete = false;
		this.readerLocations = [ ];
		this.startTime = new Date().getTime();
		this.totalTime = 0;

		//
		// google type (tbd)
		//
		this.GA_TYPE = null;

		//
		// readerTrackPercents: 	percent of the page where reader events fire at (use decimals
		//							decimals < 1 - i.e. .25) - use .0001 for "start of page."
		// fireReadCompleteEvent: 	is a 100% (i.e. reading complete) event fired?
		// readingEventLabelPrefix:	reading event label for analytics
		// gtmEventName: 			the event name sent to GTM
		// firePixelDistanceEvents:	log the pixel distance for each percentage event as well?
		// logEventsToConsole: 		log output to console?
		//
		var defaults = {
			readerTrackPercents:		[.0001, .25, .5, .75],
			fireReadCompleteEvent: 		true,
			readingEventLabelPrefix: 	'Reading ',
			gtmEventName: 				'ScrollDistance',
			gtmDataLayerName:			null,
			firePixelDistanceEvents:	false,
			logEventsToConsole: 		false
		}

		//
		// create the options
		//
		if ( (arguments[0]) && (typeof arguments[0] === "object") ) {
			this.settings = setOptions(defaults, arguments[0]);
		} else {
			this.settings = setOptions(defaults, []);
		}

		//
		// note that this now exists
		//
		_mmgaReadPercentInstantiated = true;

		//
		// assign all percent sizes based on height of page
		//
		determineReaderLocations();
	}

	//
    // Track the scroll location in the page
	//
    var trackLocation = function () {

		// sometimes a scroll event can fire before an onload fully happens - if so, stop
		//	this process for now
		if (typeof this.readerLocations == "undefined") {
			// MAY EXIT THIS BLOCK
			return;
		}

		// positions
		var scrollTop = (window.scrollY || window.pageYOffset);
        var curWinBottom = (window.innerHeight + scrollTop);
        var height = document.documentElement.scrollHeight;

		// figure out scroll time
		var currentTime = new Date();
		var timeToScroll = Math.round((currentTime.getTime() - this.startTime) / 1000);

        // if user starts to scroll send an event (if it's at a tracking point)
		for (i=this.readerLastPassed; i < this.readerLocations.length; i++) {
			// run location test
			if ( (curWinBottom >= this.readerLocations[i]) && (timeToScroll > 0) ) {

				// set label
				var eLabel = makeReadingEventLabel(this.settings.readerTrackPercents[i], false);

				// send the events
				sendEvent(this.settings.readingEventLabelPrefix, eLabel, location.pathname, timeToScroll);
				if (this.settings.firePixelDistanceEvents) {
					var eDistanceLabel = makeReadingEventLabel(this.readerLocations[i], true);
					sendEvent(this.settings.readingEventLabelPrefix, eDistanceLabel, location.pathname, timeToScroll);
				}

				// log it
				log(this.settings.readingEventLabelPrefix + this.readerLocations[i] + " /  " + eLabel + " / " + timeToScroll);

				// note what they've tracked
				this.readerLastPassed = (i + 1);
			}
		}

        // if user has hit the bottom of page send an event
        if ( (this.settings.fireReadCompleteEvent) && (curWinBottom >= height) && (! this.didComplete) ) {
            currentTime = new Date();

			// figure out scroll time
			var currentTime = new Date();
			var timeToScroll = Math.round((currentTime.getTime() - this.startTime) / 1000);

			// set label
			var eLabel = makeReadingEventLabel(1, false);

			// send the events
			sendEvent(this.settings.readingEventLabelPrefix, eLabel, location.pathname, timeToScroll);
			if (this.settings.firePixelDistanceEvents) {
				var eDistanceLabel = makeReadingEventLabel(height, true);
				sendEvent(this.settings.readingEventLabelPrefix, eDistanceLabel, location.pathname, timeToScroll);
			}

			// log it
			log(this.settings.readingEventLabelPrefix + eLabel + " / " + timeToScroll);

            this.didComplete = true;
        }
    }

	//
    // Figure out how tall our page is and adjust reader location to be a percent of that
	//
	// percent: The percent to use as a base for the calculation
	//
	function adjustReaderLocation (percent) {

		var docHeight = document.documentElement.scrollHeight;
		var adjHeight = Math.floor(docHeight * percent);

		return adjHeight;
	}

	//
	// Utility function to make a pretty reading label string
	//
	// rawEvent: 		The raw event to format
	// isPixelDistance: Is it a pixel distance (if not, assumed to be percent)?
	//
	function makeReadingEventLabel (rawEvent, isPixelDistance) {
		var lbl = "";

		if (isPixelDistance) {
			lbl = (this.settings.readingEventLabelPrefix + rawEvent + " pixels");
		} else {
			if (rawEvent < .001) {
				lbl = (this.settings.readingEventLabelPrefix + "0%");
			} else {
				lbl = (this.settings.readingEventLabelPrefix + (rawEvent * 100) + "%");
			}
		}

		return lbl;
	}

	//
	// Sends the event to whichever object we seem to have found
	//
	// eventCategory:	The event category sent back to GA
	// eventAction:		The event action sent back to GA
	// eventLabel:		The event label sent back to GA (the page URL)
	// eventValue:		The event value sent back to GA (the seconds it took to get to that point)
	//
	function sendEvent (eventCategory, eventAction, eventLabel, eventValue) {

		if (this.DEBUG_MODE) {
			// MAY EXIT THIS BLOCK
			return;
		}

		var dLayer = getGoogleDataLayer();
    console.log("dLayer: " + dLayer);
		// get ga type?
		if (this.GA_TYPE == null) {
			this.GA_TYPE = determineGoogleTrackingType();
		}
		// what type of google?
		if ( (this.GA_TYPE == "gtm") && (dLayer != null) ) {
			console.log("SOURCE: GTM");

			// tag manager
			dLayer.push({
				'event': this.settings.gtmEventName,
				'eventCategory': eventCategory,
				'eventAction': eventAction,
				'eventLabel': eventLabel,
				'eventValue': eventValue
			});
		} else if (this.GA_TYPE == "gtag") {
			console.log("SOURCE: GTAG");

			// latest gtag analytics
			gtag('event', 'mm_page_track', {
				'event_category': eventCategory,
				'event_action': eventAction,
				'event_label': eventLabel,
				'event_value': eventValue
			});
		} else if (this.GA_TYPE == "ga") {
			console.log("SOURCE: GA");

			// universal analytics
			ga('send', {
				'hitType': 'event',
				'eventCategory': eventCategory,
				'eventAction': eventAction,
				'eventLabel': eventLabel,
				'eventValue': eventValue
			});
		} else if (this.GA_TYPE == "gaq") {
			console.log("SOURCE: GAQ");

			// legacy analytics
			if (typeof pageTracker !== "undefined") {
				// "traditional syntax"
				pageTracker._trackEvent(eventCategory, eventAction, eventLabel, eventValue);
			} else {
				// "asynchronous syntax"
				_gaq.push(['_trackEvent', eventCategory, eventAction, eventLabel, eventValue]);
				_gaq.push(['pageTracker._trackEvent', eventCategory, eventAction, eventLabel, eventValue]);
			}
		}
	}


	//
	// Determines the current tracking type by checking script tags. This
	//	will continue to iterate even after finding an initial match to
	//	ensure that the right type is found (gtag loads
	//	analytics.js, for example, and we want to find gtag)
	//
	// Possible return values:
	//	"gtm": Google Tag Manager
	//	"gtag": Google Analytics tag format
	//	"ga": Google Analytics universal format
	//	"gaq": Google Analytics legacy format
	//	"": No Google script found
	//
	function determineGoogleTrackingType () {
		var scriptTags = document.getElementsByTagName("script");
		var type = "";

		for (var s in scriptTags) {
			try {
				var src = scriptTags[s].getAttribute("src");
				if (src) {
					if (src.indexOf("/gtm.js") != -1) {
						type = "gtm";
            break;
					} else if (src.indexOf("/gtag") != -1) {

						type = "gtag";
					} else if (src.indexOf("/analytics.js") != -1) {
						type = "ga";
					} else if (src.indexOf("/ga.js") != -1) {
						type = "gaq";
					}
				}
			} catch (e) {
				if (this.DEBUG_MODE) {
					console.log(scriptTags[s]);
					console.log(e);
				}
			}
		}

		return type;
	}

	//
	// Figure out the data layer
	//
	function getGoogleDataLayer () {
		var dl = null;

		if (this.settings.gtmDataLayerName != null) {
			dl = this.settings.gtmDataLayerName;
		} else if ( (typeof dataLayer !== "undefined") && (typeof dataLayer.push === "function") ) {
			dl = dataLayer;
		}

		return dl;
	}

	//
	// Determine reader % locations based on requested percents
	//
	function determineReaderLocations () {
		for (i=0; i < this.settings.readerTrackPercents.length; i++) {
			this.readerLocations[i] = adjustReaderLocation(this.settings.readerTrackPercents[i]);
			// log it
			log('LOCATION: ' + this.settings.readerTrackPercents[i]
					+ ' (' + this.readerLocations[i]
					+ ' / ' + document.documentElement.scrollHeight + ')');
		}
	}

	//
	// Respond to scroll events
	//
	function actOnScroll () {
		if (this.timer) {
			clearTimeout(this.timer);
		}

		// Use a buffer so we don't call trackLocation too often.
		this.timer = setTimeout(trackLocation, this.CALLBACK_DELAY);
	}

	//
	// Sets the options either from defaults or passed in values
	//
	// originalOptions: The original set of options (either the defaults or passed in)
	// newOptions:		The values that will be assigned to the option set
	//
	function setOptions (originalOptions, newOptions) {

		for (o in newOptions) {
			// set in new options? if so, override
			if (newOptions.hasOwnProperty(o)) {
				originalOptions[o] = newOptions[o];
			}
		}

		return originalOptions;
	}

	//
	// A log wrapper to check if we want it logged first
	//
	function log (msg) {
		if (this.settings.logEventsToConsole) {
			console.log(msg);
		}
	}

	//////////////////////////////
	// Window events
	//////////////////////////////

	//
	// Checks to see if an onload exists - if so, run that then this
	//
	// CREDIT: http://www.willmaster.com/library/web-development/more-than-one-onload-function.php
	//
	function MMGAReadPercentInstantiateSelf (f) {
		if (window.jQuery) {
			// tap into jquery
			jQuery(document).ready(function () {
				f();
			});
		} else if (typeof window.onload !== 'function') {
			window.onload = f;
		} else {
			var cache = window.onload;
			window.onload = function() {
				if (cache) { cache(); }
				f();
			};
		}
	}

	//
	// Will run after onload to determine if user already called script with override
	//
	MMGAReadPercentInstantiateSelf(function() {
		// set up the tracker if it wasn't triggered manually
		if (! getIfMMGAReadPercentHasBeenInstantiated()) {
			var mmgarp = MMGAReadPercent();
		}
	});

	// reassign all percent sizes based on height of page
	if (window.addEventListener) {
		window.addEventListener('resize', determineReaderLocations);
	} else {
		window.attachEvent('onresize', determineReaderLocations);
	}

	// track the scrolling and track location
	if (window.addEventListener) {
		window.addEventListener('scroll', actOnScroll);
	} else {
		window.attachEvent('onscroll', actOnScroll);
	}

}());


// Safe console log
if (typeof console == "undefined"){console={};console.log = function(){return;}}
