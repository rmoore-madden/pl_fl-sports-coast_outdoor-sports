/**
 * v1.0
 * 
 * A function to add ellipsis to a multi-line text block. Madden modified original example
 *	to support relative-sized elements.
 *
 * http://stackoverflow.com/questions/536814/insert-ellipsis-into-html-tag-if-content-too-wide
 */
!function(t){t.fn.ellipsis=function(){return this.each(function(){function i(){return s.height()>e.height()}function h(){return s.width()>e.width()}var e=t(this);if("hidden"==e.css("overflow")){var o;void 0==e.data("og")?(o=e.html(),e.data("og",o)):o=e.data("og"),e.html(o);var n=e.hasClass("multiline"),s=t(this.cloneNode(!0)).hide().css("position","absolute").css("overflow","visible").width(n?e.width():"auto").height(n?"auto":e.height());e.after(s);for(var a=n?i:h;o.length>0&&a();)o=o.substr(0,o.length-1),s.html(o+"&#8230;");e.html(s.html()),s.remove()}})}}(jQuery);
