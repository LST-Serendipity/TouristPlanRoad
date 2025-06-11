import *as cesium from 'cesium'

export interface pictureArrType{
  id:string|number,
  name:string,
  parentid:string|number,
  position?:cesium.Cartesian3
}
