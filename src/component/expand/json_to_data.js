import {startAnimation, endAnimation} from './ajax_animation';
const axios = require('axios');

export default class JsonToData{
  constructor(des){
    this.json = undefined;
    this.receiveDes = des;
    this.sendbody = {"id": 1}; //目前是写死的
  }

  gather(){
    startAnimation();  
    axios.post(this.receiveDes, this.sendbody)
      .then(response => {
        //MODIFIED: 还不确定后端返回的是字符串还是对象，这里要改  
        let jsonStr = response.data.data;
        console.log(jsonStr);
        this.json = JSON.parse(jsonStr);
        this.load();
      })
      .catch(error => {
        console.log(error);
        endAnimation();
      })
  }
  
  load(){
    console.log(this.json);
    //TODO: $<word>$ 特殊字段还没处理
    window.xs.loadData([
      this.json,
    ])

    //等到完全加载完才结束动画
    endAnimation();
  }

  setReceiveDes(des){
    this.receiveDes = des;
    return this;
  }

  reGather(){
    this.gather();
  }
}