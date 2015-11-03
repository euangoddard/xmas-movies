var angular = require('angular');

var app = angular.module('xmas-movies', [require('./services')]);

app.controller('AppController', function (Normalizer, MOVIES) {
    var ctrl = this;
    this.correct_movies = [];

    this.guess = function (movie) {
        var movie_normalized = Normalizer.normalize(movie);
        if (MOVIES.indexOf(movie_normalized) > -1) {
            if (ctrl.correct_movies.indexOf(movie_normalized) > -1) {
                alert('Already got ' + movie);
            } else {
                ctrl.correct_movies.push(movie_normalized);
                clear_guessed_movie();
            }
        } else {
            alert(movie + ' is not on the wall');
        }
    };

    var clear_guessed_movie = function () {
        ctrl.movie = {};
    };
    clear_guessed_movie();
});


app.constant('MOVIES', [
    'the-grinch',
    'the-nightmare-before-christmas'
]);