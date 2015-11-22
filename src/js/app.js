'use strict';

var angular = require('angular');

var KEY_CODES_TO_IGNORE = [
    13, // return
    16, // shift alone
    17, // ctrl alone
    18, // alt alone
    91, // left cmd
    93 // right cmd
];

var app = angular.module('xmas-movies', [
    require('angular-animate'),
    require('./services'),
    require('./sound')
]);

app.config(function (SoundManagerProvider, $compileProvider) {
    SoundManagerProvider.set_sounds_root('/sounds/');
    $compileProvider.debugInfoEnabled(false);
});


app.run(function (SoundManager) {
    SoundManager.add_sounds(['hohoho', 'wrong', 'hallelujah']);
});


app.controller('AppController', function ($scope, $interpolate, $timeout, SoundManager, MovieLookup) {
    var ctrl = this;
    this.correct_movies = [];
    this.total_movies = MovieLookup.size;

    this.guess = function (movie_name) {
        if (MovieLookup.has(movie_name)) {
            var movie = MovieLookup.get(movie_name);
            if (ctrl.correct_movies.indexOf(movie) > -1) {
                SoundManager.play('wrong');
                var body_template = $interpolate('You already found "{{ name }}". Try another.');
                this.show_toast(body_template(movie));
            } else {
                ctrl.correct_movies.push(movie);
                clear_guessed_movie();
                if (ctrl.correct_movies.length === MovieLookup.size) {
                    SoundManager.play('hallelujah');
                    ctrl.show_dialog('You win!', $interpolate('You found the last movie, "{{ name }}". Thanks for playing and have a very Merry Christmas.')(movie));
                    ctrl.are_answers_shown = true;
                } else {
                    SoundManager.play('hohoho');
                    this.show_toast($interpolate('You found "{{ name }}!"')(movie));
                }
            }
        } else {
            SoundManager.play('wrong');
            this.show_toast($interpolate('"{{ name }}" is not on the wall')({name: movie_name}));
        }
    };
    
    this.show_dialog = function (title, body) {
        this.dialog = {title: title, body: body};
    };
    
    this.close_dialog = function () {
        this.dialog = null;
    };
    
    var toast_timeout = null;
    this.show_toast = function (message) {
        $timeout.cancel(toast_timeout);
        this.toast.message = message;
        toast_timeout = $timeout(function () {
            ctrl.toast = {};
        }, 7000);
    };
    this.toast = {};
    
    document.addEventListener('keyup', function (event) {
        if (KEY_CODES_TO_IGNORE.indexOf(event.which) === -1 && !!ctrl.dialog) {
            $scope.$apply(function () {
                ctrl.close_dialog();
            });
        }
    });

    var clear_guessed_movie = function () {
        ctrl.movie = {};
    };
    clear_guessed_movie();
    
    this.show_help_dialog = function () {
        var body_template = $interpolate('On the wall you\'ll find {{ size }} Christmassy movies concealed in obscured posters. When you spot a movie you recognise, enter its name in the box at the bottom.');
        this.show_dialog('Welcome to Christmas Movies', body_template(MovieLookup));
    };
    
    this.show_credits_dialog = function () {
        this.show_dialog('Credits', 'Card concept and implementation by Euan Goddard. Many thanks to Greg Jackson for visual design of the poster wall.'); 
    };
    this.show_help_dialog();

    this.are_answers_shown = false;
    this.toggle_answers_visibility = function () {
        this.are_answers_shown = !this.are_answers_shown;
    };

    this.is_muted = SoundManager.is_muted;
    this.toggle_mute = function () {
        if (this.is_muted) {
            SoundManager.is_muted = false;
            this.is_muted = false;
        } else {
            SoundManager.is_muted = true;
            this.is_muted = true;
        }
    };
});


app.directive('loseFocusOn', function () {
    var directive = {
        link: function (scope, element, attrs) {
            var native_element = element[0];
            scope.$watch(attrs.loseFocusOn, function (value) {
                if (!value || angular.equals(value, {}) || angular.equals(value, [])) {
                    native_element.focus();
                    native_element.select();
                } else {
                    native_element.blur();
                }
            });
        }
    };
    
    return directive;
});
