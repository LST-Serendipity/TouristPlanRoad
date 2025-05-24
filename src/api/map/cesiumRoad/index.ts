import request from "@/utils/request";

enum API{
  GET_ROAD_LIST= "/geoserver/webgis_1/ows"
}
export const reqGetRoadList = (params:any) => {
  return request.get(API.GET_ROAD_LIST,{params})
}
