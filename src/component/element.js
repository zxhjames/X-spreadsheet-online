/* global document */
/* global window */
//自定义DOM元素生成类（核心类）
class Element {
  constructor(tag, className = '') {
    if (typeof tag === 'string') {
      this.el = document.createElement(tag);//el代表创建的标签对象
      this.el.className = className;//className代表标签的class属性
    } else {
      this.el = tag;
    }
    this.data = {};//挂载键值对到一个标签中，目前代码其他地方没有用到
  }

  //设置挂载键值对
  data(key, value) {
    if (value !== undefined) {
      this.data[key] = value;
      return this;
    }
    return this.data[key];
  }

  //事件监听，eventNames为监听事件名，handler为对应的处理函数
  on(eventNames, handler) {
    const [fen, ...oen] = eventNames.split('.');
    let eventName = fen;
    if (eventName === 'mousewheel' && /Firefox/i.test(window.navigator.userAgent)) {
      eventName = 'DOMMouseScroll';//FF兼容
    }
    //TODO:
    this.el.addEventListener(eventName, (evt) => {
      handler(evt);//调用默认的event对象
      for (let i = 0; i < oen.length; i += 1) {
        const k = oen[i];
        if (k === 'left' && evt.button !== 0) { //左键
          return;
        }
        if (k === 'right' && evt.button !== 2) { //右键
          return;
        }
        if (k === 'stop') {
          evt.stopPropagation();//阻止冒泡
        }
      }
    });
    return this;
  }

  //设置偏移，有值则设置，无值则返回当前偏移值
  offset(value) {
    if (value !== undefined) {
      Object.keys(value).forEach((k) => {
        this.css(k, `${value[k]}px`);//调用了类中css方法，将传入的value对象中所有键值对转变为对应的样式数据，k为样式名字，"value[k]px"为其对应的值
      });
      return this;
    }
    const {
      offsetTop, offsetLeft, offsetHeight, offsetWidth,
    } = this.el;
    return {
      top: offsetTop,
      left: offsetLeft,
      height: offsetHeight,
      width: offsetWidth,
    };
  }

  //设置滚动，如果有值，则设置滚动，返回新的滚动值对象，否则返回当前的滚动值对象
  scroll(v) {
    const { el } = this;
    if (v !== undefined) {
      if (v.left !== undefined) {
        el.scrollLeft = v.left;//左右滚动条的位置
      }
      if (v.top !== undefined) {
        el.scrollTop = v.top;//上下滚动条的位置
      }
    }
    return { left: el.scrollLeft, top: el.scrollTop };
  }

  //返回元素视口信息的完整对象
  box() {
    return this.el.getBoundingClientRect();
  }

  //获取当前节点的父节点
  parent() {
    return new Element(this.el.parentNode);
  }

  //不传参则返回当前元素子节点的集合，传参则为当前元素添加多个子节点，此时else必须为Element类对象集合（参见child函数）
  children(...eles) {
    if (arguments.length === 0) {
      return this.el.childNodes;
    }
    eles.forEach(ele => this.child(ele));
    return this;
  }

  //传入HTMLElement对象，将这个对象移除自当前元素的子节点集合
  removeChild(el) {
    this.el.removeChild(el);
  }

  /*
  first() {
    return this.el.firstChild;
  }

  last() {
    return this.el.lastChild;
  }

  remove(ele) {
    return this.el.removeChild(ele);
  }

  prepend(ele) {
    const { el } = this;
    if (el.children.length > 0) {
      el.insertBefore(ele, el.firstChild);
    } else {
      el.appendChild(ele);
    }
    return this;
  }

  prev() {
    return this.el.previousSibling;
  }

  next() {
    return this.el.nextSibling;
  }
  */

  //添加单个子节点，arg为字符串则添加文本节点，arg为Element类对象，则添加属性节点
  child(arg) {
    let ele = arg;
    if (typeof arg === 'string') {
      ele = document.createTextNode(arg);
    } else if (arg instanceof Element) {
      ele = arg.el;
    }
    this.el.appendChild(ele);//插入到当前元素的内部的末尾位置
    return this;
  }

