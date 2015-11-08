'use strict';

var angular = require('angular');

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
    '&': 'and'
});


services.constant('STOPWORDS', ['the']);


services.factory('MovieLookup', function (MOVIES, Normalizer) {
    var movies_by_normalized_name = {};
    angular.forEach(MOVIES, function (movie) {
        movies_by_normalized_name[Normalizer.normalize(movie.name)] = movie;
    });

    var service = {
        has: function (movie_name) {
            var movie_name_normalized = Normalizer.normalize(movie_name);
            return (movie_name_normalized in movies_by_normalized_name);
        },
        get: function (movie_name) {
            var movie_name_normalized = Normalizer.normalize(movie_name);
            var movie = movies_by_normalized_name[movie_name_normalized] || null;
            return movie;
        }
    };

    Object.defineProperty(service, 'size', {
        enumerable: true,
        value: MOVIES.length
    });

    return service;
});


services.constant('MOVIES', [
    {name: 'A Christmas Carol'},
    {name: 'Arthur Christmas'},
    {name: 'Batman Returns'},
    {name: 'Die Hard'},
    {name: 'Die Harder'},
    {name: 'Elf'},
    {name: 'Four Christmases'},
    {name: 'Fred Claus'},
    {name: 'Gremlins'},
    {name: 'Hogfather'},
    {name: 'Home Alone 2'},
    {name: 'Home Alone'},
    {name: 'Its a Wonderful Life'},
    {name: 'Jingle all the way'},
    {name: 'Lethal Weapon'},
    {name: 'Love Actually'},
    {name: 'Miracle on 34th Street'},
    {name: 'Scrooged'},
    {name: 'The Grinch'},
    {name: 'The Long Kiss Goodnight'},
    {name: 'The Muppet Christmas Carol'},
    {name: 'The Nightmare before Christmas'},
    {name: 'The Polar Express'},
    {name: 'The Santa Clause'},
    {name: 'White Christmas'}
]);


module.exports = MODULE_NAME;
