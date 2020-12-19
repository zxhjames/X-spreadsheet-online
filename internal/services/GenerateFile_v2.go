package services

import (
	"sheetServerApi/global"
	"sheetServerApi/internal/middlewares/constants"
	"sheetServerApi/internal/model/params"
	"sheetServerApi/internal/utils"
	"encoding/json"
	"github.com/360EntSecGroup-Skylar/excelize"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"log"
	"reflect"
	"strconv"
	"time"
)

/**
* @program: 处理写入样式逻辑与填充逻辑
* @description:
* @author: 占翔昊
* @create 2020-10-14 14:39
**/


// 设置样式的接口
type OpSheetCellsStyle struct {
	Alignment excelize.Alignment   //处理格子样式
	Fill  excelize.Fill           //填充样式
	Font  excelize.Font       //设置字体
	Border  []excelize.Border    //设置边框
}

type OutputParamsDTO []params.SheetDataGroup
// 用于存储填充字段备注值
type  DatabaseFill struct{
	databasekeys_comment OutputParamsDTO
	databasekeys_value OutputParamsDTO
}





// 设置单元格中已经修改的行与列的宽度
func SetColsAndRowslength(f *excelize.File,sheet params.SheetCells,sheetname string) (error) {
	//先设置修改列的长度
	if len(sheet.Cols) != 0 {
		for k := 0;k < len(sheet.Cols);k++ {
			if sheet.Cols[k].Width != constants.NilStr {
				width,err := strconv.ParseFloat(sheet.Cols[k].Width,64)
				if err != nil {
					log.Fatal(err)
					return err
				}
				// fixme 这里需要重新设置一下宽度的比例
				if err := f.SetColWidth(sheetname,sheet.Cols[k].Index,sheet.Cols[k].Index,width/5);err!=nil {
					log.Fatal(err)
					return err
				}
			}

		}
	}

	//设置修改行的长度
	if len(sheet.Rows) != 0 {
		for k := 0;k < len(sheet.Rows);k++ {
			if sheet.Rows[k].Height != constants.NilStr {
				width,err := strconv.ParseFloat(sheet.Rows[k].Height,64)
				if err != nil {
					return err
				}
				index ,err := strconv.Atoi(sheet.Rows[k].Index)
				if err != nil {
					log.Fatal(err)
					return err
				}
				if err := f.SetRowHeight(sheetname,index,width);err!=nil {
					log.Fatal(err)
					return err
				}
			}
		}
	}
	return nil
}


// 循环设置每个单元格的元数据
func SetBlockStyleAndValue(f *excelize.File, data []params.SheetDataGroup,sheetname string,username string) error {
	// 单元格样式写入对象
	opSheetCellstyles := OpSheetCellsStyle{}
	styles := []params.StyleJson{}

	var column_offset_map = utils.NewOffsetMap()
	var column_maxrow_map = utils.NewMaxCurrentRow()
	length := 0

	for k:=0 ; k<len(data); k++ {
		//todo 判断是否是填充字段还是普通字段
		if data[k].Text == constants.NilStr {
			continue
		}
		col,row,err := utils.SplitBlock(data[k].Merge[0])
		if err != nil {
			return err
		}
		flag := utils.JudgeMaxRow(column_maxrow_map,col,row)
		if true == flag  {
			logrus.Info("需要扩展")
			s1,err := utils.GetOffsetPosition(column_offset_map,data[k].Merge[0],length)
			if err != nil {
				return err
			}
			data[k].Merge[0] = s1
			s2 := constants.NilStr
			if len(data[k].Merge) == 2{
				s2,err = utils.GetOffsetPosition(column_offset_map,data[k].Merge[1],length)
				if err != nil {
					return err
				}
				data[k].Merge[1] = s2
			}
			col,row,err = utils.SplitBlock(s1)
			logrus.Info("第一个位置",data[k].Merge[0])
		}


		switch utils.IsDataKeys(data[k].Text) {
			// 如果不是数据库字段，就直接按照原来的形式填充
			case false:
				if len(data[k].Merge) > 1  {
					if err := f.MergeCell(sheetname,data[k].Merge[0],data[k].Merge[1]);err!=nil {
						log.Fatal(err)
						return err
					}
				}

				if err := SetCellStyle(f,data[k],opSheetCellstyles,styles);err!=nil {
					log.Fatal(err)
					return err
				}

				if err := SetCellsValue(f,data[k],username);err!=nil {
					log.Fatal(err)
					return err
				}
				logrus.Info("普通字段")
				logrus.Info(data[k].Text,data[k].Merge[0])
				column_maxrow_map[col] = row
				break

			// 	如果是数据库字段，就要提取出来在下一步进行操作
			case true:
				// fixme 字段表起始值的数据
				logrus.Info("数据库字段")
				l,err := FillDataValue(f,column_offset_map,column_maxrow_map,data[k])
				if err!=nil {
					log.Fatal(err)
					return err
				}
				length = l
				break
		}
		// 样式属性要重制
		opSheetCellstyles = OpSheetCellsStyle{}
	}
	return nil
}



