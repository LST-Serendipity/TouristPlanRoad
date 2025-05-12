<template>
  <div :class="mode=='vertical'? 'menuVertical right-border-half ':' menuhorizontal bottom-border-half'"  >
    <el-menu
      :mode="mode"
    >
      <el-menu-item index="home" @click="handleClick">
          <el-icon>
            <component is="HomeFilled"></component>
          </el-icon>
          <span>主页</span>
      </el-menu-item>
      <el-menu-item index="map" @click="handleClick">
          <el-icon>
            <component is="MapLocation"></component>
          </el-icon>
          <span>地图</span>
      </el-menu-item>
      <el-menu-item index="stat" @click="handleClick">
          <el-icon>
            <component is="Histogram"></component>
          </el-icon>
          <span>统计</span>
      </el-menu-item>
      <el-menu-item index="more" @click="handleClick">
          <el-icon>
            <component is="Grid"></component>
          </el-icon>
          <span>更多</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang='ts'>
import {useRouter} from 'vue-router';
const $router=useRouter()
defineProps(['mode'])
const handleClick=(index:any)=>{
  $router.push({
    path:index.index
  })
}
</script>

<style scoped >

.menuVertical {
  flex: 15;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 10px;
}
.menuhorizontal {
  flex: 15;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;

}

/* 设置右边框 */
.right-border-half {
    position: relative;
}
.right-border-half::after {
    content: '';
    position: absolute;
    right: 0;
    top: 10%;
    height: 80%;
    width: 1px;
    background-color: #000;
    box-shadow: 1px 1px 2px rgb(106, 105, 105);
}
/* 设置下边框 */
.bottom-border-half {
    position: relative;
}
.bottom-border-half::after {
    content: '';
    position: absolute;
    right: 10%;
    bottom: 0;
    width: 80%;
    height: 1px;
    background-color: #000;
    box-shadow: 1px 1px 2px rgb(106, 105, 105);
}

</style>
