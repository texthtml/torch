(function() {
    'use strict';

    var cameraWithFlash = null;

    var lightIsOn = function () {
        return document.body.classList.contains('light-on');
    };

    var switchTheLight = function(on) {
        if (on === undefined) {
            on = !lightIsOn();
        }

        if (cameraWithFlash !== null) {
            cameraWithFlash.flashMode = on ? 'torch' : 'off';
        }

        document.body.classList[on ? 'add' : 'remove']('light-on');
    };

    var findCamera = function() {
        try {
            var cameras = window.navigator.mozCameras.getListOfCameras();

            if (cameras.length === 0) {
                console.warn('No camera found, only screen availlable');
                return;
            }

            var invalidCamerasCount = 0;

            var cameraIsInvalid = function() {
                invalidCamerasCount++;

                if (invalidCamerasCount === cameras.length) {
                    console.warn('No flashlight found, only screen availlable');
                }
            };

            var GetCameraCallback = function(camera, config) {
                if (camera.capabilities.flashModes.indexOf('torch') !== -1) {
                    cameraWithFlash = camera;

                    switchTheLight(true);
                } else {
                    cameraIsInvalid();
                }
            };

            var CameraErrorCallback = function (error) {
                console.error(error);
                cameraIsInvalid();
            };

            for (var cameraId of cameras) {
                var camera = window.navigator.mozCameras.getCamera({
                    camera: cameraId
                }, {
                    mode: 'picture',
                    previewSize: null,
                    recorderProfile: 'cif'
                }, GetCameraCallback, CameraErrorCallback);
            }
        } catch (e) {
            console.warn('camera api not supported (simulator or <2.0)');
        }
    };

    window.addEventListener("visibilitychange", function(e){
        if (cameraWithFlash !== null) {
            var on = lightIsOn() && document.visibilityState === 'visible';
            cameraWithFlash.flashMode = on ? 'torch' : 'off';
        }
    }, false);

    document.body.addEventListener('click', function () {
        switchTheLight();
    });

    findCamera();

    switchTheLight(true);
}) ();
