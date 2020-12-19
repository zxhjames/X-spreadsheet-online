package model

import (
	"sheetServerApi/internal/model/params"
	"encoding/json"
	"github.com/jinzhu/gorm"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)


/**
 对excelmeta表的操作
 */
type OpGormExcelMetaDao struct {}
type OpSqlxExcelMetaDao struct {}
// 读数据
func (OpGormExcelMetaDao) ReadData(db *gorm.DB) ([]params.SheetParamsResp,error) {
	var tmp []params.GormSheetParams
	db.Table("excelmeta").Find(&tmp)
	var resp []params.SheetParamsResp
	if len(tmp) == 0 {
		return resp,nil
	}else {
		var submeta params.SheetParamsResp
		for _,v := range tmp {
			submeta.Id = v.Id
			submeta.Name = v.Name
			submeta.Time = v.Time
			if err := json.Unmarshal(v.Api,&submeta.Api);err!=nil {
				log.Fatal(err)
				return resp,err
			}
			if err := json.Unmarshal(v.Data,&submeta.Data);err!=nil {
				log.Fatal(err)
				return resp,err
			}
			if err := json.Unmarshal(v.Cell,&submeta.Cell);err!=nil {
				log.Fatal(err)
				return resp,err
			}
			resp = append(resp,submeta)
		}
	}
	return resp,nil
}

// 写数据
func (OpGormExcelMetaDao) WriteData(db *gorm.DB , p params.SheetParamsReq) (err error){
	var tmp params.GormSheetParams
	tmp.Name = p.Name
	tmp.Time = p.Time
	tmp.RawData = p.RawData
	if tmp.Data, err = json.Marshal(p.Data);err!=nil {
		return err
	}

	if tmp.Cell,err  = json.Marshal(p.Cell);err!=nil {
		return err
	}

	if tmp.Api,err = json.Marshal(p.Api);err!=nil {
		return err
	}
	tmp.Author = p.Author
	if err := db.Table("excelmeta").Create(&tmp).Error;err!=nil{
		return err
	}
	log.Println("write data success")
	return nil
}

// 获取数据表的字段，字段属性，字段备注
func (OpSqlxExcelMetaDao) GetTableMetaInfo(db *sqlx.DB,tableName string) ([]params.SheetTableMetaInfo,error){
	if tableName == "" { return nil,errors.New("表名为空!") }
	var resp []params.SheetTableMetaInfo
	psql := `select a.attnum AS "ID",
			c.relname AS "table_name",
			a.attname AS "table_column",
			concat_ws('',t.typname,SUBSTRING(format_type(a.atttypid,a.atttypmod) from '\(.*\)')) as "param_type",
			d.description AS "table_comment"
			from pg_class c, pg_attribute a , pg_type t, pg_description d
			where  c.relname = $1
			and a.attnum > 0
			and a.attrelid = c.oid
			and a.atttypid = t.oid
			and  d.objoid=a.attrelid
			and d.objsubid=a.attnum
			ORDER BY c.relname DESC,a.attnum ASC
			`
	if err := db.Unsafe().Select(&resp,psql,tableName);err!=nil {
		log.Fatal(err)
		return nil , err
	}
	return resp,nil
}



// 获取所有最原始的报表操作 数据
func (OpSqlxExcelMetaDao) GetSheetRawData(db *sqlx.DB,id int64) (string,error) {
	var resp string = ""
	var count int = 0
	psql := `select count(id) from excelmeta where id = $1`
	if err := db.Get(&count,psql,id);err!=nil {
		return resp,err
	}
	if count == 0 {
		return "",nil
	}
	psql = `select raw_data from excelmeta where id = $1`
	if err := db.Get(&resp,psql,id);err!=nil {
		return resp,err
	}
	return resp,nil
}


// 获取报表操作历史
func (d OpSqlxExcelMetaDao) GetSheetHistory(db *sqlx.DB,req params.SheetHistoryReq) ([]params.SheetHistoryInfo,error) {
	var resp []params.SheetHistoryInfo
	var count int32 = 0
	psql := `select count(id) from excelmeta offset 0 limit $1`
	if err := db.Unsafe().Get(&count,psql,req.Offset);err!=nil{
		log.Fatal(err)
		return resp,err
	}
	if count == 0 {
		return resp,nil
	}
	if count == req.Offset {
		count = req.Offset
	}
	psql = `select id , author, name, raw_data,time from excelmeta order by time desc offset 0 limit $1`
	if err := db.Unsafe().Select(&resp,psql,count);err!=nil {
		log.Fatal(err)
		return resp,err
	}
	return resp,nil
}