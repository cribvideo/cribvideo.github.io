var pageVisibility = "";
var last = {};
var current = {};

var lastHeight = 0;
var lastWidth = 0;

function appLoad() {
  initialiseHome();
  resolveName("@me");
  backgroundActivity(scanForMessages);
  followConversation();
}

function initialiseHomeChats() {
  const ls = window.localStorage;
  const token = ls.getItem("token");

  ls.setItem(
    "token",
    "eyJVc2VyQWdlbnQiOiJNb3ppbGxhLzUuMCAoWDExOyBMaW51eCB4ODZfNjQ7IHJ2OjkyLjApIEdlY2tvLzIwMTAwMTAxIEZpcmVmb3gvOTIuMCIsImtleUJ5dGVzIjoiOWY5Yzg3NDktODMwYS00NjMyLWIwY2QtYjA2NmYwMjg3YzQ4In0=.OWZiZGY0MGItOTI0MC00NDQ3LTg4YWYtYzgzZWNmMmEyNzVi"
  );
  try {
    Android.sendToken(ls.getItem("token"));
  } catch {}

  fetch("https://cribapi.ceccun.com/api/v1/chat/conversations", {
    headers: {
      authorization: ls.getItem("token"),
    },
  }).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        var conversations = data.content;

        document.getElementsByClassName("conversations")[0].innerHTML = ``;

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
          var title = document.createElement("h3");
          var lastMsg = document.createElement("p");
          var contentDiv = document.createElement("div");
          title.innerText = name;
          lastMsg.innerText = `Debug: idc`;

          contentDiv.appendChild(title);
          contentDiv.appendChild(lastMsg);
          contentDiv.className = "conversations-item-div";

          var imgDiv = document.createElement("div");
          imgDiv.className = "conversations-item-image";
          var img = document.createElement("img");
          img.src = `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}`;
          imgDiv.appendChild(img);

          var convoMain = document.createElement("div");
          convoMain.setAttribute("onclick", `initialiseChat('${id}')`);
          convoMain.className = `conversations-item`;
          convoMain.appendChild(imgDiv);
          convoMain.appendChild(contentDiv);

          var hoz = document.createElement("div");
          hoz.className = "hoz-short";
          var hozImg = document.createElement("img");
          hozImg.src = "/images/message-square.svg";
          hozImg.style.filter = "invert()";

          hoz.appendChild(hozImg);

          var mainCon = document.createElement("div");
          mainCon.className = "conversations-item-swipe";
          mainCon.id = `conversation-block_${id}`;
          mainCon.setAttribute("data-id", id);

          mainCon.appendChild(convoMain);
          mainCon.appendChild(hoz);

          document
            .getElementsByClassName("conversations")[0]
            .appendChild(mainCon);

          document
            .getElementById(`conversation-block_${id}`)
            .addEventListener("scroll", swipeChatEventListener);
        });
      });
    }
  });
}

function swipeChatEventListener(e) {
  const item = e.target;
  const id = e.target.getAttribute("data-id");
  if (item.scrollLeft == 60) {
    initialiseChat(id);
  }
}

function initialiseHome(from = "none") {
  const homeElem = document.getElementsByClassName("home")[0];
  const midElem = document.getElementsByClassName("home-mid")[0];
  const allChatElems = document.getElementsByClassName(
    "conversations-item-swipe"
  );

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
      "Battery not included",
      "Narsay?",
      "Bingoos",
      "Autograph?",
    ];
    const cribName = document.getElementById("crib-name");
    cribName.innerText =
      funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    setTimeout(() => {
      cribName.innerText = "Swipe down to capture";
      setTimeout(() => {
        cribName.innerText = "Crib";
      }, 2000);
    }, 1000);
  }
  if (from == "camera") {
    homeElem.className = "home slideUpIn";
  }
  homeElem.scrollTo(0, 100);

  homeElem.addEventListener("scroll", homeElemScrollListener);
  midElem.addEventListener("scroll", midElemScrollListener);
  console.log("evt listener");

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
      homeElem.removeEventListener("scroll", homeElemScrollListener);
      midElem.removeEventListener("scroll", midElemScrollListener);
      // for (const item of allChatElems) {
      //     item.removeEventListener('scroll', swipeChatEventListener);
      // }
    }
  }
}

