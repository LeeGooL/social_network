import EventEmitter from '../EventEmitter.js';
import { read } from '../initMenu.js';
import { removeClass } from '../util.js';
import Message from './Message.js';

const chatDiv = document.querySelector('[data-segment="chat"]');
const messagesDiv = document.querySelector('[data-segment="messages"]');
const textarea = document.querySelector('[data-field="textarea"]');

let chatInstance = null;

class Chat extends EventEmitter {
  user = null;
  friend = null;
  messages = [];

  constructor(user) {
    super();

    if (chatInstance) {
      return chatInstance;
    }

    chatInstance = this;

    this.user = user;
    removeClass(chatDiv, 'd-none');

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        this.messageHandler(e);
      }
    });
  }

  addMessages(...datas) {
    for (const data of datas) {
      const author = data.senderId === this.user.id ? this.user : this.friend;
      const message = new Message(data, author);

      this.messages.push(message);
      messagesDiv.append(message.message);

      if (!data.read) {
        read(data.id);
      }
    }

    messagesDiv.scrollTo(0, Math.max(messagesDiv.scrollHeight, messagesDiv.offsetHeight, messagesDiv.clientHeight));
  }

  messageHandler(event) {
    const content = event.target.value.trim();

    this.emit('message', content);

    textarea.value = '';
  }
}

export default Chat;
