import *as Cesium from 'cesium'
//获取所有的旅游景点信息返回信息类型
export interface PointTouristInfoResponse {
  code: number
  message: string
}

//获取所有的旅游景点信息返回信息类型
export interface PointTouristInfo {
  id: number,
  name: string,
  description: string,
  url:string
}

//获取所有的旅游景点信息返回信息类型
export interface PointTouristInfoResponseData extends PointTouristInfoResponse  {
  data: PointTouristInfo[]
}

// 获取景点点位的请求返回数据类型
export interface PointInfoGeoResponse extends PointTouristInfoResponse{
  data:Cesium.GeoJsonDataSource
}


//返回对应景点打卡点位数据类型
export interface PicturePointResponse extends PointTouristInfoResponse{
  data:Cesium.GeoJsonDataSource
}

//返回打卡点单个图片的data类型
export interface responseAllImageData{
  id:number,
  name:string,
  parentpositionid:number,
  pointid:number,
  type:number,
  url:string
}
// 返回打卡点所有图片的数据类型
export interface responseAllImage extends PointTouristInfoResponse{
  data:responseAllImageData[]
}
