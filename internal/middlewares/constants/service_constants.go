package constants
/**
 各个服务需要的常量
 */



/**
1.报表生成服务所需要生成的文件常量
*/
var Maps = []string{
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
	"L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
	"W", "X", "Y", "Z",
}


/**
空值字符串
 */
const (
	NilStr = ""
	NilText = "null"
)


/**
默认填充字段值
 */
const (
	LongTimeFormat = "#LongTimeFormat#"
	ShortTimeFormat = "#ShortTimeFormat#"
	SheetCreater = "#SheetCreater#"
)

/**
字段头标识
 */
const (
	DynamicHead = '$'
	StaticHead = '#'
)

/**
静态填充值
 */
const (
	SHORT_TIME_TYPE = "2006-01-02"
	LONG_TIME_TYPE = "2006-01-02 15:04:05"
)

/**
文件拼接字符串
 */
const (
	Name_time_mark = "-"
)