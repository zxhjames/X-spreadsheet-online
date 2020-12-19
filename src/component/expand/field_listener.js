import {renderList, dragEventActive} from './field_list';

const axios = require('axios');

export default class FieldListener{
  constructor(des){
    this.sendbody = undefined;
    this.sendDes = des;
  }

  send(){
    axios.post(this.sendDes, this.sendbody)
      .then(response => {

        let dragArray = response.data.data; //返回的是字段数组
        if(dragArray.length != 0){
          for(let k in dragArray){
            dragArray[k].TableColumn = '$' + dragArray[k].TableColumn + '$'; 
            window.xs.currentField.data.push(dragArray[k]); //添加到currentField
          }
          renderList(); //重新渲染下拉栏
          dragEventActive(); //重新绑定事件
        }
        else {
          alert("字段数量为0");
        }
      })
      .catch(error => {
        console.log(error);
      })  
  }
  
  setBody(body){
    this.sendbody = body;
  }

  showBody(){
    console.log(this.sendbody);
  }
}