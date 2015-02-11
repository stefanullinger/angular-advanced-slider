(function() {

	angular
		.module( 'angular.advancedSlider' )
		.controller( 'AdvancedSliderController', controllerDefinition );

	controllerDefinition.$inject = [ '$scope', 'AdvancedSliderService' ];

	function controllerDefinition( $scope, AdvancedSliderService ) {
		var ngModelController;

		$scope._init = init;
		$scope._updateValue = updateValue;

		function init( newNgModelController ) {
			ngModelController = newNgModelController;

			ngModelController.$render = function() {
				updateViewModel( ngModelController.$viewValue || 0 );
			};
		}

		function updateValue( event, element ) {
			var newValue = AdvancedSliderService.calculateValueFromEventData( event, element );

			$scope.$apply( function() {
				updateViewModel( newValue );
				ngModelController.$setViewValue( newValue );
			});
		}

		function updateViewModel( value ) {
			$scope.value = value;
			$scope.valueInPercent = value * 100;
		}
	}
})();