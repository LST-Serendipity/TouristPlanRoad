<template>
  <div class="countainer">
    <div class="box">
      <h1>西湖景区</h1>
      <el-carousel :interval="4000" type="card" height="180px">
        <el-carousel-item v-for="item in PictureUrlArr" :key="item">
          <img :src="item" alt="">
        </el-carousel-item>
      </el-carousel>
      <hr class="hr">
    </div>
    <!-- 卡片 -->
    <div  class="countainerButton">
      <el-scrollbar style="margin: auto; width: 50%; flex: 1;">
        <div class="scrollbar_demo">
          <div @click="cliskInfo(item)" v-for="item in PointInfo" :key="item.id" class="scrollbar_item" >
            <img :src="item.url" alt="">
            <span>{{ item.name }}</span>
          </div>

        </div>
      </el-scrollbar>
      <div class="boxright">

      </div>
    </div>

  </div>

  <!-- 弹出框 -->
  <el-dialog v-model="centerDialogVisible" title="Warning" style="width: 60%;" center>
    <template #header>
      <p>详细信息</p>
    </template>
    <template #default>
      <div>
        <h4>{{  dialogInfo?.name}}</h4>
        <p>{{ dialogInfo?.description }}</p>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <!-- <el-button @click="centerDialogVisible = false">Cancel</el-button> -->
        <el-button type="primary" @click="centerDialogVisible = false">
          关闭
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import type {PointTouristInfo} from '@/api/PointInfo/type'
import { reqGetPointTouristInfo } from '@/api/PointInfo';
import { onMounted } from 'vue';

let PictureUrlArr=ref<string[]>()
PictureUrlArr.value=[
  'https://img-baofun.zhhainiao.com/fs/ac928e2cdfb6cb06217d5e695de506fe.jpg',
  'https://hzyly.com/upload/201908/26/201908261930373237.jpg',
  'https://p1.ssl.qhmsg.com/t01e3331ab00aba185b.jpg'
]
// 定义一个名为 centerDialogVisible 的响应式变量，初始值为 false,用于弹出框
let centerDialogVisible=ref<boolean>(false)
//存储景点信息
let PointInfo=ref<PointTouristInfo[]>()
//存储对话框信息
let dialogInfo=ref<PointTouristInfo>()

const cliskInfo=(item:PointTouristInfo)=>{
  centerDialogVisible.value=true
  dialogInfo.value=item
}
//发送请求获取景区点信息
const getInfo=async()=>{
  let result=await reqGetPointTouristInfo()
  console.log(result);

  if(result.code==200){
    PointInfo.value=result.data
  }

}
onMounted(()=>{
  getInfo()
})

</script>

<style scoped>
.countainer{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

}
.box {
  flex: 1;
  width: 60%;
  margin: 0 auto;
  margin-top:20px ;
  h1{
    text-align: center;
  }
  img{
    width: 100%;
    height: 100%;
  }

}
.hr{
  width: 80%;
  height: 2px;
  margin: 0 auto;
  margin-top: 20px;
  background-color: black;

  box-shadow: 0px 1px 10px rgb(142, 141, 141);
}
.countainerButton{
  flex: 2;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  padding: 5px;
  gap: 5px;
}
.scrollbar_demo{

  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;

}
.scrollbar_item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 180px;
  width: 130px;
  margin: 10px;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgb(150, 149, 149);

  img{
    width: 100%;
    height: 90%;
    border-radius: 10px;
  }
  span{
    height: 10%;
    margin-bottom: 2px;
  }
}
.scrollbar_item:hover{
  cursor: pointer;
  box-shadow: 0px 4px 8px rgb(150, 149, 149);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.boxright{
  flex: 1;
}

</style>
