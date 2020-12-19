/* global window */
//本地化相关函数
//MODIFIED:修改为ch
import ch from './ch';

let $lang = 'ch';
const $messages = {
  ch,
};

//传入一个对应的字段，如"print.size"（key值），然后解析获得在locale文件中的命名，最后返回这个命名，如果是zh-cn，对应的就是"纸张大小”
function translate(key, messages) {
  if (messages && messages[$lang]) {
    let message = messages[$lang];
    const keys = key.split('.');
    for (let i = 0; i < keys.length; i += 1) {
      const property = keys[i];
      const value = message[property];
      if (i === keys.length - 1) return value;
      if (!value) return undefined;
      message = value;
    }
  }
  return undefined;
}

//转换一个key值，获得命名
function t(key) {
  let v = translate(key, $messages);
  if (!v && window && window.x_spreadsheet && window.x_spreadsheet.$messages) {
    v = translate(key, window.x_spreadsheet.$messages);
  }
  return v || '';
}

//等同于t()
function tf(key) {
  return () => t(key);
}

//通过设置本文件的全局变量 $lang 和 $message 来控制本地化语言和语言包的选择
function locale(lang, message) {
  $lang = lang;
  if (message) {
    $messages[lang] = message;
  }
}

export default {
  t,
};

export {
  locale,
  t,
  tf,
};
