<template>
  <div class="weui-cell_uploader" :class="{'weui-cell':props.showBorder,...props.class}" :style="{paddingLeft:props.paddingLeft}">
    <div class="weui-cell__bd" :style="{marginTop:props.marginTop,marginLeft:props.marginLeft}">
      <div class="wechat-uploader weui-uploader">
        <div class="weui-uploader__hd" role="option" v-if="!props.justShow">
          <p class="weui-uploader__title" :class="{required:required}" style="flex: none" @click.prevent="">
            {{ props.title }}
          </p>
          <span class="uploader_opt-btn_wrap">
             <span v-if="!props.justShow && !showDel && imgList.length>0" class="uploader_opt-btn" @click.self.stop.prevent="handleToggleEdit">编辑</span>
            <template v-if="showDel">
              <span class="uploader_opt-btn uploader_opt-btn-remove" @click.stop.prevent="handleDel">移除</span>
              <span class="uploader_opt-btn uploader_opt-btn-cancel" @click.stop.prevent="handleCancel">取消</span>
            </template>
            </span>
          <div class="flex-1"></div>
          <div class="weui-uploader__info">
            <span>{{ imgList.length }}</span>/<span>{{ total }}</span>
          </div>
        </div>
        <div class="weui-uploader__bd">
          <ul class="weui-uploader__files">
            <li class="weui-uploader__file" role="img" title="轻点两下查看大图" tabindex="0"
                :style="{backgroundImage: 'url('+BASE_URL_IMG+'/'+(item.thumbnailPath?item.thumbnailPath:item.path)+')'}"
                v-for="(item,index) in imgList" :key="item.id" @click.stop.prevent="previewImage(item,index)">
              <div class="del-mark" v-if="showDel" @click.stop.prevent="selectImg(item,index)">
                <span class="icon-wrap">
                  <i class="weui-icon-success-circle" v-if="item.selected"></i>
                  <i class="weui-icon-circle" v-else></i>
                </span>
              </div>
            </li>
          </ul>
          <div class="weui-uploader__input-box" id="dropWrapId" v-if="imgList.length<props.total && !props.justShow" v-loading="loading">
            <template v-if="isPc">
              <input class="weui-uploader__input" id="dropId" type="file" accept="image/*" multiple :disabled="showDel" @change="handlePcUpload"/>
              <span class="drop_tip">点击或拖拽到此处</span>
            </template>
            <input class="weui-uploader__input" type="file" accept="image/*" multiple @click.stop.prevent="chooseImage" :disabled="showDel" v-else/>
          </div>
        </div>
      </div>
    </div>
  </div>
  <wechat-toast ref="toastRef"></wechat-toast>
</template>
<script setup>
import {onMounted, onUnmounted, ref, watch} from "vue"
import wx from "weixin-js-sdk"
import {formatDateTimeThinString, base64ToFile, isWindowsWechatPlat} from "@/utils/util.js"
import {uploadFile} from "@/api/api.common.js";
import {BASE_URL_IMG} from "@/config/config";
import wechatToast from "@/components/wechat/wechat-toast.vue";
// import VConsole from "vconsole";

// const vConsole = new VConsole();

let props = defineProps({
  total: {type: Number, default: 9},
  imageList: {type: Array, default: []},
  justShow: {type: Boolean, default: false},
  showBorder: {
    type: Boolean,
    default: true
  },
  marginTop: {
    type: String,
    default: '0px'
  },
  marginLeft: {
    type: String,
    default: "0px"
  },
  paddingLeft: {
    type: String,
    default: "16px"
  },
  required: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: "图片上传"
  },
  class: {
    type: String,
    default: ""
  }
});
const imgList = ref([])
const loading = ref(false)
const showDel = ref(false);
const toastRef = ref(null);
const isPc = isWindowsWechatPlat();

const emit = defineEmits(['change']);
watch(() => props.imageList, item => {
  imgList.value = props.imageList || [];
}, {
  immediate: true
})
watch(() => props.justShow, item => {
  showDel.value = false;
}, {
  immediate: true
})


function change() {
  return imgList.value
}

function chooseImage(e) {
  let max = props.total - imgList.value.length
  if (max <= 0) {
    alert("已达到上传最大数量")
    return;
  }
  if (max > 9) {
    max = 9
  }
  wx.chooseImage({
    count: max, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: async function (res) {
      loading.value = false;
      let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
      let resListA = [];
      for (let i = 0; i < localIds.length; i++) {
        let localImgData = await getLocalImgData(localIds[i]);
        resListA.push(localImgData)
      }

      let nowString = formatDateTimeThinString(new Date(), true);
      let name = "mp-" + nowString;
      let fileList = resListA.map((p, i) => base64ToFile(p.localData, name + "-" + i));
      loading.value = true;
      Promise.all(fileList.map(f => {
        let param = new FormData();
        param.append('file', f)
        return uploadFile(param, true);
      })).then(resListB => {
        imgList.value.push(...resListB.map(p => p.data.result));
        emit("change", imgList.value)
      }).catch(e => {
        console.error("uploadFile")
        console.error(e)
      }).finally(() => {
        loading.value = false;
      })
    },
    fail(e) {
      console.error("chooseImage")
      console.error(e)
    },
    complete() {
      // 执行结束都会走这里
    }
  });
}


