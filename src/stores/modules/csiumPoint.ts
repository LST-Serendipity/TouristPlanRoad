import { defineStore } from "pinia";
import { ref } from "vue";

import type {pictureArrType} from './cesiumPointType'
import type {responseAllImageData} from '@/api/PointInfo/type'
const useCesiumPointStore=defineStore('cesiumPoint',()=>{
  let picturePoint=ref<pictureArrType[]>([])
  //储存景点对应打卡点的所有图片
  let allImagePointArr=ref<responseAllImageData[]>()

  return {allImagePointArr,picturePoint}
})
export default useCesiumPointStore
