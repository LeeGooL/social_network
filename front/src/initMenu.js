import { session, getProfile } from './util.js';

const menu = document.querySelector('[data-segment="menu"]');

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

    menu.classList.remove('invisible');
    initMenu(user);
  } catch (error) {
    console.error({ error });
  }
}

async function initMenu(user) {
  const menuItems = document.querySelectorAll('[data-menuitem]');

  for (const menuItem of menuItems) {
    menuItem.classList.remove('active');
  }

  const params = new URLSearchParams(location.search);

  if (params.has('userId')) {
    const newUser = await getProfile(params.get('userId'));

    if (newUser.user.id !== user.id) {
      return;
    }
  }

  for (const menuItem of menuItems) {
    if (location.pathname.includes(menuItem.dataset.menuitem)) {
      menuItem.classList.add('active');
    }
  }
}
