!function(){function l(e,t){return t?this.settings.readingEventLabelPrefix+e+" pixels":e<.001?this.settings.readingEventLabelPrefix+"0%":this.settings.readingEventLabelPrefix+100*e+"%"}function d(e,t,i,n){if(!this.DEBUG_MODE){var s=function(){var e=null;null!=this.settings.gtmDataLayerName?e=this.settings.gtmDataLayerName:"undefined"!=typeof dataLayer&&"function"==typeof dataLayer.push&&(e=dataLayer);return e}();null==this.GA_TYPE&&(this.GA_TYPE=function(){var t=document.getElementsByTagName("script"),e="";for(var i in t)try{var n=t[i].getAttribute("src");if(n){if(-1!=n.indexOf("/gtm.js")){e="gtm";break}-1!=n.indexOf("/gtag")?e="gtag":-1!=n.indexOf("/analytics.js")?e="ga":-1!=n.indexOf("/ga.js")&&(e="gaq")}}catch(e){this.DEBUG_MODE&&(console.log(t[i]),console.log(e))}return e}()),"gtm"==this.GA_TYPE&&null!=s?(console.log("SOURCE: GTM"),s.push({event:this.settings.gtmEventName,eventCategory:e,eventAction:t,eventLabel:i,eventValue:n})):"gtag"==this.GA_TYPE?(console.log("SOURCE: GTAG"),gtag("event","mm_page_track",{event_category:e,event_action:t,event_label:i,event_value:n})):"ga"==this.GA_TYPE?(console.log("SOURCE: GA"),ga("send",{hitType:"event",eventCategory:e,eventAction:t,eventLabel:i,eventValue:n})):"gaq"==this.GA_TYPE&&(console.log("SOURCE: GAQ"),"undefined"!=typeof pageTracker?pageTracker._trackEvent(e,t,i,n):(_gaq.push(["_trackEvent",e,t,i,n]),_gaq.push(["pageTracker._trackEvent",e,t,i,n])))}}function t(){for(i=0;i<this.settings.readerTrackPercents.length;i++)this.readerLocations[i]=(e=this.settings.readerTrackPercents[i],void 0,t=document.documentElement.scrollHeight,Math.floor(t*e)),c("LOCATION: "+this.settings.readerTrackPercents[i]+" ("+this.readerLocations[i]+" / "+document.documentElement.scrollHeight+")");var e,t}function e(){this.timer&&clearTimeout(this.timer),this.timer=setTimeout(a,this.CALLBACK_DELAY)}function n(e,t){for(o in t)t.hasOwnProperty(o)&&(e[o]=t[o]);return e}function c(e){this.settings.logEventsToConsole&&console.log(e)}var s=!1;MMGAReadPercent=function(){this.DEBUG_MODE=!1,this.CALLBACK_DELAY=100,this.timer=0,this.readerLastPassed=0,this.isScrolling=!1,this.endContent=!1,this.didComplete=!1,this.readerLocations=[],this.startTime=(new Date).getTime(),this.totalTime=0;var e={readerTrackPercents:[1e-4,.25,.5,.75],fireReadCompleteEvent:!(this.GA_TYPE=null),readingEventLabelPrefix:"Reading ",gtmEventName:"ScrollDistance",gtmDataLayerName:null,firePixelDistanceEvents:!1,logEventsToConsole:!1};arguments[0]&&"object"==typeof arguments[0]?this.settings=n(e,arguments[0]):this.settings=n(e,[]),s=!0,t()};var a=function(){if(void 0!==this.readerLocations){var e=window.scrollY||window.pageYOffset,t=window.innerHeight+e,n=document.documentElement.scrollHeight,s=new Date,a=Math.round((s.getTime()-this.startTime)/1e3);for(i=this.readerLastPassed;i<this.readerLocations.length;i++)if(t>=this.readerLocations[i]&&0<a){var o=l(this.settings.readerTrackPercents[i],!1);if(d(this.settings.readingEventLabelPrefix,o,location.pathname,a),this.settings.firePixelDistanceEvents){var r=l(this.readerLocations[i],!0);d(this.settings.readingEventLabelPrefix,r,location.pathname,a)}c(this.settings.readingEventLabelPrefix+this.readerLocations[i]+" /  "+o+" / "+a),this.readerLastPassed=i+1}if(this.settings.fireReadCompleteEvent&&n<=t&&!this.didComplete){s=new Date;s=new Date,a=Math.round((s.getTime()-this.startTime)/1e3),o=l(1,!1);if(d(this.settings.readingEventLabelPrefix,o,location.pathname,a),this.settings.firePixelDistanceEvents){r=l(n,!0);d(this.settings.readingEventLabelPrefix,r,location.pathname,a)}c(this.settings.readingEventLabelPrefix+o+" / "+a),this.didComplete=!0}}};!function(e){if(window.jQuery)jQuery(document).ready(function(){e()});else if("function"!=typeof window.onload)window.onload=e;else{var t=window.onload;window.onload=function(){t&&t(),e()}}}(function(){if(!s)MMGAReadPercent()}),window.addEventListener?window.addEventListener("resize",t):window.attachEvent("onresize",t),window.addEventListener?window.addEventListener("scroll",e):window.attachEvent("onscroll",e)}(),"undefined"==typeof console&&(console={},console.log=function(){});