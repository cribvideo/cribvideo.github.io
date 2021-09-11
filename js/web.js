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

          document.getElementsByClassName("chats")[0].appendChild(itemElem);
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
};

{
  /* <div class="chats-item">
  <img src="https://eu.ui-avatars.com/api/?name=Undefined" class="pfp" />
  <h3>Undefined</h3>
</div>; */
}

loadConversations();