function handlePcUpload(e) {
  if (isWindowsWechatPlat()) {
    if (imgList.value.length + e.target.files.length > props.total) {
      alert("上传总数量超过最大值，请重新选择");
      return;
    }
    let files = [].slice.call(e.target.files);
    let hasError = false;
    files.forEach(f => {
      if (!f.type.startsWith("image/")) {
        hasError = true;
        alert("文件只支持图片格式");
      }
    })
    if (hasError) {
      return;
    }
    loading.value = true;
    Promise.all(files.map(f => {
      let param = new FormData();
      param.append("file", f);
      return uploadFile(param, true);
    })).then(resListB => {
      let errors = [];
      resListB.forEach(p => {
        if (p.data && p.data.code > 0) {
          errors.push(p.data.msg);
        }
      })
      if (errors.length > 0) {
        toastRef.value.open("图片上传错误,详情:" + errors.join(";"), "error")
        return;
      }
      imgList.value.push(...resListB.map(p => p.data.result));
      emit("change", imgList.value);
      toastRef.value.open("图片上传完成，请及时提交表单", "success")
    }).catch(e => {
      loading.value = false;
      console.error(e);
    }).finally(() => {
      loading.value = false;
      e.target.value = "";
    })
  } else {
    console.error("非wechat,无法调用upload");
  }
}

function previewImage(item, index) {
  let current = BASE_URL_IMG + "/" + item.path;
  let urls = imgList.value.map(p => BASE_URL_IMG + "/" + p.path);
  wx.previewImage({
    current: current, // 当前显示图片的http链接
    urls: urls // 需要预览的图片http链接列表
  });
}

// 获取本地图片数据, 注意: 不能使用Promise.all 并行执行, 需要顺序执行
function getLocalImgData(imgId) {
  return new Promise((resolve, reject) => {
    wx.getLocalImgData({
      localId: imgId, // 图片的localID
      success: function (res) {
        // let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
        resolve(res)
      },
      fail(e) {
        console.error("getLocalImgData:error")
        console.error(e)
        reject(e)
      },
      complete() {
      }
    });
  })
}

function selectImg(item, index) {
  item.selected = !item.selected;
}

function handleToggleEdit() {
  if (!props.justShow) {
    showDel.value = !showDel.value;
  }
}

function handleDel() {
  let imageArray = [];
  let indexArray = [];
  imgList.value.forEach((p, i) => {
    if (!p.selected) {
      imageArray.push(p);
    } else {
      indexArray.push(i)
    }
  })
  indexArray = indexArray.reverse();
  indexArray.forEach(p => {
    imgList.value.splice(p, 1);
  })
  emit("change", imageArray);
  showDel.value = false;
}

function handleCancel() {
  imgList.value.forEach(p => {
    p.selected = false;
  })
  showDel.value = false;
}

let dropWrapDom = null;

function getDropWrapDom() {
  let dom = document.getElementById("dropWrapId");
  if (!dom) {
    dropWrapDom = null;
    return null;
  }
  dropWrapDom = dom;
  return dropWrapDom;
}

function dragoverEvent(e) {
  // 阻止事件冒泡
  e.stopPropagation();
  // 阻止默认事件（与drop事件结合，阻止拖拽文件在浏览器打开的默认行为）
  e.preventDefault();

  let dom = getDropWrapDom();
  dom.classList.add("upload_drag_hover");
}

function dragleaveEvent(e) {
  // 阻止事件冒泡
  e.stopPropagation();
  // 阻止默认事件（与drop事件结合，阻止拖拽文件在浏览器打开的默认行为）
  e.preventDefault();

  let dom = getDropWrapDom();
  dom.classList.remove("upload_drag_hover");
}

function dropEvent(e) {
  // 阻止事件冒泡
  e.stopPropagation();
  // 阻止默认事件（与dragover事件结合，阻止拖拽文件在浏览器打开的默认行为）
  e.preventDefault();
  e.target.files = e.dataTransfer.files;
  handlePcUpload(e);
  dragleaveEvent(e);
}

function handleDropFile() {
  // 实现拖拽上传
  let dropBox = document.getElementById("dropId");
  if (!dropBox) {
    return;
  }
  dropBox.addEventListener("dragover", dragoverEvent, false);
  dropBox.addEventListener("dragleave", dragleaveEvent, false);
  dropBox.addEventListener("drop", dropEvent, false)
}

function handleRemoveDropEvent() {
  let dropBox = document.getElementById("dropId");
  if (!dropBox) {
    return;
  }
  dropBox.removeEventListener("dragover", dragoverEvent);
  dropBox.removeEventListener("drop", dropEvent);
}

onMounted(() => {
  handleDropFile();
})

onUnmounted(() => {
  handleRemoveDropEvent();
})
</script>
<style lang="less">
.weui-cell_uploader {
  //display: inline-block;
  padding-bottom: 2px;
  padding-top: 6px;
}

.wechat-uploader {
  .weui-uploader__file {
    user-select: none;
    position: relative;
  }

  .del-mark {
    background-color: rgba(255, 255, 255, 0.5);
    width: 100%;
    height: 100%;
    position: relative;

    .icon-wrap {
      //background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      position: absolute;
      top: 8px;
      left: 10px;
      border-radius: 2px;
    }
  }

  .uploader_opt-btn_wrap {
    padding-left: 10px;
  }

  .uploader_opt-btn {
    font-size: 13px;
    padding-right: 5px;
    text-decoration: underline;
  }

  .upload_drag_hover {
    background-color: var(--weui-INDIGO-170);
    border: 2px dashed var(--weui-INDIGO-100);
  }

  .drop_tip {
    color: var(--weui-TAG-TEXT-BLACK);
    font-size: 11px;
    position: absolute;
    bottom: 12px;
    width: 100%;
    text-align: center;
  }
}
</style>
