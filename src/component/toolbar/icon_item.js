import Item from './item';
import Icon from '../icon';

//单个点击按钮，点击生效，不提供额外内容
export default class IconItem extends Item {
  element() {
    return super.element()
      .child(new Icon(this.tag))
      .on('click', () => this.change(this.tag));
  }

  setState(disabled) {
    this.el.disabled(disabled);
  }
}
