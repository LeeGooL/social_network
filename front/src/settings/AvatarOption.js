import FormSegment from './FormSegment.js';
import Option from './Option.js';

class AvatarOption extends Option {
  constructor() {
    super('Аватар', 'avatar');

    const segment = new FormSegment('avatar', this.form);
    Object.assign(this, { segment });
  }

  validate() {
    const avatar = this.segment.input.files;

    this.segment.resetValid();

    if (avatar.length === 1) {
      return true;
    }

    this.segment.setInvalid('Необходимо выбрать аватар');

    return false;
  }

  async save() {
    const avatar = this.segment.input.files[0];
    const data = new FormData();
    data.append('avatar', avatar);

    this.segment.resetValid();

    try {
      const res = await fetch('/api/user/avatar', { method: 'PATCH', body: data });

      if (res.ok) {
        this.segment.setValid('Аватар успешно сохранен');
        return;
      }

      const text = await res.text();
      throw Error(text);
    } catch (err) {
      console.error({ err });

      this.segment.setInvalid(err.message);
    }
  }
}

export default AvatarOption;
