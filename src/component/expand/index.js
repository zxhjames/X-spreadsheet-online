/* global window */
import LOGO from './LOGO.png';
import initSheetLoader from './sheet_loader';
import initSheetUpdater from './sheet_updater';
import initFiledList from './field_list';
import {defaultMappingList} from './field_list';
import initFieldLoader from './field_loader';
//import addAnimation from './ajax_animation';


export function initExpand() {
  let toolbar_btns = document.getElementsByClassName("x-spreadsheet-toolbar-btns");
  let toolbar = document.getElementsByClassName("x-spreadsheet-toolbar");

  // 加载LOGO
  let logo = document.createElement('img');
  logo.src = LOGO;
  logo.className = "x-spreadsheet-toolbar-logo";
  toolbar[0].insertBefore(logo, toolbar_btns[0]);
  
  //加载扩展按钮容器
  let sheet = document.getElementsByClassName("x-spreadsheet");
  let button_container = document.createElement('div');
  button_container.className = "x-spreadsheet-toolbar-container";
  sheet[0].appendChild(button_container);
  
  // 字段列表中的默认字段初始化
  window.xs.currentField = {}; // 保存当前工作环境的变量，未来会拓展
  window.xs.currentField.data = []; //用于保存当前的数据源字段，点击加载字段后会增加额外的数据源字段
  for(let k in defaultMappingList){
    window.xs.currentField.data.push(defaultMappingList[k]);
  }

  //加载扩展按钮，并绑定事件
  initSheetLoader(button_container); 
  initSheetUpdater(button_container);  
  initFiledList(button_container);
  initFieldLoader(button_container);
  
  
  // 通过这条语句判空
  //console.log(Object.getOwnPropertyNames(window.xs.currentField).length);
  
  // 设置关闭或者刷新行为的提醒，因为数据会丢失
  // 高版本浏览器可能不支持直接自定义的方式，但是还是会有提示，想要进一步定制的话，需要使用其他方式
//   var UnloadConfirm = {};
//   UnloadConfirm.MSG_UNLOAD = "如果您未上传过数据，刷新或者离开后可能会导致数据丢失\n\n您确定要离开吗?";
//   UnloadConfirm.set = function(msg) {
//     window.onbeforeunload = function(e) {
//       e = e || window.event;
//       e.returnValue = msg;
//       return msg;
//     }
//   };
//   UnloadConfirm.clear = function() {
//     window.onbeforeunload = function() {}
//   };
//   UnloadConfirm.set(UnloadConfirm.MSG_UNLOAD); // 新浏览器可能已经不支持这种自定义的信息了

}
