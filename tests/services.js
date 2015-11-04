var angular = require('angular');
require('angular-mocks');


describe('Services', function () {
    var MOCK_MOVIE = {name: 'A movie'};

    beforeEach(function () {
        angular.mock.module(require('../src/js/services'));
        angular.mock.module(function($provide) {
            $provide.constant('MOVIES', [MOCK_MOVIE]);
        });
    });

    describe('Normalizer', function () {
        var Normalizer;

        beforeEach(inject(function (_Normalizer_) {
            Normalizer = _Normalizer_;
        }));

        it('should return empty values in place', function () {
            expect(Normalizer.normalize(null)).toBe(null);
            expect(Normalizer.normalize('')).toEqual('');
        });

        it('should convert alphabetic characters to lower case', function () {
            expect(Normalizer.normalize('UPPER')).toEqual('upper');
            expect(Normalizer.normalize('Mixed')).toEqual('mixed');
            expect(Normalizer.normalize('lower')).toEqual('lower');
        });

        it('should normalize whitespace to hyphens', function () {
            expect(Normalizer.normalize('first second')).toEqual('first-second');
            expect(Normalizer.normalize('first second third')).toEqual('first-second-third');
            expect(Normalizer.normalize('first  second')).toEqual('first-second');
            expect(Normalizer.normalize('first\nsecond')).toEqual('first-second');
        });

        it('should remove any non-alphanumeric characters', function () {
            expect(Normalizer.normalize('first / second')).toEqual('first-second');
            expect(Normalizer.normalize('it\'s great!')).toEqual('its-great');
        });

        it('should trim extraneous whitespace', function () {
            expect(Normalizer.normalize('    \n space  \t  ')).toEqual('space');
        });

        it('should normalize synonyms', function () {
            expect(Normalizer.normalize('one & two')).toEqual('one-and-two');
            expect(Normalizer.normalize('one + two')).toEqual('one-and-two');
        });
        
        it('should remove the definite article', function () {
            expect(Normalizer.normalize('the x and the y')).toEqual('x-and-y');
        });
    });

    describe('MovieLookup', function () {
        var MovieLookup;
        beforeEach(inject(function (_MovieLookup_) {
            MovieLookup = _MovieLookup_;
        }));

        it('should identify existing movies by name', function () {
            expect(MovieLookup.has(MOCK_MOVIE.name)).toBe(true);
        });

        it('should identify non-existing movies by name', function () {
            expect(MovieLookup.has('not found')).toBe(false);
        });

        it('should retrieve the movie by normalized name', function () {
            expect(MovieLookup.get(MOCK_MOVIE.name)).toEqual(MOCK_MOVIE);
        });

        it('should return null when the movie is not found by normalized name', function () {
            expect(MovieLookup.get('not found')).toBe(null);
        });

        it('should report the number of known movies', function () {
            expect(MovieLookup.size).toEqual(1);
        });
    });

});