// 设置文件样式
func SetCellStyle(f *excelize.File,sheetdata params.SheetDataGroup,opSheetCellstyles OpSheetCellsStyle,stylesJson  []params.StyleJson) (error) {
	var mergeLen = len(sheetdata.Merge)
	// 设置字体
	//设置字体样部分
	opSheetCellstyles.Font.Bold = sheetdata.Style.Font.Bold
	opSheetCellstyles.Font.Italic =  sheetdata.Style.Font.Italic
	opSheetCellstyles.Font.Size = sheetdata.Style.Font.Size

	if  sheetdata.Style.Color != constants.NilStr {
		opSheetCellstyles.Font.Color =  sheetdata.Style.Color
	}
	if  sheetdata.Style.Underline == true {
		opSheetCellstyles.Font.Underline = "single"
	}
	if sheetdata.Style.Font.Name != constants.NilStr {
		opSheetCellstyles.Font.Family = sheetdata.Style.Font.Name
	}
	font_json,err := json.Marshal(opSheetCellstyles.Font)
	if err!=nil {
		log.Fatal(err)
		return err
	}
	stylesJson = append(stylesJson,params.StyleJson{"font",font_json})

	//设置背景
	if  sheetdata.Style.BgColor != constants.NilStr {
		opSheetCellstyles.Fill.Color = []string{ sheetdata.Style.BgColor}
		opSheetCellstyles.Fill.Pattern = 1
		opSheetCellstyles.Fill.Type = "pattern"
		bgcolor_json,err := json.Marshal(opSheetCellstyles.Fill)
		if err!= nil {
			log.Fatal(err)
			return err
		}
		stylesJson = append(stylesJson,params.StyleJson{"fill",bgcolor_json})
	}

	// 设置字体居中
	if  sheetdata.Style.Align != constants.NilStr {
		opSheetCellstyles.Alignment.Horizontal =  sheetdata.Style.Align
	}
	if sheetdata.Style.Align == constants.NilStr {
		opSheetCellstyles.Alignment.Horizontal = "left"
	}

	if  sheetdata.Style.Valign != constants.NilStr {
		// 前端中的 middle 对应的是后台的r
		if sheetdata.Style.Valign == "middle" {
			opSheetCellstyles.Alignment.Vertical =  "center"
		}else {
			opSheetCellstyles.Alignment.Vertical =  sheetdata.Style.Valign
		}
		// 默认是left
	}

	if sheetdata.Style.Valign == constants.NilStr {
		// 默认是center
		opSheetCellstyles.Alignment.Vertical =  "center"
	}
	opSheetCellstyles.Alignment.WrapText =  sheetdata.Style.TextWrap
	position_json , err := json.Marshal(opSheetCellstyles.Alignment)
	if err!= nil {
		log.Fatal(err)
		return err
	}
	stylesJson = append(stylesJson,params.StyleJson{"alignment",position_json})



	//设置边框
	if len(sheetdata.Style.Border.Bottom)!=0 {opSheetCellstyles.Border = append(opSheetCellstyles.Border,excelize.Border{
		Type:  "bottom",
		Color:  sheetdata.Style.Border.Bottom[1],
		Style: 1,
	})}
	if len( sheetdata.Style.Border.Right)!=0 {opSheetCellstyles.Border = append(opSheetCellstyles.Border,excelize.Border{
		Type:  "right",
		Color:  sheetdata.Style.Border.Right[1],
		Style: 1,
	})}
	if len( sheetdata.Style.Border.Left)!=0 {opSheetCellstyles.Border = append(opSheetCellstyles.Border,excelize.Border{
		Type:  "left",
		Color:  sheetdata.Style.Border.Left[1],
		Style: 1,
	})}
	if len( sheetdata.Style.Border.Top)!=0 {
		opSheetCellstyles.Border = append(opSheetCellstyles.Border,excelize.Border{
		Type:  "top",
		Color: sheetdata.Style.Border.Top[1],
		Style: 1,
	})}
	border_json , err := json.Marshal(opSheetCellstyles.Border)
	if err!= nil {
		log.Fatal(err)
		return err
	}

	stylesJson = append(stylesJson,params.StyleJson{"border",border_json})
	if len(stylesJson) != 0 {
		jsonstr := utils.SetStyleStr(stylesJson)
		style, err := f.NewStyle(jsonstr)
		if err!= nil{
			log.Fatal(err)
			return err
		}

		if err := f.SetCellStyle(sheetname,  sheetdata.Merge[0], sheetdata.Merge[mergeLen - 1], style);err!=nil {
			log.Fatal(err)
			return err
		}
	}
	return nil
}

