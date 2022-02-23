/**
 * v1.0
 *
 * Callsource script to lookup a phone number based on passed parameters and then store said params as 
 *	cookies for subsequent usage.
 *
 * NOTE: This was originally a third party script that has been rewritten by Madden Media for their usage.
 */

var backwardsCompatible = true; // leaving true fixes IE cookie problem in old version
								// setting to false improves performance of new version

// the script id (contains styles for the resulting iframe content)
var scriptID = "csScript";

// the iframe id to be assigned (so that callers can further control that element)
var iframeID = "csIFrame";

var callsourceServer = 'reporting.callsource.com'; // for production - use 'budev08.callsource.com' for testing
var referrerHost = (document.referrer.split('/'))[2]; // for production - use 'CMN' for testing

var urlString = window.location.href;
var thisHost = (urlString.split('/'))[2];

// get parameters from url
var accountParam = getParameter("ctd_ac", urlString);
var customerParam = getParameter("ctd_co", urlString);
var campaignParam = getParameter("ctx_name", urlString);
var adsourceParam = getParameter("ct_Ad_Source", urlString);

///////////////////////////////////////////////////////////
// CONFIGURE PARAMETERS
///////////////////////////////////////////////////////////

// variants to try if the adsourceParam was not discovered
if (adsourceParam.length == 0) { adsourceParam = getParameter("ctx_Ad%20Source", urlString); }
if (adsourceParam.length == 0) { adsourceParam = getParameter("ct_Ad\\+Source", urlString); }
if (adsourceParam.length == 0) { adsourceParam = getParameter("ctx_Ad\\+Source", urlString); }

// attempt to discover referrer host
if (referrerHost != null && thisHost.indexOf(referrerHost) == -1 && referrerHost.indexOf('undefined') == -1) {
	setCookie("ReferrerHost", referrerHost, "3600");
} else {
	referrerHost = getCookie("ReferrerHost");
}

// check for parameters in URL
if ( (urlString.indexOf("ctd_ac") != -1) && (urlString.indexOf("ctd_co") != -1) ) {
	var cookieValue = getCookie("CTTrackRef");
	// create cookie of it does not exist	
	if (cookieValue == null) {
		setCookie("CTTrackRef", urlString, "3600");
	} else {
		cookieQueryString = (cookieValue.split("?"))[1];
		thisQueryString = (urlString.split("?"))[1];
		// create new cookie if the current parameters are different from the saved parameters
		if (thisQueryString.indexOf(cookieQueryString) == -1) {
			setCookie("CTTrackRef", urlString, "3600");
		}
	}
} else {
	// paramemters are not present - check for a cookie
	var cookieValue = getCookie("CTTrackRef");
	if (cookieValue != null) {
		var queryString = (cookieValue.split("?"))[1];
		if (queryString != null) {
			var redirectURL;
			if (urlString.indexOf('?') > -1) {
				// Preserve other parameters in current URL.
				redirectURL = urlString+'&'+queryString;
			} else {
				// No other parameters are present in current URL.
				redirectURL = urlString+'?'+queryString;
			}
			if (window.ActiveXObject && backwardsCompatible) {
				// This is for the IE cookie problem in the old version
				window.location = redirectURL;
			} else {
				accountParam = getParameter("ctd_ac", redirectURL);
				customerParam = getParameter("ctd_co", redirectURL);
				campaignParam = getParameter("ctx_name", redirectURL);
				adsourceParam = getParameter("ct_Ad_Source", redirectURL);
				// console.log("DEBUG");
				// console.log(accountParam);
				// console.log(customerParam);
				// console.log(campaignParam);
				// console.log(adsourceParam);
			}
		}
	}
}

///////////////////////////////////////////////////////////
// CORE FUNCTIONS
///////////////////////////////////////////////////////////

