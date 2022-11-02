const express = require('express');
const { Server } = require('ws');
const port = process.env.PORT || 8080;

const server = express()
  .listen(port, () => console.log(`Listening on ${port}`));

const socket = new Server({ server });

var users = {};

// Customize server emoji set

const emoji = {
  "greet": ["👋"],
  "normal": ["🦒","🦍","🐔","🐴","🐷"],
  "ping": ["🔊"],
  "login": ["🔊"]
}

const userList = (users) => {
	let list = {type: "userlist"};
	for(let entry in users) {
		list[entry] = users[entry].name;
	}
	return list;
}

socket.on("connection", (sock, request) => {

  let uid = 0;

  while(true) {
    if(!users.hasOwnProperty(uid)) {
      users[uid] = sock;
      break;
    }
    uid++;
  }
 
  sock.on("close", () => {
    delete users[uid];
  });

  sock.on("message", (message) => {
    message = JSON.parse(message);
    let name = message.user;
    let msg = message.text;
    let type = emoji[message.type];
	let list = userList(users);
    let chosenIcon = type[Math.floor(Math.random() * type.length)];
    for (let user in users) {
      if (message.type === "ping") {
		users[uid].socket.send(JSON.stringify(list));
		break;
	  };
      if (message.type === "login") {
		users[uid] = {
			id: uid,
			socket: sock,
			name: name
		}
		break;
	  }
      let packet = {
        name: name,
        type: chosenIcon,
        text: msg
      }
      users[user].socket.send(JSON.stringify(packet));
      //users[user].socket.send(`${name} ${chosenIcon} ${msg}`);
    }
  });

});
