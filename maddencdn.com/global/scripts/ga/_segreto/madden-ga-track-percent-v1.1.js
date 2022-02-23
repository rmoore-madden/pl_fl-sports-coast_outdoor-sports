/**
 * v1.1 - Copyright 2014 Madden Media - All rights reserved.
 *
 * Advanced Google Analytics tracking script that tracks starting reading, 25%,
 *	50%, 75% and completion. This is otherwise a duplicate of:
 *
 * madden-ga-track-start-end-v1.0.js
 *
 * This duplication is in place to reduce configuration work for callers.
 *
 * Requires Google Analytics and jQuery. This script will determine which analytics
 *	object (universal, legacy, etc.) seems to be present and will adjust tracking
 *	calls based on this.
 */

// safe console log
if (typeof console == "undefined"){console={};console.log = function(){return;}}

jQuery(function($) {

    // Debug flags
    var debugMode = false;
    var logOutput = true;

    // Default time delay before checking location
    var callBackTime = 100;

	// percent of the page where reader events fire
	//	at (use decimals < 1 - i.e. .25) - use .0001 for "start of page"
	var readerLocationPercents = [.0001, .25, .5, .75];

    // # px before tracking a reader (will be assigned based on readerLocationPercents)
    var readerLocations = [ ];

	// how far have they made it (this will be managed by the script)
	var readerLastPassed = 0;
	
    // Set some flags for tracking & execution
    var timer = 0;
    var isScrolling = false;
    var endContent = false;
    var didComplete = false;

    // Set some time variables to calculate reading time
    var startTime = new Date();
    var beginning = startTime.getTime();
    var totalTime = 0;
	
    // Check the location and track user
    function trackLocation () {

		// positions
        var curWinBottom = ($(window).height() + $(window).scrollTop());
        var height = $(document).height();

		// figure out scroll time
		var currentTime = new Date();
		var timeToScroll = Math.round((currentTime.getTime() - beginning) / 1000);

        // If user starts to scroll send an event (if it's at a tracking point)
		for (i=readerLastPassed; i < readerLocations.length; i++) {
			// run location test
			if ( (curWinBottom >= readerLocations[i]) && (timeToScroll > 0) ) {

				// set label
				var label = makeReadingEventLabel(readerLocationPercents[i]);

				// send the event
				sendEvent('Reading', label, timeToScroll, location.pathname);

				// log it
				log('READING: ' + readerLocations[i] + " /  " + label + " / " + timeToScroll);

				// note what they've tracked
				readerLastPassed = (i + 1);
			}
		}

        // if user has hit the bottom of page send an event
        if ( (curWinBottom >= height) && (! didComplete) ) {
            currentTime = new Date();
			
			// figure out scroll time
			var currentTime = new Date();
			var timeToScroll = Math.round((currentTime.getTime() - beginning) / 1000);

			// set label
			var label = makeReadingEventLabel(1);
			
			// send the event
			sendEvent('Reading', label, timeToScroll, location.pathname);

			// log it
			log('READING: ' + label + " / " + timeToScroll);
			
            didComplete = true;
        }
    }

    // figure out how tall our page is and adjust reader location to be a percent of that
	function adjustReaderLocation (percent) {
	
		var docHeight = $(document).height();
		var adjHeight = Math.floor(docHeight * percent);

		return adjHeight;		
	}

	// util function to make a pretty reading label string
	function makeReadingEventLabel (raw) {
		var lbl = "";

		if (raw < .001) {
			lbl = "StartReading";
		} else if (raw == 1) {
			lbl = "ContentBottom";
		} else {
			lbl = ("Reading " + (raw * 100) + "%");
		}
		
		return lbl;
	}
	
	// a log wrapper to check if we want it logged first
	function log (msg) {
		if (logOutput) {
			console.log(msg);
		}
	}
	
	// sends the event to whichever object we seem to have found
	function sendEvent (eventCategory, eventAction, eventValue, page) {

		if (debugMode) {
			// MAY EXIT THIS BLOCK
			return;
		}

		// test for any given analytics type
		if ( (typeof dataLayer !== "undefined") && (typeof dataLayer.push === "function") ) {
			// google tag manager
			dataLayer.push({
				'event': 'ScrollDistance',
				'eventCategory': eventCategory,
				'eventAction': eventAction,
				'eventLabel': page,
				'eventValue': eventValue
			});
		} else if (typeof _gaq != "undefined") {
			// legacy analytics
			if (typeof pageTracker != "undefined") {
				// "traditional syntax"
				pageTracker._trackEvent(eventCategory, eventAction, page, eventValue);
			} else {
				// "asynchronous syntax"
				_gaq.push(['_trackEvent', eventCategory, eventAction, page, eventValue]);
				_gaq.push(['pageTracker._trackEvent', eventCategory, eventAction, page, eventValue]);
			}
		} else if (typeof ga != "undefined") {
			// universal analytics
			ga('send', {
				'hitType': 'event',
				'eventCategory': eventCategory,
				'eventAction': eventAction,
				'eventLabel': page,
				'eventValue': eventValue
			});
		}
	}

	// determine reader % locations	
	function determineReaderLocations () {
		for (i=0; i < readerLocationPercents.length; i++) {
			readerLocations[i] = adjustReaderLocation(readerLocationPercents[i]);
			// log it
			log('LOCATION: ' + readerLocationPercents[i]
					+ ' (' + readerLocations[i] + ' / ' + $(document).height() + ')');
		}
	}
	
	// assign all percent sizes based on height of page
    $(window).load(function() {
		determineReaderLocations();
	});

	// reassign all percent sizes based on height of page
    $(window).resize(function() {
		determineReaderLocations();
	});

    // Track the scrolling and track location
    $(window).scroll(function() {
	
        if (timer) {
            clearTimeout(timer);
        }

        // Use a buffer so we don't call trackLocation too often.
        timer = setTimeout(trackLocation, callBackTime);
    });
});
