<template>
  <el-dialog v-model="dialogVisible" title="场站位置地图" width="80%" top="10px" center custom-class="stationMap"
    @close="handleClosedDialog" :close-on-click-modal="false" :style="{ height: dialogHeight + 'px' }"
    class="stationMap">
    <div id="map_station_container"></div>
  </el-dialog>
</template>
<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import AMapLoader from '@amap/amap-jsapi-loader';
import { AMAP_KEY } from "@/config/config.js";
import { GlobalStore } from "@/store/index.js";
import { ElMessage } from "element-plus";

let dialogVisible = ref(false);
let map = null;
let stationPoint = [];
let stationName = "";
let stationType = "";
let imgPath = "";
function open(item = [], name = "", type = "") {
  stationName = name;
  stationType = type;
  switch (type) {
    case 'pile':
      imgPath = './img/station/pile.png';
      break;
    case 'cargo':
      imgPath = './img/station/cargo.png';
      break;
    default:
      alert("未知的站点类型");
      return;
  }
  dialogVisible.value = true;
  if (!item || item.length !== 2) {
    ElMessage.warning("参数错误");
    return;
  }
  stationPoint = item;
  initMap();
}

defineExpose({
  open
});

function initMap() {
  //地图初始化应该在地图容器div已经添加到DOM树之后
  AMapLoader.load({
    key: AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale", 'AMap.ControlBar', 'AMap.ToolBar'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  }).then((AMap) => {
    map = new AMap.Map("map_station_container", {
      // 设置地图容器id
      //mapStyle: "amap://styles/whitesmoke", //设置地图的显示样式
      viewMode: "3D", // 是否为3D地图模式
      terrain: true, //开启地形图
      pitch: 0,
      rotateEnable: true,
      pitchEnable: true,
      rotation: 0,
      zoom: 12, // 初始化地图级别
      center: stationPoint, // 初始化地图中心点位置
    });
    let controlBar = new AMap.ControlBar({ //控制地图旋转插件
      position: {
        right: '10px',
        top: '10px'
      }
    });
    map.addControl(controlBar);
    let toolBar = new AMap.ToolBar({ //地图缩放插件
      position: {
        right: '40px',
        top: '110px'
      }
    });
    map.addControl(toolBar);
    let scale = new AMap.Scale();
    map.addControl(scale);
    showStation(map);
  }).catch((e) => {
    console.error(e);
  });
}

function destroy() {
  map?.destroy();
}

function showStation(map) {
  const markerContent = `<div class="custom-content-marker">
    <img src="${imgPath}" alt="" id="station_id"></div>`;
  const position = new AMap.LngLat(stationPoint[0], stationPoint[1]); //Marker 经纬度
  const marker = new AMap.Marker({
    position: position,
    content: markerContent, //将 html 传给 content
    offset: new AMap.Pixel(-13, -30), //以 icon 的 [center bottom] 为原点
  });
  marker.setTitle(stationName);
  // marker.setLabel({
  //   direction:'right',
  //   offset:new AMap.Pixel(1,-10),
  //   content:`<div class="map_tip a">${stationName}</div>`
  // }) //构建自定义信息窗体
  let infoWindow = new AMap.InfoWindow({
    anchor: 'bottom-left',
    content: stationName,
    offset: new AMap.Pixel(0, -30)
  });
  infoWindow.open(map, position);

  marker.on("click", function (e) {
    infoWindow.open(map, position);
  })
  map.add(marker);
}

function handleClosedDialog() {
  dialogVisible.value = false;
  destroy();
}

const dialogHeight = ref(500);
const globalStore = GlobalStore();

function setHeight() {
  let val = globalStore.screenSize;
  if (val && val.length === 2) {
    dialogHeight.value = val[1] - 40;
  }
}

watch(() => globalStore.screenSize, val => {
  setHeight();
}, { immediate: true });
</script>
<style lang="less">
#map_station_container {
  width: 100%;
  height: 100%;
  padding: 0;
}

.stationMap {
  .custom-content-marker {
    position: relative;
    width: 34px;
    height: 34px;
  }

  .custom-content-marker img {
    width: 100%;
    height: 100%;
  }

  .custom-content-marker .close-btn:hover {
    background: #666;
  }

  .el-dialog__body {
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>
