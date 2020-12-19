package global

import (
	"github.com/jinzhu/gorm"
	"github.com/jmoiron/sqlx"
)

/**
 全局数据源
 */


var (
	// gorm 数据库操作引擎
	DBOrmEngine *gorm.DB
	// sqlx 数据库操作引擎
	DBSqlxEngine *sqlx.DB
)

