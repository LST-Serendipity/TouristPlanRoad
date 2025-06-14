<template>
     <el-card class="displayInfo" >
      <div class="head">
        <span>景点名称: {{ pointInfoDrawer.name }}</span>
      </div>
      <div class="body">
        <el-scrollbar height="400px">
          <ul>
            <li v-for="(item,index) in imageArr" :key="item.id"  @dblclick="seeImagePoint(item,index)">
              <el-image :preview-src-list="previewEnabled?imageList:[]" @click="seeImage(item)" @dblclick="closeImage()" style="width: 100%; height: 100%" :src="item.url" fit="contain" />
            </li>
          </ul>
      </el-scrollbar>
      </div>
    </el-card>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import *as Cesium from 'cesium'

import useCesiumPointStore from '@/stores/modules/csiumPoint'

import type {responseAllImageData,responseAllImage} from '@/api/PointInfo/type'
import type {pictureArrType} from '@/stores/modules/cesiumPointType'

import {reqGetPointTakePicturePos,reqGetAllImage} from '@/api/PointInfo/index'
import { watch } from 'vue';
import { onMounted } from 'vue';

//定义景点点的仓库
const useCesiumPointstore=useCesiumPointStore()
const prop=defineProps<{
  viewer:Cesium.Viewer,
  pointInfoDrawer:{
    name:string,
    coordinates:[number,number]|null
  }


}>()
const {viewer,pointInfoDrawer,}=prop
watch(()=>{

},()=>{

})

//控制图片预览
let previewEnabled =ref<boolean>(false)

//辨别单击或双击
const checkCount=ref<number>(0)
//图片预览数组列表
let imageList=ref<string[]>()
//控制定时器
let timer:number|null=null
let imageArr=ref<responseAllImageData[]>()
//右边弹窗图片双击回调
const seeImagePoint=(item:responseAllImageData,index:number)=>{
  console.log(item);

  let position=useCesiumPointstore.picturePoint.find((element:pictureArrType)=>{
    return element.id==item.parentpositionid
  })
  // console.log(position?.position);
  //获取的笛卡尔坐标
  let cartesian:Cesium.Cartesian3=position?.position
  // 将笛卡尔坐标转换为地理坐标
  const cartographic=Cesium.Cartographic.fromCartesian(cartesian)
  //设置高度
  const newHeight=500
  const newCartographic=new Cesium.Cartographic(
    cartographic.longitude,
    cartographic.latitude,
    newHeight
  )
  // 转回笛卡尔坐标并飞行
  const newPosition = Cesium.Cartesian3.fromRadians(
    newCartographic.longitude,
    newCartographic.latitude,
    newCartographic.height
  );

  viewer?.camera.flyTo({
    destination:newPosition,
    duration: 1
  })

}
//单击回调，设置防抖防止双击有单击事件触发
const seeImage=(item:responseAllImageData)=>{
  //每次点击之前将数据清空防止双击时有图片显示
  imageList.value=[]
  // 点击加一
  checkCount.value++
  // 点击一次，触发图片预览事件
  if(checkCount.value==1){
    timer=setTimeout(()=>{
      imageList.value=imageArr.value?.map(items=>{
        return items.url
      }).filter((element)=>{
        return element==item.url
      })
      previewEnabled.value=true

      checkCount.value=0
    },300)
  }else if(checkCount.value==2){ //点击两次（双击）清除定时器不触发图片预览使事件
    clearTimeout((timer as number))
    checkCount.value=0
  }

}
// 图片双击事件
const closeImage=()=>{
  previewEnabled.value=false
}

const getAllImages=async(id:number)=>{
  const resultImage:responseAllImage=await reqGetAllImage(id)
  if(resultImage.code==200){
    useCesiumPointstore.allImagePointArr=resultImage.data
    imageArr.value=useCesiumPointstore.allImagePointArr
    console.log("imageArr-----------------------\n",imageArr.value);

  }
}

const getOneImages=(pickedFeature:any)=>{
  if(imageArr.value){
    console.log("仓库图片数组",useCesiumPointstore.allImagePointArr);

    imageArr.value=(useCesiumPointstore.allImagePointArr as responseAllImageData[]).filter((item:responseAllImageData)=>{
      if(item.parentpositionid==pickedFeature.id.properties.id.getValue()){
        return item
      }
    })

    //转换笛卡尔坐标为弧度
    const Car3degree=Cesium.Cartographic.fromCartesian(pickedFeature.id.position._value)
    console.log(Car3degree);
    //转换弧度为经纬度
    const lon=Cesium.Math.toDegrees(Car3degree.longitude)
    const lat=Cesium.Math.toDegrees(Car3degree.latitude)
    //储存经纬度
    pointInfoDrawer.coordinates=[lon,lat]

    //储存点击要素的name值
    console.log(pickedFeature.id.name);

    pointInfoDrawer.name=pickedFeature.id.name
    return pointInfoDrawer
  }
}

onMounted(()=>{
  console.log("子组件挂载完毕");

})
defineExpose({ getAllImages,getOneImages });

</script>
<style scoped>
.displayInfo{
    position: absolute;
    top: 12%;
    right: 10px;
    width: 20%;
    height: 80%;
    background-color: rgb(205, 234, 245,0.8);
  }
  .body{
    ul{
      width: 95%;
      height: 80%;
      margin: auto;
      margin-top: 10px;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 5px;
      li{
        width: 45%;
      }
    }
  }
</style>
