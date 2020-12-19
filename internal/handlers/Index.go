package handlers

import (
	"sheetServerApi/internal/middlewares/response"
	"github.com/gin-gonic/gin"
	"log"
)

// 测试接口联通
func Index(c *gin.Context) {
	log.Println("Hello Index!")
	response.ResponseSuccess(c,200,"ok","接口正常")
}