function initialiseChat(chatID) {
  const ls = window.localStorage;
  const token = ls.getItem("token");
  const chatElem = document.getElementById("chat");
  const chatBarElem = document.getElementsByClassName("chat-bar")[0];
  chatElem.className = "chat slideRightIn";

  const chatBackButton = document.getElementById("chat-back-button");
  chatElem.addEventListener("scroll", chatElemScrollListener);

  chatBackButton.addEventListener("click", chatBackElemScrollListener);

  chatBarElem.addEventListener("keydown", sendMessageListener);

  fetch(
    `https://cribapi.ceccun.com/api/v1/chat/conversations/${chatID}/details`,
    {
      headers: {
        authorization: token,
      },
    }
  ).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        document.getElementById("groupName").innerText = data.content.name;
        data.content.participants.forEach((item, index) => {
          resolveName(item.id);
        });
      });
    }
  });

  console.log(chatID);
  fetch(
    `https://cribapi.ceccun.com/api/v1/chat/conversations/${chatID}/latest`,
    {
      headers: {
        authorization: token,
      },
    }
  ).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        document.getElementsByClassName("chat-mid")[0].innerHTML = ``;
        var randomIDElem = document.createElement("div");
        const randomID = `message-box ${btoa(Math.random())}`;
        randomIDElem.className = randomID;
        document
          .getElementsByClassName("chat-mid")[0]
          .appendChild(randomIDElem);
        last["element"] = document.getElementsByClassName(randomID)[0];
        data.content.forEach((item, index) => {
          parseMessage(
            item.content,
            item.author,
            0,
            undefined,
            item.type,
            item.id,
            last["element"]
          );
        });
        current["conversation"] = chatID;
      });
    }
  });

  function chatBackElemScrollListener() {
    chatElem.className = "chat slideRightOut";
    chatElem.removeEventListener("scroll", chatElemScrollListener);
    chatBackButton.removeEventListener("click", chatElemScrollListener);
    current["conversation"] = "";
  }

  function chatElemScrollListener() {
    if (chatElem.scrollLeft == 0) {
      chatElem.className = "chat slideRightOut";
      chatElem.removeEventListener("scroll", chatElemScrollListener);
      chatBackButton.removeEventListener("click", chatElemScrollListener);
      current["conversation"] = "";
    }
  }

  function sendMessageListener(e) {
    const message = chatBarElem.innerText.trim();

    if (message == "") {
      chatBarElem.innerHTML = "";
    }

    if (e.keyCode == 13 && !e.shiftKey) {
      e.preventDefault();
      if (message != "") {
        var id = "@me";
        const dtHost = new Date;
        parseMessage(message, "@me", dtHost.getTime(), null, "text", "tbd", document.getElementsByClassName("chat-mid")[0], (id) => {
          fetch(`https://cribapi.ceccun.com/api/v1/chat/conversations/${current["conversation"]}/send`, {
            method: 'POST',
            mode: 'cors',
            headers: {
              authorization: ls.getItem('token'),
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              content: message,
              type: "text"
            })
          }).then((response) => {
            if (response.status == 200) {
              document.getElementById(id).className = "chat-message me";
            }
          })
        });
        chatBarElem.innerHTML = "";
      }
    }
  }
}

function initialiseCamera(prepare = false, prepareCb = "none") {
  var video = document.getElementById("camera-video");
  video.setAttribute("playsinline", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("muted", "");

  /* Setting up the constraint */
  var facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
  var constraints = {
    audio: false,
    video: {
      optional: [
        { minWidth: 320 },
        { minWidth: 640 },
        { minWidth: 1024 },
        { minWidth: 1280 },
        { minWidth: 1920 },
        { minWidth: 2560 },
      ],
    },
  };

  const cameraElem = document.getElementById("camera");

  if (prepare == true) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function success(stream) {
        video.srcObject = stream;
        if (prepareCb != "none") {
          prepareCb();
        }
      });
  } else {
    document.getElementById("camera").className = "camera screen";
    cameraElem.addEventListener("scroll", cameraElemScrollListener);
  }

  function cameraElemScrollListener() {
    if (cameraElem.scrollTop == 0) {
      cameraElem.removeEventListener("scroll", cameraElemScrollListener);
      initialiseHome("camera");
      cameraElem.className = "hidden";
      const stream = video.srcObject;

      const tracks = stream.getTracks();

      tracks.forEach(function (track) {
        track.stop();
      });
    }
  }
}

