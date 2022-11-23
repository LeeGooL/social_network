import EventEmitter from '../EventEmitter.js';
import { addClass } from '../util.js';

class Select extends EventEmitter {
  options = [];

  constructor() {
    super();

    const ul = document.createElement('ul');
    addClass(ul, 'nav', 'nav-tabs', 'mb-3');

    this.ul = ul;
  }

  add(option) {
    this.options.push(option);
    this.ul.append(option.li);

    option.on('select', (code) => {
      this.active(code);
    });
  }

  active(code) {
    for (const option of this.options) {
      if (option.code === code) {
        option.activate();
      } else {
        option.deactivate();
      }
    }
  }
}

export default Select;
