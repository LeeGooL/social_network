import FormSegment from './FormSegment.js';
import Option from './Option.js';

class StatusOption extends Option {
  constructor(status) {
    super('Статус', 'status');

    const segment = new FormSegment('status', this.form);
    segment.input.value = status;

    Object.assign(this, { segment });
  }

  validate() {
    return true;
  }

  async save() {
    const status = this.segment.input.value.trim();

    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        this.segment.setValid('Статус успешно обновлен');
        return;
      }

      const text = await res.text();
      throw Error(text);
    } catch (err) {
      console.error({ err });
    }
  }
}

export default StatusOption;
