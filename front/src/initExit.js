import { removeClass, session } from './util.js';

const signOutButton = document.querySelector('[data-action="signout"]');

main();

async function main() {
  const user = await session();

  if (user != null) {
    removeClass(signOutButton, 'd-none');
    signOutButton.addEventListener('click', signout);
  }
}

async function signout() {
  try {
    const res = await fetch('/api/signout', { method: 'POST' });
  } catch (error) {
    console.error({ error });
  } finally {
    location.reload();
  }
}
