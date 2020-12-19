import Item from './item';
import Icon from '../icon';

//可选中按钮，点击进行状态的切换
export default class ToggleItem extends Item {
  element() {
    const { tag } = this;
    return super.element()
      .child(new Icon(tag))
      .on('click', () => this.click());
  }

  click() {
    this.change(this.tag, this.toggle());
  }

  setState(active) {
    this.el.active(active);
  }

  toggle() {
    return this.el.toggle();
  }

  active() {
    return this.el.hasClass('active');
  }
}
