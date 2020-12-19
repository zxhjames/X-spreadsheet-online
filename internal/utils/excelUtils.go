package utils

import (
	"sheetServerApi/internal/middlewares/constants"
	"sheetServerApi/internal/model/params"
	"errors"
	"github.com/360EntSecGroup-Skylar/excelize"
	"log"
	"strconv"
)

/**
* @program: src
* @description:
* @author: 占翔昊
* @create 2020-11-12 09:43
**/

// 新建一个文档
func Init_file(SheetName string) (*excelize.File,error){
	f := excelize.NewFile()
	if SheetName == constants.NilStr{
		return nil,errors.New("文件名不能为空!")
	}
	index := f.NewSheet(SheetName)
	f.SetActiveSheet(index)
	return f,nil
}

//返回样式设置的字符串
func SetStyleStr(obj []params.StyleJson) string {
	if len(obj) == 0 {
		return ""
	}
	left, right, sub, i := "{", "}", "", 0
	for ; i < len(obj)-1; i++ {
		sub = sub + `"` + obj[i].Name + `":` + string(obj[i].Params) + ","
	}
	sub = sub + `"` + obj[i].Name + `":` + string(obj[i].Params)
	return left + sub + right
}


/*
	判断是否是默认字段
   ——————————————————
   |  #sheetCreator#|
   ——————————————————
*/
func IsDefaultKeys(key string) (bool) {
	if key == constants.NilStr {
		return false
	}
	r := []rune(key)
	if r[0] == constants.StaticHead && r[len(r) - 1] == constants.StaticHead{
		return true
	}
	return false
}



/*
	判断是否是数据库字段
   ——————————————————
   |     工号        |
   ——————————————————
   |     $Uid$      |
   ——————————————————
*/

// v1版本 // 判断是否是填充字段
func IsDataKeys(key string) (bool) {
	r := []rune(key)
	if r[0] == constants.DynamicHead && r[len(r) - 1] == constants.DynamicHead{
		return true
	}
	return false
}


func GetOffsetPosition(column_offset_map map[string]int,str string,len int) (string,error){
	// 提取列号
	if str == constants.NilStr {
		return constants.NilStr,nil
	}

	columnWord,columnNum,err := SplitBlock(str)
	if err != nil {
		log.Fatal(err)
		return constants.NilStr,err
	}
	//todo 这里需要重新计算
	Num_tmp := columnNum + column_offset_map[columnWord] * len
	str = columnWord + strconv.Itoa(Num_tmp)
	return str,nil
}

/**
单元格切分，例如 "A1"  --->  "A" 和 1
 */
func SplitBlock(block string) (string,int,error) {
	col := string([]rune(block)[0])
	row := string([]rune(block)[1:])
	row_int,err := strconv.Atoi(row)
	if err !=nil {
		return constants.NilStr,-1,err
	}
	return col,row_int,nil
}

// 单元格偏移量计数器，记录目前写入的数据的偏移量，这里返回一个map用来记录
func NewOffsetMap() map[string]int {
	return map[string]int{
		"A":0,
		"B":0,"C":0,"D":0,"E":0,"F":0,"G":0,"H":0,"I":0,"J":0,"K":0,"L":0,"M":0,"N":0,
		"O":0,"P":0,"Q":0,"R":0,"S":0,"T":0,"U":0,"V":0,"W":0,"X":0,"Y":0,"Z":0,
	}
}



// 单元格最长行计数器 用来记录该列目前写入的最长的行的位置，这里返回一个map用来记录
func NewMaxCurrentRow() map[string]int {
	return map[string]int{
		"A":0,
		"B":0,"C":0,"D":0,"E":0,"F":0,"G":0,"H":0,"I":0,"J":0,"K":0,"L":0,"M":0,"N":0,
		"O":0,"P":0,"Q":0,"R":0,"S":0,"T":0,"U":0,"V":0,"W":0,"X":0,"Y":0,"Z":0,
	}
}



// 判断当前行是否超过了当前最大行
func JudgeMaxRow(column_maxrow_map map[string]int,col string,row int) (bool){
	// 如果大于当前最大值，则正常写入，否则就要扩展
	if row > column_maxrow_map[col] {
		return false
	}
	return true
}