func SetCellsValue(f *excelize.File,sheetdata params.SheetDataGroup,username string) (error) {
	//写入文本
	// todo 这里将来 要判断是否是字段，如果是字段，那么就要写入数据源中的数据到这个字段里面
	var text string
	if sheetdata.Text != constants.NilText {
		if utils.IsDefaultKeys(sheetdata.Text) {
			switch sheetdata.Text {
				case constants.LongTimeFormat:
					text = time.Now().Format(constants.LONG_TIME_TYPE)
					break
				case constants.ShortTimeFormat:
					text = time.Now().Format(constants.SHORT_TIME_TYPE)
					break
				case constants.SheetCreater:
					text = username
					break
				default:
					break
			}
		}else {
			text = sheetdata.Text
		}
		if err := f.SetCellValue(sheetname,sheetdata.Merge[0],text);err!=nil {
			log.Fatal(err)
			return err
		}
	}
	return nil
}


/**
 mock一个数据源
 */
type Employee struct {
	Uid int32 `db:"uid"`
	Name string `db:"name"`
	Dept string `db:"dept"`
	Salary float32 `db:"salary"`
}

// 填充字段真实值
func FillDataValue(f *excelize.File,column_offset_map,column_max_map map[string]int,outputdata params.SheetDataGroup) (int,error){
	// 获取这个字段名
	param,err := GetSubParam(outputdata.Text)
	if err != nil {
		log.Fatal(err)
		return -1,err
	}

	// 获取数据源 模拟查询数据
	db := global.DBSqlxEngine
	var em []Employee
	psql := `select `+ param + ` from employee`
	if err := db.Unsafe().Select(&em,psql);err!=nil {
		log.Fatal(err)
		return -1,err
	}
	if (len(em) == 0) {
		log.Fatal("数据查出为空")
		return -1,nil
	}
	offset := len(em)



	// 写入数据
	if err := doWrite(f,column_offset_map,column_max_map,offset,em,param,outputdata);err!=nil {
		log.Fatal(err)
		return -1,err
	}
	return offset,nil
}


// 获取真实字段值
func GetSubParam(str string) (string,error){
	tmp := []rune(str)
	if len(tmp) <= 2 {
		return "",errors.New("invalid param,length is less 0!")
	}
	tmp = tmp[1:len(tmp) - 1]
	return string(tmp),nil
}


/*
重新调整单元格的写入起点 这里的返回值可能是一个字符串(不合并)，也可能是两个字符串(合并)
 */
