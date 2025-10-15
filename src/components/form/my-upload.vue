<template>
  <el-upload v-model:file-list="fileList" class="my-upload" :show-file-list="true" drag accept="image/*"
    :action="BASE_URL + uploadUrl" :headers="uploadHeaders" list-type="picture-card" :on-remove="handleRemove"
    :data="data" :on-preview="handlePictureCardPreview" :before-upload="uploadBefore" :on-success="uploadFileSuccess"
    :on-error="uploadFileError" :disabled="justShow" ref="myUploadRef" :id="myUploadId" :limit="limit"
    :on-exceed="handleExceed">
    <template #default>
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        拖拽文件到这里或<em>点击上传</em>
        <div>仅支持上传图片</div>
      </div>
    </template>
  </el-upload>
  <el-image-viewer v-if="showImageViewer" :hide-on-click-modal="true" :url-list="fileList.map(p => p.url)"
    @close="closeImage" :initial-index="initialIndex" />
</template>
<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
import { nextTick, onMounted, ref, useId, useTemplateRef, watch } from "vue";
import { ElLoading, ElMessage, ElNotification } from "element-plus";
import { GlobalStore } from "@/store";
import { getFileListByIdStr } from "@/api/api.file.js";
import { BASE_URL_IMG, BASE_URL } from "@/config/config";

let globalStore = GlobalStore();
const uploadUrl = ref("");
const uploadHeaders = ref({ "Authorization": "Bearer " + globalStore.token });
const exportLoading = ref(false);
let emit = defineEmits(["success", "uploading"]);
let loading = null;
const myUploadId = useId();
const data = ref({
  folder: "",
  isDateFolder: false, // 是否按日期分文件夹
  isThumbnail: true, // 是否生成缩略图
})
/*
fileList =
[{
 name: 'food.jpeg',
 url: 'https://fuss10.elemecdn.com/a.png',
 data: {
        "fileId": "A1917139378090676224",
        "fileName": "微信图片_20250103141040.png",
        "thumbnailUrl": "repair/2025/20250429/7pSWcY607LBGE0YW8rmFC4acRtb2GnSNa9AF0Uoy_thumb.png",
        "fileUrl": "repair/2025/20250429/7pSWcY607LBGE0YW8rmFC4acRtb2GnSNa9AF0Uoy.png"
    }
}]
 */
const fileList = ref([]);
let props = defineProps({
  // 上传类型,目前有维修等
  type: {
    type: String,// repair|common
    required: true,
    default: ""
  },
  // 图片id,多个用逗号(,)隔开
  fileIds: {
    type: String,
    required: false,
    default: ""
  },
  limit: {
    type: Number,
    required: false,
    default: 10
  },
  justShow: {
    type: Boolean,
    required: false,
    default: false
  }
})

watch(() => props.fileIds, (val = "") => {
  if (val.length === 0) {
    fileList.value = [];
  } else {
    nextTick(() => {
      loadImages(val);
    })
  }
}, {
  immediate: true
})


watch(() => props.justShow, val => {
  switchShow(val);
}, {
  immediate: true
})

watch(() => exportLoading.value, val => {
  emit("uploading", val);
}, {
  immediate: true
})

function switchShow(justShow) {
  nextTick(() => {
    let dom = document.getElementById(myUploadId);
    if (!dom) {
      return;
    }
    let uploadDom = dom.querySelector(".el-upload");
    if (!uploadDom) {
      return;
    }
    if (justShow) {
      uploadDom.style.display = "none";
    } else {
      uploadDom.style.display = "block";
    }
  })
}


onMounted(() => {
  switch (props.type) {
    case "repair":
      uploadUrl.value = "/file/uploadRepair"
      break;
    case "order":
      uploadUrl.value = "/file/uploadOrder"
      break;
    case "certificate":
      uploadUrl.value = "/file/uploadCertificate";
      break;
    case "contract":
      uploadUrl.value = "/file/customUpload";
      data.value.folder = "contract";
      break;
    case "station":
      uploadUrl.value = "/file/customUpload";
      data.value.folder = "station";
      break;
    default:
      let msg = "暂未实现类型为:" + props.type + "的上传";
      console.error(msg);
      ElMessage.warning(msg);
      break;
  }
})

function loadImages(fileIdStr) {
  if (!fileIdStr) {
    ElMessage.info("无图片");
    return;
  }
  openFullScreen();
  fileList.value = [];
  getFileListByIdStr(fileIdStr).then(res => {
    if (res.length === 0) {
      ElMessage.info("无图片");
      return;
    }
    fileList.value = res.map(p => ({
      uid: p.fileId,
      name: p.fileName,
      url: BASE_URL_IMG + "/" + p.fileUrl,
      data: p
    }));
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

function uploadBefore() {
  exportLoading.value = true;
}

function uploadFileSuccess(response) {
  exportLoading.value = false;
  if (response.code !== 0) {
    ElNotification.error({
      title: "上传失败",
      message: "详情:" + response.message
    })
    return;
  }
  ElMessage.success({
    message: '文件/图片上传成功',
    duration: 5 * 1000
  });
  parseResponse();
}

function uploadFileError(e) {
  exportLoading.value = false;
  let msg = JSON.parse(e.message);
  let message = msg.message ? msg.message : e.message;
  ElMessage.error({
    message: message,
    duration: 5 * 1000
  });
}

function handleRemove(item) {
  let index = fileList.value.findIndex(p => p.uid === item.uid);
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
  parseResponse();
}

const handleExceed = (files) => {
  // upload.value.clearFiles();
  // const file = files[0];
  // file.uid = genFileId();
  // upload.value.handleStart(file);
}


function parseResponse() {
  fileList.value = fileList.value.map(p => {
    let data = p.data || (p.response && p.response.data) || {}
    return {
      uid: p.uid || data.fileId,
      name: p.name,
      url: p.url,
      data: data
    }
  })
  emit("success", fileList.value);

  hideUploadBtnOnExceed();
}

// 如果图片超过限制,则隐藏上传按钮
function hideUploadBtnOnExceed() {
  // 如果图片超过限制,则隐藏上传按钮
  if (props.limit === 0) {
    return;
  }
  let dom = document.getElementById(myUploadId);
  if (!dom) {
    return;
  }
  let uploadDom = dom.querySelector(".el-upload");
  if (!uploadDom) {
    return;
  }
  if (fileList.value.length >= props.limit) {
    uploadDom.style.display = "none";
    // if (justShow) {
    //   uploadDom.style.display = "none";
    // } else {
    //   uploadDom.style.display = "block";
    // }
  } else {
    if (props.justShow) {
      uploadDom.style.display = "none";
    } else {
      uploadDom.style.display = "block";
    }
  }
}

const initialIndex = ref(0);
const showImageViewer = ref(false);

function handlePictureCardPreview(uploadFile) {
  showImageViewer.value = true;
  let i = fileList.value.findIndex(p => p.uid === uploadFile.uid);
  if (i < 0) {
    i = 0;
  }
  initialIndex.value = i;
}

function closeImage() {
  showImageViewer.value = false;
}

</script>
<style lang="less">
.my-upload {
  display: flex;
  width: 100%;

  .el-upload {
    margin-right: 10px;
  }

  .el-upload-list {
    flex: 1;
    //padding-left: 10px;
  }

  .el-upload__text {
    overflow: auto;
  }

  .el-upload-dragger {
    padding: 2px;
    height: 100%;
  }

  .el-upload--picture-card {
    width: auto;

  }
}
</style>
