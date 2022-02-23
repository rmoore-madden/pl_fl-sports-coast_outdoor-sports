/*
 * v1.1
 *
 * Automatically track outbound links in Google Analytics. Any link that you do not want tracked
 *	can be assigned a "noGA" class and it will not be skipped here. Includes support for GA and GAQ
 *
 * CREDIT: http://www.sitepoint.com/track-outbound-links-google-analytics/
 *
 * Modified to support ability for links to open in new window w/o triggering a popup warning
 */

!function(e){"use strict";{var t="noGA";window.location.host}e("body").on("click",function(n){function a(e,t){if("undefined"!=typeof _gaq)if("undefined"!=typeof pageTracker)pageTracker._trackEvent("Presentation Layer","Outbound Click",e);else{var n=function(t){return t?void(self.location.href=e):!1};_gaq.push(["_set","hitCallback",n(t)]),_gaq.push(["_trackEvent","Presentation Layer","Outbound Click",e]),_gaq.push(["pageTracker._trackEvent","Presentation Layer","Outbound Click",e])}else"undefined"!=typeof ga&&ga("send",{hitType:"event",eventCategory:"Presentation Layer",eventAction:"Outbound Click",eventLabel:e,hitCallback:t?function(){self.location.href=e}:function(){return!1}})}if(!(n.isDefaultPrevented()||"undefined"==typeof _gaq&&"undefined"==typeof ga)){var i=e(n.target).closest("a");if(1==i.length&&(void 0===i.attr("class")||-1==i.attr("class").indexOf(t))){n.preventDefault();var o=i[0].href,r=i[0].target;""!=r?(e(i[0]).on("click",function(){window.open(o,r);return a(o,!1),!1}),e(i[0]).click()):(a(o,!0),setTimeout(function(){self.location.href=o},1e3))}}})}(jQuery);
