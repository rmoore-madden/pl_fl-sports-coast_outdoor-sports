//
// Plugin: jQuery.dragmove
// Source: github.com/nathco/jQuery.dragmove
// Author: Nathan Rutzky
// Update: 1.0
//
// MADDEN CUSTOMIZATION: prevents dragging outside of parent
//
(function($) {

	$.fn.dragmove = function(options) {
	
		// 
		// padding: how much padding on parent edge insets before drag stop kicks in?
		//
		var settings = $.extend({
			paddingTop: 10,
			paddingRight: 10,
			paddingBottom: 10,
			paddingLeft: 10
		}, options);

		return this.each(function() {
	
			var $document = $(document),
				$this = $(this),
				active,
				startX,
				startY;
			
			$this.on('mousedown touchstart', function(e) {
			
				active = true;
				startX = e.originalEvent.pageX - $this.offset().left;
				startY = e.originalEvent.pageY - $this.offset().top;	
				
				if ('mousedown' == e.type)
					
					click = $this;
									
				if ('touchstart' == e.type)
				
					touch = $this;
									
				if (window.mozInnerScreenX == null)
				
					return false;	
			});
			
			$document.on('mousemove touchmove', function(e) {
				
				if ('mousemove' == e.type && active) {
				
   					// disallow dragging off edges
					if ($this.parent().offset().top >= $this.offset().top) {
						// top
						$this.offset({ top: ($this.parent().offset().top + settings.paddingTop) });
						active = false;
					} else if ($this.offset().left <= $this.parent().offset().left) {
						// left
						$this.offset({ left: ($this.parent().offset().left + settings.paddingLeft) });
						active = false;
					} else if (($this.offset().left + $this.outerWidth()) > $this.parent().width()) {
						// right
						$this.offset({ left: ($this.parent().width() - $this.outerWidth() - settings.paddingRight) });
						active = false;
					} else if (($this.offset().top + $this.outerHeight()) > ($this.parent().offset().top + $this.parent().height())) {
						// bottom
						$this.offset({ top: (($this.parent().offset().top + $this.parent().height()) - $this.outerHeight() - settings.paddingBottom) });
						active = false;
					} else {
						click.offset({ 
							left: e.originalEvent.pageX - startX,
							top: e.originalEvent.pageY - startY 
						});
					}
				}
				
				if ('touchmove' == e.type && active) {

   					// disallow dragging off edges
					if ($this.parent().offset().top >= $this.offset().top) {
						// top
						$this.offset({ top: ($this.parent().offset().top + settings.paddingTop) });
						active = false;
					} else if ($this.offset().left <= $this.parent().offset().left) {
						// left
						$this.offset({ left: ($this.parent().offset().left + settings.paddingLeft) });
						active = false;
					} else if (($this.offset().left + $this.outerWidth()) > $this.parent().width()) {
						// right
						$this.offset({ left: ($this.parent().width() - $this.outerWidth() - settings.paddingRight) });
						active = false;
					} else if (($this.offset().top + $this.outerHeight()) > ($this.parent().offset().top + $this.parent().height())) {
						// bottom
						$this.offset({ top: (($this.parent().offset().top + $this.parent().height()) - $this.outerHeight() - settings.paddingBottom) });
						active = false;
					} else {
						touch.offset({
							left: e.originalEvent.pageX - startX,
							top: e.originalEvent.pageY - startY
						
						});
					}
				}
				
			}).on('mouseup touchend', function() {
				
				active = false;
				
			});
								
		});
			
	};

})(jQuery);