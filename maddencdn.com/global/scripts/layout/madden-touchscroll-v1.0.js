/**
 * v1.0
 *
 * Scroll override/handling for iOS devices. Looks for a default div ("iosScrollWrapper") and manually
 *	positions that based on touch events. These events should only fire for mobile devices.
 *
 * PENDING: lifted and subsequently modified from an online example - need to find again to give proper credit
 */

var iosScrollWrapper = document.getElementById("iosScrollWrapper");

var activeTouch = null;
var touchStartY = 0;
var iosScrollWrapperStartScrollTop = 0;
var offsetY = 0;
var lastOffsetY = 0;
var currentTop = 0;

document.addEventListener("touchend", touchEnd);
document.addEventListener("touchcancel", touchEnd);

//
// when touch starts
//
document.addEventListener("touchstart", function(event) {
	event.preventDefault();

	var touch = event.changedTouches[0];

	if ( activeTouch == null ) {
		activeTouch = touch;
		touchStartY = touch.screenY;
		// use offsetTop instead of scrollTop
		iosScrollWrapperStartScrollTop = iosScrollWrapper.offsetTop;


		// cancel inertia animations
		iosScrollWrapper.style.webkitTransition = 'none';
	}
});

//
// when touch is happening (dragging the finger)
//
document.addEventListener("touchmove", function() {

var test = 0;

	for (var i=0; i < event.changedTouches.length; i++ ) {
		var touch = event.changedTouches[i];

		if (touch === activeTouch) {
			lastOffsetY = offsetY;
			offsetY = touch.screenY - touchStartY;
			// use offsetTop instead of scrollTop
			var newTop = (iosScrollWrapperStartScrollTop + offsetY);
//			if (newTop >= 0) {
//				iosScrollWrapper = (newTop + "px");

$("#iosScrollWrapper").css("transform", "translateY(" + currentTop + "px)");
test++;
$("#topBar").css("top", (test + "px"));
$("#debug").html("TOUCH: " + $("#topBar").offset().top);

//			} else {
//				// no going past top
//				newTop = 0;
//			}
			// note for global usage
			currentTop += newTop;
						
			break;
		}
	}	

	// if they specified additional goings on during scroll, call that for them here
	if (typeof(onTouchmoveAdditionalActions) == "function") {
		onTouchmoveAdditionalActions();
	}

});

//
// When touch is over or canceled, run this
//
function touchEnd (event) {
	for (var i=0; i < event.changedTouches.length; i++ ) {
		var touch = event.changedTouches[i];
		if (touch === activeTouch) {

// $("#debug").html("TE: " + document.body.top);

			applyInertia();
			activeTouch = null;
			break;
		}
	}
}

//
// Simulate the mobile scrolling inertia
//
function applyInertia () {

//	if (currentTop >= 0) {
	    var velocity = (offsetY - lastOffsetY) * 3;
	    var time = (Math.abs(velocity) / 350);
	    var iosScrollWrapperEndPosition = (iosScrollWrapper.offsetTop + velocity);
	
	    iosScrollWrapper.style.webkitTransition = ("transform " + time + "s ease-out");
		var rounded = Math.round(iosScrollWrapperEndPosition);

$("#debug").html("INERTIA");

	    // iosScrollWrapper.style.top = (rounded + "px");
		$("#iosScrollWrapper").css("transform", "translateY(" + rounded + "px)");

//	}
}