//
// Builds the iFrame to show the number generated by Callsource
//
// number: The number to show by default and potentially replace if the call works
// format: An optional format for the number (i.e. "(xxx) xxx-xxxx") for the resulting number
// cssScriptID: An optional CSS ID for the script tag for this instance of the number replace
// cssIFrameID: An optional CSS ID for the iFrame for this instance of the number replace
// account: An optional override for URL parameters for the account ID
// customer: An optional override for URL parameters for the customer ID
// campaign: An optional override for URL parameters for the campaign ID
// adsource: An optional override for URL parameters for the adsource ID
//
function replaceNumber (number, format, cssScriptID, cssIFrameID, account, customer, campaign, adsource) {
	//use parameters from url if not defined for function
	if ((account == null || account == "undefined") && accountParam.length > 0) {
		account = accountParam;
	}
	if ((customer == null || customer == "undefined") && customerParam.length > 0) {
		customer = customerParam;
	}
	if ((campaign == null || campaign == "undefined") && campaignParam.length > 0) {
		campaign = campaignParam;
	}
	if ((adsource == null || adsource == "undefined") && adsourceParam.length > 0) {
		adsource = adsourceParam;
	}
	// set defaults
	if ( (format == null) || (format == "undefined") ) {
		format = '(xxx) xxx-xxxx';
	}
	if (campaign == null) {
		campaign = 'undefined';
	}
	if (adsource == null) {
		adsource = 'undefined';
	}

	// specified iframe id? if not, use default
	var iID = (cssIFrameID == null) ? iframeID : cssIFrameID;

	// get layout information by getting current script tag object
	var scriptTag = document.getElementById((cssScriptID == null) ? scriptID : cssScriptID);
	
	var frameWidth = encodeURIComponent((scriptTag.getAttribute("data-frame-width") == undefined) ? "150" : scriptTag.getAttribute("data-frame-width"));
	var frameHeight = encodeURIComponent((scriptTag.getAttribute("data-frame-height") == undefined) ? "17" : scriptTag.getAttribute("data-frame-height"));
	var textcolor = encodeURIComponent(getHex(getCSSStyleFromElement(scriptTag, 'color')));
	var fontfamily = encodeURIComponent(getCSSStyleFromElement(scriptTag, 'font-family', 'fontFamily'));
	var fontsize = encodeURIComponent(getCSSStyleFromElement(scriptTag, 'font-size', 'fontSize'));
	var fontstyle = encodeURIComponent(getCSSStyleFromElement(scriptTag, 'font-style', 'fontStyle'));
	var fontweight = encodeURIComponent(getCSSStyleFromElement(scriptTag, 'font-weight', 'fontWeight'));
	
	var servletRequest = 'http://' + callsourceServer
			+ '/simplelookup/Lookup?ctd_ac=' + encodeURIComponent(account) + '&ctd_co='
			+ encodeURIComponent(customer) + '&ctx_name=' + encodeURIComponent(campaign) + '&ct_Ad_Source='
			+ adsource + '&fmt=' + encodeURIComponent(format) + '&number=' + encodeURIComponent(number)
			+ '&referrer=' + encodeURIComponent(referrerHost) + '&textcolor=' + textcolor
			+ '&fontfamily=' + fontfamily + '&fontsize=' + fontsize
			+ '&fontstyle=' + fontstyle + '&fontweight=' + fontweight;
	var iframe = '<iframe id="' + iID + '" allowtransparency="true" frameborder=0 marginwidth=0 marginheight=0 scrolling="no" '
			+ 'width="' + frameWidth + '" height="' + frameHeight + '" src="' + servletRequest + '"></iframe>';

console.log(iframe);

	document.write(iframe);
}

///////////////////////////////////////////////////////////
// UTILITY FUNCTIONS
///////////////////////////////////////////////////////////

//
// Creates a cookie
//
// name: The name of the cookie to set
// value: The value for the cookie
// seconds: How far out does it expire?
//
function setCookie (name, value, seconds) {
	var expires = "";
	if (seconds) {
		var date = new Date();
		date.setTime(date.getTime()+(seconds*1000));
		expires = "; expires="+date.toGMTString();
	}
	document.cookie = name+"="+value+expires+"; path=/";
}

//
// Finds the value for the requested cookie name
//
// name: The name of the cookie to look for
//
function getCookie (name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) {
			// MAY EXIT THIS BLOCK
			return c.substring(nameEQ.length,c.length);
		}
	}
	return null;
}

//
// Gets a parameter from the URL string
//
// name: The parameter to find
// urlString: The URL string to search
//
function getParameter (name, urlString) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec(urlString);
	if( results == null ) {
		return "";
	} else {
		return results[1];
	}
}

//
// Gets a style setting from the passed DOM element
//
// element: The parameter to find
// property: The CSS property to find (i.e. "font-size")
// variant: If - for example - "font-size" is "fontSize" (older browsers)
//
function getCSSStyleFromElement (element, property, variant) {
	var value = "";

	if (element.currentStyle) {
		value = element.currentStyle[property];
	} else if (window.getComputedStyle) {
		value = document.defaultView.getComputedStyle(element,null).getPropertyValue(property);
	}

	if ( (value == "") && (variant != undefined) ) {
		// try the variant
		if (element.currentStyle) {
			value = element.currentStyle[variant];
		} else if (window.getComputedStyle) {
			value = document.defaultView.getComputedStyle(element,null).getPropertyValue(variant);
		}
	}

	return value;
}

//
// Converts a color string to a hex color
//
// color: The color to convert
//
function getHex (color) {
	if (color.indexOf('rgb') > -1) { // Mozilla in rgb(255, 255, 255) format
		var rgbcolor = ((color.split("("))[1].split(")"))[0].split(",");
		var red = rgbcolor[0];
		var green = rgbcolor[1];
		var blue = rgbcolor[2];
		return RGBtoHex(red, green, blue);
	} else { // IE already hex or color word
		if (color.indexOf('#') == 0)
			color = color.substring(1);
		return color;
	}
}

//
// Converts R/G/B color values to a hex color
//
// R: red
// G: green
// B: blue
//
function RGBtoHex (R,G,B) {
	return toHex(R)+toHex(G)+toHex(B)
}

//
// Converts a number to a hex equivalent
//
// N: The number to convert
//
function toHex (N) {
	if (N==null) return "00";
	N=parseInt(N);
	if (N==0 || isNaN(N))
		return "00";
	N=Math.max(0,N);
	N=Math.min(N,255);
	N=Math.round(N);
	return "0123456789ABCDEF".charAt((N-N%16)/16)
		+ "0123456789ABCDEF".charAt(N%16);
}