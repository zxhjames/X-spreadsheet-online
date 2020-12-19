import Calendar from './calendar';
import { h } from './element';
import { cssPrefix } from '../config';

//页面日期选择器，目前系统中暂时没用上，依赖于calendar类
export default class Datepicker {
  constructor() {
    this.calendar = new Calendar(new Date());
    this.el = h('div', `${cssPrefix}-datepicker`).child(
      this.calendar.el,
    ).hide();
  }

  setValue(date) {
    // console.log(':::::::', date, typeof date, date instanceof string);
    const { calendar } = this;
    if (typeof date === 'string') {
      // console.log(/^\d{4}-\d{1,2}-\d{1,2}$/.test(date));
      if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(date)) {
        calendar.setValue(new Date(date.replace(new RegExp('-', 'g'), '/')));
      }
    } else if (date instanceof Date) {
      calendar.setValue(date);
    }
    return this;
  }

  change(cb) {
    this.calendar.selectChange = (d) => {
      cb(d);
      this.hide();
    };
  }

  show() {
    this.el.show();
  }

  hide() {
    this.el.hide();
  }
}
