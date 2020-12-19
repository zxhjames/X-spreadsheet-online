const axios = require('axios');

// export default function addAnimation(){
//   // 请求拦截器
//   axios.interceptors.request.use((config) => {
//     startAnimation();
//     return config;
//   }, (error) => {
//     endAnimation();
//     return Promise.reject(error);
//   })
  
//   // 响应拦截器
//   axios.interceptors.response.use((response) => {
//     endAnimation();
//     return response;
//   }, (error) => {
//     endAnimation();
//     return Promise.reject(error);
//   })    
// }

export function startAnimation(){
    let sheet_page = document.getElementsByClassName("x-spreadsheet");
    let page = document.createElement('div');
    page.className = "x-spreadsheet-page";

    let content = document.createElement('div');
    content.className = "x-spreadsheet-loading-content";
    content.innerHTML = "Loading ......";

    let container = document.createElement('div');
    container.className = "x-spreadsheet-loading-container";

    page.appendChild(content);
    page.appendChild(container);

    for(let i = 0;i < 5;i++){
        let loading = document.createElement('div');
        loading.className = "x-spreadsheet-loading-div";
        container.appendChild(loading);
    }
    sheet_page[0].appendChild(page);
}

export function endAnimation(){
    let sheet_page = document.getElementsByClassName("x-spreadsheet");
    let page = document.getElementsByClassName("x-spreadsheet-page");
    sheet_page[0].removeChild(page[0]);
}