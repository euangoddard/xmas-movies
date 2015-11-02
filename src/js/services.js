var angular = require('angular');

var MODULE_NAME = 'xmas.services';

var services = angular.module(MODULE_NAME, []);

services.factory('Normalizer', function () {
    var normalize = function (string) {
        if (!string) {
            return string;
        }
        var string_lower = string.toLowerCase();
        var words = string_lower.split(/\s+/g);
        var words_normalized = [];
        angular.forEach(words, function (word) {
            var word_normalized = word.replace(/\W+/g, '');
            if (word_normalized) {
                words_normalized.push(word_normalized);
            }
        });
        return words_normalized.join('-');
    };

    return {
        normalize: normalize
    };
});


module.exports = MODULE_NAME;
