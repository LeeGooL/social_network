import '../initExit.js';

const usersListDiv = document.querySelector('[data-segment="usersList"]');

main();

async function main() {
  try {
    const res = await fetch('api/users');

    if (res.ok) {
      const data = await res.json();
      initUsersList(data);
      return;
    }

    const text = res.text();
    throw Error(text);
  } catch (err) {
    console.error({ err });
  }
}

function initUsersList(users) {
  usersListDiv.textContent = '';

  for (const item of users) {
    usersListDiv.append(createUserItem(item));
  }
}

function createUserItem(user) {
  const link = document.createElement('a');
  link.className = 'list-group-item list-group-item-action text-primary';
  link.textContent = `${user.name} ${user.surname}`;
  link.href = `/profile.html?userId=${user.id}`;

  return link;
}
