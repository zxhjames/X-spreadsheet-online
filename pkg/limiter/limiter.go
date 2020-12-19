package limiter

import (
	"github.com/gin-gonic/gin"
	"github.com/juju/ratelimit"
	"time"
)

/**
* @program: src
* @description:
* @author: 占翔昊
* @create 2020-10-13 20:38
**/
// 通用限流接口
type LimiterInterface interface {
	//限流器的键值对名称
	Key(c *gin.Context) string
	//获取令牌桶
	GetBucket (key string) (*ratelimit.Bucket,bool)
	// 新增多个令牌桶
	AddBucket (rules ...LimiterBucketRule) LimiterInterface
}

// 存储令牌桶与键值对映射的关系
type Limiter struct {
	LimiterBuckets map[string]*ratelimit.Bucket
}

// 定义存储令牌桶的一些相应的规则属性
type LimiterBucketRule struct {
	Key string  //自定义令牌桶
	FillInterval time.Duration //放置令牌的间隔时间
	Capacity int64 //令牌桶容量
	Quantum int64 //每次达到间隔时间后放开的令牌数量
}

