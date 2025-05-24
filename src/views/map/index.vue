<template>

    <el-card  :style="`display: ${cardDisabled};`" :class="deviceType()=='desktop'?'card card_toolsWindows':'card card_toolsmodile'">
      <span>路径规划</span>
      <el-input v-model="pointInfoDrawer.name" size="small" disabled style="margin: 5px 0;"></el-input>
      <el-button @click="planRoad" size="small">去这里</el-button>
    </el-card>
    <div class="map" ref="map">
    </div>

    <!-- 加载道路 -->
    <CesiumRouter v-if="viewer" :viewer="viewer"></CesiumRouter>
    <!-- 加载点 -->
    <CesiumPoint v-if="viewer" :viewer="viewer"></CesiumPoint>
    <!-- 加载3dtileset -->
    <CesiumTileset v-if="viewer" :viewer="viewer"></CesiumTileset>
    <!-- <el-drawer v-model="drawer" title="I am the title" :with-header="false">
       <template #header>
        <span>景点信息</span>
       </template>
       <template #default>
        <div>
          <span>景点名称：{{pointInfoDrawer.name}}</span>
        </div>
        <el-button @click="planRoad">去这里</el-button>
       </template>
    </el-drawer> -->

</template>

<script setup lang='ts'>
import { ref, onMounted,onUnmounted } from 'vue';
import *as Cesium from 'cesium'
import { Cartesian3,Terrain } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css'
import {reqPlanRoad} from '@/api/LineInfo/index'
import type {planRoadParmas} from '@/api/LineInfo/type'

import CesiumRouter from './road/index.vue'
import CesiumPoint from './point/index.vue'
import CesiumTileset from './3dTileset/index.vue'

import {deviceType} from '@/utils/calType'


// 类型定义
interface BuildingInfo {
  batchId: string
}
//密钥
Cesium.Ion.defaultAccessToken =import.meta.env.VITE_CESIUM_KEY
//实例化地图
const map=ref()
let viewer=ref<Cesium.Viewer>()
// 选中的建筑信息
const selectedBuilding=ref<BuildingInfo|null>(null)
// 选中的建筑的颜色
const selectColor=ref<{
  feature:Cesium.Cesium3DTileFeature|null,
  originalColor:Cesium.Color|null}>({
  feature:null,
  originalColor:null
})
//弹窗元素
let nameOverlay=ref<HTMLElement|null>(null)
// 定义一个名为 drawer 的响应式变量，初始值为 false
let drawer=ref<boolean>(false)
//存储点数据的信息弹窗
let pointInfoDrawer=ref<{
  name:string,
  coordinates:[number,number]|null

}>({
  name:'',
  coordinates:null

})
//储存道路规划信息
let planRoadLayer=ref()
//地图路径规划卡片
const cardDisabled=ref<string>('none')

