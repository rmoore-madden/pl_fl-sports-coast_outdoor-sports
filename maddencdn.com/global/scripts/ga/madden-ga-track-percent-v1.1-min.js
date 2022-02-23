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

"undefined"==typeof console&&(console={},console.log=function(){}),jQuery(function(e){function n(){var n=e(window).height()+e(window).scrollTop(),t=e(document).height(),c=new Date,u=Math.round((c.getTime()-w)/1e3);for(i=h;i<l.length;i++)if(n>=l[i]&&u>0){var d=o(g[i]);r("Reading",d,u,location.pathname),a("READING: "+l[i]+" /  "+d+" / "+u),h=i+1}if(n>=t&&!p){c=new Date;var c=new Date,u=Math.round((c.getTime()-w)/1e3),d=o(1);r("Reading",d,u,location.pathname),a("READING: "+d+" / "+u),p=!0}}function t(n){var t=e(document).height(),o=Math.floor(t*n);return o}function o(e){var n="";return n=.001>e?"StartReading":1==e?"ContentBottom":"Reading "+100*e+"%"}function a(e){d&&console.log(e)}function r(e,n,t,o){u||("undefined"!=typeof dataLayer&&"function"==typeof dataLayer.push?dataLayer.push({event:"ScrollDistance",eventCategory:e,eventAction:n,eventLabel:o,eventValue:t}):"undefined"!=typeof _gaq?"undefined"!=typeof pageTracker?pageTracker._trackEvent(e,n,o,t):(_gaq.push(["_trackEvent",e,n,o,t]),_gaq.push(["pageTracker._trackEvent",e,n,o,t])):"undefined"!=typeof ga&&ga("send",{hitType:"event",eventCategory:e,eventAction:n,eventLabel:o,eventValue:t}))}function c(){for(i=0;i<g.length;i++)l[i]=t(g[i]),a("LOCATION: "+g[i]+" ("+l[i]+" / "+e(document).height()+")")}var u=!1,d=!1,f=100,g=[1e-4,.25,.5,.75],l=[],h=0,v=0,p=!1,s=new Date,w=s.getTime();e(window).load(function(){c()}),e(window).resize(function(){c()}),e(window).scroll(function(){v&&clearTimeout(v),v=setTimeout(n,f)})});
