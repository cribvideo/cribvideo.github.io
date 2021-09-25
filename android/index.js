var currentScreen = "load"

var currentVars = {
    cameraFacingMode: "user"
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/iOS-sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
        });
    });
}

function loginScreen() {

}

function loadQuickSnap() {
    permissionHandler("request", "camera", () => {
        currentVars["cameraConstraints"] = navigator.userAgent.includes("iPhone") ? {video:true} : {
            audio: false,
            video: {
                facingMode: currentVars["cameraFacingMode"]
            }
        };
        var videoElem = document.getElementById("cameraVideo");

        videoElem.setAttribute('autoplay', '');
        videoElem.setAttribute('muted', '');
        videoElem.setAttribute('playsinline', '');

        permissionHandler("get","camera", (stream) => {
            videoElem.srcObject = stream;
            videoElem.play();
        });
    })
}

function permissionHandler(access = "get", type, cb) {
    if (type == "camera") {
        if (access == "request") {
            if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
                console.log("This device supports video.");

                navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        optional: [
                            {minWidth: 320},
                            {minWidth: 640},
                            {minWidth: 1024},
                            {minWidth: 1280},
                            {minWidth: 1920},
                            {minWidth: 2560},
                        ]
                    }
                })
                cb();
            } else {

            }
        }
        if (access == "get") {
            navigator.mediaDevices.getUserMedia(currentVars["cameraConstraints"]).then(function success(stream) {
                cb(stream)
            });
        }

    }
}

function appStart() {

   loadQuickSnap();
}

appStart();


function jumpToCamera() {
    document.getElementsByClassName("cameraScreen")[0].className = "cameraScreen-active screen";
    document.getElementsByClassName("chatsScreen")[0].className = "chatsScreen screen inactive";

    currentScreen = "camera";
    loadQuickSnap();


    document.getElementsByClassName("spectacle")[0].addEventListener("click", () => {
        var vidElem = document.getElementById("cameraVideo");
        vidElem.pause();
        
        var canvas = document.getElementById('cameraCanvas');     
        var video = document.getElementById('cameraVideo');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);  
        canvas.toBlob((blob) => {
          const img = new Image();
          var blb = window.URL.createObjectURL(blob)
          window.open(blb);
          vidElem.play()
        });
    });

}

setInterval(() => {
    document.getElementById("root-style").innerHTML = `
        :root {
            --v-height: ${window.innerHeight}px
        }
    `;
}, 10);