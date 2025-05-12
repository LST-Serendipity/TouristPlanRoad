<template>
  <div class="logo">
    <img class="Logoimage" :src="LogoImage" alt="logo">
  </div>

</template>

<script setup lang='ts'>
import LogoImage from '@/assets/logo/logo.png'
defineProps(['mode'])

</script>

<style scoped >
.logo {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .Logoimage{
    height: 50%;
  }

}
</style>
