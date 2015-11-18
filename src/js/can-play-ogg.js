'use strict';

// Test taken from https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js

var element = document.createElement('audio');
var can_play_ogg;
try {
    can_play_ogg = !!element.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '');
}
catch (e) {
    can_play_ogg = false;
}

module.exports = function () {
    return can_play_ogg;
};
