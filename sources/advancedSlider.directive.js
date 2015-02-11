(function() {

	angular
		.module( 'angular.advancedSlider' )
		.directive( 'advancedSlider', directiveDefinition );

	directiveDefinition.$inject = [ '$timeout', '$window', 'AdvancedSliderService' ];

	function directiveDefinition( $timeout, $window, AdvancedSliderService ) {
		return {
			controller: 'AdvancedSliderController',
			controllerAs: 'AdvancedSliderController',
			link: link,
			replace: true,
			require: 'ngModel',
			restrict: 'AE',
			scope: {
				isDisabled: '&?',
				onSlideStart: '&?',
				onSlideEnd: '&?',
				onWillStartSliding: '&?'
			},
			template: '<div data-ng-transclude></div>',
			transclude: true
		};

		// ****************
		// Implementation
		// ****************
		function link( scope, element, attrs, ngModelController ) {
			if (!ngModelController) {
				return;
			}

			scope._init( ngModelController );

			element[0].addEventListener( AdvancedSliderService.getInputDownEventName(), onInputDown, true );

			function onClick( event ) {
				event.stopImmediatePropagation();
			}

			function onInputDown( event ) {
				if ( event.type === 'mousedown' && event.button != 0 ) {
					return;
				}

				if ( attrs.isDisabled && true === scope.isDisabled() ) {
					return;
				}

				$window.addEventListener( AdvancedSliderService.getInputMoveEventName(), onInputMove, true );
				$window.addEventListener( AdvancedSliderService.getInputUpEventName(), onInputUp, true );
				document.addEventListener( 'click', onClick, true );

				if ( attrs.onWillStartSliding ) {
					scope.onWillStartSliding({
						event: event,
						sliderValue: ngModelController.$viewValue || 0
					})
				}

				scope._updateValue( event, element[0] );

				if ( attrs.onSlideStart ) {
					scope.onSlideStart({
						event: event,
						sliderValue: ngModelController.$viewValue || 0
					})
				}
			}

			function onInputMove( event ) {
				// preventDefault is necessary to continously fire the move event on Android devices
				// see: http://stackoverflow.com/questions/6316503/how-to-get-continuous-mousemove-event-when-using-android-mobile-browser
				event.preventDefault();

				scope._updateValue( event, element[0] );
			}

			function onInputUp( event ) {
				$window.removeEventListener( AdvancedSliderService.getInputMoveEventName(), onInputMove, true );
				$window.removeEventListener( AdvancedSliderService.getInputUpEventName(), onInputUp, true );

				$timeout( function() {
					document.removeEventListener( 'click', onClick, true );
				}, 100 );

				if ( attrs.onSlideEnd ) {
					scope.onSlideEnd({
						event: event,
						sliderValue: ngModelController.$viewValue || 0
					})
				}
			}
		}
	}

})();