package routers

import (
	"sheetServerApi/internal/handlers"
	"sheetServerApi/internal/middlewares/Auth"
	"github.com/gin-gonic/gin"
)

// 路由限流工具
//var methodLimiters = limiter.NewMethodLimiter().AddBucket(
//		limiter.LimiterBucketRule{
//			Key:          "/auth",
//			FillInterval: time.Second,
//			Capacity:     10,
//			Quantum:      10,
//		},
//	)


// 路由组件
func NewRouter() (*gin.Engine) {
	//自定义报表框架的生成
	r := gin.New()
	r.Use(Auth.Cors())
	//r.Use(log.LoggerToFile())
	r.Use(gin.Recovery())
	//r.Use(limit.RateLimiter(methodLimiters))
	v2 := r.Group("/v2")
	{
		v2.GET("/hello",handlers.Index)
		// 创建报表
		v2.POST("/xsheetServer/create",handlers.CreateSheetDatas)
		// 获取报表的操作历史
		v2.POST("/xsheetServer/history/get",handlers.GetSheetHistory)
		// 获取报表的原生字段
		v2.POST("/xsheetServer/rawdatas/get",handlers.GetTableRawData)
		// 获取数据源的所有字段信息
		v2.POST("/xsheetServer/tablemeta/get",handlers.GetSheetTableMeta)
	}

	return r
}
