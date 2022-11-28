import { dateFormatter } from '../util.js';

const messageTemplate = document.querySelector('[data-template="message"]');

class Message {
  constructor(data, author) {
    const message = document.importNode(messageTemplate.content, true).firstElementChild;
    const href = `/profile.html?userId=${author.id}`;

    message.querySelector('[data-field="linkToProfile"]').href = href;
    message.querySelector('[data-field="avatar"]').src = author.img;

    const name = message.querySelector('[data-field="name"]');
    name.textContent = `${author.name} ${author.surname}`;
    name.href = href;

    message.querySelector('[data-field="date"]').textContent = dateFormatter.format(data.createdAt);
    message.querySelector('[data-field="content"]').textContent = data.content;

    Object.assign(this, { message, data, author });
  }
}

export default Message;

/*
{
    "id": 2,
    "name": "danil",
    "surname": "tarasov",
    "email": "m@m.m",
    "img": "/sets/avatar.png",
    "status": "hello. I'm Danil."
}

{
    "id": "claxrnvvy0000hss8adru2zjy",
    "senderId": 1,
    "receiverId": 2,
    "content": "Привет мир!",
    "createdAt": 1669457117232,
    "readed": false
}
*/