func GetIncPosition(offset int,HAS_OFFSET int32,str[] string)  (error,string,string){
	var row string // 预处理完的column
	if HAS_OFFSET == 0 && offset == 0{
		if len(str) == 1 {
			return nil,str[0],constants.NilStr
		}
		return nil,str[0],str[1]
	}
	if len(str) == 1 {
		// 如果不合并
		row = string([]rune(str[0])[1:])
		res,err := GetIncResString(string([]rune(str[0])[0]),row,offset,HAS_OFFSET)
		if err != nil {
			return err,constants.NilStr,constants.NilStr
		}
		return nil,res,constants.NilStr
	} else if len(str) == 2 {
		// 如果合并单元格，那么在这里就要重新调整,重新调整横坐标到一个水平线上
		r1 := []rune(str[0])
		r2 := []rune(str[1])

		if string(r1[1:]) == string(r2[1:]) {
			res1,err := GetIncResString(string(r1[0]),string(r1[1:]),offset,HAS_OFFSET)
			if err != nil {
				return err,constants.NilStr,constants.NilStr
			}
			res2,err := GetIncResString(string(r2[0]),string(r2[1:]),offset,HAS_OFFSET)
			if err != nil {
				return err,constants.NilStr,constants.NilStr
			}
			return nil,res1,res2
		}

		tmp1,err1 := strconv.ParseInt(string(r1[1:]),10,32)
		if err1 != nil {
			log.Fatal(err1)
			return err1,constants.NilStr,constants.NilStr
		}
		tmp2,err2 := strconv.ParseInt(string(r2[1:]),10,32)
		if err2 != nil {
			log.Fatal(err2)
			return err2,constants.NilStr,constants.NilStr
		}
		var res int64
		if tmp1 < tmp2 {
			res = tmp2
		}else {
			res = tmp1
		}
		var res_conv int = int(res)
		row = strconv.Itoa(res_conv)

		if string(r1[0]) == string(r2[0]) {
			res,err := GetIncResString(string(r1[0]),row,offset,HAS_OFFSET)
			if err != nil {
				log.Fatal(err)
				return err,constants.NilStr,constants.NilStr

			}
			return nil,res,constants.NilStr
		}

		res1,err1 := GetIncResString(string(r1[0]),row,offset,HAS_OFFSET)
		if err1 != nil {
			log.Fatal(err1)
			return err1,constants.NilStr,constants.NilStr
		}
		res2,err2 := GetIncResString(string(r2[0]),row,offset,HAS_OFFSET)
		if err2 != nil {
			log.Fatal(err2)
			return err2,constants.NilStr,constants.NilStr
		}
		return nil,res1,res2
	}
	return nil,constants.NilStr,constants.NilStr
}

// 字符串转换
func GetIncResString(col string,row string,offset int,HAS_OFFSET int32) (string,error) {
	var result string = constants.NilStr
	parseInt, err := strconv.ParseInt(row, 10, 32)
	if err != nil {
		log.Fatal(err)
		return result,err
	}
	tmp := int32(parseInt)
	tmp = tmp + int32(offset) + HAS_OFFSET
	result = col + strconv.Itoa(int(tmp))
	return result,nil
}




// 写入数据流
func doWrite(f *excelize.File,column_offset_map,column_max_map map[string]int,k int, obj interface{},param string,data params.SheetDataGroup) (error) {
	// 返回的结果集
	var result string

	// 样式
	opSheetCellstyles := OpSheetCellsStyle{}
	styles := []params.StyleJson{}
	t := reflect.TypeOf(obj)
	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}
	// 如果这个泛型不是切片类型就直接抛出异常
	if t.Kind() != reflect.Slice {
		return errors.New("类型异常")
	}
	col1 ,row1 := string([]rune(data.Merge[0])[0]),string([]rune(data.Merge[0])[1:])
	logrus.Info(col1,row1)
	col2 ,row2 := constants.NilStr,constants.NilStr
	s1,s2,err:= constants.NilStr,constants.NilStr,errors.New(constants.NilStr)
	for index:=0;index<k;index++{
		v := reflect.ValueOf(obj).Index(index)
		switch v.FieldByName(param).Kind() {
			case reflect.String:
				val := v.FieldByName(param).String()
				result = val
				break
			case reflect.Int32,reflect.Int,reflect.Int64:
				val := v.FieldByName(param).Int()
				result =strconv.Itoa(int(val))
				break
			case reflect.Float64,reflect.Float32:
				val := v.FieldByName(param).Float()
				result = strconv.FormatFloat(val,'f', -1, 64)
				break
			default:
				break
		}

		s1,err = GetIncResString(col1,row1,index, 0)
		if err != nil {
			log.Fatal(err)
			return err
		}
		data.Merge[0] = s1
		if len(data.Merge) == 2 {
			col2,row2= string([]rune(data.Merge[1])[0]),string([]rune(data.Merge[1])[1:])
			s2,err = GetIncResString(col2,row2,index, 0)
			if err != nil {
				log.Fatal(err)
				return err
			}
			if err = f.MergeCell(sheetname,s1,s2);err!=nil {
				log.Fatal(err)
				return err
			}
		}
		if err = SetCellStyle(f,data,opSheetCellstyles,styles);err!=nil {
			log.Fatal(err)
			return err
		}
		logrus.Info(data.Text,s1)
		if err = f.SetCellValue(sheetname,s1,result);err != nil {
			log.Fatal(err)
			return err
		}
	}
	// 更新map_offset 和 max_map
	column_offset_map[col1]++
	if col2 != constants.NilStr {
		column_offset_map[col2]++
	}
	col,row,err := utils.SplitBlock(s1)
	if err != nil {
		return err
	}
	column_max_map[col] = row
	return nil
}


