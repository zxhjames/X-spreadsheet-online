package global

import "sheetServerApi/pkg/setting"

/**
 全局配置文件
 */

var (
	ServerSetting *setting.ServerSettings //服务配置
	AppSetting *setting.AppSettings // 应用配置
	DatabaseOrmSetting *setting.DatabaseOrmSetting // gorm数据源配置
	DatabaseSqlxSetting *setting.DatabaseSqlxSetting // sqlx数据源配置
)
