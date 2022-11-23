import '../initExit.js';
import '../initMenu.js';
import { session } from '../util.js';
import AvatarOption from './AvatarOption.js';
import EmailOption from './EmailOption.js';
import NameOption from './NameOption.js';
import PasswordOption from './PasswordOption.js';
import Select from './Select.js';
import StatusOption from './StatusOption.js';

const selectSegment = document.querySelector('[data-segment="select"]');

main();

async function main() {
  const user = await session(() => (location.href = '/'));

  const select = new Select();

  select.add(new EmailOption(user.email));
  select.add(new NameOption(user.name, user.surname));
  select.add(new PasswordOption());
  select.add(new AvatarOption(user.avatar));
  select.add(new StatusOption(user.status));

  select.active('email');

  selectSegment.innerHTML = '';
  selectSegment.append(select.ul);
}