// 初始化cesium的viewer
const initViewer=()=>{
  viewer.value=new Cesium.Viewer(map.value,{
    baseLayerPicker: false,
    // 关闭cesium的logo
    infoBox: false,
    // 关闭cesium的动画和时间轴
    animation: false,
    timeline: false,
    geocoder:false,
    homeButton:false,
    navigationHelpButton:false,
    sceneModePicker:false,

    terrain:Terrain.fromWorldTerrain(),

  }),
  (viewer.value.cesiumWidget.creditContainer as any).style.display='none'
}
//配置天地图矢量图层
const tdtVecLayer=new Cesium.WebMapTileServiceImageryProvider({
  url: "http://t{s}.tianditu.gov.cn/img_w/wmts?tk="+import.meta.env.VITE_TDT_KEY,
  layer: "vec",
  style: "default",
  format: "image/jpeg",
  tileMatrixSetID: "w",
  subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"], // 负载均衡子域
  maximumLevel: 18, // 最大缩放级别
  tilingScheme: new Cesium.WebMercatorTilingScheme(),

})
//配置天地图注记图层
const tdtCvaLayer=new Cesium.WebMapTileServiceImageryProvider({
  url: "http://t{s}.tianditu.gov.cn/cva_w/wmts?tk="+import.meta.env.VITE_TDT_KEY,
  layer: "cva",
  style: "default",
  format: "image/jpeg",
  tileMatrixSetID: "w",
  subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"], // 负载均衡子域
  maximumLevel: 18, // 最大缩放级别
  tilingScheme: new Cesium.WebMercatorTilingScheme(),

})
//设置模型要素的鼠标左键点击事件
const setupClickHandler=()=>{
  // 判断是否有viewer实例
  if(!viewer.value){
    return
  }
  //监听 HTML canvas 上的各种屏幕空间事件，例如鼠标移动、点击、双击等。
  const handler=new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas)

  handler.setInputAction(async (click: Cesium.ScreenSpaceEventHandler.PositionedEvent)=>{
    //路径规划卡片隐藏
    cardDisabled.value='none'
    const pickedFeature=(viewer.value as Cesium.Viewer).scene.pick(click.position)
    console.log("pickedFeature",pickedFeature);
    if(pickedFeature.id instanceof Cesium.Entity){
      console.log(pickedFeature.id.position);
      console.log(pickedFeature.id.polyline);
      //判断点击要素为景区点要素
      if(pickedFeature.id.position){
        //路径规划卡片显示
        cardDisabled.value='block'
        console.log(pickedFeature.id.position._value);
        //转换笛卡尔坐标为弧度
        const Car3degree=Cesium.Cartographic.fromCartesian(pickedFeature.id.position._value)
        console.log(Car3degree);
        //转换弧度为经纬度
        const lon=Cesium.Math.toDegrees(Car3degree.longitude)
        const lat=Cesium.Math.toDegrees(Car3degree.latitude)
        //储存经纬度
        pointInfoDrawer.value.coordinates=[lon,lat]
        drawer.value=true
        //储存点击要素的name值
        pointInfoDrawer.value.name=pickedFeature.id.name

      }
    }
    // 判断是否为 Cesium3DTileFeature
    console.log("判断是否为 Cesium3DTileFeature",pickedFeature instanceof Cesium.Cesium3DTileFeature);
    if (!Cesium.defined(pickedFeature)) {
      console.log("未拾取到要素");
    }
    // 调用验证拾取要素有效性的函数，判断是否为有效的 Cesium3DTileFeature
    if (isValidFeature(pickedFeature)) {
      // 处理有效的 Cesium3DTileFeature，调用 processBuildingClick 函数
      await processBuildingClick(pickedFeature)
    }else{
      // 处理无效的 Cesium3DTileFeature
      clearHeightBuilding()
    }
  },Cesium.ScreenSpaceEventType.LEFT_CLICK)
}
//鼠标移动事件
const setupMouseMoveHandler=()=>{
  // 判断是否有viewer实例
  if(!viewer.value){
    return
  }
  //监听 HTML canvas 上的各种屏幕空间事件，鼠标移动
  viewer.value.screenSpaceEventHandler.setInputAction((movement: any)=>{
    // 获取鼠标在屏幕上的位置对应的要素
    const pickedFeature=viewer.value.scene.pick(movement.endPosition)
    // 判断是否为 Cesium3DTileFeature
    if(!Cesium.defined(pickedFeature)){
      // 不为Cesium3DTileFeature类型就隐藏浮层
      (nameOverlay.value as HTMLElement).style.display="none"
      return
    }
    // 调用浮层显示函数，更新浮层位置

    if(pickedFeature instanceof Cesium.Cesium3DTileFeature){
      updateNameOverlay(pickedFeature,movement.endPosition)
    }



  },Cesium.ScreenSpaceEventType.MOUSE_MOVE)

}
// 右键获取点击位置
const setupRightClickHandler=()=>{
  const handlerRight= new Cesium.ScreenSpaceEventHandler(viewer.value?.canvas)
  handlerRight.setInputAction((event:Cesium.ScreenSpaceEventHandler.PositionedEvent)=>{
    const pickCoor=viewer.value?.scene.pickPosition(event.position)
    console.log("笛卡尔坐标值",pickCoor);
    const pickRadius=Cesium.Cartographic.fromCartesian(pickCoor as Cartesian3)
    console.log("弧度值",pickRadius);
    const lon=Cesium.Math.toDegrees(pickRadius.longitude)
    const lat=Cesium.Math.toDegrees(pickRadius.latitude)
    console.log("经纬度：",[lon,lat]);

  },Cesium.ScreenSpaceEventType.RIGHT_CLICK)
}

