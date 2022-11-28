import '../initExit.js';
import '../initMenu.js';

import { io } from 'https://cdn.socket.io/4.5.4/socket.io.esm.min.js';
import { session } from '../util.js';
import Chat from './Chat.js';
import ChatsList from './ChatsList.js';

main();

async function main() {
  const user = await session(() => (location.href = '/'));
  const socket = new io({ path: '/api/chat' });
  const params = new URLSearchParams(location.search);

  if (params.has('userId')) {
    const friendId = parseInt(params.get('userId'), 10);
    const chat = new Chat(user);

    socket.emit('getChat', friendId, ({ friend, messages }) => {
      chat.friend = friend;
      chat.addMessages(...messages);
    });

    chat.on('message', (content) => {
      socket.emit('message', { content, friendId });
    });

    socket.on('message', (message) => chat.addMessages(message));
  } else {
    const chatsList = new ChatsList(user);

    socket.on('init', (data) => chatsList.init(data));

    chatsList.on('select', (friendId) => (location.href = `/chat.html?userId=${friendId}`));
  }
}
