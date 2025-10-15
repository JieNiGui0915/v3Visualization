<template>
  <div class="my-image" :style="props.imgStyle">
    <img class="my-image-img" :src="path" v-for="(path,index) in srcList.map(p=>p.thumbnailUrl)" :key="path" :alt="path" @click="showImg(index)">
  </div>
  <el-image-viewer v-if="showImageViewer" :hide-on-click-modal="true" :url-list="srcList.map(p=>p.fileUrl)" @close="close" :initial-index="initialIndex"/>
</template>
<script setup>
import {BASE_URL_IMG} from "@/config/config";
import {ref, watch} from "vue";

const props = defineProps({
  /**
   {
   "id": 2776,
   "name": "mp-20241218130256-0.jpg",
   "fileUrl": "resource/public/upload/20241218/d6ekaofkq4rgoehsmn.jpg",
   "thumbnailUrl": "resource/public/upload/20241218/d6ekaofkq4rgoehsmn_thumb.jpg"
   }
   */
  srcList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  imgClass: {
    type: String,
    default: ""
  },
  imgStyle: {
    type: String,
    default: null
  }
})

const showImageViewer = ref(false);
const initialIndex = ref(0);
const srcList = ref([]);
watch(props.srcList, (val = []) => {
  if (val.length === 0) {
    srcList.value = [];
  } else {
    srcList.value = val.map(p => ({
      fileUrl: BASE_URL_IMG + "/" + p.fileUrl,
      thumbnailUrl: BASE_URL_IMG + "/" + p.thumbnailUrl,
    }));
  }
}, {
  immediate: true
})

function showImg(index) {
  showImageViewer.value = true;
  initialIndex.value = index;
}

function close() {
  showImageViewer.value = false;
}
</script>
<style lang="less">
.my-image {
  display: flex;

  .my-image-img {
    cursor: pointer;
    height: auto;
    margin-right: 5px;
  }
}
</style>
