package setting

import "time"

/**
* @program: src
* @description:
* @author: 占翔昊
* @create 2020-10-05 18:34
**/

// 服务器端的配置
type ServerSettings struct {
	RunMode string
	HttpPort string
	ReadTimeout time.Duration
	WriteTimeout time.Duration
}

// App的配置
type AppSettings struct {
	AppName string
	LogFileName string
	LogFilePath string
	ReleaseUrl string
	ConfigDir string
	ExcelFileDir string
}

// 数据库的配置
type DatabaseOrmSetting struct {
	DBType string
	Username string
	Password string
	Host string
	Port string
	DBName string
	MaxIdleConns int
	MaxOpenConns int
}

type DatabaseSqlxSetting struct {
	DBType string
	Username string
	Password string
	Host string
	Port string
	DBName string
	MaxIdleConns int
	MaxOpenConns int
}


