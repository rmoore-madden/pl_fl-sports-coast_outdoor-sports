/**
 * v1.0
 *
 * Hover controls - shows or hides controls based on mouse location
 */
!function(e){var t,a=0,n=500,s=!1;e.fn.HoverControls=function(a){var n=e.extend({delay:5e3,parentElment:document,cssClass:"",triggerOnScroll:!0},a),o=e(this),l=n.triggerOnScroll?"mouseenter mousemove scroll":"mouseenter mousemove";e(n.parentElment).on(l,function(){s||(o.addClass(n.cssClass),i(o,n.delay,n.cssClass))}),e(n.parentElment).on("mouseleave",function(){o.removeClass(n.cssClass),clearInterval(t)}),o.on("mouseover",function(){s=!0,clearInterval(t)}),o.on("mouseleave",function(){s=!1,i(o,n.delay,n.cssClass)})};var i=function(e,s,i){a=0,clearInterval(t),t=setInterval(function(){o(s)||e.removeClass(i)},n)},o=function(e){var t=!0;return a==e&&(a=0,t=!1),a+=n,t}}(jQuery);
