import request from '@/utils/request'
import type {PointTouristInfoResponseData,PicturePointResponse,responseAllImage} from './type'
// 枚举定义接口
enum API{
  // 获取所有的旅游景点信息接口地址
  GET_POINTTOURISTINFO='/api/getPoint/Info',
  //获取对于地点的详细信息及打卡点位置接口地址
  GET_POINTTAKEPICTUREPOSITION='/api/getPoint/getTakePicturePosition',
  //获取对应点的所有打卡地点图片接口地址
  GET_POINTALLIMAGE='/api/getPoint/getAllImage'
}
// 获取所有的旅游景点信息方法
export const reqGetPointTouristInfo = () => {
  return request.get<any,PointTouristInfoResponseData>(API.GET_POINTTOURISTINFO)
}
//获取对于地点的详细信息及打卡点位置请求方法
export const reqGetPointTakePicturePos=(id:number)=>request.get<any,PicturePointResponse>(API.GET_POINTTAKEPICTUREPOSITION +`?id=${id}`)
//获取对应点的所有打卡地点图片请求方法
export const reqGetAllImage=(pointid:number)=>request.get<any,responseAllImage>(API.GET_POINTALLIMAGE+`?pointid=${pointid}`)
