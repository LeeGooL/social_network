import FormSegment from './FormSegment.js';
import Option from './Option.js';

class NameOption extends Option {
  validateNameMessage = 'Нужно указать имя';
  validateSurnameMessage = 'Нужно указать фамилию';
  validNameMessage = 'Имя сохранено';
  validSurnameMessage = 'Фамилия сохранена';

  constructor(name, surname) {
    super('Имя/фамилия', 'name');

    this.nameSegment = new FormSegment('name', this.form);
    this.surnameSegment = new FormSegment('surname', this.form);

    this.nameSegment.input.value = name;
    this.surnameSegment.input.value = surname;
  }

  validate() {
    const { nameSegment, surnameSegment, validateNameMessage, validateSurnameMessage } = this;
    const flag = nameSegment.input.value.length && surnameSegment.input.value.length;

    nameSegment.resetValid();
    surnameSegment.resetValid();

    if (flag) {
      return true;
    }

    if (!nameSegment.input.value.trim().length) nameSegment.setInvalid(validateNameMessage);
    if (!surnameSegment.input.value.trim().length) surnameSegment.setInvalid(validateSurnameMessage);

    return false;
  }

  async save() {
    const { nameSegment, surnameSegment, validNameMessage, validSurnameMessage } = this;
    const name = nameSegment.input.value.trim();
    const surname = surnameSegment.input.value.trim();

    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, surname }),
      });

      if (res.ok) {
        nameSegment.setValid(validNameMessage);
        surnameSegment.setValid(validSurnameMessage);
        return;
      }

      const text = await res.text();
      throw Error(text);
    } catch (err) {
      console.error({ err });

      nameSegment.setValid(err.message);
      surnameSegment.setValid(err.message);
    }
  }
}

export default NameOption;
