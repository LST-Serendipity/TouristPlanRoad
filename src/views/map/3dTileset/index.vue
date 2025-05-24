<template>
    <div class="CesiumTileset"></div>
</template>

<script setup lang='ts'>
import { ref,onMounted } from 'vue';
import *as Cesium from 'cesium'
const props=defineProps<{
  viewer:Cesium.Viewer}>()

const viewer=ref<Cesium.Viewer|null>(null)
onMounted(async()=>{
    viewer.value=props.viewer
    console.log("CesiumTileset",viewer.value);
      // 添加cesiumion资源
    const tileset=await Cesium.Cesium3DTileset.fromIonAssetId(import.meta.env.VITE_CESIUM_MODEL	);
    viewer.value.scene.primitives.add(tileset);
    await tileset.readyPromise
    console.log("加载完成");

    // 控制细节级别，值越小越精细
    tileset.maximumScreenSpaceError=50
    tileset.preloadWhenHidden=true

})
</script>

<style scoped>

</style>
