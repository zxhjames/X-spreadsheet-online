import { Element, h } from './element';
import { cssPrefix } from '../config'; //默认为"x-spreadsheet"

//图表元素类，继承自Element类，内部是一个div嵌套一个子div
export default class Icon extends Element {
  constructor(name) {
    super('div', `${cssPrefix}-icon`);
    this.iconNameEl = h('div', `${cssPrefix}-icon-img ${name}`);
    this.child(this.iconNameEl);
  }

  //设置内部div的类名
  setName(name) {
    this.iconNameEl.className(`${cssPrefix}-icon-img ${name}`);
  }
}