const resolveName = (id, cb = () => {}) => {
  const ls = window.localStorage;

  const url = `https://cribapi.ceccun.com/api/v1/friends/${id}/details`;

  var cacheRaw = ls.getItem(`.cache_${url}`);

  if (
    cacheRaw != undefined &&
    cacheRaw != null &&
    ls.getItem(`.cache_${url}_grab`) == undefined
  ) {
    var cache = JSON.parse(atob(cacheRaw));
    cb(cache.name, cache.pfp);
  } else {
    fetch(url, {
      headers: {
        authorization: ls.getItem("token"),
      },
    }).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          ls.setItem(`.cache_${url}`, btoa(JSON.stringify(data.content)));
          cb(data.content.name, data.content.pfp, data.content.id);
        });
      }
    });
  }
};

const parseMessage = (
  message,
  authorID,
  time,
  reply = undefined,
  type,
  id = undefined,
  element = document.getElementsByClassName("rs-message-box")[0],
  cb = ""
) => {
  const messageUUID = btoa(Math.random());
  var ls = window.localStorage;

  const myId = JSON.parse(
    atob(
      ls.getItem(".cache_https://cribapi.ceccun.com/api/v1/friends/@me/details")
    )
  );

  var chatModal = document.createElement("div");
  chatModal.className = "chat-message them";
  chatModal.setAttribute("id", messageUUID);
  var author = document.createElement("div");
  author.id = `${messageUUID}_author`;
  if (authorID == myId.id || authorID == "@me") {
    var cmClassState = "chat-message me";
    if (id == "tbd") {
      cmClassState = "chat-message me sending";
      cb(messageUUID);
    }
    chatModal.className = cmClassState;
  }
  author.className = "author";
  var content = document.createElement("div");
  content.className = "content";
  try {
    if (message.trim() == "") {
      return;
    }
    content.innerText = message.trim();
  } catch (e) {
    content.innerHTML =
      "<i style='opacity: 0.5'>This message is unavailable.</i>";
  }

  chatModal.appendChild(author);
  chatModal.appendChild(content);

  element.appendChild(chatModal);

  resolveName(authorID, (authorName, pfpLink) => {
    document.getElementById(`${messageUUID}_author`).innerText = authorName;
  });
};

const scanForMessages = (int) => {
  var ls = window.localStorage;

  fetch("https://cribapi.ceccun.com/api/v1/updates", {
    headers: {
      authorization: ls.getItem("token"),
    },
  }).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        if (data.error != "1") {
          loadSignUp();
        }
        if (data.content != null && data.content != undefined) {
          var content = data.content;
          if (
            content["conversations"][current["conversation"]] != null &&
            content["conversations"][current["conversation"]] != undefined
          ) {
            if (
              content.conversations[current["conversation"]].messages != null &&
              content.conversations[current["conversation"]].messages !=
                undefined
            ) {
              content.conversations[current["conversation"]].messages.forEach(
                (item, index) => {
                  parseMessage(
                    item.content,
                    item.author,
                    item.time,
                    undefined,
                    item.type,
                    item.id,
                    last["element"]
                  );
                }
              );
            }
          }
        }
      });
    }
  });
};

function followConversation(scrollNow = 0) {
  const chatMid = document.getElementsByClassName("chat-mid")[0];
  var oldHeight = 0;
  setInterval(() => {
    if (chatMid.scrollHeight != oldHeight) {
      const oldSH = oldHeight - chatMid.scrollTop - chatMid.offsetHeight;
      oldHeight = chatMid.scrollHeight;
      if (oldSH == 0) {
        chatMid.scrollTo(0, chatMid.scrollHeight);
      }
    }
  }, 100);
}

const backgroundActivity = (cb) => {
  cb();

  var time = 1000;
  if (pageVisibility == "hidden") {
    time = 5000;
    console.log("sob");
  }
  setTimeout(() => {
    backgroundActivity(cb);
  }, time);
};

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

navigator.serviceWorker.register("/android-sw.js");
