package model

import (
	"sheetServerApi/global"
	"sheetServerApi/pkg/setting"
	"fmt"
	"github.com/jinzhu/gorm"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"log"
	"time"
)

/**
 初始化Gorm框架的DB引擎
 */
func NewDBOrmEngine(databaseSetting *setting.DatabaseOrmSetting) (*gorm.DB,error) {
	//设置数据库连接字符串
	db,err:=gorm.Open(databaseSetting.DBType,fmt.Sprintf(
		"host=%s port=%s user=%s dbname=%s sslmode=disable password=%s",
		databaseSetting.Host,
		databaseSetting.Port,
		databaseSetting.Username,
		databaseSetting.DBName,
		databaseSetting.Password,
		))
	if err!= nil {
		log.Fatal(err)
		return nil,err
	}
	if global.ServerSetting.RunMode == "debug" {db.LogMode(true)}
	db.SingularTable(true)
	//设置超时和空闲时间
	db.DB().SetMaxIdleConns(databaseSetting.MaxIdleConns)
	db.DB().SetMaxOpenConns(databaseSetting.MaxOpenConns)
	db.DB().SetConnMaxLifetime(10*time.Minute)
	return db,nil
}

/**
初始sqlx引擎
 */
func NewDBSqlxEngine(databaseSetting *setting.DatabaseSqlxSetting) (*sqlx.DB,error) {
	db,err:=sqlx.Open(databaseSetting.DBType,fmt.Sprintf(
		"host=%s port=%s user=%s dbname=%s sslmode=disable password=%s",
		databaseSetting.Host,
		databaseSetting.Port,
		databaseSetting.Username,
		databaseSetting.DBName,
		databaseSetting.Password,
	))
	if err!= nil {
		log.Fatal(err)
		return nil,err
	}
	//设置超时和空闲时间
	db.SetMaxIdleConns(databaseSetting.MaxIdleConns)
	db.SetMaxOpenConns(databaseSetting.MaxIdleConns)
	db.SetConnMaxLifetime(10*time.Minute)
	return db,nil
}