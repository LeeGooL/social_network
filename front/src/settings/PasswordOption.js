import FormSegment from './FormSegment.js';
import Option from './Option.js';

class PasswordOption extends Option {
  constructor() {
    super('Пароль', 'password');

    const passwordSegment = new FormSegment('password', this.form);
    const confirmPasswordSegment = new FormSegment('confirmPassword', this.form);

    Object.assign(this, { passwordSegment, confirmPasswordSegment });
  }

  validate() {
    const { passwordSegment, confirmPasswordSegment } = this;

    passwordSegment.resetValid();
    confirmPasswordSegment.resetValid();

    const password = passwordSegment.input.value;
    const confirmPassword = confirmPasswordSegment.input.value;

    let flag = true;

    if (password.length < 3) {
      flag = false;
      passwordSegment.setInvalid('Пароль должен быть не менее 3-х символов');
    }

    if (!confirmPassword.length) {
      flag = false;
      confirmPasswordSegment.setInvalid('Укажите пароль дважды');
    }

    if (password !== confirmPassword && confirmPassword.length) {
      flag = false;
      confirmPasswordSegment.setInvalid('Пароли должны совпадать');
    }

    return flag;
  }

  async save() {
    const password = this.passwordSegment.input.value;

    this.passwordSegment.input.value = '';
    this.confirmPasswordSegment.input.value = '';

    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        this.passwordSegment.setValid('Пароль успешно обновлен');
        return;
      }

      const text = await res.text();
      throw Error(text);
    } catch (err) {
      console.error({ err });
      this.passwordSegment.setInvalid(err.message);
    }
  }
}

export default PasswordOption;
