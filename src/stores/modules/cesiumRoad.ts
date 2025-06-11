import { defineStore } from "pinia";
import { ref } from "vue";
const useCesiumRoadStore = defineStore("cesiumRoad",()=> {
  let planroad=ref<[number,number][]>()

  return { planroad }
})

export default useCesiumRoadStore;
