angular.module('neonHexagon', [])
  .controller('MainCtrl', function($timeout, $window) {
    var vm = this;
    vm.lightest = '#fdf5f5';
    vm.speed = 4000;

    vm.width = 36 * 16; //32rem
    vm.height = $window.innerHeight;

    vm.peaks = [{
      fill: '#fec28c',
      opacity: 0.15,
      def: {
        left: [-0.3, 0.65,
               0.35, 0.2,
               0.95, 0.65],
        right: [0.05, 0.65,
                0.65, 0.2,
                1.3, 0.65]
      }
    }, {
      fill: '#ffe6cf',
      opacity: 0.2,
      def: {
        left: [-0.4, 0.65,
               0.25, 0.2,
               0.85, 0.65],
        right: [0.15, 0.65,
                0.75, 0.2,
                1.4, 0.65]
      }
    }, {
      fill: '#B2B193',
      opacity: 0.9,
      def: {
        left: [-0.3, 0.65,
               0.3, 0.28,
               0.8, 0.65],
        right: [0.2, 0.65,
                0.7, 0.28,
                1.3, 0.65]
      }
    }, {
      fill: 'url(#blue-green-2)',
      opacity: 0.95,
      def: {
        left: [-0.55, 0.65,
               0.1, 0.2,
               0.7, 0.65],
        right: [0.3, 0.65,
                0.9, 0.2,
                1.65, 0.65]
      }
    }, {
      fill: 'url(#blue-green-1)',
      def: {
        left: [-0.6, 0.65,
               0, 0.2,
               0.6, 0.65],
        right: [0.4, 0.65,
                1, 0.2,
                1.6, 0.65]
      }
    }];

  })
  .directive('nSvg', function() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: 'templates/svg',
      templateNamespace: 'svg',
      scope: {
        size: '='
      },
      bindToController: true,
      controller: function() {
        var vm = this;
        vm.viewBox = [0, 0, vm.size, vm.size].join(' ');
      },
      controllerAs: 'ctrl'
    };
  })
  .directive('cube', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'templates/cube',
      templateNamespace: 'svg',
      scope: {
        size: '='
      },
      bindToController: true,
      controller: function() {
        var vm = this;

        var angles = [30 + 60, 30 + 60*2, 30 + 60*3, 30 + 60*4, 30 + 60*5, 30 + 60*6];
        vm.width = Math.min(80, vm.size * 0.25);
        vm.x = vm.size / 2 - vm.width / 2;
        var r = vm.width / 2;
        var c = [r, r];

        var pts = angles.map(function(angle) {
          return [rx(r, angle, c[0]), ry(r, angle, c[1])];
        });

        var pathData = pts.map(function(pt, i) {
          return (i === 0) ? ['M' + pt[0],  pt[1]].join(' ') :
                             ['L' + pt[0],  pt[1]].join(' ');
        });

        pathData.push('Z');

        vm.d = pathData.join(' ');

        vm.panels = [{
          pts: [c, pts[1], pts[2], pts[3]],
          color: '#E8645C'
        }, {
          pts: [c, pts[3], pts[4], pts[5]],
          color: '#FF7764'
        }, {
          pts: [c, pts[5], pts[0], pts[1]],
          color: '#FEFDFC'
        }];
      },
      controllerAs: 'ctrl'
    };
  })
  .directive('panel', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'templates/path',
      templateNamespace: 'svg',
      scope: {
        pts: '='
      },
      bindToController: true,
      controller: function() {
        var vm = this;

        var pathData = [
          'M', vm.pts[0][0], vm.pts[0][1],
          'L', vm.pts[1][0], vm.pts[1][1],
          'L', vm.pts[2][0], vm.pts[2][1],
          'L', vm.pts[3][0], vm.pts[3][1]
        ];

        vm.d = pathData.join(' ');
      },
      controllerAs: 'ctrl'
    };
  })
  .directive('mountainRange', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'templates/path',
      templateNamespace: 'svg',
      scope: {
        w: '=',
        h: '='
      },
      bindToController: true,
      controller: function() {
        var vm = this;

        var pathData = [
          'M', vm.w * -0.1, vm.h,
          'L', vm.w * -0.1, vm.h * 0.2,
          'L', vm.w * 0.5, vm.h * 0.65,
          'L', vm.w * 1.1, vm.h * 0.2,
          'L', vm.w * 1.1, vm.h
        ];

        vm.d = pathData.join(' ');
      },
      controllerAs: 'ctrl'
    };
  })
  .directive('peak', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: 'templates/path',
      templateNamespace: 'svg',
      scope: {
        w: '=',
        h: '=',
        def: '='
      },
      bindToController: true,
      controller: function() {
        var vm = this;

        var pathData = [
          'M', vm.w * vm.def[0], vm.h * vm.def[1],
          'L', vm.w * vm.def[2], vm.h * vm.def[3],
          'L', vm.w * vm.def[4], vm.h * vm.def[5]
        ];

        vm.d = pathData.join(' ');
      },
      controllerAs: 'ctrl'
    };
  });

/**
 * Utilities
 */
function rad(a) {
  return Math.PI * a / 180;
}

function rx(r, a, c) {
  return c - r * Math.cos(rad(a));
}

function ry(r, a, c) {
  return c - r * Math.sin(rad(a));
}

function map(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function mapPt(n, start1, stop1, start2, stop2) {
  return [
    map(n, start1, stop1, start2[0], stop2[0]),
    map(n, start1, stop1, start2[1], stop2[1])
  ];
}