  //传入一个Element对象，判断当前元素是否包含这个节点
  contains(ele) {
    return this.el.contains(ele);
  }

  //如果v已定义，为其设定一个新的类名
  className(v) {
    if (v !== undefined) {
      this.el.className = v;
      return this;
    }
    return this.el.className;
  }

  //为当前元素添加class，name为指定值，class可以指定为多个值
  addClass(name) {
    this.el.classList.add(name);
    return this;
  }

  //判断当前元素的class属性中是否存在名为name的值
  hasClass(name) {
    return this.el.classList.contains(name);
  }

  //移除当前元素class属性中的名为name的值
  removeClass(name) {
    this.el.classList.remove(name);
    return this;
  }

  //切换当前元素class属性中的'active'为存在或者不存在
  toggle(cls = 'active') {
    return this.toggleClass(cls);
  }

  //为当前元素切换class属性的值，若name存在则移除，若不存在则添加
  toggleClass(name) {
    return this.el.classList.toggle(name);
  }

  //功能同toggle函数，默认为添加类名，同时添加'active'
  active(flag = true, cls = 'active') {
    if (flag) this.addClass(cls);
    else this.removeClass(cls);
    return this;
  }

  //设置类名“选中”
  checked(flag = true) {
    this.active(flag, 'checked');
    return this;
  }

  //设置类名“可编辑/不可编辑”
  disabled(flag = true) {
    if (flag) this.addClass('disabled');
    else this.removeClass('disabled');
    return this;
  }

  // key, value
  // key
  // {k, v}...
  //若value非空，则根据键值对设置元素标签内的属性，否则返回元素名为key的属性值，如果key为对象类型，则通过key内部键值对设置属性
  attr(key, value) {
    if (value !== undefined) {
      this.el.setAttribute(key, value);
    } else {
      if (typeof key === 'string') {
        return this.el.getAttribute(key);
      }
      Object.keys(key).forEach((k) => {
        this.el.setAttribute(k, key[k]);
      });
    }
    return this;
  }

  //移除元素名为key的属性
  removeAttr(key) {
    this.el.removeAttribute(key);
    return this;
  }

  //若content非空，则设置元素标签的内部字符串为其值，否则返回其内部字符串的值
  html(content) {
    if (content !== undefined) {
      this.el.innerHTML = content;
      return this;
    }
    return this.el.innerHTML;
  }

  //v未定义，则返回元素value值，否则设定value值
  val(v) {
    if (v !== undefined) {
      this.el.value = v;
      return this;
    }
    return this.el.value;
  }

  //获取元素的角点
  focus() {
    this.el.focus();
  }

  //根据集合内容，移除对应的style属性中的名为k的键值对
  cssRemoveKeys(...keys) {
    keys.forEach(k => this.el.style.removeProperty(k));
    return this;
  }

  // css( propertyName )
  // css( propertyName, value )
  // css( properties )
  // 设置元素的样式，通过标签的内联样式进行修改（style属性）
  css(name, value) {
    if (value === undefined && typeof name !== 'string') { //多个样式属性，通过对象保存在name中，value未定义
      Object.keys(name).forEach((k) => {
        this.el.style[k] = name[k];
      });
      return this;
    }
    if (value !== undefined) { //单个样式属性
      this.el.style[name] = value;
      return this;
    }
    return this.el.style[name]; // typeof name === 'string' && value === undefined 情况下，返回该样式属性的值
  }

  //获取一个元素计算过后的最终的样式对象，只读
  computedStyle() {
    return window.getComputedStyle(this.el, null);
  }

  //通过css的display属性设置块级可见
  show() {
    this.css('display', 'block');
    return this;
  }

  //通过css的display属性设置不可见
  hide() {
    this.css('display', 'none');
    return this;
  }
}

//相当于为Element构造函数设置一个别名
const h = (tag, className = '') => new Element(tag, className);

export {
  Element,
  h,
};
