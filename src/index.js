(function() {
    'use strict';

    var cameraWithFlash = null;

    var lightIsOn = function () {
        return document.body.classList.contains('light-on');
    };

    var lock = null;

    var switchTheLight = function(on) {
        if (on === undefined) {
            on = !lightIsOn();
        }

        if (cameraWithFlash !== null) {
            cameraWithFlash.flashMode = on ? 'torch' : 'off';
        }

        if ('requestWakeLock' in window.navigator) {
            if (on && lock === null) {
                lock = window.navigator.requestWakeLock('screen');
            }

            if (!on && lock !== null) {
                lock.unlock();
                lock = null;
            }
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

            var usePromise = window.navigator.mozCameras.getCamera.length === 1;

            for (var cameraId of cameras) {
                if (usePromise) {
                    window.navigator.mozCameras.getCamera(cameraId, {mode: 'unspecified'}).then(function(p) {
                        GetCameraCallback(p.camera);
                    }, CameraErrorCallback);
                } else {
                    var camera = window.navigator.mozCameras.getCamera({
                        camera: cameraId
                    }, {
                        mode: 'picture',
                        previewSize: null,
                        recorderProfile: 'cif'
                    }, GetCameraCallback, CameraErrorCallback);
                }
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
