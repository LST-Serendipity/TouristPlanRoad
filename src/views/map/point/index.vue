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
      // console.log("点要素geometry",result.features[0].geometry.coordinates);
      Cesium.GeoJsonDataSource.load(result,{
        clampToGround:true,

      }).then((dataSources)=>{
        viewer.dataSources.add(dataSources)
        console.log(dataSources.entities.values[0].position);

        const Entity=dataSources.entities.values
        Entity.forEach((entity)=>{

          if(entity.name=='雷峰塔'){
            entity.billboard=new Cesium.BillboardGraphics({
              image:'public/lft.png',
              scale:0.6
            })

          }
          else{
            entity.billboard=new Cesium.BillboardGraphics({
              image:'public/tubiao.png',
              scale:0.5
            })
          }
          entity.label=new Cesium.LabelGraphics({
            text:entity.name,
            pixelOffset:new Cesium.Cartesian2(0,-30)
          })


        })
      })



    }

  }

  onMounted(()=>{
    console.log("Viewer",viewer);
    loadimgPoint()

  })
</script>

<style scoped>

</style>
