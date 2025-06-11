import { defineStore } from "pinia";
import { ref } from "vue";
import type {pictureArrType} from './cesiumPointType'
const useCesiumPointStore=defineStore('cesiumPoint',()=>{
  let picturePoint=ref<pictureArrType[]>([])
  //储存景点对应打卡点的所有图片
  let allImagePointArr=ref()

  return {allImagePointArr,picturePoint}
})
export default useCesiumPointStore
