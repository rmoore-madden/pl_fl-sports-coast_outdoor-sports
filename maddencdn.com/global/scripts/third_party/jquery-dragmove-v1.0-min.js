// Plugin: jQuery.dragmove
// Source: github.com/nathco/jQuery.dragmove
// Author: Nathan Rutzky
// Update: 1.0

!function(o){o.fn.dragmove=function(){return this.each(function(){var e,t,n,i=o(document),u=o(this);u.on("mousedown touchstart",function(o){return e=!0,t=o.originalEvent.pageX-u.offset().left,n=o.originalEvent.pageY-u.offset().top,"mousedown"==o.type&&(click=u),"touchstart"==o.type&&(touch=u),null==window.mozInnerScreenX?!1:void 0}),i.on("mousemove touchmove",function(o){"mousemove"==o.type&&e&&click.offset({left:o.originalEvent.pageX-t,top:o.originalEvent.pageY-n}),"touchmove"==o.type&&e&&touch.offset({left:o.originalEvent.pageX-t,top:o.originalEvent.pageY-n})}).on("mouseup touchend",function(){e=!1})})}}(jQuery);
