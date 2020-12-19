//字体相关函数
import './_.prototypes';

//目前支持7种字体
const baseFonts = [
  { key: 'Arial', title: 'Arial' },
  { key: 'Helvetica', title: 'Helvetica' },
  { key: 'Source Sans Pro', title: 'Source Sans Pro' },
  { key: 'Comic Sans MS', title: 'Comic Sans MS' },
  { key: 'Courier New', title: 'Courier New' },
  { key: 'Verdana', title: 'Verdana' },
  { key: 'Lato', title: 'Lato' },
];

//pt单位px单位映射表，表格中使用的字体大小的单位是pt（下拉框中是pt，实际显示应该是px），对应系统中的字号如下（可以和本地excel文件进行对应）
//参见 https://www.runoob.com/w3cnote/px-pt-em-convert-table.html
const fontSizes = [
  { pt: 7.5, px: 10 },//六号
  { pt: 8, px: 11 },//无对应
  { pt: 9, px: 12 },//小五
  { pt: 10, px: 13 },//无对应
  { pt: 10.5, px: 14 },//五号
  { pt: 11, px: 15 },//无对应
  { pt: 12, px: 16 },//小四
  { pt: 14, px: 18.7 },//四号
  { pt: 15, px: 20 },//小三
  { pt: 16, px: 21.3 },//三号
  { pt: 18, px: 24 },//小二
  { pt: 22, px: 29.3 },//二号
  { pt: 24, px: 32 },//小一
  { pt: 26, px: 34.7 },//一号
  { pt: 36, px: 48 },//小初
  { pt: 42, px: 56 },//初号
  // { pt: 54, px: 71.7 },
  // { pt: 63, px: 83.7 },
  // { pt: 72, px: 95.6 },
];

//pt单位转换为px单位
function getFontSizePxByPt(pt) {
  for (let i = 0; i < fontSizes.length; i += 1) {
    const fontSize = fontSizes[i];
    if (fontSize.pt === pt) {
      return fontSize.px;
    }
  }
  return pt;
}

//将baseFonts这个数组转换成 map 数据结构
function fonts(ary = []) {
  const map = {};
  baseFonts.concat(ary).forEach((f) => {
    map[f.key] = f;
  });
  return map;
}

export default {};
export {
  fontSizes,
  fonts,
  baseFonts,
  getFontSizePxByPt,
};
