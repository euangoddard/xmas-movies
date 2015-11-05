var angular = require('angular');

var MODULE_NAME = 'xmas.fullscreen';

var fullscreen = angular.module(MODULE_NAME, []);

fullscreen.factory('Fullscreen', function () {
    var is_fullscreen_available = 
        'exitFullscreen' in document || 
        'msExitFullscreen' in document || 
        'mozCancelFullScreen' in document || 
        'webkitExitFullscreen' in document
        ;
    var is_fullscreen_active = function() {
        return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    };
    var enter_fullscreen = function (element) {
        element.requestFullscreen ? element.requestFullscreen() : element.msRequestFullscreen ? element.msRequestFullscreen() : element.mozRequestFullScreen ? element.mozRequestFullScreen() : element.webkitRequestFullscreen && element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    };
    var exit_fullscreen = function() {
        document.exitFullscreen ? document.exitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen();
    };
    
    var toggle_fullscreen = function (element) {
        if (!is_fullscreen_available) {
            return;
        }
        if (is_fullscreen_active()) {
            exit_fullscreen();
        } else {
            enter_fullscreen(element);
        }
    };
    
    return {
        toggle: toggle_fullscreen
    };
});

module.exports = MODULE_NAME;