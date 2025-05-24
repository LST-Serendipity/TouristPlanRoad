<template>
    <div>
      <el-drawer v-model="drawer" title="I am the title" :with-header="false">
        <span>Hi there!</span>
      </el-drawer>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'

const prop=defineProps({
  drawer:Boolean
})
// 定义一个名为 drawer 的响应式变量，初始值为 false
const drawer = ref<boolean>(prop.drawer)


</script>

<style scoped lang='scss'>

</style>
