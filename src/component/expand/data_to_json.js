//MODIFIED:前端页面data to ajax json文件
// 调用了工具函数 alphabet.js 中的坐标转换
import { stringAt, xy2expr } from '../../core/alphabet';
import {startAnimation, endAnimation} from './ajax_animation';

const axios = require('axios');
const qs = require('qs');

function assemble(data, merge, styles, cell) {
  let json = {};
  
  // 构建 json 中的 cell 字段，包含 rows 和 cols，是两个数组，存储对应行列index和修改过后宽度（或是高度），在前端默认值是 25x100  
  json.cell = {}; // 构建cell字段
  json.cell.cols = [];
  
  for(let key in cell){
    if(key.search("len") != -1){
      break; //最后的len字段不需要
    }
    let colStr = `{"index":"${stringAt(key + '')}", "width":"${cell[key].width + ''}"}`;
    json.cell.cols.push(JSON.parse(colStr));
  }

  //由于struct的原因，需要判断cell.cols初始是否为空
  if(json.cell.cols.length == 0){
    json.cell.cols.push(JSON.parse('{"index":"", "width":""}')); 
  }

  json.cell.rows = [];
   
  // 简化merge，用于后续使用
  let mergeFirstCol = {};
  for(let key in merge){
    let firstCol = merge[key].split(":")[0];
    mergeFirstCol[`${firstCol}`] = `${merge[key]}`;
  }
  
  //注意默认字体为 Arial ，大小为10，没有其余样式，如果没有style，则最少要设置这两种样式，具体见 解析style 的else
  json.data = []  // 构建data字段
  for(let rowKey in data){
    if(rowKey.search("len") != -1){
      break; 
    }
    if(data[rowKey].hasOwnProperty('height')){ 
      let rowStr = `{"index":"${(parseInt(rowKey) + 1).toString()}", "height":"${data[rowKey].height + ''}"}`;
      json.cell.rows.push(JSON.parse(rowStr));
    }
    let innerCell = data[rowKey].cells;
    for(let colKey in innerCell){
      // 解析merge
      let mergeResult = [];
      if(innerCell[colKey].hasOwnProperty('merge')){
        let cellCor = xy2expr(parseInt(colKey), parseInt(rowKey));
        mergeResult.push(`${mergeFirstCol[`${cellCor}`].split(":")[0]}`);
        mergeResult.push(`${mergeFirstCol[`${cellCor}`].split(":")[1]}`);

        //在合并的单元格存在样式的时候，框架有一些bug，会在rows中显示其余合并坐标的单元格，所以需要判断去除
        let [rowIndex, colIndex] = innerCell[colKey].merge;
        rowIndex = parseInt(rowIndex);
        colIndex = parseInt(colIndex);
        if(innerCell[colKey].hasOwnProperty('style')){//这种bug只有在合并单元格存在样式的情况下存在
          for(let i = 0; i <= rowIndex; i++){
            let rowTmp = parseInt(rowKey) + i;
            for(let j = 0; j <= colIndex; j++){
              if(j == 0 && i == 0){
                continue;
              }
              let colTmp = parseInt(colKey) + j;
              if(data[`${rowTmp}`] && data[`${rowTmp}`].cells && data[`${rowTmp}`].cells[`${colTmp}`]){//复制粘贴后可能出现bug，所以要判断字段是否存在才能删除
                delete data[`${rowTmp}`].cells[`${colTmp}`]; //删除data中的属性
              }  
            }
          }
        }
        
      }
      else{
        mergeResult.push(`${xy2expr(parseInt(colKey), parseInt(rowKey))}`);
      }
      
      // 解析style
      let styleResult = {};
      //默认的无格式的style字段内容
      styleResult.color = "";
      styleResult.bgcolor = "";
      styleResult.align = "";
      styleResult.valign = "";
      styleResult.font = {};
      styleResult.font.bold = false;
      styleResult.font.italic = false;
      styleResult.font.size = 0;
      styleResult.font.name = "";
      styleResult.underline = false;
      styleResult.border = {};
      styleResult.border.bottom = [];
      styleResult.border.top = [];
      styleResult.border.left = [];
      styleResult.border.right = [];
      styleResult.textwrap = false;
      
      if(innerCell[colKey].hasOwnProperty('style')){ //存在style
        // 判断对应的styles数组里的情况
        if(styles[`${innerCell[colKey].style}`].hasOwnProperty('color')){
          styleResult.color = styles[`${innerCell[colKey].style}`].color;
        }
        if(styles[`${innerCell[colKey].style}`].hasOwnProperty('bgcolor')){
          styleResult.bgcolor = styles[`${innerCell[colKey].style}`].bgcolor;
        }
        if(styles[`${innerCell[colKey].style}`].hasOwnProperty('align')){
          styleResult.align = styles[`${innerCell[colKey].style}`].align;
        }
        if(styles[`${innerCell[colKey].style}`].hasOwnProperty('valign')){
          styleResult.valign = styles[`${innerCell[colKey].style}`].valign;
        }
        if(styles[`${innerCell[colKey].style}`].hasOwnProperty('font')){
          for(let k of ["bold", "italic", "size", "name"]){
            if(styles[`${innerCell[colKey].style}`].font.hasOwnProperty(`${k}`)){
              styleResult.font[k] = styles[`${innerCell[colKey].style}`].font[k];
            }
          }
        }
        if(styles[`${innerCell[colKey].style}`].hasOwnProperty('underline')){
          styleResult.underline = styles[`${innerCell[colKey].style}`].underline;
        }
        if(styles[`${innerCell[colKey].style}`].hasOwnProperty('border')){ 
          for(let k of ["bottom", "top", "left", "right"]){
            if(styles[`${innerCell[colKey].style}`].border.hasOwnProperty(`${k}`)){
              styleResult.border[k] = styles[`${innerCell[colKey].style}`].border[k];
            }
          }
        }
        if(styles[`${innerCell[colKey].style}`].hasOwnProperty('textwrap')){
          styleResult.textwrap = styles[`${innerCell[colKey].style}`].textwrap;
        }
      }
      styleResult = JSON.stringify(styleResult);
      
      // 解析text
      // 注意 "null" 为保留字，代表单元格为空，但是可能有格式
      let textResult = null;
      if(innerCell[colKey].hasOwnProperty('text')){
        textResult = innerCell[colKey].text;
      }
      
      //MODIFIED: mergeOrNot 改成数组类型，因为解构的时候默认没有冒号，这里用一种简单的办法实现
      // 理论上应该用拼接字符串更规范
      let dataStr = undefined;
      if(mergeResult.length > 1){
        dataStr = `{"mergeOrNot":["${mergeResult[0]}", "${mergeResult[1]}"], "style":${styleResult}, "text":"${textResult}"}`;;
      }
      else{
        dataStr = `{"mergeOrNot":["${mergeResult}"], "style":${styleResult}, "text":"${textResult}"}`;
      }

      // 开发模式
      json.data.push(JSON.parse(dataStr));
   
      // TODO:
      // 因为使用了json序列化，所以处理json中的英文单双引号比较麻烦
      // 在反序列化前使用 str = str.replace("\"", "\\\"") str = str.replace("\'","\\\'") 应该是可以解决的
    //   try{
    //     json.data.push(JSON.parse(dataStr));
    //   }
    //   catch(err){
    //       console.log(err);
    //       alert("请不要使用英文双引号和单引号");
    //   }
    }
  }

  //由于struct的原因，需要判断cell.rows初始是否为空
  if(json.cell.rows.length == 0){
    json.cell.rows.push(JSON.parse('{"index":"", "height":""}')); 
  }

  // 以下是假数据
  json.time = getFormatTime(); // 以前端时间为准
  json.name = window.xs.currentField.detail.filename; // 表格虚拟名字，不等同于后端本地保存的文件名
  json.api = window.xs.currentField.source; // 对应的填充数据源
  json.author = window.xs.currentField.detail.author; // 目前使用的用户
  
  // 原始格式数据，以字符串的形式存在
  let raw = {};
  raw.styles = styles;
  raw.merges = merge;
  raw.cols = cell;
  raw.rows = data;
  //raw.name = "sheet1";
  json.rawdata = JSON.stringify(raw);  

  return json;
};

