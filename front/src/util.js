const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const errorClass = 'is-invalid';
const successClass = 'is-valid';

export function validateEmail(email) {
  return emailRegex.test(email);
}

export function addClass(elem, className) {
  return elem.classList.add(className);
}

export function removeClass(elem, className) {
  return elem.classList.remove(className);
}

export function errorValidation(elems, flag = true) {
  if (flag) {
    flag = false;
  }

  elems.forEach((el) => addClass(el, errorClass));

  return flag;
}

export function successfulValidation(elems) {
  elems.forEach((el) => {
    removeClass(el, errorClass);
    addClass(el, successClass);
  });
}

export function getDataFromIGroup(item) {
  const field = item.dataset.igroup;
  const input = item.querySelector('input');
  const wrapper = item.querySelector('div');

  return { field, input, wrapper };
}

export async function session(unauthenticatedCallback = () => {}) {
  try {
    const res = await fetch('api/session');

    if (res.ok) {
      const user = await res.json();
      return user;
    }

    unauthenticatedCallback();
  } catch (err) {
    console.error({ err });
  }
}
