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


    function homeElemScrollListener() {
        if (homeElem.scrollTop == 0) {
            homeElem.className = "home slideDown";
            initialiseCamera();
            homeElem.removeEventListener('scroll', homeElemScrollListener);
        }
    }
}

function initialiseChat() {
    const chatElem = document.getElementById("chat");
    chatElem.className = "chat slideRightIn";

    chatElem.addEventListener('scroll', chatElemScrollListener)

    function chatElemScrollListener() {
        if (chatElem.scrollLeft == 0) {
            chatElem.className = "chat slideRightOut";
            chatElem.removeEventListener('scroll', chatElemScrollListener);
        }
    }
}

function initialiseCamera() {
    var video = document.getElementById("camera-video");
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');

    /* Setting up the constraint */
    var facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
    var constraints = {
        audio: false,
        video: {
            facingMode: facingMode
        }
    };

    navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
        video.srcObject = stream;
        document.getElementById("camera").className = "camera screen";
    });

    const cameraElem = document.getElementById("camera");

    cameraElem.addEventListener('scroll', cameraElemScrollListener);

    function cameraElemScrollListener() {
        if (cameraElem.scrollTop == 0) {
            cameraElem.className = "hidden";
            const stream = video.srcObject;

            const tracks = stream.getTracks();

            tracks.forEach(function(track) {
                track.stop();
            });

            initialiseHome("camera");
            cameraElem.removeEventListener('scroll', cameraElemScrollListener);
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