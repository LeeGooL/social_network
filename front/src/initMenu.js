import { io } from 'https://cdn.socket.io/4.5.4/socket.io.esm.min.js';
import { addClass, getProfile, removeClass, session } from './util.js';

const menu = document.querySelector('[data-segment="menu"]');

let socket = null;

main();

async function main() {
  if (!menu) {
    return;
  }

  try {
    const user = await session();

    if (user == null) {
      return;
    }

    removeClass(menu, 'invisible');
    initMenu(user);
  } catch (error) {
    console.error({ error });
  }
}

async function initMenu(user) {
  const menuItems = document.querySelectorAll('[data-menuitem]');

  for (const menuItem of menuItems) {
    removeClass(menuItem, 'active');
  }

  const params = new URLSearchParams(location.search);

  if (params.has('userId') && location.pathname.includes('profile')) {
    const newUser = await getProfile(params.get('userId'));

    if (newUser.user.id !== user.id) {
      return;
    }
  }

  for (const menuItem of menuItems) {
    if (location.pathname.includes(menuItem.dataset.menuitem)) {
      addClass(menuItem, 'active');
    }
  }

  socket = new io({ path: '/api/notification' });
  socket.on('status', handler);
}

function handler(flag) {
  const notificationIcon = menu.querySelector('[data-field="notification"]');

  if (flag) {
    removeClass(notificationIcon, 'd-none');
  }
}

export function read(messageId) {
  socket.emit('status', messageId, handler);
}
