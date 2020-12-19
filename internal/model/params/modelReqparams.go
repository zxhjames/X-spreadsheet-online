package params

/**
* @program: src
* @description:
* @author: 占翔昊
* @create 2020-10-25 17:57
**/


// 获取excel表的字段名，字段信息，字段备注
type SheetTableMetaInfo struct {
	TableName string `db:"table_name"` // 表名
	//TableDescribe string `db:"table_describe"` // 表描述
	TableColumn string `db:"table_column"` // 表列名
	ParamType string `db:"param_type"` // 表字段类型
	TableComment string `db:"table_comment"` // 表字段备注
}


// 获取文件操作历史记录
type SheetHistoryInfo struct {
	Id int64 `json:"id" db:"id"`
	Author string `json:"author" db:"author"`
	FileName string `json:"file_name" db:"name"`
	RawData string `json:"raw_data" db:"raw_data"`
	Time string `json:"time" db:"time"`
}


