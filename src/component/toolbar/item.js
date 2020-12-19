import { cssPrefix } from '../../config';
import tooltip from '../tooltip';
import { h } from '../element';
import { t } from '../../locale/locale';

// 所有工具栏按钮类型的父类，其含有三个主要的子类 dropdown_item icon_item toggle_item 其余所有按钮继承自这三个子类
// tip: 存储按钮的信息，一般为其中文名 + 快捷键，会体现在其对应的元素的一个名为"data-tooltip"的属性中
// tag: 原始的英文名，一般在整个系统中最为识别名使用
// shortcut: 快捷键对应的字符串类型 eg."Ctrl+B"
// value: 某些按钮元素存储了当前的值，一般会在初始化时设定一个系统默认的初始值，在data_proxy中可以看到
// el: 自定义ELement对象
// change: 绑定的是该按钮元素的点击监听事件
export default class Item {
  constructor(tag, shortcut, value) {
    this.tip = t(`toolbar.${tag.replace(/-[a-z]/g, c => c[1].toUpperCase())}`);
    if (shortcut) this.tip += ` (${shortcut})`;
    this.tag = tag;
    this.shortcut = shortcut;
    this.value = value;
    this.el = this.element();
    this.change = () => {};
  }
  
  element() {
    const { tip } = this;
    return h('div', `${cssPrefix}-toolbar-btn`)
      .on('mouseenter', (evt) => {
        tooltip(tip, evt.target);
      })
      .attr('data-tooltip', tip);//data-tooltip在这里设置
  }

  setState() {}
}
