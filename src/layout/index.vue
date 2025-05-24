<template>
  <div :class="deviceType()=='desktop'?'layout':'layoutMobile'">
       <!-- 展示功能组件 -->
      <div :class="deviceType()=='desktop'?'Top':'TopMobile'" >
        <Logo :mode="mode"></Logo>
        <Menu :mode="mode"></Menu>
      </div>

      <!-- 展示地图 -->
      <div class="Bottom" >
        <Top></Top>
      </div>
    </div>
</template>

<script setup lang='ts'>

  import { ref } from 'vue';
import Top from './Bottom/index.vue';
  import Logo from './Top/Logo.vue';
  import Menu from './Top/Menu.vue';
  //hjuo
  let mode=ref<any>()

  // 计算宽高，用于判断设备类型
  const deviceType=()=>{
    if(window.innerWidth<768){
      return 'mobile'
    }
    if(window.innerWidth<1024){
      return 'tablet'
    }
    return 'desktop'
  }
  mode.value=(deviceType()=='desktop'?'vertical':'horizontal')
  console.log(mode.value);

</script>
<script lang="ts">
export default {
  name: 'layout',
}
</script>
<style scoped >
/* desktop设备 */
.layout {
  display: flex;
  height: 100vh;
  width: 100%;
  .Top {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .Bottom {
    flex: 15;
    height: 100%;
  }
}
/* mobile或tablet设备 */
.layoutMobile {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  .TopMobile {
    flex: 1;
    display: flex;
    flex-direction: row;
  }
  .Bottom {
    flex: 15;
    height: 80%;
    box-sizing: border-box;
  }

}
</style>