// 计算对象长度
function calLength(entire){
  return Object.keys(entire).length - 1;
};

// 格式化时间
function getFormatTime(){
    let date = new Date();
    let transverse = "-"; //可以修改连接符
    let Verticalpoint = ":";
    let month = date.getMonth() + 1;//获取月份
    let strDate = date.getDate();//获取具体的日期           
    let strHour = date.getHours();//获取...钟点
    let strMinute = date.getMinutes();//获取分钟数
    let strSeconde = date.getSeconds();//获取秒钟数

    //如果是则在前面加“0”
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 1 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (strHour >= 1 && strHour <=9) {
      strHour = "0" + strHour
    }
    if (strMinute >= 1 && strMinute <= 9) {
      strMinute = "0" + strMinute;
    }
    if (strSeconde >= 1 && strSeconde <= 9) {
      strSeconde = "0" + strSeconde;
    }

    let NewDate = date.getFullYear() + transverse + month + transverse + strDate + " " +
      strHour + Verticalpoint + strMinute + Verticalpoint + strSeconde;
    //返回拼接字符串
    return NewDate;
}

// 接收响应体并转换为xlsx文件下载，ajax无法触发浏览器的下载机制，所以需要使用到<a>标签进行模拟点击
function aTagDownload(url){
  let aEle = document.createElement('a'); // 创建a标签
  aEle.setAttribute('href', url);
  //aEle.setAttribute('download', "我随便caide.xlsx"); // 可以修改下载的文件名，前提是非跨域资源，所以这里是不行的
  aEle.style.display = 'none';
  document.body.appendChild(aEle);
  aEle.click(); // 点击下载
  document.body.removeChild(aEle); // 下载完成移除元素
}

