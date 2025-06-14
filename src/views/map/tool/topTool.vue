<template>
    <el-card class="tool" style="width: 90%;height: 8%;" shadow="hover">
      <ul class="toolul">
        <li>
          <!-- 路径规划下拉框 -->
          <el-dropdown placement="bottom">
            <el-button >
              路径规划<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="planCusRoad(1,'自选点')">自选点</el-dropdown-item>
                  <el-dropdown-item @click="planCusRoad(2,'依经纬度')">依经纬度</el-dropdown-item>
                  <el-dropdown-item @click="planCusRoad(3,'依自身位置')">依自身位置</el-dropdown-item>
                </el-dropdown-menu>
              </template>

          </el-dropdown>
        </li>
        <li><el-button >景点预览</el-button></li>
        <li><el-button >路线图</el-button></li>
      </ul>
    </el-card>
    <!-- 路径规划卡片 -->
    <el-card  class="cardTool" :style="`display: ${cardDisabledTool};`"  >
      <span style="font-size: 12px;">{{planTypeName  }}</span>
      <div class="box">
        <el-input v-model="startPosition" size="small" :disabled="btnVisible1" style="margin: 5px 0;"></el-input>
        <el-button size="small" @click="PointClick('start')" v-show="btnVisible1">选点</el-button>
      </div>
      <div class="box">
        <el-input v-model="endPosition" size="small" :disabled="btnVisible2" style="margin: 5px 0;"></el-input>
        <el-button size="small" @click="PointClick('end')" v-show="btnVisible2">选点</el-button>
      </div>
      <div class="box">
        <el-button @click="planToolRoad" size="small" >确定</el-button>
        <el-button @click="cancelToolPlan" size="small">取消</el-button>
      </div>
    </el-card>
</template>

