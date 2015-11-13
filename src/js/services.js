'use strict';

var angular = require('angular');
var levenshtein = require('fast-levenshtein');

var MODULE_NAME = 'xmas.services';

var services = angular.module(MODULE_NAME, []);

services.factory('Normalizer', function (SYNONYMS, STOPWORDS) {
    var normalize = function (string) {
        if (!string) {
            return string;
        }
        var string_lower = string.toLowerCase();
        var words = string_lower.split(/\s+/g);
        var words_normalized = [];
        angular.forEach(words, function (word) {
            var word_synonym = normalize_synonyms(word);
            var word_normalized = word_synonym.replace(/\W+/g, '');
            if (word_normalized && STOPWORDS.indexOf(word_normalized) === -1) {
                words_normalized.push(word_normalized);
            }
        });
        return words_normalized.join('-');
    };

    var normalize_synonyms = function (word) {
        var word_synonym = SYNONYMS[word] || word;
        return word_synonym;
    };

    return {
        normalize: normalize
    };
});


services.constant('SYNONYMS', {
    '+': 'and',
    '&': 'and',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine'
});


services.constant('STOPWORDS', ['the']);


services.factory('MovieLookup', function (MOVIES, Normalizer) {
    var movies_by_normalized_name = {};
    angular.forEach(MOVIES, function (movie) {
        movies_by_normalized_name[Normalizer.normalize(movie.name)] = movie;
    });

    var service = {
        has: function (movie_name) {
            return retrieve_movie(movie_name) !== null;
        },
        get: function (movie_name) {
            return retrieve_movie(movie_name);
        }
    };

    var retrieve_movie = function (movie_name) {
        var movie_name_normalized = Normalizer.normalize(movie_name);
        var movie = movies_by_normalized_name[movie_name_normalized];

        if (!movie) {
            var best_match = {movie: null, levenshtein_distance: Infinity};
            angular.forEach(movies_by_normalized_name, function (test_movie, test_normalized_name) {
                var levenshtein_distance = levenshtein.get(
                    test_normalized_name,
                    movie_name_normalized
                );
                if (levenshtein_distance < best_match.levenshtein_distance) {
                    best_match = {
                        movie: test_movie,
                        levenshtein_distance: levenshtein_distance
                    };
                }
            });
            if (best_match.levenshtein_distance < 3) {
                movie = best_match.movie;
            }
        }

        return movie || null;
    };

    Object.defineProperty(service, 'size', {
        enumerable: true,
        value: MOVIES.length
    });

    return service;
});


services.constant('MOVIES', [
    {name: 'A Christmas Carol', align: 'left'},
    {name: 'Arthur Christmas', align: 'right', top: '20%', right: '34%'},
    {name: 'Batman Returns', align: 'right', top: '28%', right: '83%'},
    {name: 'Die Hard', align: 'right', top: '4%', right: '77%'},
    {name: 'Die Harder', align: 'right', top: '54%', right: '20%'},
    {name: 'Elf', align: 'right', top: '46%', right: '63%'},
    {name: 'Four Christmases', align: 'right', top: '31%', right: '23%'},
    {name: 'Fred Claus', align: 'right', top: '60%', right: '75%'},
    {name: 'Gremlins', align: 'right', top: '80%', right: '25%'},
    {name: 'Hogfather', align: 'left', top: '68%', left: '12%'},
    {name: 'Home Alone 2', align: 'right', top: '10%', right: '27%'},
    {name: 'Home Alone', align: 'right', top: '90%', right: '80%'},
    {name: 'It\'s a Wonderful Life', top: '9%', left: '10%', align: 'left'},
    {name: 'Jingle all the way', align: 'right', top: '42%', right: '12%'},
    {name: 'Lethal Weapon', align: 'right', top: '95%', right: '65%'},
    {name: 'Love Actually', align: 'right', top: '59%', right: '50%'},
    {name: 'Miracle on 34th Street', align: 'right', top: '85%', right: '5%'},
    {name: 'Scrooged', align: 'right', top: '14%', right: '10%'},
    {name: 'The Grinch', align: 'left', top: '15%', left: '41%'},
    {name: 'The Long Kiss Goodnight', align: 'right', top: '32%', right: '60%'},
    {name: 'The Muppet Christmas Carol', align: 'left', top: '39%', left: '15%'},
    {name: 'The Nightmare before Christmas', align: 'right', top: '65%', right: '34%'},
    {name: 'The Polar Express', align: 'left', left: '56%', top: '5%'},
    {name: 'The Santa Clause', align: 'right', top: '53%', right: '80%'},
    {name: 'White Christmas', align: 'right', top: '91%', right: '40%'}
]);


module.exports = MODULE_NAME;
