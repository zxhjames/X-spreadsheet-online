//MODIFIED: 显示所有可用字段
import { xy2expr } from '../../core/alphabet';

// 默认的填充字段
// 识别关键字 #index#
// 添加其他默认字段时，要在这里以上边的格式进行命名
export const defaultMappingList = [
  {
    "TableColumn": "#longTimeFormat#",
    "TableComment": "创建时间y-m-d h:m:s",
  },
  {
    "TableColumn": "#shortTimeFormat#",
    "TableComment": "创建时间y-m-d",
  },
  {
    "TableColumn": "#sheetCreater#",
    "TableComment": "创建人",  
  }
]

function mergeInCol(ri, ci){
  let merge = window.xs.getData()[0].merges;
  if(merge.length == 0) {
    return false;
  }
  let fisrtStr = xy2expr(ri, ci); //获得起始坐标
  
  for(let k in merge){
    let strArray = merge[k].split(":"); 
    if(strArray[0] == fisrtStr){//判断是一个合并单元格则进入
      if(strArray[1].match(/[0-9]+/g,"")[0] != fisrtStr.match(/[0-9]+/g,"")[0]){ //存在行合并，返回跳出
        return true;
      }
      else{
        continue;
      }    
    }
  }
  return false;
}


export function renderList() {
  let fieldListDropDown = document.getElementsByClassName("x-spreadsheet-toolbar-expand-btns-list-dropdown");
  fieldListDropDown[0].innerHTML = ""; //删除所有子元素

  for(let k in window.xs.currentField.data){
    // 创建默认div
    let dragDiv = document.createElement('div');
    dragDiv.className = "x-spreadsheet-toolbar-expand-btns-list-dropdown-drag";
    dragDiv.innerHTML = `${window.xs.currentField.data[k].TableColumn}` + '<br>' + `备注: ${window.xs.currentField.data[k].TableComment}`;
    dragDiv.setAttribute("draggable", true);
  
    // 添加
    fieldListDropDown[0].appendChild(dragDiv);       
  }
}

export function dragEventActive() {
  let drag = document.getElementsByClassName('x-spreadsheet-toolbar-expand-btns-list-dropdown-drag');
  for (let k of drag) {
    // 记录拖拽行为松手时的坐标，进而可以通过坐标确定对应的单元格
    k.addEventListener('dragend', function (event) {
      let posY = event.clientY;
      let posX = event.clientX;

      // getCellRectByXY存在bug，原因可能和toolbar栏的40px高度相关，所以这里Y坐标需要减去40
      let {ri, ci} = window.xs.data.getCellRectByXY(posX, posY - 40);

      // 构建填充的字符串
      let fill = this.innerHTML.match(/(.+?)<br>/g,"");
      let fillResult = fill[0].replace(/<br>/g, "");
      // 跳过一个关键字，将首字母转换成大写的，其余不变
      fillResult = fillResult.charAt(0) + fillResult.charAt(1).toUpperCase() + fillResult.slice(2);
        
      let result = window.xs.data.getCellRectByXY(posX, posY - 40);

      // 为指定单元格添加文本，然后自动重新渲染整个表格
      if(mergeInCol(ci, ri)){
        alert("数据源的填充字段只能放在 1*1 或者 1*n 的单元格中");
      }
      else{
        window.xs.cellText(ri, ci, fillResult);
      }
      
      window.xs.reRender();
    }, false);
  }
}


export default function initFiledList(toolbar) {
    let fieldListDiv = document.createElement('div');//
    fieldListDiv.className = "x-spreadsheet-toolbar-container-innerdiv";
    
    // 创建按钮
    let fieldListBtn = document.createElement('button');
    fieldListBtn.innerHTML = "字段列表";
    fieldListBtn.className = "x-spreadsheet-toolbar-expand-btns-list-btn";
    
    // 创建下拉栏
    let fieldListDropDown = document.createElement('div');
    fieldListDropDown.className = "x-spreadsheet-toolbar-expand-btns-list-dropdown";
    fieldListDropDown.style.display = "none";

    // 点击显示下拉栏
    fieldListBtn.addEventListener('click', function () {
      if (fieldListDropDown.style.display == "inline-block") {
        fieldListDropDown.style.display = 'none';
      }
      else {
        fieldListDropDown.style.display = 'inline-block';
      }
    }, false);
    
    // 点击下拉栏以外处，隐藏下拉栏
    document.addEventListener('click', function (event) {
      let elem = event.target;
      while (elem) { //循环判断至根节点，防止点击的是div子元素   
        if (elem.className == 'x-spreadsheet-toolbar-expand-btns-list-btn' || elem.className == 'x-spreadsheet-toolbar-expand-btns-list-dropdown') {
          return;
        }
          elem = elem.parentNode;
      }
      let s = document.getElementsByClassName("x-spreadsheet-toolbar-expand-btns-list-dropdown")[0];
      s.style.display = "none";
    }, false);
    
    // 插入按钮和下拉栏
    toolbar.appendChild(fieldListDiv);
    fieldListDiv.appendChild(fieldListBtn);
    fieldListDiv.appendChild(fieldListDropDown);//
    
    // 动态插入可拖拽div，初始化时插入默认的填充字段
    renderList();

    //为可拖拽的div设置事件
    dragEventActive();
        
    //   //TODO: 添加单元格高亮，方便显示
    //   k.addEventListener('dragstart', function (event) {
    //     let posY = event.clientY;
    //     let posX = event.clientX;
    //     let {ri, ci} = window.xs.data.getCellRectByXY(posX, posY - 40);
    //   }, false);
    //}
}