// 验证拾取要素有效性
const isValidFeature = (feature: any): feature is Cesium.Cesium3DTileFeature => {
  return feature instanceof Cesium.Cesium3DTileFeature
}

// 创建一个浮层元素，用于显示建筑的BIN编号
const createdom=()=>{
  // 创建信息浮层（显示建筑BIN编号）
  nameOverlay.value= document.createElement("div")
  console.log("nameOverlay.value",nameOverlay.value);

  viewer.value.container.appendChild(nameOverlay.value); // 添加至Viewer容器
  // 添加至Viewer容器
  nameOverlay.value.className = "backdrop";
  nameOverlay.value.style.display = "none";
  nameOverlay.value.style.position = "absolute";
  nameOverlay.value.style.bottom = "0";
  nameOverlay.value.style.left = "0";
  nameOverlay.value.style["pointer-events"] = "none";
  nameOverlay.value.style.padding = "4px";
  nameOverlay.value.style.backgroundColor = "RGB(89, 203, 232,0.6)";

}
// 监听鼠标移动事件，动态更新浮层位置
function updateNameOverlay(pickedFeature: Cesium.Cesium3DTileFeature, position: Cesium.Cartesian2) {
  // 判断是否为 Cesium3DTileFeature
  if (!Cesium.defined(pickedFeature)) {
    // 不为Cesium3DTileFeature类型就隐藏浮层
    (nameOverlay.value as HTMLElement).style.display = "none";
    return;
  }
  // 设置浮层位置（屏幕坐标系）
  (nameOverlay.value as HTMLElement).style.display = "block";
  (nameOverlay.value as HTMLElement).style.bottom = `${viewer.value.canvas.clientHeight - position.y}px`;
  (nameOverlay.value as HTMLElement).style.left = `${position.x}px`;
  (nameOverlay.value as HTMLElement).textContent = pickedFeature._batchId; // 显示BIN编号
}
// 处理建筑点击
const processBuildingClick = async (feature: any) => {
  // 获取建筑属性
  const properties = await feature.getPropertyIds()
  console.log("feature-----------------",feature._batchId);

  // 更新选中建筑信息
  selectedBuilding.value = {
    batchId:feature._batchId
  }
  console.log("---------------------",selectedBuilding.value);
  // 处理建筑点击事件
  if (feature) {
    // 调用处理模型点击的函数
    heightBuilding(feature)
  }
}
// 处理模型点击
const heightBuilding=(feature:Cesium.Cesium3DTileFeature)=>{
  // 清除前一个样式颜色
  clearHeightBuilding()
  // 判断有没有上一个选中的建筑
  if(selectColor.value.feature){
    // 有就恢复原来的颜色
    selectColor.value.feature.color=(selectColor.value.originalColor as Cesium.Color).clone()
  }
  // 将当前选中的建筑颜色赋值给selectColor的originalColor属性
  const currentColor=feature.color
  //更新selectColor的feature属性为当前选中的建筑，originalColor属性为当前选中的建筑的颜色
  selectColor.value={
    feature:feature,
    originalColor:currentColor instanceof Cesium.Color?currentColor.clone():null
  }
  // 设置当前选中建筑的颜色为红色
  feature.color=Cesium.Color.RED.withAlpha(0.5)

}
// 清除样式
const clearHeightBuilding=()=>{
  // 清除颜色
  //判断是否有要素和原始颜色
  if (selectColor.value.feature) {
    // 有就恢复原来的颜色
    selectColor.value.feature.color=(selectColor.value.originalColor as Cesium.Color).clone()
    // 重置selectColor属性为初始值
    selectColor.value={
      feature:null,
      originalColor:null
    }
  }
  // 重置选中建筑信息
  selectedBuilding.value = null
}
//抽屉规划路线点击按钮回调
const planRoad=async()=>{
  if(pointInfoDrawer.value.coordinates){
    //发送请求获取路径
    const startLon=120.14113572580173
    const startLat=30.231869014719596
    const endLon=pointInfoDrawer.value.coordinates[0]
    const endLat=pointInfoDrawer.value.coordinates[1]
    const params:planRoadParmas={
      startLon:startLon,
      startLat:startLat,
      endLon:endLon,
      endLat:endLat
    }
    let result:any=await reqPlanRoad(params)
    if(result.code==200){
      if(planRoadLayer.value){
        viewer.value?.dataSources.remove(planRoadLayer.value)
      }
      console.log(result.data.planRoadGeoJSON);
      try{
        //加载获得的geojson数据
        planRoadLayer.value=await viewer.value?.dataSources.add(Cesium.GeoJsonDataSource.load(result.data.planRoadGeoJSON,{
          stroke:Cesium.Color.RED,
          strokeWidth:10,
          clampToGround:true,

        }))
        viewer.value?.camera.flyTo({
          destination:Cesium.Cartesian3.fromDegrees(params.startLon,params.endLat,500),

        })

        console.log("已规划路线");

        drawer.value=false

      }catch(err){
        console.log(err);

      }
    }

  }

}

