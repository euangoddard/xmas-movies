'use strict';

var angular = require('angular');

var app = angular.module('xmas-movies', [
    require('./services'),
    require('./sound')
]);

app.config(function (SoundManagerProvider) {
    SoundManagerProvider.set_sounds_root('/sounds/');
});


app.run(function (SoundManager) {
    SoundManager.add_sounds(['hohoho']);
});


app.controller('AppController', function (SoundManager, MovieLookup) {
    var ctrl = this;
    this.correct_movies = [];
    this.total_movies = MovieLookup.size;

    this.guess = function (movie_name) {
        if (MovieLookup.has(movie_name)) {
            var movie = MovieLookup.get(movie_name);
            if (ctrl.correct_movies.indexOf(movie) > -1) {
                alert('Already got ' + movie.name);
            } else {
                SoundManager.play('hohoho');
                ctrl.correct_movies.push(movie);
                clear_guessed_movie();
            }
        } else {
            alert(movie_name + ' is not on the wall');
        }
    };

    var clear_guessed_movie = function () {
        ctrl.movie = {};
    };
    clear_guessed_movie();
});


app.directive('magnify', function () {
    var directive = {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var magnifying_glass = angular.element('<div class="magnifying-glass off"/>');
            element.after(magnifying_glass);
            var magnifying_glass_half_size = 75;
            
            element.on('touchstart touchenter', function () {
                scope.$apply(function () {
                    magnifying_glass.removeClass('off');
                });
            });
            
            element.on('touchend touchleave touchcancel', function () {
                scope.$apply(function () {
                    magnifying_glass.addClass('off');
                });
            });
            
            element.on('touchmove', function (event) {
                var touch = event.touches[0];
                move_magnifying_glass(touch.clientX, touch.clientY); 
            });
            
            var move_magnifying_glass = function (x, y) {
                scope.$apply(function () {
                    var parent = element.parent()[0];
                    var left = x - magnifying_glass_half_size - parent.offsetLeft; 
                    var top = y - magnifying_glass_half_size - parent.offsetTop;
                    magnifying_glass.css({left: left + 'px', top: top + 'px', backgroundPositionX: -1 * left + 'px', backgroundPositionY: -1 * top + 'px'});
                });
            }
        }
    };
    return directive;
});