<script setup lang='ts'>
import *as Cesium from 'cesium'
import { ref } from 'vue';
import type {planRoadParmas} from '@/api/LineInfo/type'
import {reqPlanRoad} from '@/api/LineInfo/index'
import { ElMessage } from 'element-plus';

  const prop=defineProps<{viewer:Cesium.Viewer}>()
  const viewer=prop.viewer
  console.log(viewer);

  // 起始位置
  let startPosition=ref<number[]>()
  // 终点位置
  let endPosition=ref<number[]>()
  // 起始点实体
  let startpoint=ref<Cesium.Entity|null>(null)
  // 终点实体
  let endpoint=ref<Cesium.Entity|null>(null)
  //Geojson加载的实例
  let planCusRoadLayer=ref()
  //卡片显隐
  let cardDisabledTool=ref<string>('none')
  //点击事件实例
  let handlerRight:Cesium.ScreenSpaceEventHandler|null
  let btnVisible1=ref<boolean>()
  let btnVisible2=ref<boolean>()
  let planTypeName=ref<string>()
  // 右键获取点击位置
  const setupRightClickHandler=(flag:string)=>{
    if(handlerRight) {
      handlerRight.destroy(); // 彻底销毁处理器
      handlerRight = null;    // 重置引用
    }
    handlerRight= new Cesium.ScreenSpaceEventHandler(viewer?.scene?.canvas)
    console.log(handlerRight);

    handlerRight.setInputAction((event:Cesium.ScreenSpaceEventHandler.PositionedEvent)=>{

      const pickedFeature=(viewer as Cesium.Viewer).scene?.pick(event.position)
      console.log(pickedFeature);
      if(pickedFeature.id instanceof Cesium.Entity){
        if(pickedFeature.id.position||pickedFeature.id.polyline){
          const pickCoor=viewer?.scene?.pickPosition(event.position)
          // console.log("笛卡尔坐标值",pickCoor);
          const pickRadius=Cesium.Cartographic.fromCartesian(pickCoor as Cesium.Cartesian3)
          // console.log("弧度值",pickRadius);
          const lon=Cesium.Math.toDegrees(pickRadius.longitude)
          const lat=Cesium.Math.toDegrees(pickRadius.latitude)
          // console.log("经纬度：",[lon,lat]);

          // 起始点
          if(flag==='start'){
            console.log(123);
            if(startpoint.value){
              viewer.entities.remove(startpoint.value)
            }
            startPosition.value=[lon,lat]
            startpoint.value=viewer.entities.add({
              position:Cesium.Cartesian3.fromDegrees(startPosition.value[0],startPosition.value[1],0),
              point:{
                color:Cesium.Color.RED,
                pixelSize:20,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
              },
              label:{
                pixelOffset:new Cesium.Cartesian2(0,-30),
                scale:0.6,
                text:'起始点',
                fillColor:Cesium.Color.YELLOW,
                heightReference :Cesium.HeightReference.CLAMP_TO_GROUND
              }
            })
            console.log("起始点\n",startpoint.value);

          }
          // 终点
          if(flag==='end'){
            console.log(456);

            if(endpoint.value){
              viewer.entities.remove(endpoint.value)
            }
            endPosition.value=[lon,lat]
            endpoint.value=viewer.entities.add({
              position:Cesium.Cartesian3.fromDegrees(endPosition.value[0],endPosition.value[1],0),
              point:{
                color:Cesium.Color.RED,
                pixelSize:20,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
              },
              label:{
                pixelOffset:new Cesium.Cartesian2(0,-30),
                scale:0.6,
                text:'终点',
                fillColor:Cesium.Color.SKYBLUE,
                heightReference :Cesium.HeightReference.CLAMP_TO_GROUND
              }
            })

            console.log("终点\n",endpoint.value);
          }
        }
      }


    },Cesium.ScreenSpaceEventType.RIGHT_CLICK)

  }
  // 路径规划按钮点击事件回调
  const planCusRoad=(num:number,name:string)=>{
    startPosition.value=[]
    endPosition.value=[]
    planTypeName.value=name
    if(num==1){
      cardDisabledTool.value='block'
      btnVisible1.value=true
      btnVisible2.value=true
    }
    if(num==2){
      cardDisabledTool.value='block'
      btnVisible1.value=false
      btnVisible2.value=false
    }
    if(num==3){
      cardDisabledTool.value='block'
      btnVisible1.value=false
      btnVisible2.value=true
    }
  }
  // 两个选点点击按钮回调
  const PointClick=(flag:string)=>{

    if(viewer){
      if(flag==='start'){
        setupRightClickHandler('start')
      }
      if(flag==='end'){
        setupRightClickHandler('end')
      }
    }else{
      ElMessage({
        type:'error',
        message:'场景未加载完成'
      })
    }

  }
  //规划路径确定按钮点击回调
  const planToolRoad=async ()=>{
    console.log("起始点\n",startPosition.value);
    console.log("终点\n",endPosition.value);

    if(startPosition.value&&endPosition.value){
      const params:planRoadParmas={
        startLon:(startPosition.value as number[])[0],
        startLat:(startPosition.value as number[])[1],
        endLon:(endPosition.value as number[])[0],
        endLat:(endPosition.value as number[])[1]
      }
      let result:any=await reqPlanRoad(params)
      if(result.code==200){
        if(planCusRoadLayer.value){
          viewer?.dataSources.remove(planCusRoadLayer.value)
        }
        console.log(result.data.planRoadGeoJSON);
        //加载获得的路径规划geojson数据
        planCusRoadLayer.value=await viewer?.dataSources.add(Cesium.GeoJsonDataSource.load(result.data.planRoadGeoJSON,{
          stroke:Cesium.Color.RED,
          strokeWidth:10,
          clampToGround:true,
        }))
        ElMessage({
          type:'success',
          message:'已规划路线'
        })
        // console.log("已规划路线");
      }
    }else{
      ElMessage({
        type:'error',
        message:'请先选择位置'
      })
    }

  }
  // 取消按钮点击回调
  const cancelToolPlan=()=>{
    if(handlerRight) {
      handlerRight.destroy(); // 彻底销毁处理器
      handlerRight = null;    // 重置引用
    }
    if(startpoint.value){
      viewer.entities.remove(startpoint.value)
    }
    if(endpoint.value){
      viewer.entities.remove(endpoint.value)
    }
    if(planCusRoadLayer){
      viewer?.dataSources.remove(planCusRoadLayer.value)
    }
    startPosition.value=[]
    endPosition.value=[]
    cardDisabledTool.value='none'
  }

</script>

<style scoped>
  .tool{
    position: absolute;
    z-index: 10;
    margin-left:1% ;
    margin-top: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(239, 235, 235,0.8);
    .toolul{
      width: 100%;
      height: 90%;
      margin: auto;
      list-style: none;
      display: flex;
      gap: 10px;
      justify-content: center;
      align-items: center;
    }
  }
.cardTool{
  position: absolute;
  top: 40%;
  left: 10%;
  width: 12%;

  overflow-y: auto;
  z-index: 10;
  .box{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2px;
  }
}
</style>
