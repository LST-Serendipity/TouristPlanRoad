import *as Cesium from 'cesium'
//定义请求返回数据的类型
export interface ResponseGetRoadMessage{
  code:number,
  message:string
}
//定义请求返回数据道路的data数据类型
export interface responseData{
  geoJSon:Cesium.GeoJsonDataSource
}
//请求道路数据返回的数据类型
export interface responseRoad extends ResponseGetRoadMessage{
  data:responseData
}

//定义请求路径规划请求参数类型
export interface planRoadParmas{
  startLon:number,
  startLat:number,
  endLon:number,
  endLat:number
}
//定义请求路径规划返回数据data类型
export interface planRoadData{

}
