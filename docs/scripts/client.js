var host = "wss://cmpsc-302-project-esteban.herokuapp.com"; // Change to your Heroku host

//var host = "ws://localhost:8080";

setName.addEventListener("click", () => {
  let name = nameEntry.value;
  if(!name) return false;

  chat.name = nameEntry.value;

  chatLogin.setAttribute("hidden","true");

  sendMsg.removeAttribute("disabled");
  sendBtn.removeAttribute("disabled");

  chat.init()
});

sendMsg.addEventListener("keydown", (evt) => {
  if(evt.key == "Enter" && evt.key !== "Shift"){
    evt.preventDefault();
    sendBtn.click();
  }
  return false;
});

nameEntry.addEventListener("keydown", (evt) => {
  if(evt.key == "Enter") {
    evt.preventDefault();
    setName.click();
  }
  return false;
});

var chat = {
  name: null,
  socket: new WebSocket(host),
  init: () => {

    chat.window = document.getElementById("chat-window");
	
	let login = {
		type: "login",
		user: chat.name,
		text: ""
	}
	
	chat.socket.send(
		JSON.stringify(login)
	);
	
    chat.send(`${chat.name} has entered the chat.`, "greet");

    chat.socket.addEventListener("message", (evt) => {
      let msg = evt.data;
      let packet = JSON.parse(msg);
      console.log(packet);
      if(packet.type === "userlist") {
        delete packet.type;
        // Do user stuff; send to new property?
        // packet.type, everything else is a user
        chat.updateUsers(packet);
      } else {
        chat.post(packet);
      }
    });

    setInterval(() => {
      chat.send("","ping");
    },15000);

  },

  send: (message, type) => {
    let msg = {
      user: chat.name,
      text: sendMsg.value || message,
      type: type
    }

    if(typeof(msg.text) !== "string") return false;

    chat.socket.send(JSON.stringify(msg));

    if(type !== "ping") sendMsg.value = "";
    return false;
  },

  scroll: () => {
    let msgs = Array.from(
      document.getElementsByClassName("chat-msg")
    );
    let pos = msgs[msgs.length - 1].offsetTop;
    document.getElementById("chat-window").scrollTo({
      top: pos,
      behavior: "smooth"
    });
    return false;
  },

  post: (message) => {
    let msg = document.createElement("p");
    let text = document.createElement("span")
    text.className = "chat-msg";
    text.innerText = `${message.name} ${message.type} ${message.text}`;
    msg.appendChild(text);
    chat.window.appendChild(msg);
    chat.scroll();
    return false;
  },

  updateUsers: (users) => {
    let list = document.getElementById('chat-users');
    list.innerHTML = users; // TODO: Move or replace this
    // TODO: Loop over list of users
    //for(let user in users) {
    //  list[user] = users[user].name;
    //  list.append(users)
    //}
    //return list;
    // TODO: Replace all content with the resulting list of users
    return false;
  },

};