//组件挂载后加载地图
onMounted(async()=>{
  initViewer();

  (viewer.value as Cesium.Viewer).scene.debugShowFramesPerSecond = true; // 显示 FPS
  (viewer.value as Cesium.Viewer).scene.postProcessStages.fxaa.enabled = false; // 开启抗锯齿
  // viewer.value.scene.globe.enableLighting=false
  (viewer.value as Cesium.Viewer).resolutionScale = Math.min(1.0, window.devicePixelRatio);

  //添加天地图矢量图层
  // (viewer.value as Cesium.Viewer).imageryLayers.addImageryProvider(tdtVecLayer);
  //添加天地图注记图层
  (viewer.value as Cesium.Viewer).imageryLayers.addImageryProvider(tdtCvaLayer);



  createdom()
  try{
    // 设置模型的鼠标左键点击事件
    setupClickHandler()
    // 设置鼠标移动事件
    setupMouseMoveHandler()
    //鼠标右键点击事件
    setupRightClickHandler()
  }catch(err){
    console.log("加载失败",err);

  }

  // 飞到指定位置
  (viewer.value as Cesium.Viewer).camera.flyTo({
    destination:Cartesian3.fromDegrees(120.1317, 30.2108,1000),
    orientation: {
      heading: Cesium.Math.toRadians(1), // 朝向
      pitch: Cesium.Math.toRadians(-15), // 俯视角
      roll: 0
    },
    duration: 3 // 飞行时间（秒）
  })

})

// 新增卸载处理
onUnmounted(() => {
  if (viewer.value && !viewer.value.isDestroyed()) {
    viewer.value.destroy();
    console.log('Cesium 实例已销毁');
  }
});

defineExpose({
  viewer
})
</script>

<style scoped>

  .card {
    position:absolute;
    display: none;
    z-index: 10;
    text-align: center;
    font-size: 15px;
    background-color: rgb(246, 243, 243,0.8);
  }
  .card_toolsWindows{
    top: 5px;
    left:10%;
    width: 10%;
    height: 20%;
  }
  .card_toolsmodile{
    top: 10%;
    left: 2px;
    width: 30%;
    height: 15%;
  }

  .map{
    width: 100%;
    height: 100%;

  }


</style>
