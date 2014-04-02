(function() {
    'use strict';

    var cameraWithFlash = null;

    var lightIsOn = function () {
        return document.body.classList.contains('light-on');
    };

    var switch_the_light = function(on) {
        if (on === undefined) {
            on = !lightIsOn();
        }

        if (cameraWithFlash !== null) {
            cameraWithFlash.flashMode = on ? 'torch' : 'off';
        }

        document.body.classList[on ? 'add' : 'remove']('light-on');
    };

    if ('mozCameras' in window.navigator) {
        var cameras = window.navigator.mozCameras.getListOfCameras();

        for (var cameraId of cameras) {
            var camera = window.navigator.mozCameras.getCamera({
                camera: cameraId
            }, function(camera) {
                if (camera.capabilities.flashModes.indexOf('torch') !== -1) {
                    cameraWithFlash = camera;

                    switch_the_light(true);
                }
            });
        }
    }

    window.addEventListener("visibilitychange", function(e){
        if (cameraWithFlash !== null) {
            var on = lightIsOn() && document.visibilityState === 'visible';
            cameraWithFlash.flashMode = on ? 'torch' : 'off';
        }
    }, false);

    document.body.addEventListener('click', function () {
        switch_the_light();
    });

    switch_the_light(true);
}) ();
