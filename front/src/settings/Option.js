import EventEmitter from '../EventEmitter.js';
import { addClass, removeClass } from '../util.js';

class Option extends EventEmitter {
  constructor(title, code) {
    super();

    const li = document.createElement('li');
    addClass(li, 'nav-item');

    const button = document.createElement('button');
    addClass(button, 'nav-link');
    button.textContent = title;
    button.addEventListener('click', () => this.emit('select', code));

    li.append(button);

    Object.assign(this, {title, code, li, button})

    this.form = document.querySelector(`[data-tab="${code}"]`);

    const saveButton = this.form.querySelector('[data-action="save"]');
    saveButton.addEventListener('click', (e) => {
      e.preventDefault();

      if (this.validate()) {
        this.save();
      }
    });
  }

  activate() {
    const { button, form } = this;
    addClass(button, 'active');
    removeClass(form, 'd-none');
  }

  deactivate() {
    const { button, form } = this;
    removeClass(button, 'active');
    addClass(form, 'd-none');
  }
}

export default Option;
