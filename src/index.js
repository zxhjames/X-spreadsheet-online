/* global window, document */
import { h } from './component/element';
import DataProxy from './core/data_proxy';
import Sheet from './component/sheet';
import Bottombar from './component/bottombar';
import { cssPrefix } from './config';
import { locale } from './locale/locale';
import './index.less';
import './component/expand/index';
import { initExpand } from './component/expand/index';

//入口类，整个系统通过调用 x_spreadsheet 得以初始化和工作（核心类）
class Spreadsheet {
  constructor(selectors, options = {}) {
    let targetEl = selectors;
    this.options = options;
    this.sheetIndex = 1;
    this.datas = [];
    if (typeof selectors === 'string') {
      targetEl = document.querySelector(selectors);
    }
    this.bottombar = new Bottombar(() => {
      const d = this.addSheet();
      this.sheet.resetData(d);
    }, (index) => {
      const d = this.datas[index];
      this.sheet.resetData(d);
    }, () => {
      this.deleteSheet();
    }, (index, value) => {
      this.datas[index].name = value;
    });
    this.data = this.addSheet();
    const rootEl = h('div', `${cssPrefix}`)
      .on('contextmenu', evt => evt.preventDefault());
    // create canvas element
    targetEl.appendChild(rootEl.el);
    this.sheet = new Sheet(rootEl, this.data);
    rootEl.child(this.bottombar.el);
  }
  //todo 手动增加单元格合并
  addMergeCell(index,sr,sc,er,ec) {
    console.log("addMergeCell")
    this.datas[index].setSelector(sr,sc,er,ec);
    this.datas[index].merge();
    this.reRender();
  }


  //加载初始数据
  addSheet(name, active = true) {
    const n = name || `sheet${this.sheetIndex}`;
    const d = new DataProxy(n, this.options);
    d.change = (...args) => {
      this.sheet.trigger('change', ...args);
    };
    this.datas.push(d);
    console.log('d:', n, d, this.datas);
    this.bottombar.addItem(n, active);
    this.sheetIndex += 1;
    return d;
  }

  deleteSheet() {
    const [oldIndex, nindex] = this.bottombar.deleteItem();
    if (oldIndex >= 0) {
      this.datas.splice(oldIndex, 1);
      if (nindex >= 0) this.sheet.resetData(this.datas[nindex]);
    }
  }

  //加载初始数据
  refreshSheet(name, active = true) {
    const n = name || `sheet${this.sheetIndex}`;
    const d = this.data
    d.change = (...args) => {
      this.sheet.trigger('change', ...args);
    };
  
    this.datas.push(d)
    //this.bottombar.addItem(n, active);
    this.sheetIndex += 1;
    return d;
  }
  // 重新刷新数据
  refreshData(data) {
    // 判断传递数据的类型
    const ds = Array.isArray(data) ? data : [data];
    this.bottombar.clear();
    this.datas = [];
    if (ds.length > 0) {
      for (let i = 0; i < ds.length; i += 1) {
        const it = ds[i];
        const nd = this.refreshSheet(it.name, i === 0);
        console.log(nd)
        // nd.styles = data.styles
        nd.setData(it);
        if (i === 0) {
          // 这一步很关键，重新刷新数据
          this.sheet.resetData(nd);
        }
      }
    }
    return this;
  }


  loadData(data) {
    const ds = Array.isArray(data) ? data : [data];
    this.bottombar.clear();
    this.datas = [];
    if (ds.length > 0) {
      for (let i = 0; i < ds.length; i += 1) {
        const it = ds[i];
        const nd = this.addSheet(it.name, i === 0);
        nd.setData(it);
        if (i === 0) {
          this.sheet.resetData(nd);
        }
      }
    }
    return this;
  }

  getData() {
    return this.datas.map(it => it.getData());
  }

  cellText(ri, ci, text, sheetIndex = 0) {
    this.datas[sheetIndex].setCellText(ri, ci, text, 'finished');
    return this;
  }

  cell(ri, ci, sheetIndex = 0) {
    return this.datas[sheetIndex].getCell(ri, ci);
  }

  cellStyle(ri, ci, sheetIndex = 0) {
    return this.datas[sheetIndex].getCellStyle(ri, ci);
  }

  reRender() {
    this.sheet.table.render();
    return this;
  }

  on(eventName, func) {
    this.sheet.on(eventName, func);
    return this;
  }

  validate() {
    const { validations } = this.data;
    return validations.errors.size <= 0;
  }

  change(cb) {
    this.sheet.on('change', cb);
    return this;
  }

  static locale(lang, message) {
    locale(lang, message);
  }
}

const spreadsheet = (el, options = {}) => new Spreadsheet(el, options);

//绑定到全局，可以在index.html的<script>中直接使用
if (window) {
  window.x_spreadsheet = spreadsheet;
  window.x_spreadsheet.locale = (lang, message) => locale(lang, message);
  window.expand = initExpand;
}

export default Spreadsheet;
export {
  spreadsheet,
};
