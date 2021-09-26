function appLoad() {
    initialiseHome();
}

function initialiseHome(from = "none") {
    const homeElem = document.getElementsByClassName("home")[0];
    const midElem = document.getElementsByClassName("home-mid")[0];


    if (from == "none") {
        homeElem.className = "home"
    }
    if (from == "camera") {
        homeElem.className = "home slideUpIn"
    }
    homeElem.scrollTo(0, 100);
    
    homeElem.addEventListener('scroll', homeElemScrollListener);
    midElem.addEventListener('scroll', midElemScrollListener);
    console.log("evt listener")

    let cameraInitialised = 0;

    function midElemScrollListener() {
        if (midElem.scrollTop == 0) {
            if (cameraInitialised == 0) {
                cameraInitialised = 1;
                initialiseCamera(true, () => {
                    console.log("Camera Initialised");
                });
            }
        }
    }

    function homeElemScrollListener() {
        if (homeElem.scrollTop == 0) {
            homeElem.className = "home slideDown";
            if (cameraInitialised == 0) {
                initialiseCamera(true, () => {
                    initialiseCamera();
                });
            } else {
                initialiseCamera();
            }
            homeElem.removeEventListener('scroll', homeElemScrollListener);
            midElem.removeEventListener('scroll', midElemScrollListener);
        }
    }
}

function initialiseChat() {
    const chatElem = document.getElementById("chat");
    chatElem.className = "chat slideRightIn";

    const chatBackButton = document.getElementById("chat-back-button");
    chatElem.addEventListener('scroll', chatElemScrollListener)

    chatBackButton.addEventListener('click', chatBackElemScrollListener);

    function chatBackElemScrollListener() {
        chatElem.className = "chat slideRightOut";
        chatElem.removeEventListener('scroll', chatElemScrollListener);
        chatBackButton.removeEventListener('click', chatElemScrollListener);
    }

    function chatElemScrollListener() {
        if (chatElem.scrollLeft == 0) {
            chatElem.className = "chat slideRightOut";
            chatElem.removeEventListener('scroll', chatElemScrollListener);
            chatBackButton.removeEventListener('click', chatElemScrollListener);
        }
    }
}

function initialiseCamera(prepare = false, prepareCb = 'none') {
    var video = document.getElementById("camera-video");
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');

    /* Setting up the constraint */
    var facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
    var constraints = {
        audio: false,
        video: {
            optional: [
                {minWidth: 320},
                {minWidth: 640},
                {minWidth: 1024},
                {minWidth: 1280},
                {minWidth: 1920},
                {minWidth: 2560},
            ],
        }
    };

    const cameraElem = document.getElementById("camera");
    
    if (prepare == true) {
        navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
            video.srcObject = stream;
            if (prepareCb != 'none') {
                prepareCb();
            }
        });
    } else {
        document.getElementById("camera").className = "camera screen";
        cameraElem.addEventListener('scroll', cameraElemScrollListener);
    }



    function cameraElemScrollListener() {
        if (cameraElem.scrollTop == 0) {
            cameraElem.removeEventListener('scroll', cameraElemScrollListener);
            initialiseHome("camera");
            cameraElem.className = "hidden";
            const stream = video.srcObject;

            const tracks = stream.getTracks();

            tracks.forEach(function(track) {
                track.stop();
            });

        }
    }      
}

var lastHeight = 0;
var lastWidth = 0;

setInterval(() => {
    if (lastHeight != window.innerHeight || lastWidth != window.innerWidth) {
        document.getElementById("root-style").innerHTML = `
        :root {
            --v-height: ${window.innerHeight}px;
            --v-width: ${window.innerWidth}px;
        }
        `;
        lastHeight = window.innerHeight;
        lastWidth = window.innerWidth;
    }
}, 10);
appLoad();