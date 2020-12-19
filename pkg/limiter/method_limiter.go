package limiter

import (
	"github.com/gin-gonic/gin"
	"github.com/juju/ratelimit"
	"strings"
)

/**
* @program: src
* @description: 对路由进行限流
* @author: 占翔昊
* @create 2020-10-13 20:46
**/


// 继承通用限流器
type MethodLimiter struct {
	*Limiter
}


func NewMethodLimiter() MethodLimiter {
	return MethodLimiter{
		Limiter:&Limiter{
			LimiterBuckets: make(map[string]*ratelimit.Bucket),
		},
	}
}

func (l MethodLimiter) Key(c *gin.Context) string {
	url := c.Request.RequestURI
	index := strings.Index(url,"?")
	if index == -1 {
		return url
	}
	return url[:index]
}

func (l MethodLimiter) GetBucket (key string) (*ratelimit.Bucket,bool) {
	bucket , ok := l.LimiterBuckets[key]
	return bucket,ok
}

func (l MethodLimiter) AddBucket(rules ...LimiterBucketRule) LimiterInterface {
	for _,rule := range rules {
		if _,ok := l.LimiterBuckets[rule.Key];!ok {
			l.LimiterBuckets[rule.Key] = ratelimit.NewBucketWithQuantum(rule.FillInterval,rule.Capacity,rule.Quantum)
		}
	}
	return l
}
