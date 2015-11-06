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
    
    this.toggle_fullscreen_image = function ($event) {
        Fullscreen.toggle($event.target);
    };

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
