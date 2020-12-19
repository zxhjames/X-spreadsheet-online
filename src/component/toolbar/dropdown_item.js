import Item from './item';

//点击提供可选内容
export default class DropdownItem extends Item {
  dropdown() {}

  getValue(v) {
    return v;
  }

  element() {
    const { tag } = this;
    this.dd = this.dropdown();
    this.dd.change = it => this.change(tag, this.getValue(it));
    return super.element().child(
      this.dd,
    );
  }

  setState(v) {
    if (v) {
      this.value = v;
      this.dd.setTitle(v);
    }
  }
}