function getBlob(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
        };

        xhr.send();
    });
}

function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        const body = document.querySelector('body');

        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);
        
        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
    }
}

function blobDownload(url, filename) {
    getBlob(url).then(blob => {
        saveAs(blob, filename);
    });
}

export default class DataToJson{
  constructor(){
    this.merge_cache = undefined;
    this.data_cache = undefined;
    this.styles_cache = undefined;
    this.cell_cache = undefined;
    this.json = undefined;
    this.gather();
    this.sendDes = undefined;
  }
  
  gather(){
    let json_data = window.xs.getData();
    this.merge_cache = json_data[0]["merges"];
    this.data_cache = json_data[0]["rows"];
    this.styles_cache = json_data[0]["styles"];
    this.cell_cache = json_data[0]["cols"];
    
    //console.log(this.showCell());
    //console.log(this.showMerge());
    //console.log(this.showData());
    //console.log(this.showStyles());
    this.json = assemble(this.data_cache, this.merge_cache, this.styles_cache, this.cell_cache);
  } 
  
  send() {
    console.log(this.json);
    console.log(JSON.stringify(this.json));
    if(this.json.data.length == 0){
      alert("不能生成空的表格");
    }
    startAnimation();
    axios.post(this.sendDes, this.json)
    .then(response => {
      console.log(response.data.data);
      if(response.data.code == "200"){  
        // 使用<a>进行资源的下载，不能在前端修改文件的名字
        //aTagDownload(response.data.data);  
        // 使用 Blob 对象下载文件，可以修改名字
        // 后端存储时名字的格式为 名字-10位时间戳 例如 http://106.75.227.222/sheets/case-1605148546.xlsx
        let fileName = response.data.data.match(/[^/]+-[0-9]+.xlsx$/g, "")[0].replace(/-[0-9]+.xlsx/g, ""); //获取到上边例子中的 case

        blobDownload(response.data.data, fileName + ".xlsx");
      }
      else{
        alert("返回码不对");
      }
      endAnimation();
    })
    .catch(error => {
      alert("上传失败，请稍后再试");
      endAnimation();
      console.log(error);
    })
  }

  showData(){
    return this.data_cache;
  }

  showMerge(){
    return this.merge_cache;
  }

  showStyles(){
    return this.styles_cache;
  }
  
  showCell(){
    return this.cell_cache;
  }
  
  showJson(){
    return this.json;
  }

  setSendDes(des){
    this.sendDes = des;
    return this; //允许链式调用
  }
}