import '../initExit.js';
import '../initMenu.js';
import { addClass, removeClass, session } from '../util.js';

const cardTemplate = document.querySelector('[data-template="friendCard"]');
const friendsList = document.querySelector('[data-segment="friends"][data-type="list"]');
const requestsHeader = document.querySelector('[data-segment="requests"][data-type="header"]');
const requestsList = document.querySelector('[data-segment="requests"][data-type="list"]');

let requests = [];
let friends = [];

main();

async function main() {
  await session(() => (location.href = '/'));
  await init();

  initRequests();
  initFriends();
}

function createFriendCard(user) {
  const friendCard = document.importNode(cardTemplate.content, true).firstElementChild;
  const imgElem = friendCard.querySelector('[data-field="avatar"]');
  const nameElem = friendCard.querySelector('[data-field="name"]');

  friendCard.href = `/profile.html/userId=${user.id}`;
  imgElem.src = user.img;
  nameElem.textContent = `${user.name} ${user.surname}`;

  return friendCard;
}

async function init() {
  try {
    const res = await fetch('/api/friends');

    if (res.ok) {
      const data = await res.json();
      console.log({ data });
      requests = data.requests;
      friends = data.friends;
      return;
    }

    const text = await res.text();
    throw Error(text);
  } catch (err) {
    console.error({ err });
  }
}

function initRequests() {
  if (!requests.length) {
    addClass(requestsHeader, 'd-none');
    return;
  }

  removeClass(requestsHeader, 'd-none');
  requestsList.append(...requests.map(createFriendCard));
}

function initFriends() {
  friendsList.append(...friends.map(createFriendCard));
}
