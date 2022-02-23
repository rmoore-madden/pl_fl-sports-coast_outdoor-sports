/**
 * v1.0
 * 
 * A function to add ellipsis to a multi-line text block. Madden modified original example
 *	to support relative-sized elements.
 *
 * USAGE: 
 *	<p class="ellipsis multiline">Lorem ipsum dolor sit amet</p>
 *	overflow: hidden; white-space: nowrap|normal; <-- nowrap for non-multiline types
 *
 * http://stackoverflow.com/questions/536814/insert-ellipsis-into-html-tag-if-content-too-wide
 */
 (function($) {
	$.fn.ellipsis = function() {
		return this.each(function() {
			var el = $(this);

			if (el.css("overflow") == "hidden") {
				// madden change - this stores original text as data attr and resets it each 
				//	time. this allows for text to adjust to responsive design
				var text;
				if (el.data("og") == undefined) {
					text = el.html();
					el.data("og", text);
				} else {
					text = el.data("og");
				}
				el.html(text);
				
				var multiline = el.hasClass('multiline');
				var t = $(this.cloneNode(true))
					.hide()
					.css('position', 'absolute')
					.css('overflow', 'visible')
					.width(multiline ? el.width() : 'auto')
					.height(multiline ? 'auto' : el.height());

				el.after(t);
				
				function height() { return t.height() > el.height(); };
				function width() { return t.width() > el.width(); };

				var func = multiline ? height : width;

				while (text.length > 0 && func()) {
					text = text.substr(0, text.length - 1);
					t.html(text + "&#8230;");
				}

				el.html(t.html());
				t.remove();
			}
		});
	};
})(jQuery);

