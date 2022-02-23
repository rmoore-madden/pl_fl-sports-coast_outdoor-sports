/**
 * v1.3 - Copyright 2019 Madden Media - All rights reserved.
 *
 * Supports lazy loading of multimedia page content based on usage of data attributes.
 *    The current document size used to evaluate which size to load uses the standard
 *    Madden Media floating div test.
 *
 * Tags:
 *    - data-load-onload: if present, this will load on load of page (good for hero image)
 *    - data-load-manual: if present, this will not load on scroll.
 *    - data-load-offset: sm|md|lg - How far ahead of time should the asset be loaded? Can
 *        correlate to the image, or can be any value if staggered image load is required
 *        for a large cluster of images.
 *    - data-load-type: image|class|bg|poster - what type of asset is being loaded?
 *        "img": img tag src
 *        "class": the class to add to the element (useful for bg images)
 *        "bg": set the background-image file to the related size
 *        "poster": video tag poster image
 *    - data-load-alt: If an image, this will be set as the alt tag after load
 *    - data-load-all: The data for all sizes (usually class name for a bg image)
 *    - data-load-lg: The data for the large (e.g. desktop) size (class name or img src)
 *    - data-load-md: The data for the large (e.g. tablet) size (class name or img src)
 *    - data-load-sm: The data for the small (e.g. mobile) size (class name or img src)
 *
 * Suggested usages:
 *    - Elements by this plugin data type:
 *        MMLazyLoad.init({ loadElements: document.querySelectorAll("[data-load-type]") });
 *    - Elements by custom CSS class:
 *        MMLazyLoad.init({ loadElements: document.getElementsByClassName("[CSS_CLASS_NAME]") });
 *    - Single element by ID, from framework: 
 *          getLazyLoadPluginObject().manual('[ID]');
 *        
 */

