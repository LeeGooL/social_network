import { validateEmail } from '../util.js';
import FormSegment from './FormSegment.js';
import Option from './Option.js';
validateEmail;

class EmailOption extends Option {
  validWrapper;
  invalidWrapper;
  wrapper;
  emailInput;

  validMessage = 'Почта была успешно обновлена';
  validateMessage = 'Нужно указать почту';

  constructor(email) {
    super('Почта', 'email');
    this.segment = new FormSegment('email', this.form);
    this.segment.input.value = email;
  }

  validate() {
    const { segment, validateMessage } = this;
    const value = segment.input.value;
    const flag = validateEmail(value);

    segment.resetValid();

    if (flag) {
      return true;
    }

    segment.setInvalid(validateMessage);

    return false;
  }

  async save() {
    const { segment, validMessage } = this;

    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: segment.input.value }),
      });

      if (res.ok) {
        segment.setValid(validMessage);
        return;
      }

      const text = await res.text();
      throw Error(text);
    } catch (err) {
      console.error({ err });
      segment.setInvalid(err.message);
    }
  }
}

export default EmailOption;
