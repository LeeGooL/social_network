import { addClass, getProfile, removeClass, session } from '../util.js';
import '../initExit.js';
import '../initMenu.js';

const fields = document.querySelectorAll('[data-field]');
const addFriendButton = document.querySelector('[data-action="addFriend"]');
const removeFriendButton = document.querySelector('[data-action="removeFriend"]');
const removeRequestButton = document.querySelector('[data-action="removeRequest"]');
const startChatButton = document.querySelector('[data-action="startChat"]');
const sentPostButton = document.querySelector('[data-action="sendPost"]');

let user = null;
let profile = null;

main();

async function main() {
  profile = await session();

  const params = new URLSearchParams(location.search);

  if (params.has('userId')) {
    user = await getProfile(parseInt(params.get('userId')));
  } else if (profile) {
    user = await getProfile(parseInt(profile.id));
  } else {
    return (location.href = '/');
  }

  initProfile();
}

function initProfile() {
  let { user: userField, request, friend } = user;

  for (const field of fields) {
    const fieldName = field.dataset.field;

    if (fieldName === 'name') {
      const name = `${userField.name} ${userField.surname}`;
      field.textContent = name;
      document.title = name;
    } else if (fieldName === 'status') {
      field.textContent = userField.status;
    } else if (fieldName === 'avatar') {
      field.src = userField.img;
    }

    if (request && profile && profile.id != userField.id) {
      removeClass(removeRequestButton, 'd-none');
      removeRequestButton.addEventListener('click', removeRequest);
    }

    if (profile != null ? friend && profile && profile.id != userField.id : false) {
      removeClass([removeFriendButton, startChatButton], 'd-none');
      removeFriendButton.addEventListener('click', removeFriend);
      startChatButton.addEventListener('click', () => {
        document.location = `/chat.html?userId=${user.user.id}`;
      });
    }

    if (profile != null ? !request && !friend && profile.id != userField.id : false) {
      removeClass(addFriendButton, 'd-none');
      addFriendButton.addEventListener('click', addFriend);
    }

    if (profile != null ? (profile != null && profile.id === userField.id) || friend : false) {
      sentPostButton.disabled = false;

      if (fieldName === 'postEditor') {
        field.value = '';
        field.disabled = false;
      }
    }
  }
}

async function addFriend() {
  try {
    const res = await fetch(`/api/request/${user.user.id}`, { method: 'POST' });

    if (res.ok) {
      location.reload();
      return;
    }

    const text = await res.json();
    throw Error(text);
  } catch (err) {
    console.error({ err });
    alert(err.message);
  }
}

async function removeRequest() {
  try {
    const res = await fetch(`/api/revoke/${user.user.id}`, { method: 'POST' });

    if (res.ok) {
      location.reload();
      return;
    }

    const text = await res.json();
    throw Error(text);
  } catch (err) {
    console.error({ err });
    alert(err.message);
  }
}

async function removeFriend() {
  try {
    const res = await fetch(`/api/friend/${user.user.id}`, { method: 'DELETE' });

    if (res.ok) {
      location.reload();
      return;
    }

    const text = await res.json();
    throw Error(text);
  } catch (err) {
    console.error({ err });
    alert(err.message);
  }
}
