// 为按钮（或者说是函数）添加节流，防止短时间内多次点击，导致后端服务器生成重复数据，同时导致压力过大

export function throttle(func, delay) {
  var timer = null;            
  return function() {                
    var context = this;               
    var args = arguments;                
    if (!timer) {                    
      timer = setTimeout(function() {                        
        func.apply(context, args);                        
        timer = null;                    
      }, delay);                
    }            
  }        
}

