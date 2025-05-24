<template>
    <div id="CesiumRoad"></div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted } from 'vue';
import  *as Cesium  from 'cesium';
import {reqGetRoadList} from "@/api/map/cesiumRoad";
import {reqGetRoad} from '@/api/LineInfo/index'
import type {responseRoad} from '@/api/LineInfo/type'

import axios from 'axios';

const props=defineProps<{
    viewer:Cesium.Viewer
  }>()
const viewer = props.viewer;
console.log("Viewer",viewer);

//加载路径,直接加载
const loadingRoad=async()=>{
  const wfsUrl=
    'http:localhost:8088/geoserver/webgis_1/ows?'+
    'service=WFS&' +
    'version=1.0.0&' +
    'request=GetFeature&' +
    'typeName=webgis_1:roadLevel2_4326&' +
    'outputFormat=application/json&' +
    'srsName=EPSG:4326'

  Cesium.GeoJsonDataSource.load(wfsUrl).then((response)=>{
    console.log("加载成功--------------",response);
    viewer.dataSources.add(response)
  }).catch((error)=>{
    console.log("加载失败",error);
  })


}
//通过axios加载
const axiosGerWfs=async()=>{
  const wfsUrl='/geoserver/webgis_1/ows?'

  const parmas={
    service:"WFS",
    version:"1.0.0",
    request:"GetFeature",
    typeName:"Webgis_1:roadLevel2_4326",
    outputFormat:"application/json",
    srsName:"EPSG:4326",
  }
  axios.get(wfsUrl,{
    params:parmas
  })
    .then((response)=>{
      console.log(response)
      if(response.status==200){
        viewer.dataSources.add(Cesium.GeoJsonDataSource.load(response.data))
      }
    })
    .catch((error=>{
      console.log(error);

    }))
}
//api加载
const loadingRoadWfs=async()=>{
  const wfsParmas={
    service:'WFS',
    version:'1.0.0',
    request:'GetFeature',
    typeName:'webgis_1:road_network',
    outputFormat:'application/json',
    srsName:'EPSG:4326'
  }
  const result=await reqGetRoadList(wfsParmas)
  console.log("result",result);
  try{
    viewer.dataSources.add(Cesium.GeoJsonDataSource.load(result))
  }catch(err){
    console.log("加载失败",err);
  }
}
// 访问后端获取road
const reqGetRoadGeoJSON=async()=>{
  let result:responseRoad = await reqGetRoad()
  console.log(result.data);

  if(result.code==200){
    console.log(result.data);

    try{
      viewer.dataSources.add(Cesium.GeoJsonDataSource.load(result.data))
    }catch(err){
      console.log(err);

    }

  }
}

onMounted(() => {
  // reqGetRoadGeoJSON()
  // loadingRoad()
  loadingRoadWfs()
  // axiosGerWfs()
})



</script>

<style scoped lang='scss'>

</style>
