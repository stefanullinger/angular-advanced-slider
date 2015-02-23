(function() {

	angular
		.module( 'angular.advancedSlider' )
		.factory( 'AdvancedSliderService', serviceDefinition );

	serviceDefinition.$inject = [ 'Modernizr' ];

	function serviceDefinition( Modernizr ) {
		// ********
		// Public
		// ********
		var service = {
			calculateOffsetLeftFromEventData : calculateOffsetLeftFromEventData,
			calculateValueFromEventData      : calculateValueFromEventData,
			isTouchSupported                 : Modernizr.supportsTouch,
			getInputDownEventName            : getInputDownEventName,
			getInputMoveEventName            : getInputMoveEventName,
			getInputUpEventName              : getInputUpEventName,
			getOffsetLeft                    : getOffsetLeft,
			getOffsetTop                     : getOffsetTop
		};

		// ****************
		// Initialization
		// ****************
		return service;


		// ****************
		// Implementation
		// ****************
		function calculateOffsetLeftFromEventData( event, element ) {
			var offset = 0;

			// To calculate the offset of any element relative to another element, we have to find a common parent
			// of both elements. Obviously, the document is one of them, so we will use it.
			if ( Modernizr.supportsTouch ) {
				offset = event.touches[0].pageX - service.getOffsetLeft( element );
			} else {
				event = fixEventOffset( event );
				offset = service.getOffsetLeft( event.target ) + event.offsetX - service.getOffsetLeft( element );
			}

			return offset;
		}

		function calculateValueFromEventData( event, element ) {
			var offset = service.calculateOffsetLeftFromEventData( event, element );
			var width = element.clientWidth || 1;

			var value = offset / width;
			return Math.max( Math.min( 1, value ), 0 );
		}

		function fixEventOffset( event ) {
			/**
			 * There's no offsetX in Firefox, so we fix that.
			 * Solution provided by Jack Moore in this post:
			 * http://www.jacklmoore.com/notes/mouse-position/
			 * did not work, because event.currentTarget.getBoundingClientRect() threw an error (is not a function).
			 * Now trying an implementation from http://bugs.jquery.com/ticket/8523#comment:16
			 * @param $event
			 * @returns {*}
			 */
			/*
			 if (navigator.userAgent.match(/Firefox/i)) {
			 var style 			= event.currentTarget.currentStyle || window.getComputedStyle(event.target, null);
			 var borderLeftWidth = parseInt(style['borderLeftWidth'], 10);
			 var borderTopWidth 	= parseInt(style['borderTopWidth'], 10);
			 var rect 			= event.currentTarget.getBoundingClientRect();
			 var offsetX 		= event.clientX - borderLeftWidth - rect.left;
			 var offsetY 		= event.clientY - borderTopWidth - rect.top;

			 event.offsetX = offsetX;
			 event.offsetY = offsetY;
			 }
			 */

			if ( typeof event.offsetX === 'undefined' || typeof event.offsetY === 'undefined' ) {
				var targetOffset = {
					left: service.getOffsetLeft( event.target ),
					top: service.getOffsetTop( event.target )
				};

				event.offsetX = event.pageX - targetOffset.left;
				event.offsetY = event.pageY - targetOffset.top;
			}

			return event;
		}

		function getInputDownEventName() {
			var eventName = 'mousedown';

			if ( Modernizr.supportsTouch ) {
				eventName = 'touchstart';
			}

			return eventName;
		}

		function getInputMoveEventName() {
			var eventName = 'mousemove';

			if ( Modernizr.supportsTouch ) {
				eventName = 'touchmove';
			}

			return eventName;
		}

		function getInputUpEventName() {
			var eventName = 'mouseup';

			if ( Modernizr.supportsTouch ) {
				eventName = 'touchend';
			}

			return eventName;
		}

		/**
		 * Gets the left value relative to the document
		 * @param element
		 * @returns {number}
		 */
		function getOffsetLeft( element ) {
			var rect = element.getBoundingClientRect();
			return rect.left + document.body.scrollLeft;
		}

		/**
		 * Gets the top value relative to the document
		 * @param element
		 * @returns {number}
		 */
		function getOffsetTop( element ) {
			var rect = element.getBoundingClientRect();
			return rect.top + document.body.scrollTop;
		}
	}

})();