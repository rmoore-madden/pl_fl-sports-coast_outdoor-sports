/**
 * v1.7 - Copyright 2018 Madden Media - All rights reserved.
 *
 * Global frameworks functions for all content.
 *
 * Outside of 3 layout type elements (#isSmall, #isMedium, #isLarge), nothing
 *    in this file is specific to a given layout. There are default building block
 *    elements; however these elements can be overridden. See initLayout() below for more.
 */

// sticky top bar variables
var _stickyTopBarHeight = 0;
var _stickyTopBarOffset = 0;

// chapter data
var _chapterTops = new Array();
var _onChapter = 0;

// default callbacks
var _setChapterLinkCallback;
var _chapterSetCompleteCallback;

// default elements (can be overridden/set during init)
var _stickyTopBarEl = "#topBar";
var _stickyTopBarProgressBarEl;
var _mobileMenuEl = "#mobileMenu";
var _socialMenuTriggerEl = "#socialLinksTrigger";
var _topAndMobileMenuControl = "#controlsTrigger";
var _chapterEl = ".chapter";
var _chapterLinkEl = ".chapterLink";
var _chapterElPrefix = "#c";
var _multiSizeImageEl = ".multiSize";
var _readMoreEl = undefined;
var _relatedLinkEl = "#alsoLikeLinkWrap";
var _lazyLoadDataName = "[data-load-type]";

// for layout
var DEFAULT_SM_TEST_EL = "#isSmall";
var DEFAULT_MD_TEST_EL = "#isMedium";
var DEFAULT_LG_TEST_EL = "#isLarge";
var IS_RESPONSIVE = document.addEventListener;
var _isSmall = false;
var _isMedium = false;
var _isLarge = false;

var _lazyLoadObject = null;

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// STOCK EVENT FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Called on ready
//
// See initLayout() below for additional parameter descriptions
//
frameworksOnReady = function (customCallbacks, customElements, calulateChapterHeights) {

    // figure out mobile, tablet, desktop, parallax
    initViewTypes();

    // init layout
    initLayout(customCallbacks, customElements, calulateChapterHeights);
}

//
// Called on scroll
//
frameworksOnScroll = function () {
    // adjust the scroll bar progress
    adjustScrollProgress();
}

//
// Called on a touch move on mobile
//
frameworksOnTouchMove = function () {
    // adjust the scroll bar progress
    adjustScrollProgress();
}

