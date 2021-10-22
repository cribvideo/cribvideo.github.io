function appLoad() {
    initialiseHome();
}

function initialiseHomeChats() {
    const ls = window.localStorage;
    const token = ls.getItem("token");

    ls.setItem("token", "eyJVc2VyQWdlbnQiOiJNb3ppbGxhLzUuMCAoWDExOyBMaW51eCB4ODZfNjQ7IHJ2OjkyLjApIEdlY2tvLzIwMTAwMTAxIEZpcmVmb3gvOTIuMCIsImtleUJ5dGVzIjoiOWY5Yzg3NDktODMwYS00NjMyLWIwY2QtYjA2NmYwMjg3YzQ4In0=.OWZiZGY0MGItOTI0MC00NDQ3LTg4YWYtYzgzZWNmMmEyNzVi");
    try {
        Android.sendToken(ls.getItem("token"))
    } catch {}
    
    fetch("https://cribapi.ceccun.com/api/v1/chat/conversations", {
    headers: {
      authorization: ls.getItem("token"),
    },
    }).then((response) => {
        if (response.status == 200) {
        response.json().then((data) => {
            var conversations = data.content;

            document.getElementsByClassName('conversations')[0].innerHTML = ``;


            conversations.forEach((item, index) => {
                var name = item.name;
                var id = item.id;
                // <div class="conversations-item-swipe">
                //         <div onclick="initialiseChat()" class="conversations-item">
                //             <div class="conversations-item-image">
                //                 <img src="https://eu.ui-avatars.com/api/?name=Ajaz%20C" />
                //             </div>
                //             <div>
                //                 <h3>A conversation</h3>
                //                 <p>Ejaz: Test</p>
                //             </div>
                //         </div>
                //         <div class="hoz-short">
                //             <img style="filter: invert()" src="/images/message-square.svg" />
                //         </div>
                // </div>
                var title = document.createElement('h3');
                var lastMsg = document.createElement('p');
                var contentDiv = document.createElement('div');
                title.innerText = name;
                lastMsg.innerText = `Debug: idc`;

                contentDiv.appendChild(title);
                contentDiv.appendChild(lastMsg);
                contentDiv.className = "conversations-item-div"

                var imgDiv = document.createElement('div');
                imgDiv.className = "conversations-item-image";
                var img = document.createElement('img');
                img.src = `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
                imgDiv.appendChild(img);

                var convoMain = document.createElement('div');
                convoMain.setAttribute('onclick', `initialiseChat('${id}')`);
                convoMain.className = `conversations-item`;
                convoMain.appendChild(imgDiv);
                convoMain.appendChild(contentDiv);

                var hoz = document.createElement('div');
                hoz.className = "hoz-short";
                var hozImg = document.createElement('img')
                hozImg.src = "/images/message-square.svg";
                hozImg.style.filter = 'invert()';

                hoz.appendChild(hozImg);

                var mainCon = document.createElement('div');
                mainCon.className = "conversations-item-swipe";
                mainCon.id = `conversation-block_${id}`;
                mainCon.setAttribute('data-id', id);

                mainCon.appendChild(convoMain);
                mainCon.appendChild(hoz);

                document.getElementsByClassName('conversations')[0].appendChild(mainCon);

                document.getElementById(`conversation-block_${id}`).addEventListener('scroll', swipeChatEventListener);
            })
        });
        }
    });
}

function swipeChatEventListener(e) {
    const item = e.target;
    const id = e.target.getAttribute('data-id');
    if (item.scrollLeft == 60) {
        console.log(id);
        initialiseChat();
    }
}

function initialiseHome(from = "none") {
    const homeElem = document.getElementsByClassName("home")[0];
    const midElem = document.getElementsByClassName("home-mid")[0];
    const allChatElems = document.getElementsByClassName("conversations-item-swipe");

    const ls = window.localStorage;

    // for (const item of allChatElems) {
    //     item.addEventListener('scroll', swipeChatEventListener);
    // }

    if (from == "none") {
        homeElem.className = "home";
        setTimeout(() => {
            initialiseHomeChats();
        }, 500);
        const funnyMessages = [
            "Swag",
            "Your favourite app",
            "Welcome home, babe",
            "You go!",
            "Battery not included"
        ]
        const cribName = document.getElementById("crib-name");
        cribName.innerText = funnyMessages[Math.floor(Math.random()*(funnyMessages.length - 1))];
        setTimeout(() => {
            cribName.innerText = "Swipe down to capture"
            setTimeout(() => {
                cribName.innerText = "Crib"
            }, 2000)
        }, 1000)
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
            // for (const item of allChatElems) {
            //     item.removeEventListener('scroll', swipeChatEventListener);
            // }
        }
    }
}

function initialiseChat(id) {
    const chatElem = document.getElementById("chat");
    chatElem.className = "chat slideRightIn";

    const chatBackButton = document.getElementById("chat-back-button");
    const chatBar = document.getElementsByClassName("chat-bar")[0];
    chatElem.addEventListener('scroll', chatElemScrollListener)

    chatBackButton.addEventListener('click', chatBackElemScrollListener);

    chatBar.addEventListener('keyup', keyBoardTrigger);

    function chatBackElemScrollListener() {
        chatElem.className = "chat slideRightOut";
        chatElem.removeEventListener('scroll', chatElemScrollListener);
        chatBackButton.removeEventListener('click', chatElemScrollListener);
    }

    function keyBoardTrigger(e) {
        console.log(e);
    }

    function chatElemScrollListener() {
        if (chatElem.scrollLeft == 0) {
            chatElem.className = "chat slideRightOut";
            chatElem.removeEventListener('scroll', chatElemScrollListener);
            chatBackButton.removeEventListener('click', chatElemScrollListener);
            chatBar.removeEventListener('keyup', keyBoardTrigger);
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

document.getElementById("root-style").innerHTML = `
        :root {
            --v-height: ${window.innerHeight}px;
            --v-width: ${window.innerWidth}px;
        }
        `;
lastHeight = window.innerHeight;
lastWidth = window.innerWidth;

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

navigator.serviceWorker.register('/android-sw.js');