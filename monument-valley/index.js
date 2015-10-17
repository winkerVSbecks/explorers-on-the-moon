var WIDTH = 30 * 16; // 30rem

angular.module('monumentValley', ['ngAnimate'])
  .controller('MainCtrl', function($timeout, $window, $element, $scope) {
    var vm = this;
    vm.dx = 0;
    vm.dy = 0;
    var CARD = $element[0];
    getSize();
    vm.styles = getStyles();

    vm.peaks = [{
      fill: '#fec28c',
      opacity: 0.15,
      left: {
        type: 'left',
        pts: [-0.3, 0.65,
             0.35, 0.2,
             0.95, 0.65],
        mx: 0.0625,
        my: -0.9
      },
      right: {
        type: 'right',
        pts: [0.05, 0.65,
              0.65, 0.2,
              1.3, 0.65],
        mx: 0.0625,
        my: -0.9,
      }
    }, {
      fill: '#ffe6cf',
      opacity: 0.2,
      left: {
        type: 'left',
        pts: [-0.4, 0.65,
             0.25, 0.2,
             0.85, 0.65],
        mx: 0.125,
        my: -0.75,
      },
      right: {
        type: 'right',
        pts: [0.15, 0.65,
              0.75, 0.2,
              1.4, 0.65],
        mx: 0.125,
        my: -0.75,
      }
    }, {
      fill: '#B2B193',
      opacity: 0.9,
      left: {
        type: 'left',
        pts: [-0.3, 0.65,
             0.3, 0.28,
             0.8, 0.65],
        mx: 0.25,
        my: -0.25,
      },
      right: {
        type: 'right',
        pts: [0.2, 0.65,
              0.7, 0.28,
              1.3, 0.65],
        mx: 0.25,
        my: -0.25,
      }
    }, {
      fill: 'url(#blue-green-2)',
      opacity: 0.95,
      left: {
        type: 'left',
        pts: [-0.55, 0.65,
             0.1, 0.2,
             0.7, 0.65],
        mx: 0.5,
        my: -0.20,
      },
      right: {
        type: 'right',
        pts: [0.3, 0.65,
              0.9, 0.2,
              1.65, 0.65],
        mx: 0.5,
        my: -0.20,
      }
    }, {
      fill: 'url(#blue-green-1)',
      left: {
        type: 'left',
        pts: [-0.6, 0.65,
             0, 0.2,
             0.6, 0.65],
        mx: 0.75,
        my: -0.15,
      },
      right: {
        type: 'right',
        pts: [0.4, 0.65,
              1, 0.2,
              1.6, 0.65],
        mx: 0.75,
        my: -0.15,
      }
    }];

    angular.element($window).bind('resize', function() {
      getSize();
      $scope.$apply();
    });

    vm.onMove = function(event) {
      var cardInfo = CARD.getBoundingClientRect();

      var halfW = cardInfo.width / 2;
      var halfH = cardInfo.height / 2;

      var x = event.pageX - cardInfo.left;
      var y = event.pageY - cardInfo.top;

      var sceneX = -(halfW - x)
      var sceneY =  halfH - y;

      vm.dx = constrain(sceneX, -halfW, halfW);
      vm.dy = constrain(sceneY, -halfH, halfH);

      vm.styles = getStyles();
    };

    function getSize(event) {
      vm.width = Math.min($window.innerWidth, WIDTH );
      vm.height = $window.innerHeight;
    }

    function getStyles() {
      var y = map(vm.dx, -1, 1, 10, -10);
      var x = map(vm.dy, -1, 1, 5, -5);
      var z = 0;

      return {
        transform: 'rotateX(' + x + 'deg) rotateY(' + y + 'deg) rotateZ(0deg)'
      };
    };

  })
  .directive('valley', function() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'templates/valley',
      templateNamespace: 'svg',
      scope: {},
      bindToController: {
        dx: '=',
        dy: '='
      },
      controllerAs: 'valley',
      controller: function() {
        this.name = 'valley';
      }
    };
  })
  .directive('mountainRange', function() {
    return {
      restrict: 'A',
      // replace: true,
      templateUrl: 'templates/mountainRange',
      templateNamespace: 'svg',
      scope: {},
      bindToController: {
        w: '=',
        h: '=',
        dx: '=',
        dy: '='
      },
      controllerAs: 'mountainRange',
      controller: function() {
        var vm = this;

        vm.d = function() {
          return  [
            'M', vm.w * -0.1, vm.h,
            'L', vm.w * -0.1, vm.h * 0.2,
            'L', vm.w * 0.5, vm.h * 0.65,
            'L', vm.w * 1.1, vm.h * 0.2,
            'L', vm.w * 1.1, vm.h
          ].join(' ');
        };

        vm.translate = function() {
          var xBase = this.w * 0.05 * 1.625;
          var yBase = this.h * 0.05;
          var xAmt = map(this.dx, -1, 1, -xBase, xBase);
          var yAmt = map(this.dy, -1, 1, yBase, -yBase);
          return 'translate(' + xAmt + ',' + yAmt + ')';
        };
      }
    };
  })
  .directive('peak', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'templates/peak',
      templateNamespace: 'svg',
      scope: {},
      bindToController: {
        w: '=',
        h: '=',
        def: '=',
        dx: '=',
        dy: '=',
      },
      controllerAs: 'peak',
      controller: function() {
        var vm = this;

        vm.d = function() {
          return [
            'M', vm.w * vm.def.pts[0], vm.h * vm.def.pts[1],
            'L', vm.w * vm.def.pts[2], vm.h * vm.def.pts[3],
            'L', vm.w * vm.def.pts[4], vm.h * vm.def.pts[5],
            'L', vm.w * vm.def.pts[4], vm.h,
            'L', vm.w * vm.def.pts[0], vm.h,
          ].join(' ');
        };

        vm.translate = function() {
          var xBase = vm.w * 0.05 * vm.def.mx;
          var yBase = vm.h * 0.05 * vm.def.my;

          var xMin = vm.def.type === 'left' ? -xBase : -2 * xBase;
          var xMax = vm.def.type === 'left' ? 2 * xBase : xBase;

          var xAmt = map(vm.dx, -1, 1, xMin, xMax);
          var yAmt = map(vm.dy, -1, 1, yBase, -yBase);
          return 'translate(' + xAmt + ',' + yAmt + ')';
        };
      }
    };
  });


/**
 * Utilities
 */
function constrain(n, start1, stop1) {
  var v = map(n, start1, stop1, -1, 1);
  return Math.max(Math.min(v, 1), -1);
}

function map(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}