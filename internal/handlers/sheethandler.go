package handlers

import (
	"sheetServerApi/internal/middlewares/response"
	"sheetServerApi/internal/model/params"
	"sheetServerApi/internal/services"
	"github.com/gin-gonic/gin"
	"log"
)


// 生成报表
func CreateSheetDatas(c *gin.Context) {
	var req params.SheetParamsReq
	if err := c.BindJSON(&req);err!=nil {
		log.Fatal(err)
		response.ResponseError(c,400,"参数绑定错误",err)
		return
	}
	url, err := services.GenerateSheetFile(req)
	if err!=nil {
		log.Fatal(err)
		response.ResponseError(c,500,err.Error(),err)
		return
	}
	response.ResponseSuccess(c,200,"生成成功",url)
}



// 根据ID获取表的模版数据
func GetTableRawData(c *gin.Context) {
	var req params.SheetRawdataReq
	if err := c.BindJSON(&req);err!=nil {
		log.Fatal(err)
		response.ResponseError(c,400,"参数绑定错误",err)
		return
	}
	data,err := services.GetExcelRawDatas(req.ID)
	if err!= nil {
		log.Fatal(err)
		response.ResponseError(c,500,err.Error(),err)
		return
	}
	response.ResponseSuccess(c,200,"获取成功",data)
}


// 获取数据源的字段信息
func GetSheetTableMeta(c *gin.Context) {
	var req params.SheetTableReq
	if err := c.BindJSON(&req);err!=nil {
		log.Fatal(err)
		response.ResponseError(c,400,"参数绑定错误",err)
		return
	}
	data,err := services.GetTableMetaInfo(req.TableName)
	if err!= nil {
		log.Fatal(err)
		response.ResponseError(c,500,"生成失败",err)
		return
	}
	response.ResponseSuccess(c,200,"生成成功",data)
}

// 获取表格的操作历史
func GetSheetHistory(c *gin.Context) {
	var req params.SheetHistoryReq
	if err := c.BindJSON(&req);err!=nil {
		log.Fatal(err)
		response.ResponseError(c,400,"参数绑定错误",err)
		return
	}
	data,err := services.GetSheetHistory(req)
	if err!= nil {
		log.Fatal(err)
		response.ResponseError(c,500,"获取失败",err)
		return
	}
	response.ResponseSuccess(c,200,"获取成功",data)
}