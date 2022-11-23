import {
  errorValidation,
  getDataFromIGroup,
  removeClass,
  session,
  successfulValidation,
  validateEmail,
} from '../util.js';

const igroupEmail = document.querySelector('[data-igroup="email"]');
const igroupName = document.querySelector('[data-igroup="name"]');
const igroupSurname = document.querySelector('[data-igroup="surname"]');
const igroupPassword = document.querySelector('[data-igroup="password"]');
const igroupConfirmPassword = document.querySelector('[data-igroup="confirmPassword"]');
const button = document.querySelector('[data-action="reg"]');

const items = [igroupEmail, igroupName, igroupSurname, igroupPassword, igroupConfirmPassword];

main();

async function main() {
  const user = await session();

  if (user) {
    return (document.location = '/profile.html');
  }

  button.addEventListener('click', validation);
}

function validation() {
  let isAllValid = true;
  const data = {};

  for (const item of items) {
    const { field, input, wrapper } = getDataFromIGroup(item);

    if (
      input.value === '' ||
      (field === 'email' && !validateEmail(input.value)) ||
      (field === 'password' && input.value.length < 3) ||
      (field === 'confirmPassword' && input.lenght !== igroupPassword.querySelector('input').lenght)
    ) {
      isAllValid = errorValidation([input, wrapper], isAllValid);
    } else {
      successfulValidation([input, wrapper]);

      if (field !== 'confirmPassword') result[field] = input.value;
    }
  }

  if (isAllValid) {
    registration({ result });
  }
}

// POST /api/reg
async function registration({ result }) {
  for (const item of items) {
    const { field, input, wrapper } = getDataFromIGroup(item);

    removeClass([input, wrapper], 'is-valid');

    if (field === 'password' || field === 'confirmPassword') {
      input.value = '';
    }
  }

  try {
    const res = await fetch('api/reg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });

    if (res.ok) {
      alert('Регистрация прошла успешно');
      document.location.href = '/';
      return;
    }

    const text = await res.text();
    throw Error(text);
  } catch (err) {
    console.error({ err });
    alert(err.message);
  }
}
