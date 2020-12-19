package response

import "github.com/gin-gonic/gin"

/**
 统一请求参数
 */

type RespOk struct {
	Code int
	Msg  string
	Data interface{}
}

type RespErr struct {
	Code  int
	Msg   string
	Error error
}

func ResponseSuccess(c *gin.Context, code int, Msg string, Data interface{}) {
	c.JSON(200, gin.H{
		"code": code,
		"msg":  Msg,
		"data": Data,
	})
}

func ResponseError(c *gin.Context, code int, Msg string, Error error) {
	c.JSON(code, gin.H{
		"code":  code,
		"msg":   Msg,
		"error": Error,
	})
}
