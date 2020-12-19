import DropdownItem from './dropdown_item';
import DropdownAlign from '../dropdown_align';

//负责水平对齐
export default class Align extends DropdownItem {
  constructor(value) {
    super('align', '', value);
  }

  dropdown() {
    const { value } = this;
    return new DropdownAlign(['left', 'center', 'right'], value);
  }
}
