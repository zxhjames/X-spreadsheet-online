package constants



/**
系统配置所需常量的位置
 */
const (
	Debug_config_dir = "/XsheetServerApi/configs" //开发环境下的配置目录
	Release_config_dir = "/go/src/configs" //生产环境下的配置目录
	Release_excel_dir = "/sheets/"
)

/**
 系统日志生成所需的常量
 */
const (
	RELEASE_LOG_FILE_PATH = "/go/src/log"
	LOG_FILE_NAME = "system.log"
)