/* global window */
//事件绑定，target为绑定对象，name为事件名，fn为handle函数
export function bind(target, name, fn) {
  target.addEventListener(name, fn);
}

//事件解绑
export function unbind(target, name, fn) {
  target.removeEventListener(name, fn);
}

//解绑外部点击事件
export function unbindClickoutside(el) {
  if (el.xclickoutside) {
    unbind(window.document.body, 'click', el.xclickoutside);
    delete el.xclickoutside;
  }
}

// the left mouse button: mousedown → mouseup → click
// the right mouse button: mousedown → contenxtmenu → mouseup
// the right mouse button in firefox(>65.0): mousedown → contenxtmenu → mouseup → click on window
//绑定外部点击事件
//关于xclickoutside属性，是先调用这个函数才会初始化，然后调用上边的函数可以进行属性的删除，实际内部是一个handle类型的变量，用于处理外部点击事件
export function bindClickoutside(el, cb) {
  el.xclickoutside = (evt) => {
    // ignore double click
    // console.log('evt:', evt);
    if (evt.detail === 2 || el.contains(evt.target)) return; //双击或者点击在绑定元素的内部时，不触发事件
    if (cb) cb(el);//cb为回调函数
    else {//正常的事件处理
      el.hide();//关闭显示当前元素
      unbindClickoutside(el);//解绑事件
    }
  };
  bind(window.document.body, 'click', el.xclickoutside);
}

//设定鼠标松开和在元素上移动的事件
export function mouseMoveUp(target, movefunc, upfunc) {
  bind(target, 'mousemove', movefunc);
  const t = target;
  t.xEvtUp = (evt) => {//松开时触发解绑和upfunc
    // console.log('mouseup>>>');
    unbind(target, 'mousemove', movefunc);
    unbind(target, 'mouseup', target.xEvtUp);
    upfunc(evt);
  };
  bind(target, 'mouseup', target.xEvtUp);
}

//计算触碰的位置，提供给回调函数使用
function calTouchDirection(spanx, spany, evt, cb) {
  let direction = '';
  // console.log('spanx:', spanx, ', spany:', spany);
  if (Math.abs(spanx) > Math.abs(spany)) {
    // horizontal
    direction = spanx > 0 ? 'right' : 'left';
    cb(direction, spanx, evt);
  } else {
    // vertical
    direction = spany > 0 ? 'down' : 'up';
    cb(direction, spany, evt);
  }
}

// cb = (direction, distance) => {}
//绑定移动端触摸事件
export function bindTouch(target, { move, end }) {
  let startx = 0;
  let starty = 0;
  bind(target, 'touchstart', (evt) => {
    const { pageX, pageY } = evt.touches[0];
    startx = pageX;
    starty = pageY;
  });
  bind(target, 'touchmove', (evt) => {
    if (!move) return;
    const { pageX, pageY } = evt.changedTouches[0];
    const spanx = pageX - startx;
    const spany = pageY - starty;
    if (Math.abs(spanx) > 10 || Math.abs(spany) > 10) {
      // console.log('spanx:', spanx, ', spany:', spany);
      calTouchDirection(spanx, spany, evt, move);
      startx = pageX;
      starty = pageY;
    }
    evt.preventDefault();
  });
  bind(target, 'touchend', (evt) => {
    if (!end) return;
    const { pageX, pageY } = evt.changedTouches[0];
    const spanx = pageX - startx;
    const spany = pageY - starty;
    calTouchDirection(spanx, spany, evt, end);
  });
}
