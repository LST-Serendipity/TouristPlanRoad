import request from '@/utils/request'
import type {PointTouristInfoResponseData} from './type'
// 枚举定义接口
enum API{
  // 获取所有的旅游景点信息接口地址
  GET_POINTTOURISTINFO='/api/getPoint/Info'
}
// 获取所有的旅游景点信息方法
export const reqGetPointTouristInfo = () => {
  return request.get<any,PointTouristInfoResponseData>(API.GET_POINTTOURISTINFO)
}
