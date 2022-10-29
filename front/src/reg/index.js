import { validateEmail, addClass, removeClass } from '../util.js';

const igroupEmail = document.querySelector('[data-igroup="email"]');
const igroupName = document.querySelector('[data-igroup="name"]');
const igroupSurname = document.querySelector('[data-igroup="surname"]');
const igroupPassword = document.querySelector('[data-igroup="password"]');
const igroupConfirmPassword = document.querySelector('[data-igroup="confirmPassword"]');
const button = document.querySelector('[data-action="reg"]');

const items = [igroupEmail, igroupName, igroupSurname, igroupPassword, igroupConfirmPassword];

main();

function main() {
  button.addEventListener('click', validation);
}

function errorValidation(elems, className = 'is-invalid', flag = true) {
  if (flag) {
    flag = false;
  }

  elems.forEach((el) => addClass(el, className));

  return flag;
}

function successfulValidation(elems, className = 'is-valid') {
  elems.forEach((el) => removeClass(el, className));
}

function getDataFromIGroup(item) {
  const field = item.dataset.igroup;
  const input = item.querySelector('input');
  const wrapper = item.querySelector('div');

  return { field, input, wrapper };
}

function validation() {
  let isAllValid = true;
  const result = {};

  for (const item of items) {
    const { field, input, wrapper } = getDataFromIGroup(item);

    if (
      input.value === '' ||
      (item.dataset.igroup === 'email' && !validateEmail(input.value)) ||
      (item.dataset.igroup === 'password' && input.value.length < 3) ||
      (item.dataset.igroup === 'confirmPassword' && input.lenght !== igroupPassword.querySelector('input').lenght)
    ) {
      isAllValid = errorValidation([input, wrapper], 'is-invalid', isAllValid);
    } else {
      successfulValidation([input, wrapper], 'is-invalid');
      addClass(input, 'is-valid');

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

    console.log({ field, input, wrapper });

    input.classList.remove('is-valid');
    wrapper.classList.remove('is-valid');

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
    console.log({ err });
    alert(err.message);
  }
}
