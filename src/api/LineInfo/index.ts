import request from "@/utils/request";
import type {responseRoad,planRoadParmas} from './type'
enum API{
  //获取道路geojson数据
  GETROAD_URL='/api/getRoad/Road',
  //路线规划请求地址
  PLANROAD_URL='/api/getRoad/roadPlanning'
}
//获取道路geojson数据请求方法
export const reqGetRoad=()=>request.get<any,responseRoad>(API.GETROAD_URL)
// 路线规划请求方法
export const reqPlanRoad=(params:planRoadParmas)=>request.get<any,any>(API.PLANROAD_URL,{params})
