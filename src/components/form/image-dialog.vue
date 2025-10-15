<template>
  <div class="image-dialog" v-if="showImageViewer">
    <el-image-viewer :hide-on-click-modal="true" :url-list="srcList.map(p=>p.fileUrl)" @close="close" :initial-index="initialIndex" v-if="srcList.length>0"/>
    <div>暂无图片</div>
  </div>
</template>
<script setup>
import {ref} from "vue";
import {getFileListByIdStr} from "@/api/api.file.js";
import {ElMessage, ElLoading} from "element-plus";
import {BASE_URL_IMG} from "@/config/config.js";

const open = (fileIdStr) => {
  loadImages(fileIdStr);
}

defineExpose({
  open
})

const showImageViewer = ref(false);
const initialIndex = ref(0);
const srcList = ref([]);
let loading = null;

function loadImages(fileIdStr) {
  if (!fileIdStr) {
    ElMessage.info("无图片");
    return;
  }
  openFullScreen();
  srcList.value = [];
  getFileListByIdStr(fileIdStr).then(res => {
    if (res.length === 0) {
      ElMessage.info("无图片");
      return;
    }
    srcList.value = res.map(p => ({
      fileId: p.fileId,
      fileName: p.fileName,
      fileUrl: BASE_URL_IMG + "/" + p.fileUrl,
      thumbnailUrl: BASE_URL_IMG + "/" + p.thumbnailUrl,
    }));
    showImg(0);
  }).finally(_ => {
    closeFullScreen();
  })
}


const openFullScreen = () => {
  loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => {
    closeFullScreen();
  }, 20000)
}

const closeFullScreen = () => {
  if (loading) {
    loading.close();
  }
  loading = null;
}

function showImg(index) {
  showImageViewer.value = true;
  initialIndex.value = index;
}

function close() {
  showImageViewer.value = false;
}
</script>
<style lang="less">
.image-dialog {
}
</style>
