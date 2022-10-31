import { errorValidation, getDataFromIGroup, session, successfulValidation, validateEmail } from '../util.js';

const emailIGroup = document.querySelector('[data-igroup="email"]');
const passwordIGroup = document.querySelector('[data-igroup="password"]');
const enterButton = document.querySelector('[data-action="enter"]');

const items = [emailIGroup, passwordIGroup];

main();

async function main() {
  const user = await session();

  if (user) {
    return (document.location = '/profile.html');
  }

  enterButton.addEventListener('click', validation);
}

function validation() {
  let isAllValid = true;
  const data = new FormData();

  for (const item of items) {
    const { field, wrapper, input } = getDataFromIGroup(item);

    if ((field === 'email' && !validateEmail(input.value)) || (field === 'password' && input.value.length < 3)) {
      isAllValid = false;

      errorValidation([input, wrapper]);
    } else {
      successfulValidation([input, wrapper]);
      data.append(field, input.value);
    }
  }

  if (isAllValid) {
    enter({ data });
  }
}

async function enter({ data }) {
  for (const item of items) {
    const { field, input, wrapper } = getDataFromIGroup(item);

    input.classList.remove('is-valid');
    wrapper.classList.remove('is-valid');

    if (field === 'password') {
      input.value = '';
    }
  }

  try {
    const res = await fetch('api/signin', {
      method: 'POST',
      body: data,
    });

    if (res.ok) {
      document.location.href = '/profile.html';
      return;
    }

    const text = await res.text();
    throw Error(text);
  } catch (err) {
    console.error({ err });
    alert(err.message);
  }
}
