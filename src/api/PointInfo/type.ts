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
