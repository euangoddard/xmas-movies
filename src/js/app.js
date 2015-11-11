'use strict';

var angular = require('angular');
var template = require('lodash.template');


var app = angular.module('xmas-movies', [
    require('angular-animate'),
    require('./services'),
    require('./sound')
]);

app.config(function (SoundManagerProvider) {
    SoundManagerProvider.set_sounds_root('/sounds/');
});


app.run(function (SoundManager) {
    SoundManager.add_sounds(['hohoho']);
});


app.controller('AppController', function ($scope, SoundManager, MovieLookup) {
    var ctrl = this;
    this.correct_movies = [];
    this.total_movies = MovieLookup.size;

    this.guess = function (movie_name) {
        if (MovieLookup.has(movie_name)) {
            var movie = MovieLookup.get(movie_name);
            if (ctrl.correct_movies.indexOf(movie) > -1) {
                var body_template = template('You already found "${name}". Try another.');
                this.show_dialog('Already found', body_template(movie));
            } else {
                SoundManager.play('hohoho');
                ctrl.correct_movies.push(movie);
                this.show_dialog('Correct!', template('You found "${name}!"')(movie));
                clear_guessed_movie();
            }
        } else {
            this.show_dialog('Not on the wall', template('"${name}" is not on the wall')({name: movie_name}));
        }
    };
    
    this.show_dialog = function (title, body) {
        this.dialog = {title: title, body: body};
    };
    
    this.close_dialog = function () {
        this.dialog = null;
    };
    
    document.addEventListener('keyup', function (event) {
        if (event.which == 27 && !!ctrl.dialog) {
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
        var body_template = template('On the wall you\'ll find ${size} Christmassy movies concealed in obscured posters. When you spot a movie you recognise, enter its name in the box at the bottom.');
        this.show_dialog('Welcome to Christmas Movies', body_template(MovieLookup));
    };
    this.show_help_dialog();

    this.are_answers_shown = false;
    this.toggle_answers_visibility = function () {
        this.are_answers_shown = !this.are_answers_shown;
    };
});
