//MODIFIED:上传表格数据到后端
import DataToJson from './data_to_json';
import {throttle} from './throttle';

export default function initSheetUpdater(toolbar){
  let sheetUpdaterDiv = document.createElement('div');
  sheetUpdaterDiv.className = "x-spreadsheet-toolbar-container-innerdiv";
  
  let sheetUpdaterBtn = document.createElement('button');
  sheetUpdaterBtn.innerHTML = "上传";
  sheetUpdaterBtn.className = "x-spreadsheet-toolbar-expand-btns-updater";
  
  sheetUpdaterBtn.addEventListener("click", throttle(function(){
    let data2josnInstance = new DataToJson(); 
    data2josnInstance.setSendDes("http://106.75.227.222:9091/v2/xsheetServer/create");
    data2josnInstance.send(); 
  }, 1000), false);
    
  toolbar.appendChild(sheetUpdaterDiv);
  sheetUpdaterDiv.appendChild(sheetUpdaterBtn);
}