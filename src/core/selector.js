/*
 * @Author: your name
 * @Date: 2020-07-24 11:28:42
 * @LastEditTime: 2020-12-03 16:24:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xspreadsheet/src/core/selector.js
 */
import { CellRange } from './cell_range';

export default class Selector {
  constructor() {
    this.range = new CellRange(0,0,0,0);
    this.ri = 0;
    this.ci = 0;
  }

  //todo 
  setRange(cell) {
    this.range = cell;
  }
  multiple() {
    return this.range.multiple();
  }

  setIndexes(ri, ci) {
    this.ri = ri;
    this.ci = ci;
  }

  size() {
    return this.range.size();
  }
}