(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.MMLazyLoad = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    'use strict';

    var IS_BOT = /bot|google|baidu|bing|msn|duckduckgo|teoma|slurp|yandex/i.test(navigator.userAgent);

    // window size info
    var smTestEl = null;
    var mdTestEl = null;
    var lgTestEl = null;
    var _isSmall = false;
    var _isMedium = false;
    var _isLarge = false;

    // other vars
    var MMLazyLoad = {};
    var supports = ( (!! document.querySelector) && (!! root.addEventListener) );
    var settings = {};

    //
    // loadElements: An array of elements to act upon for this plugin
    // preloadDistanceLg: How far ahead of a "large" image should loading start (in px)?
    // preloadDistanceMd: How far ahead of a "medium" image should loading start (in px)?
    // preloadDistanceSm: How far ahead of a "small" image should loading start (in px)?
    // debug: Might be handy for this plugin to log when items load (true|false)
    //
    var defaults = {
        loadElements: null,
        preloadDistanceLg: 1000,
        preloadDistanceMd: 600,
        preloadDistanceSm: 250,
        debug: false
    };

    // for scrolling
    var windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var scrollTop = window.pageYOffset;

    // holder array for discovered elements to be managed
    var MMLazyLoadEls = [];

    // holder for processed elements to be managed
    var MMProcessedlazyLoadEls = [];

    //
    // Public Functions
    //

    /**
     * Initialize
     * @public
     * @param {Object} options User settings
     */
    MMLazyLoad.init = function (options) {

        if (! supports) {
            // MAY EXIT THIS BLOCK
            return;
        }

        MMLazyLoad.destroy();

        // build options
        settings = options;
        for (var opt in defaults) {
            if (typeof settings[opt] === 'undefined') {
                settings[opt] = defaults[opt];
            }
        }

        // find size trackers
        smTestEl = document.getElementById("isSmall");
        mdTestEl = document.getElementById("isMedium");
        lgTestEl = document.getElementById("isLarge");

        // integrity check - data
        if (settings.loadElements == null) {
            console.log("LAZYLOAD: No elements provided - please do so during config with 'loadElements'. Exiting now.");
            // MAY EXIT THIS BLOCK
            return;
        }

        // integrity check - size tester elements
        if ( (! smTestEl) || (! mdTestEl) || (! lgTestEl) ) {
            console.log("LAZYLOAD: Missing one or more size testers. Exiting now.");
            // MAY EXIT THIS BLOCK
            return;
        }

        // get the document size
        getDocumentSize();

        // go through the set and either load now or add to scroll list
        for (var i=0; i < settings.loadElements.length; i++) {
            if ( (IS_BOT) || (settings.loadElements[i].getAttribute("data-load-onload")) ) {
                // is a bot or not tied to scroll - load now
                loadContent(settings.loadElements[i], settings.debug);
                MMProcessedlazyLoadEls.push(settings.loadElements[i]);
            } else {
                // copy all the rest to a holder array that we can remove items
                //    from as they are loaded
                MMLazyLoadEls.push(settings.loadElements[i]);
            }
        }

        // listen for events
        window.addEventListener("resize", windowResizeListener, false);
        window.addEventListener("orientationchange", windowResizeListener, false);
        window.addEventListener("scroll", windowScrollListener, false);

        // return to caller if they called init directly
        return MMLazyLoad;
    };

    /**
     * Destroy the current initialization
     * @public
     */
    MMLazyLoad.destroy = function () {

        if (! settings) {
            // MAY EXIT THIS BLOCK
            return;
        }

        // remove event listeners
        window.removeEventListener("resize", windowResizeListener, false);
        window.removeEventListener("orientationchange", windowResizeListener, false);
        window.removeEventListener("scroll", windowScrollListener, false);

        settings = null;
    };

    /**
     * Gets the debug mode
     * @public
     */
    MMLazyLoad.getDebugMode = function () {

        if (! settings) {
            // MAY EXIT THIS BLOCK
            return;
        }

        return settings.debug;
    };

    /**
     * Sets the debug mode
     * @public
     */
    MMLazyLoad.setDebugMode = function (debug) {

        if (! settings) {
            // MAY EXIT THIS BLOCK
            return;
        }

        settings.debug = debug;
    };

    //Manually call lazyload by ID:
    MMLazyLoad.manual = function(id) {
        for(let i = 0; i < MMLazyLoadEls.length; i++) {
            if(MMLazyLoadEls[i].getAttribute('id') === id) {
                loadContent(MMLazyLoadEls[i], settings.debug);
                MMProcessedlazyLoadEls.push(MMLazyLoadEls[i]);
                MMLazyLoadEls.splice(i, 1);
            }
        }
    }

    //
    // Events
    //

    /**
     * Listens for resizes
     * @private
     */
    function windowResizeListener (e) {
        // listen for resizing to change size testers
        getDocumentSize();

        // update window height and scroll top
        windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        scrollTop = window.pageYOffset;

        // reload what we already loaded, as the size might have changed
        for (var i=0; i < MMProcessedlazyLoadEls.length; i++) {
            loadContent(MMProcessedlazyLoadEls[i], settings.debug);
        }
    }

    /**
     * Listens for scrolls
     * @private
     */
    function windowScrollListener (e) {

        // update current scroll top
        scrollTop = (window.pageYOffset + windowHeight);

        // loop through unloaded items
        for (var i=0; i < MMLazyLoadEls.length; i++) {

            var elOffsetTop = Math.max(MMLazyLoadEls[i].getBoundingClientRect().top + window.pageYOffset);

            // what size is the content? we need this number to calculate how far before we start the loading
            var size = (MMLazyLoadEls[i].getAttribute("data-load-offset"))
                ? MMLazyLoadEls[i].getAttribute("data-load-offset")
                : "sm";
            var offset = 0;
            var manual = MMLazyLoadEls[i].getAttribute("data-load-manual");
            switch (size) {
                case "lg":
                    offset = settings.preloadDistanceLg;
                break;
                case "md":
                    offset = settings.preloadDistanceMd;
                break;
                case "sm":
                    offset = settings.preloadDistanceSm;
                break;
            }

            // are we ready to load it?
            if (!manual && scrollTop >= (elOffsetTop - offset)) {
                // yes!
                loadContent(MMLazyLoadEls[i], settings.debug);
                // add it to the processed set and remove it from the monitored set
                MMProcessedlazyLoadEls.push(MMLazyLoadEls[i]);
                MMLazyLoadEls.splice(i, 1);
            }
        }
    }

    //
    // Private Functions
    //

    /**
     * Updates the current document size
     * @private
     */
    function getDocumentSize () {
        var sSm = (window.getComputedStyle)
            ? getComputedStyle(smTestEl, null) : smTestEl.currentStyle;
        var sMd = (window.getComputedStyle)
            ? getComputedStyle(mdTestEl, null) : mdTestEl.currentStyle;
        var sLg = (window.getComputedStyle)
            ? getComputedStyle(lgTestEl, null) : lgTestEl.currentStyle;

        _isSmall = ( (smTestEl) && (sSm.getPropertyValue("float") != "none") ) ? true : false;
        _isMedium = ( (mdTestEl) && (sMd.getPropertyValue("float") != "none") ) ? true : false;
        _isLarge = ( (lgTestEl) && (sLg.getPropertyValue("float") != "none") ) ? true : false;
    }

    /**
     * Content loader
     * @private
     *
     * el: The DOM element to work with
     * debug: output load info to console?
     */
    function loadContent (el, debug) {
        var sizeData = false;
        if (el.getAttribute("data-load-all")) {
            // all have the same
            sizeData = el.getAttribute("data-load-all");
        } else if (_isSmall) {
            // small
            sizeData = el.getAttribute("data-load-sm");
        } else if (_isMedium) {
            // medium
            sizeData = el.getAttribute("data-load-md");
        } else {
            // you get where this is going
            sizeData = el.getAttribute("data-load-lg");
        }

        if (sizeData) {
            // and now what type of content is it?
            if (el.getAttribute("data-load-type") == "img") {
                // img src
                el.setAttribute("src", sizeData);
                // alt tag?
                if (el.getAttribute("data-load-alt")) {
                    el.setAttribute("alt", el.getAttribute("data-load-alt"));
                }
                if (debug) {
                    console.log("LAZYLOAD img: " + sizeData);
                }
            } else if ( (el.getAttribute("data-load-type") == "class") && (! el.classList.contains(sizeData)) ) {
                // css class
                el.classList.add(sizeData);
                if (debug) {
                    console.log("LAZYLOAD class: " + sizeData);
                }
            } else if (el.getAttribute("data-load-type") == "bg") {
                // background-image property transfer
                el.style.backgroundImage = "url('" + sizeData + "')";
                if (debug) {
                    console.log("LAZYLOAD bg: " + sizeData);
                }
            } else if (el.getAttribute("data-load-type") == "poster") {
                // video poster
                el.setAttribute("poster", sizeData);
                if (debug) {
                    console.log("LAZYLOAD poster: " + sizeData);
                }
            }
        } else {
            if (debug) {
                console.log("LAZYLOAD not loading: no size found for this view");
                console.log(el);
            }
        }
    }

    // give back to caller
    return MMLazyLoad;
});
