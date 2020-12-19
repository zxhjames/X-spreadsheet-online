import DropdownItem from './dropdown_item';
import DropdownAlign from '../dropdown_align';

//负责垂直对齐
export default class Valign extends DropdownItem {
  constructor(value) {
    super('valign', '', value);
  }

  dropdown() {
    const { value } = this;
    return new DropdownAlign(['top', 'middle', 'bottom'], value);
  }
}
