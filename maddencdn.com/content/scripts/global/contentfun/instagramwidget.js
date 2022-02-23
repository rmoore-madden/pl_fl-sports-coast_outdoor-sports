// INSTAGRAM WIDGET //

$(document).ready(function() {
	// the instagram widget
	wi = $("#widgetInstagram").WidgetInstagram({
		apiID: 'f3ef268403204693a97ca541337d0055',
		tagName: 'explorebranson',
		captionID: 'widgetInstagramCaption',
		navLinks: {
			prevLinkID: '#widgetInstagramPrev',
			nextLinkID: '#widgetInstagramNext'
		}
	});
});
