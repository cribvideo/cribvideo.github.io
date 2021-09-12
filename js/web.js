var current = {};
var pageVisibility = "visible";

const loadConversations = () => {
  var ls = window.localStorage;
  fetch("https://cribapi.ceccun.com/api/v1/chat/conversations", {
    headers: {
      authorization: ls.getItem("token"),
    },
  }).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        var conversations = data.content;

        conversations.forEach((convo) => {
          var name = convo.name;
          var id = convo.id;

          var itemElem = document.createElement("div");
          itemElem.className = "chats-item";

          var h3 = document.createElement("h3");
          h3.innerText = name;

          var img = document.createElement("img");
          img.src = `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}`;
          img.className = "pfp";

          itemElem.appendChild(img);
          itemElem.appendChild(h3);

          itemElem.setAttribute("id", `chat-link-${id}`);

          itemElem.setAttribute("onclick", `openConvo("${id}")`);

          document.getElementsByClassName("chats")[0].prepend(itemElem);

          try {
            document.getElementById("chats-list-loader").remove();
          } catch (e) {}
        });
      });
    }
  });
};

const openConvo = (id) => {
  try {
    document.getElementsByClassName("chats-item-active")[0].className =
      "chats-item";
  } catch (e) {}
  document.getElementById(`chat-link-${id}`).className =
    "chats-item chats-item-active";

  document
    .getElementsByClassName("rs-welcome")[0]
    .setAttribute("style", "display: none");
  document.getElementsByClassName("rs-chat")[0].setAttribute("style", "");

  document
    .getElementsByClassName("chat-box-input")[0]
    .addEventListener("keydown", (e) => {
      if (e.keyCode == 13) {
        e.preventDefault();
      }
    });

  document
    .getElementsByClassName("chat-box-input")[0]
    .addEventListener("keyup", (e) => {
      if (e.keyCode == 13) {
        sendMessage(
          document.getElementsByClassName("chat-box-input")[0].innerText
        );

        document.getElementsByClassName("chat-box-input")[0].innerText = "";
      }
    });

  current["conversation"] = id;

  var ls = window.localStorage;

  const token = ls.getItem("token");

  fetch(`https://cribapi.ceccun.com/api/v1/chat/conversations/${id}/details`, {
    headers: {
      authorization: token,
    },
  }).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        document.getElementById("groupName").innerText = data.content.name;
        data.content.participants.forEach((item, index) => {
          resolveName(item.id);
        });
      });
    }
  });

  fetch(`https://cribapi.ceccun.com/api/v1/chat/conversations/${id}/latest`, {
    headers: {
      authorization: token,
    },
  }).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        document.getElementsByClassName("rs-message-box")[0].innerHTML = ``;

        data.content.forEach((item, index) => {
          parseMessage(
            item.content,
            item.author,
            0,
            undefined,
            item.type,
            item.id
          );
        });

        document
          .getElementsByClassName("rs-message-box")[0]
          .scrollTo(
            0,
            document.getElementsByClassName("rs-message-box")[0].scrollHeight
          );
      });
    }
  });
};

{
  /* <div class="chats-item">
  <img src="https://eu.ui-avatars.com/api/?name=Undefined" class="pfp" />
  <h3>Undefined</h3>
</div>; */
}

const sendMessage = (message) => {
  var ls = window.localStorage;

  const myId = JSON.parse(
    atob(
      ls.getItem(".cache_https://cribapi.ceccun.com/api/v1/friends/@me/details")
    )
  );

  var time = new Date();

  try {
    if (message.trim() == "") {
      return;
    } else {
      parseMessage(message, myId.id, time.getTime(), undefined, "text");
      fetch(
        `https://cribapi.ceccun.com/api/v1/chat/conversations/${current["conversation"]}/send`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            authorization: ls.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: message.trim(),
            type: "text",
          }),
        }
      );
    }
  } catch (e) {}
};

const parseMessage = (
  message,
  authorID,
  time,
  reply = undefined,
  type,
  id = undefined
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
  var author = document.createElement("div");
  author.id = `${messageUUID}_author`;
  if (authorID == myId.id) {
    chatModal.className = "chat-message me";
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

  document.getElementsByClassName("rs-message-box")[0].appendChild(chatModal);

  resolveName(authorID, (authorName, pfpLink) => {
    document.getElementById(`${messageUUID}_author`).innerText = authorName;
  });
  document
    .getElementsByClassName("rs-message-box")[0]
    .scrollTo(
      0,
      document.getElementsByClassName("rs-message-box")[0].scrollHeight
    );
};

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
          cb(data.content.name, data.content.pfp);
        });
      }
    });
  }
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
                    item.id
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

// let webSocket = new WebSocket("wss://cribapi.ceccun.com");
// webSocket.onmessage = (e) => {
//   var data = JSON.parse(e.data);
//   if (data.type == "update") {
//     if (data.content != null && data.content != undefined) {
//       var content = data.content;
//       if (
//         content["conversations"][current["conversation"]] != null &&
//         content["conversations"][current["conversation"]] != undefined
//       ) {
//         if (
//           content.conversations[current["conversation"]].messages != null &&
//           content.conversations[current["conversation"]].messages != undefined
//         ) {
//           content.conversations[current["conversation"]].messages.forEach(
//             (item, index) => {
//               parseMessage(
//                 item.content,
//                 item.author,
//                 item.time,
//                 undefined,
//                 item.type,
//                 item.id
//               );
//             }
//           );
//         }
//       }
//     }
//   }
// };

var ls = window.localStorage;
// webSocket.onopen = (e) => {
//   webSocket.send(
//     JSON.stringify({
//       authorization: ls.getItem("token"),
//     })
//   );
// };

window.addEventListener("blur", () => {
  pageVisibility = "hidden";
});

window.addEventListener("focus", () => {
  pageVisibility = "visible";
});

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

const loadHomeScreen = () => {
  backgroundActivity(() => {
    scanForMessages(1);
  });
  resolveName(`@me`, (name) => {
    document.getElementById("@me-name").innerText = name;
  });
  loadConversations();

  var welcomeTitle = document.getElementById("welcome-h2");
  var welcomeP = document.getElementById("welcome-p");

  const randomTitles = ["Howdy!", "bingus?", "Lookin' fresh"];
  const randomP = [
    "Your chats are synchronized.",
    "bingus bongus bingus, beengos boongas, bong",
    "Slap that call button when you're ready.",
  ];

  const randomInt = Math.floor(Math.random() * randomTitles.length);

  welcomeTitle.innerText = randomTitles[randomInt];
  welcomeP.innerText = randomP[randomInt];
};

const loadSignUp = () => {
  document.getElementsByClassName("sign-up-modal")[0].setAttribute("style", "");
  document.getElementById("signupbutton").addEventListener("click", (e) => {
    e.target.innerText = "Fetching...";
    var username = document.getElementById("username-email");
    var password = document.getElementById("pw");
    if (username.value.trim() == "" || password.value.trim() == "") {
      e.target.innerText = "Sign In";
      return;
    } else {
      fetch("https://cribapi.ceccun.com/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username.value,
          password: password.value,
        }),
      }).then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            if (data.error != "1") {
              e.target.innerText = "Sign In";
              return;
            } else {
              var ls = window.localStorage;
              ls.clear();
              ls.setItem("token", data.authentication);

              document
                .getElementsByClassName("sign-up-modal")[0]
                .setAttribute("style", "display: none;");

              loadHomeScreen();
            }
          });
        }
      });
    }
  });
};

var ls = window.localStorage;

if (ls.getItem("token") == undefined) {
  loadSignUp();
} else {
  loadHomeScreen();
}
