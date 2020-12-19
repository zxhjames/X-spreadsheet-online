package limit

import (
	"ExcelSystem/utils"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"sheetServerApi/pkg/limiter"
)



// 限流
func RateLimiter(l limiter.LimiterInterface) gin.HandlerFunc {
	return func (c *gin.Context) {
		key := l.Key(c)
		if bucket,ok := l.GetBucket(key);ok {
			count := bucket.TakeAvailable(1)
			if count == 0 {
				utils.ResponseError(c,500,"流量过大",errors.New("请求超过限制"))
				return
			}
		}
		c.Next()
	}
}