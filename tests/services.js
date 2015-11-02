var angular = require('angular');
var mocks = require('angular-mocks');

describe('Services', function () {
    beforeEach(function () {
        angular.mock.module(require('../src/js/services'));
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
            expect(Normalizer.normalize('first & second')).toEqual('first-second');
            expect(Normalizer.normalize('it\'s great!')).toEqual('its-great');
        });

        it('should trimextraneous whitespace', function () {
            expect(Normalizer.normalize('    \n space  \t  ')).toEqual('space');
        });
    });

});
