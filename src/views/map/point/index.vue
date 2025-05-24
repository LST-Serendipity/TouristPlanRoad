<template>
    <div id="CesiumPoint"></div>
</template>

<script setup lang='ts'>
  import { defined } from 'cesium';
  import *as Cesium from 'cesium'
  import { onMounted } from 'vue';
  import { reqGetRoadList } from '@/api/map/cesiumRoad';

  //定义props，从父组件接收viewer
  const porps=defineProps<{viewer:Cesium.Viewer}>()
  //定义viewer，从父组件接收
  const viewer=porps.viewer;
  //组件挂载后加载
  //发送请求获取点要素WFS
  const loadimgPoint=async()=>{
    //请求参数
    const wfsParmas={
      service:"WFS",
      version:"1.0.0",
      request:"GetFeature",
      typeName:"webgis_1:xihu_Point",
      outputFormat:"application/json",
      srsName:"EPSG:4326",
    }
    const result=await reqGetRoadList(wfsParmas)
    if(result){
      console.log("点要素",result);
      viewer.dataSources.add(Cesium.GeoJsonDataSource.load(result))
    }

  }

  onMounted(()=>{
    console.log("Viewer",viewer);
    loadimgPoint()

  })
</script>

<style scoped>

</style>
