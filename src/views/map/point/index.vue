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
  const customsvg="M798.4 842.4H212c-19.2 0-34.4 15.2-34.4 34.4s15.2 34.4 34.4 34.4h586.4c19.2 0 34.4-15.2 34.4-34.4s-15.2-34.4-34.4-34.4zM947.2 652.8l-54.4-72c8-2.4 14.4-6.4 19.2-13.6 35.2-48.8 54.4-106.4 53.6-167.2 0-158.4-129.6-287.2-288-287.2-108.8 0.8-208.8 63.2-256.8 160.8l-32.8-45.6c-5.6-7.2-13.6-12.8-22.4-14.4-8.8-1.6-18.4 0.8-25.6 5.6-4 2.4-7.2 5.6-9.6 9.6L64 655.2c-4.8 8-6.4 16.8-4 26.4 2.4 8.8 7.2 16.8 15.2 21.6s16.8 6.4 26.4 4c8.8-2.4 16.8-7.2 21.6-15.2l239.2-382.4L598.4 640c6.4 8.8 16 13.6 26.4 14.4 10.4 0.8 20.8-4 28-12l105.6-126.4 133.6 177.6c5.6 7.2 13.6 12.8 22.4 13.6 1.6 0 4 0.8 5.6 0.8 7.2 0 14.4-2.4 20-6.4 7.2-5.6 12.8-13.6 13.6-22.4 1.6-8.8-0.8-18.4-6.4-26.4 0 0.8 0 0 0 0zM878.4 736H132c-9.6 0-17.6 3.2-24.8 9.6-6.4 6.4-10.4 15.2-10.4 24 0 9.6 3.2 17.6 9.6 24.8 6.4 6.4 15.2 10.4 24 10.4H877.6c9.6 0 17.6-4 24-10.4s9.6-15.2 9.6-24.8c0.8-18.4-13.6-33.6-32.8-33.6z"
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
      console.log("点要素ggeometry",result.features[0].geometry.coordinates);
      Cesium.GeoJsonDataSource.load(result,{
        clampToGround:true
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
