import EventEmitter from '../EventEmitter.js';
import { dateFormatter } from '../util.js';

const chatsList = document.querySelector('[data-segment="chatsList"]');
const chatItemTemplate = document.querySelector('[data-template="chatItem"]');

class ChatsList extends EventEmitter {
  user = null;

  constructor(user) {
    super();

    const listOfChats = document.createElement('li');
    listOfChats.className = 'list-group';

    chatsList.append(listOfChats);

    Object.assign(this, { listOfChats, user });
  }

  init(chats) {
    for (const chat of chats) {
      const chatItem = document.importNode(chatItemTemplate.content, true).firstElementChild;
      const friend = this.user.id === chat.receiver.id ? chat.sender : chat.receiver;
      const items = chatItem.querySelectorAll('[data-field]');

      for (const item of items) {
        const field = item.dataset.field;

        if (field === 'avatar') {
          item.src = friend.img;
        } else if (field === 'profileLink') {
          item.href = `/profile.html?userId=${friend.id}`;
        } else if (field === 'name') {
          item.textContent = `${friend.name} ${friend.surname}`;
        } else if (field === 'date') {
          item.textContent = dateFormatter.format(chat.message.createdAt);
        } else if (field === 'lastMessage') {
          item.textContent = chat.message.content;
        }
      }

      chatItem.addEventListener('click', () => this.emit('select', friend.id));
      chatItem.style.cursor = 'pointer';
      this.listOfChats.append(chatItem);
    }
  }
}

export default ChatsList;
