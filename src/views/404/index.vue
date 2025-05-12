<template>
  <div class="box">
    <el-empty description="404 页面不存在" />
    <el-button type="default" @click="goHome" class="btn">返回首页</el-button>
  </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome=()=>{
  router.push('/')
}



</script>

<style scoped>
.box{
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .btn{
   width: 200px;
   margin: 0 auto;
 }
}
</style>
