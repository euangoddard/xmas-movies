'use strict';

var MODULE_NAME = 'xmas.sound';

var angular = require('angular');
var can_play_ogg = require('./can-play-ogg');

var sound = angular.module(MODULE_NAME, []);

sound.provider('SoundManager', function () {

    var sounds = {};

    var sounds_root = '/';

    var extension = can_play_ogg() ? 'ogg' : 'm4a';

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    var context;
    try {
        context = new AudioContext();
    } catch (e) {
        context = null;
    }

    this.set_sounds_root = function (root) {
        sounds_root = root;
        return this;
    };

    var get_sound_file_name = function (sound) {
        return sounds_root + sound + '.' + extension;
    };

    this.$get = function ($q) {
        var is_muted = false;
        var gain_node = context.createGain();
        gain_node.gain.value = 1;
        gain_node.connect(context.destination);

        var load_sound = function (sound) {
            var url = get_sound_file_name(sound);

            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            var sound_load_promise = $q(function (resolve, reject) {
                request.onload = function () {
                    context.decodeAudioData(request.response, function (buffer) {
                        sounds[sound] = buffer;
                        resolve(sound);
                    });
                };
                request.onerror = reject;
            });
            request.send();
            return sound_load_promise;
        };

        var service = {
            play: function (sound) {
                var sound_promise = $q(function (resolve) {
                    var buffer = sounds[sound];
                    var source = context.createBufferSource();
                    source.buffer = buffer;
                    source.connect(gain_node);
                    source.onended = resolve;
                    source.start(0);
                });
                return sound_promise;
            },

            add_sounds: function (sounds) {
                var sound_load_promises = [];
                angular.forEach(sounds, function (sound) {
                    sound_load_promises.push(load_sound(sound));
                });
                return $q.all(sound_load_promises);
            }
        };
        Object.defineProperty(service, 'is_muted', {
            enumerable: true,
            get: function () {
                return is_muted;
            },
            set: function (value) {
                is_muted = !!value;
                if (is_muted) {
                    gain_node.gain.value = 0;
                } else {
                    gain_node.gain.value = 1;
                }
            }
        });

        return service;
    };

    if (!context) {
        this.$get = function () {
            return {
                play: angular.noop,
                add_sounds: angular.noop,
                is_muted: true
            };
        };
    }

});

module.exports = MODULE_NAME;
