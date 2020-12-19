//转换相关函数
import './_.prototypes';

const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

//表格列字母转换，由index转换为实际的字符串，eg. 25->'Z' 26->'AA'
export function stringAt(index) {
  let str = '';
  let cindex = index;
  while (cindex >= alphabets.length) {
    cindex /= alphabets.length;
    cindex -= 1;
    str += alphabets[parseInt(cindex, 10) % alphabets.length];
  }
  const last = index % alphabets.length;
  str += alphabets[last];
  return str;
}

//表格列字母转换，由str转换为实际的整型顺序（0开始），eg. 'Z'->25 'AA'->26
export function indexAt(str) {
  let ret = 0;
  for (let i = 0; i < str.length - 1; i += 1) {
    const cindex = str.charCodeAt(i) - 65;
    const exponet = str.length - 1 - i;
    ret += (alphabets.length ** exponet) + (alphabets.length * cindex);
  }
  ret += str.charCodeAt(str.length - 1) - 65;
  return ret;
}

//表格坐标转换，src为字符串，返回一个两个元素的数组（代表x轴，y轴坐标，0开始） eg. 'A1'->[0,0] 'A2'->[0,1]
export function expr2xy(src) {
  let x = '';
  let y = '';
  for (let i = 0; i < src.length; i += 1) {
    if (src.charAt(i) >= '0' && src.charAt(i) <= '9') {
      y += src.charAt(i);
    } else {
      x += src.charAt(i);
    }
  }
  return [indexAt(x), parseInt(y, 10) - 1];
}

//表格坐标转换，x，y分别为x轴，y轴坐标，返回一个字符串，eg. [0,0]->'A1'
export function xy2expr(x, y) {
  return `${stringAt(x)}${y + 1}`;
}

//表格坐标变换，src为初始坐标，xn，yn为x轴坐标增量和y轴坐标增量，返回一个字符串表示新的坐标，新坐标需要加上增量，eg. 'A1',[1,1]->'B2'
export function expr2expr(src, xn, yn, condition = () => true) {
  if (xn === 0 && yn === 0) return src;
  const [x, y] = expr2xy(src);
  if (!condition(x, y)) return src;
  return xy2expr(x + xn, y + yn);
}

export default {
  stringAt,
  indexAt,
  expr2xy,
  xy2expr,
  expr2expr,
};

