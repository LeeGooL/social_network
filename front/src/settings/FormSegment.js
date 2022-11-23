import { addClass, removeClass } from '../util.js	';

class FormSegment {
  constructor(name, root = document) {
    const segment = root.querySelector(`[data-segment="${name}"]`);

    if (!segment) {
      throw Error(`Segment [data-segment="${name}"] wasn't found`);
    }

    this.wrapper = segment.querySelector('[data-field="wrapper"]');
    this.input = segment.querySelector('input');
    this.invalidWrapper = segment.querySelector('.invalid-feedback');
    this.validWrapper = segment.querySelector('.valid-feedback');
  }

  resetValid() {
    removeClass([this.wrapper, this.input], 'is-valid', 'is-invalid');
  }

  setValid(text = '') {
    addClass([this.wrapper, this.input], 'is-valid');

    if (this.validWrapper) {
      this.validWrapper.textContent = text;
    }
  }

  setInvalid(text = '') {
    addClass([this.wrapper, this.input], 'is-invalid');

    if (this.invalidWrapper) {
      this.invalidWrapper.textContent = text;
    }
  }
}

export default FormSegment;
