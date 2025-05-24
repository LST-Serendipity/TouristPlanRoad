import { defineStore } from "pinia";
import { ref } from "vue";
const useCesiumRoadStore = defineStore("cesiumRoad",()=> {
  let road=ref<any>()

  return { road }
})

export default useCesiumRoadStore;
