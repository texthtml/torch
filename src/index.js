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

    var got_camera = function(camera) {
        if (cameraWithFlash === null && camera.capabilities.flashModes.indexOf('torch') !== -1) {
            cameraWithFlash = camera;

            switch_the_light(true);
        } else {
            camera.release();
        }
    };

    var version = window.navigator.userAgent.match(/Firefox\/([\d]+)/);
    var usePromise = (version && version.length === 2 && version[1] >= 37)

    try {
        var cameras = window.navigator.mozCameras.getListOfCameras();

        for (var cameraId of cameras) {
            if (usePromise) {
                window.navigator.mozCameras.getCamera(
                    cameraId,
                    {
                        mode: 'unspecified'
                    }
                ).then(function(p) {
                    got_camera(p.camera);
                });
            } else {
                window.navigator.mozCameras.getCamera(
                    cameraId, null, got_camera
                );
            }
        }
    } catch (e) {
        // camera api not supported
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