//
// Called on resize
//
frameworksOnResize = function () {

    // figure out mobile, tablet, desktop, parallax
    initViewTypes();

    // adjust the layout
    adjustLayoutAfterResize();
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// LAYOUT PREP
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Figure out at the core what all we're doing
//
initViewTypes = function () {
    _isSmall = ( (jQuery(DEFAULT_SM_TEST_EL).length != 0) && (jQuery(DEFAULT_SM_TEST_EL).css("float") != "none") ) ? true : false;
    _isMedium = ( (jQuery(DEFAULT_MD_TEST_EL).length != 0) && (jQuery(DEFAULT_MD_TEST_EL).css("float") != "none") ) ? true : false;
    _isLarge = ( (jQuery(DEFAULT_LG_TEST_EL).length != 0) && (jQuery(DEFAULT_LG_TEST_EL).css("float") != "none") ) ? true : false;
}

//
// Initializes the layout for the content. This tests for a few HTML5 data attributes
//    for offsets related to read more jumps and a sticky nav bar height
//
// customCallbacks: Callback functions to use after some layout adjustments are performed. By
//                    default, these are not set. Options are:
//
//                        customCallbacks = {
//                            "setChapterLinkCallback": YOUR_FUNCTION_NAME,
//                            "chapterSetCompleteCallback": YOUR_FUNCTION_NAME
//                        };
//
//                    setChapterLinkCallback: When this frameworks sets the chapter, it needs to
//                        call back out to the main content to have that parent manage
//                        what happens to chapter links. It's assumed that the
//                        function will take a true|false param for on|off status.
//                     chapterSetCompleteCallback: If the main content wants to know when the
//                        chapter setting is all officially complete (including scrolling),
//                        it can be notified by giving this function name
//
// customElements: DOM identifiers (IDs or classes) of items essential to a basic
//                   layout. None, some or all can be provided, and all will have
//                   default values. Options (with current defaults shown) are as follows:
//
//                        customElements = {
//                            "topBar": "#topBar",
//                            "mobileMenuEl": "#mobileMenu",
//                            "socialMenuTriggerEl": "#socialLinksTrigger",
//                            "topAndMobileMenuControl": "#controlsTrigger",
//                            "chapterEl": ".chapter",
//                            "chapterLinkEl": ".chapterLink",
//                            "chapterElPrefix": "#c",
//                            "multiSizeImageEl: ".multiSize"
//                            "readMoreEl": undefined,
//                            "_relatedLinkEl": "#alsoLikeLinkWrap",
//                            "_lazyLoadDataName": "[data-load-type]"
//                        };
//
//                  topBar: CSS ID for the top sticky bar element
//                  mobileMenuEl: CSS ID for the mobile menu element
//                  socialMenuTriggerEl: CSS ID for the social menu trigger element
//                  topAndMobileMenuControl: CSS ID for the top/mobile menu trigger element
//                  chapterEl: CSS class for the content chapter elements
//                  chapterLinkEl: CSS class for the content chapter navigation elements
//                  chapterElPrefix: CSS ID string prefix for the individual chapter IDs
//                  multiSizeImageEl: CSS class for images that have multiple sizes based on
//                                    size/mode (which will be changed as the mode changes) - images
//                                    that are this class can have 4 data attributes: "data-src",
//                                    "data-src-medium", "data-src-small" and "data-src-legacy"
//                  readMoreEl: Can be either single or multiple identifiers - i.e.
//                              ".readMore" or [".readMore", "#introStory1"]
//                  relatedLinkEl: CSS ID for related Links wrapper to
//                                 populate related links after load
//                  lazyLoadDataName: Vanilla JS data selector for all lazy load items
//
// calulateChapterHeights: Should this process calculate the chapter heights? If callers
//                           will be adjusting the height of the page for any reason during
//                           a load process *after* this function is called, this should be
//                           set to false and then the caller should call initChapterTops()
//                           manually on their own when they are ready
//
initLayout = function (customCallbacks, customElements, calulateChapterHeights) {

    // populate custom callbacks
    if (customCallbacks != undefined) {
        _setChapterLinkCallback = customCallbacks["setChapterLinkCallback"] || _setChapterLinkCallback;
        _chapterSetCompleteCallback = customCallbacks["chapterSetCompleteCallback"] || _chapterSetCompleteCallback;
    }

    // populate custom layout elements
    if (customElements != undefined) {
        _stickyTopBarEl = customElements["topBar"] || _stickyTopBarEl;
        _mobileMenuEl = customElements["mobileMenuEl"] || _mobileMenuEl;
        _socialMenuTriggerEl = customElements["socialMenuTriggerEl"] || _socialMenuTriggerEl;
        _topAndMobileMenuControl = customElements["topAndMobileMenuControl"] || _topAndMobileMenuControl;
        _chapterEl = customElements["chapterEl"] || _chapterEl;
        _chapterLinkEl = customElements["chapterLinkEl"] || _chapterLinkEl;
        _chapterElPrefix = customElements["chapterElPrefix"] || _chapterElPrefix;
        _multiSizeImageEl = customElements["multiSizeImageEl"] || _multiSizeImageEl;
        _readMoreEl = customElements["readMoreEl"] || _readMoreEl;
        _relatedLinkEl = customElements["relatedLinkEl"] || _relatedLinkEl;
        _lazyLoadDataName = customElements["lazyLoadDataName"] || _lazyLoadDataName;
    }

    // load lazy load plugin and process
    jQuery.getScript("https://www.maddencdn.com/global/scripts/layout/madden-lazy-load-jquery-v1.3.min.js")
        .done(function(script, textStatus) {
        // load the elements into the plugin
        _lazyLoadObject = jQuery("*[data-load-type]").lazyLoad();
    })
        .fail(function(jqxhr, settings, exception) {
        console.log("NOTICE lazy load did not load.");

    });

    // figure out our mobile menu
    if (jQuery(_mobileMenuEl).length) {
        var mme = jQuery(_mobileMenuEl);
        var mmChaptersEl = mme.data("chapters");
        var mmToTopEl = mme.data("top-link");
        var mmCloseTriggerEl = mme.data("close-trigger");

        // if any data attributes are undefined, we need to know
        try {
            // listen to the close trigger el
            jQuery((mmCloseTriggerEl)).click(function () {
                toggleMobileMenu(_mobileMenuEl, _topAndMobileMenuControl);
            });
            // listen to the mobile top menu el
            jQuery(mmToTopEl).click(function () {
                toTop();
                toggleMobileMenu(_mobileMenuEl, _topAndMobileMenuControl);
            });
            // listen to the chapters
            jQuery(mmChaptersEl).children("div").each(function (index) {
                jQuery(this).click(function() {
                    toggleMobileMenu(_mobileMenuEl, _topAndMobileMenuControl);
                    var cc = jQuery(this).data("chapter");
                    if (typeof cc == "undefined") {
                        goToChapter((index + 1));
                    } else {
                        goToChapter(parseInt(cc));
                    }
                });
            });
        } catch(err) {
            console.log(err);
        }
    }

    // social links menu
    if (jQuery(_socialMenuTriggerEl).length) {
        var sLink = jQuery(_socialMenuTriggerEl);
        var sLinksClass = sLink.data("social-links");
        var sLinkClassOff = sLink.data("social-links-class-off");
        var sLinkClassOn = sLink.data("social-links-class-on");
        var sTriggerLinkClassOff = sLink.data("trigger-class-off");
        var sTriggerLinkClassOn = sLink.data("trigger-class-on");

        // if anything goes wrong, we need to know
        try {
            var sLinks = jQuery(sLinksClass);
            if (getIsDesktop()) {
                // non-touch devices
                sLinks.on("mouseenter", function (event) {
                    sLink.attr("class", sTriggerLinkClassOn);
                }).on("mouseleave", function (event) {
                    sLink.attr("class", sTriggerLinkClassOff);
                });
            } else {
                // touch devices
                jQuery(document).on("touchstart", sLinksClass, function (event) {
                    sLinks.attr("class", sLinkClassOn);
                    sLink.attr("class", sTriggerLinkClassOn);
                }).on("touchend", function(){
                    sLinks.attr("class", sLinkClassOff);
                    sLink.attr("class", sTriggerLinkClassOff);
                }).on("touchcancel", function() {
                    sLinks.attr("class", sLinkClassOff);
                    sLink.attr("class", sTriggerLinkClassOff);
                });
            }
        } catch(err) {
            console.log(err);
        }
    }

    // build the social links dynamically
    jQuery(".socialShare").each(function () {
        var cName = jQuery(this).attr("class");
        var url = "#";
        var openInDialog = false;
        if (cName.indexOf("pinterest") != -1) {
            var ogImg = jQuery(this).data("ogimage");
            url = buildSocialShareLink("PINTEREST", ogImg);
        } else if (cName.indexOf("twitter") != -1) {
            url = buildSocialShareLink("TWITTER", null);
        } else if (cName.indexOf("facebook") != -1) {
            openInDialog = true;
            url = buildSocialShareLink("FACEBOOK", null);
        }
        if (url == null) {
            jQuery(this).attr("href", "javascript:alert('Sharing this site is not currently available.')");
        } else {
            if (openInDialog) {
                // it's a dialog
                jQuery(this).attr("href", "#");
                jQuery(this).attr("onclick", url);
            } else {
                jQuery(this).attr("href", url);
            }
        }
    });

    // is there a top bar? if so, note the height
    if (jQuery(_stickyTopBarEl).length) {
        _stickyTopBarHeight = jQuery(_stickyTopBarEl).height();
        // see if there is an offset el to find
        if ( (jQuery(_stickyTopBarEl).data("offset-el") != undefined) && (jQuery(jQuery(_stickyTopBarEl).data("offset-el")).length != 0) ) {
            _stickyTopBarOffset = jQuery(jQuery(_stickyTopBarEl).data("offset-el")).offset().top;
        }
        // see if there is a progress bar el
        if ( (jQuery(_stickyTopBarEl).data("progress-bar-el") != undefined) && (jQuery(jQuery(_stickyTopBarEl).data("progress-bar-el")).length != 0) ) {
            _stickyTopBarProgressBarEl = jQuery(_stickyTopBarEl).data("progress-bar-el");
        }
    }

    // make any "read more" arrow and intro story links clickable
    if (_readMoreEl != undefined) {
        if (! jQuery.isArray(_readMoreEl)) {
            _readMoreEl = [ _readMoreEl ];
        }
        jQuery.each(_readMoreEl, function( index, value ) {
            jQuery(value).click(function () {
                var readMoreOffset = 0;
                // see if there is an offset el to find
                if ( (jQuery(value).data("offset-el") != undefined) && (jQuery(jQuery(value).data("offset-el")).length != 0) ) {
                    readMoreOffset = jQuery(jQuery(value).data("offset-el")).offset().top;
                }
                // scroll
                jQuery('html, body').animate({ scrollTop: (readMoreOffset - _stickyTopBarHeight) }, 300);
            });
        });
    }

    // note our chapter offsets if we are responsible for this
    if (calulateChapterHeights) {
        initChapterTops(true);
    }

    // smooth scroll for our name links
    jQuery(_chapterLinkEl).click(function() {
        // animate the scroll
        var cc = jQuery(this).data("chapter");
        if (typeof cc != "undefined") {
            goToChapter(parseInt(cc));
        } else {
            var target = jQuery(this.hash);
            goToChapter(this.hash.substr(1));
        }

        return false;
    });
}

//
// Gets the current chapter tops
//
// adjustScroll: Adjust the scroll progress after chapter tops are found?
//
initChapterTops = function (adjustScroll) {

    var tops = new Array();

    // find each chapter top
    jQuery(_chapterEl).each(function (index) {
        tops[index] = Math.floor(jQuery(this).offset().top - _stickyTopBarHeight);
    });
    // store the results
    _chapterTops = tops;

    // adjust scroll progress now?
    if (adjustScroll) {
        adjustScrollProgress();
    }
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// LAYOUT UPDATES
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Builds a social share link with the current page URL
//
// site: The site to go to ("FACEBOOK", "PINTEREST", "TWITTER")
// ogImage: the URL for the OG image (for Pinterest only)
//
buildSocialShareLink = function (site, ogImage) {
    var link = "";
    var url = "";
    var encURL = "";
    var encTitle = encodeURIComponent(document.title);
    var encOGImage = encodeURIComponent(ogImage);

    // is this running locally? if so, search in a known place or two for an online story link
    if (location.protocol == "file:") {
        var ogLink = jQuery("body").data("online-url");
        var cLink = jQuery("link[rel='canonical']").href;
        if (typeof ogLink !== "undefined") {
            url = ogLink;
        } else if (typeof cLink !== "undefined") {
            url = cLink;
        }

        // if the url is still empty, then we can't link to share the
        //    story - tell the caller that with an empty string
        if (url == "") {
            // MAY EXIT THIS BLOCK
            return null;
        }
    } else if (url == "") {
        // just set the url from the current link
        url = [location.protocol, '//', location.host, location.pathname].join('');
    }

    // now encode the url
    encURL = encodeURIComponent(url);

    // and set the link
    switch (site) {
        case "FACEBOOK":
            link = "window.open('https://www.facebook.com/sharer/sharer.php?u=" + encURL + "','facebook-share-dialog', 'width=626,height=436'); return false;";
            break;
        case "PINTEREST":
            link = ("https://www.pinterest.com/pin/create/button/?url=" + encURL
                    + "&media=" + encOGImage
                    + "&description=" + encTitle);
            break;
        case "TWITTER":
            link = ("https://twitter.com/intent/tweet?text=" + encTitle + "%3A%20" + encURL + "&amp;source=webclient");
            break;
    }

    return link;
}

//
// Set footer links after page load
//
// linkData: A JSON array of related link data with a title and link attribute per entry
//
buildRelatedLinks = function (linkData) {

    // look for the div in the dom
    var relatedLinks = jQuery(_relatedLinkEl);

    // loop and populate
    for (var i=0; i < linkData.length; i++) {
        var dispPos = (i + 1);
        // build the div linkWrapper to hold footer link
        var newRelatedLink = "<div class='linkWrapper'>"
        + "<a href='" + linkData[i].link + "' target='_blank'>"
        + "<div class='rLink rLink" + dispPos + "'>"
        + "<div id='linkWrapper" + dispPos + "' class='linkTitleWrapper'><div class='linkTitle'>" + linkData[i].title + "</div></div>"
        + "</div></a></div>";

        relatedLinks.append(newRelatedLink);
    }
}

//
// iPad Pro will use large size, but needs backgrounds set to scroll, not fixed. This will not
//    do any harm for non-pro devices, either, as they will be using the scroll setting regardless.
//
// el: The DOM identifier (ID or class) to act upon - will default to ".chapterImage" if unset
//
unFixBGImagesForIPads = function (el) {
    el = (typeof el == "undefined") ? ".chapterImage" : el;
    if ( (getIsLarge()) && (getIsIPad()) ) {
        $(el).css("background-attachment", "scroll");
    }
}

//
// Gets the lazy load plugin object for the caller to use or adjust settings on
//
getLazyLoadPluginObject = function () {
    return _lazyLoadObject;
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// LAYOUT ANALYSIS
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Returns the current chapter
//
getCurrentChapter = function () {
    return _onChapter;
}

//
// Returns the visible viewport (factors in the top bar height)
//
// includePx: include the "px" value?
//
getVisibleViewport = function (includePx) {

    if (includePx) {
        return ((window.innerHeight - _stickyTopBarHeight) + "px");
    } else {
        return parseInt(window.innerHeight - _stickyTopBarHeight);
    }
}

//
// Returns the scroll top of the given item
//
// el: The DOM identifier (ID or class) to scroll
// includePx: include the "px" value?
//
getViewportOffset = function (el, includePx) {

    if (includePx) {
        return ( (jQuery(el).offset().top - jQuery(window).scrollTop() - _stickyTopBarHeight) + "px");
    } else {
        return parseInt(jQuery(el).offset().top - jQuery(window).scrollTop() - _stickyTopBarHeight);
    }
}

//
// Returns if the passed item is in the viewport or not
//
// el: The DOM identifier (ID or class) to scroll
//
getItemInViewport = function (el) {
    var elOT = jQuery(el).offset().top;
    return ( (elOT + jQuery(el).outerHeight()) <= jQuery(window).scrollTop()) || (elOT >= (jQuery(window).scrollTop() + jQuery(window).height()) )
        ? false : true;
}

//
// Returns if the passed item is at the center of the viewport or not
//
// el: The DOM identifier (ID or class) to scroll
// offset: How far either way from center counts as "center"?
//
getItemInViewportCenter = function (el, offset) {
    var elOT = jQuery(el).offset().top;
    var halfWinHeight = (jQuery(window).height() / 2);
    offset = offset || 0;

    return ( (elOT >= (jQuery(window).scrollTop() + halfWinHeight + offset)) ||
            (elOT <= (jQuery(window).scrollTop() + halfWinHeight - offset)) )
        ? false : true;
}

//
// What's the height of the sticky bar?
//
getStickyTopBarHeight = function () {
    return _stickyTopBarHeight;
}

//
// Are we on mobile? (up to layout to set this - we just return that setting)
//
getIsSmall = function () {
    return _isSmall;
}

//
// Are we on a tablet? (up to layout to set this - we just return that setting)
//
getIsMedium = function () {
    return _isMedium;
}

//
// Are we doing parallax effects? (up to layout to set this - we just return that setting)
//
getIsLarge = function () {
    return _isLarge;
}

//
// Are we on mobile? (up to layout to set this - we just return that setting)
//
// DEPRECATED: use getIsSmall()
//
getIsMobile = function () {
    "undefined"!=typeof console&&console.log("%c NOTICE getIsMobile()) deprecated - use getIsSmall()","background:orange; color:black");
    return _isSmall;
}

//
// Are we on a tablet? (up to layout to set this - we just return that setting)
//
// DEPRECATED: use getIsMedium()
//
getIsTablet = function () {
    "undefined"!=typeof console&&console.log("%c NOTICE getIsTablet()) deprecated - use getIsMedium()","background:orange; color:black");
    return _isMedium;
}

//
// Are we doing parallax effects? (up to layout to set this - we just return that setting)
//
// DEPRECATED: use getIsLarge()
//
getDoParallax = function () {
    "undefined"!=typeof console&&console.log("%c NOTICE getDoParallax()) deprecated - use getIsLarge()","background:orange; color:black");
    return _isLarge;
}

//
// Is this desktop? (not up to layout - user agent test)
//
getIsDesktop = function () {
    return (! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

//
// Is the user on an iPad?
//
getIsIPad = function () {
    return (navigator.userAgent.match(/iPad;.*CPU.*OS/i));
}

//
// Later-generation iPads support more desktop-esque funcionality - here's a test for them
//
getIsNewerIPad = function() {
    if (! getIsIPad()) {
        // MAY EXIT THIS BLOCK
        return false;
    }

    return (window.devicePixelRatio == 1) ? false : true;
}

//
// Will the design be responsive? (not up to layout - javascript test)
//
getIsResponsive = function () {
    return IS_RESPONSIVE;
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// LAYOUT ADJUSTMENTS
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Adjusts the layout of content after/during a resize event
//
adjustLayoutAfterResize = function () {

    // reset chapter tops
    initChapterTops(true);
}

//
// Adjusts the height of an art element to the related text element
//
// artEl: The DOM identifier (ID or class) for the art to change
// textEl: The DOM identifier (ID or class) for the text to match to
//
adjustChapterLinksArtHeight = function (artEl, textEl) {
    jQuery(artEl).css("height", jQuery(textEl).outerHeight());
}

//
// Maximizes the passed item's size to the width of the parent and the height of the viewport
//
// itemEl: The DOM identifier (ID or class) for the item to alter
// parentEl: The DOM identifier (ID or class) of the parent element
//
adjustSizeToParentAndViewport = function (itemEl, parentEl) {

    jQuery(itemEl).css("height", getVisibleViewport(true));
    jQuery(itemEl).css("width", jQuery(parentEl).width());
}

//
// Given itemEl, this adjusts the height of itemEl to the height of parentEl
//
// itemEl: The DOM identifier (ID or class) for the item to alter
// parentEl: The DOM identifier (ID or class) of the parent element
//
adjustSizeHeightToParent = function (itemEl, parentEl) {
    var h = jQuery(parentEl).height();
    jQuery(itemEl).css("height", (h + "px"));
}

//
// Adjust all passed elements to the same height
//
// itemEls: An array of the DOM identifiers (ID or class) for the items to alter
//
equalizeElementHeightsToTallest = function (itemEls) {
    var max = 0;

    // determine who is the tallest
    for (var i=0; i < itemEls.length; i++) {
        var h = jQuery(itemEls[i]).height();
        if (h != null) {
            max = (h > max) ? h : max;
        }
    }

    // set all to max
    for (var i=0; i < itemEls.length; i++) {
        jQuery(itemEls[i]).css("height", (max + "px"));
    }
}

//
// Updates the current scroll progress
//
adjustScrollProgress = function () {

    // first we see if the progress div exists
    if (jQuery(_stickyTopBarProgressBarEl).length == 0) {
        // MAY EXIT THIS BLOCK
        return;
    }

    var chapter = -1;
    var wh = jQuery(document).height();
    var h = jQuery("body").height();
    var scrollHeight = (wh - h - _stickyTopBarOffset);
    var scrollPercent;

    // calculate
    scrollPercent = Math.round(((jQuery(document).scrollTop() - _stickyTopBarOffset) / scrollHeight) * 100);

    // update the bar
    jQuery(_stickyTopBarProgressBarEl).css("width", (scrollPercent + "%"));

    // which chapter?
    for (var i=(_chapterTops.length-1); i >= 0; i--) {
        if (jQuery(document).scrollTop() >= _chapterTops[i]) {
            chapter = (i + 1);
            break;
        }
    }

    // adjust the links if we found a match
    if (chapter != -1) {
        adjustChapterLinks(chapter);
    }

    return chapter;
}

//
// Sets the class for the current chapter that the reader is on
//
// NOTE: see initLayout above for note on the _setChapterLinkCallback
//
// chapter: The current chapter
//
adjustChapterLinks = function (chapter) {

    // loop through the links
    jQuery(_chapterLinkEl).each(function () {
        if (jQuery(this).attr("href") != ("#" + chapter) ) {
            // turn it off
            if (typeof(_setChapterLinkCallback) == "function") {
                _setChapterLinkCallback(this, false);
            }
        } else {
            // turn it on
            if (typeof(_setChapterLinkCallback) == "function") {
                _setChapterLinkCallback(this, true);
            }
            // and note it
            _onChapter = chapter;
        }
    });
}

//
// Finds all images declared to be multi-sized and changes their source
//    according to which view we're in
//
// DEPRECATED: Lazy loading is automatically handled by frameworks with separate plugin
//
adjustMultiSizedImages = function () {
    "undefined"!=typeof console&&console.log("%c NOTICE adjustMultiSizedImages()) deprecated - lazy load is automatically managed","background:orange; color:black");
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// USER INTERACTION
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Scrolls nicely back to the top
//
toTop = function () {
    jQuery('html, body').animate({ scrollTop: 0 }, 600);
}

//
// The top menu might not always be a top menu - use this to handle that
//
runTopMenuControl = function () {
    if (getIsSmall()) {
        toggleMobileMenu(_mobileMenuEl, _topAndMobileMenuControl);
    } else {
        toTop();
    }
}

//
// Toggles the passed mobile menu
//
// menuEl: The DOM identifier (ID or class) for the menu
// expEl: The DOM identifier (ID or class) for the menu expand icon
//
toggleMobileMenu = function (menuEl, expEl) {
    if (getIsSmall()) {
        jQuery(menuEl).toggle("fast");
        jQuery(expEl).toggle("fast");
    }
}

//
// Scrolls to the requested chapter
//
// chapter: The chapter to go to
//
goToChapter = function (chapter) {

    var target = jQuery((_chapterElPrefix + chapter));

    // factor in top bar height (+1 pixel just to tuck it underneath the top bar)
    var oTop = (target.offset().top - _stickyTopBarHeight + 1);

    // create a delay that is inversely proportional to the number of chapters jumping
    var chaptersTraveled = (_onChapter > chapter) ? (_onChapter - chapter) : (chapter - _onChapter);
    var delay = Math.floor(1000 / (_chapterTops.length - (_chapterTops.length - chaptersTraveled)));

    // and go
    jQuery('html, body').animate({ scrollTop: oTop }, delay, function() {
        // set the chapter
        adjustChapterLinks(chapter);
        // and chapter setting is done - is there a custom function we should call?
        if (typeof(_chapterSetCompleteCallback) == "function") {
            _chapterSetCompleteCallback(chapter);
        }
    });

    // update this
    _onChapter = chapter;
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// ANIMATION / MANIPULATION
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

//
// Scrolls the background position of the passed element in a slideshow manner
//
// el: The DOM identifier (ID or class) to scroll
// xAdjust: How much X to adjust (can be negative or a string)
// yAdjust: How much Y to adjust (can be negative or a string)
// timeout: The timeout to pause between changes
// scrollChapter: Run the scroll when on this chapter
//
animateOverflowContent = function (el, xAdjust, yAdjust, timeout, scrollChapter) {

    // set it if we're on the desired chapter
    if (scrollChapter == _onChapter) {
        var bPos = jQuery(el).css("background-position").split(" ");
        var newXPos = (isNaN(xAdjust)) ? xAdjust : (xAdjust + parseInt(bPos[0]) + "px");
        var newYPos = (isNaN(yAdjust)) ? yAdjust : (yAdjust + parseInt(bPos[1]) + "px");

        // set
        jQuery(el).css({
            "background-position": (newXPos + " " + newYPos)
        });
    }

    // loop regardless
    window.setTimeout(function() {
        animateOverflowContent(el, xAdjust, yAdjust, timeout, scrollChapter);
    }, timeout);
}

//
// Super-basic cross-fade loop
//
// Credit: http://www.simonbattersby.com/blog/simple-jquery-image-crossfade/
//
// el: The DOM identifier (ID or class) to scroll
// delay: The delay between fades
//
cycleImages = function (el, delay) {
    var active = jQuery(el + " .active");
    var next = (active.next().length > 0) ? active.next() : jQuery(el + " img:first");
    next.css("z-index", 2); // move the next image up the pile
    active.fadeOut(delay, function() {
        // fade out the top image
        active.css("z-index", 1).show().removeClass("active"); // reset the z-index and unhide the image
        next.css("z-index", 3).addClass("active"); // make the next image the top one
    });
}
