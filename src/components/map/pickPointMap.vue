<template>
  <el-dialog v-model="dialogVisible" title="拾取点位置" width="80%" top="10px" center custom-class="pickPointMap"
    @close="handleClosedDialog" :close-on-click-modal="false" :style="{ height: dialogHeight + 'px' }"
    class="pickPointMap">
    <div id="map_pickPoint_container"></div>
    <div class="bottom_wrap">
      <div class="flex_row flex-justify-center mt-10">
        <span class="lnglat_tip ml-10">当前坐标:</span>
        <span class="lnglat_tip">{{ stationPoint.join(", ") }}</span>
      </div>

      <div class="flex_row flex-justify-center mt-10">
        <el-button class="ml-10" type="primary" @click="handleSubmit">确认</el-button>
        <el-button class="ml-10" type="warning" @click="handleClear">清除</el-button>
        <el-button class="ml-10" type="info" @click="handleClosedDialog">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import AMapLoader from '@amap/amap-jsapi-loader';
import { AMAP_KEY } from "@/config/config.js";
import { GlobalStore } from "@/store/index.js";
import { ElMessage } from "element-plus";
import { deepCopy } from "@/utils/util";

const emit = defineEmits(['close']);

let dialogVisible = ref(false);
let map = null;
let stationPoint = ref([]);

function open(item = [], name = "") {
  dialogVisible.value = true;
  if (!item || item.length !== 2 || !item[0] || !item[1]) {
    // item = [116.397428, 39.90923]; // 默认坐标
    // ElMessage.warning("请先选择站点位置");
  } else {
    stationPoint.value = deepCopy(item);
  }
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
    plugins: ["AMap.Scale", 'AMap.ControlBar', 'AMap.ToolBar', 'AMap.MapType'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  }).then((AMap) => {
    map = new AMap.Map("map_pickPoint_container", {
      // 设置地图容器id
      //mapStyle: "amap://styles/whitesmoke", //设置地图的显示样式
      viewMode: "3D", // 是否为3D地图模式
      terrain: true, //开启地形图
      pitch: 0,
      rotateEnable: true,
      pitchEnable: true,
      rotation: 0,
      zoom: 12, // 初始化地图级别
      center: stationPoint.value.length === 2 ? stationPoint.value : [116.397428, 39.90923], // 初始化地图中心点位置
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
    map.addControl(new AMap.MapType({
      defaultType: 0, //0代表默认，1代表卫星
      showRoad: true,//显示路况（右上角也可点击）
      position: {
        right: '10px',
        bottom: '110px'
      }
    }));
    showMarker();
    onMapClick(map);
  }).catch((e) => {
    console.error(e);
  });
}

function destroy() {
  map?.destroy();
  stationPoint.value = [];
}

function onMapClick(map) {
  map.on("click", function (e) {
    // 点击地图时，清除之前的标记
    map.clearMap(); // 清除地图上的所有覆盖物
    // 清除之前的点标记
    if (stationPoint.value.length > 0) {
      stationPoint.value = [];
    }

    const lnglat = e.lnglat;
    stationPoint.value = [lnglat.lng, lnglat.lat];
    showMarker();

  });

}

function showMarker() {
  if (stationPoint.value.length === 0) {
    return;
  }
  // 自定义点标记内容
  var markerContent = document.createElement("div");
  markerContent.className = "custom-content-marker";

  // 点标记中的图标
  var markerImg = document.createElement("img");
  markerImg.className = "markerlnglat";
  markerImg.src = "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png";
  markerImg.setAttribute('width', '25px');
  markerImg.setAttribute('height', '34px');
  markerContent.appendChild(markerImg);

  // 点标记中的文本
  var markerSpan = document.createElement("span");
  markerSpan.className = 'marker';
  markerSpan.innerHTML = stationPoint.value.join(", "); // 显示坐标
  markerContent.appendChild(markerSpan);


  const position = new AMap.LngLat(stationPoint.value[0], stationPoint.value[1]); //Marker 经纬度
  const marker = new AMap.Marker({
    position: position,
    content: markerContent, //将 html 传给 content
    offset: new AMap.Pixel(-13, -30), //以 icon 的 [center bottom] 为原点
    draggable: true,
    cursor: 'move',
  });
  marker.on("dragging", function (e) {
    // 拖动时更新坐标
    stationPoint.value = [e.lnglat.lng, e.lnglat.lat];
    markerSpan.innerHTML = stationPoint.value.join(", ");
  });
  marker.on('dragend', function (e) {
    // 拖动结束后更新坐标
    stationPoint.value = [e.lnglat.lng, e.lnglat.lat];
    markerSpan.innerHTML = stationPoint.value.join(", ");
  });

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

function handleClear() {
  if (stationPoint.value.length > 0) {
    stationPoint.value = [];
    map.clearMap(); // 清除地图上的所有覆盖物
    ElMessage.success("已清除站点位置");
  }
}

function handleSubmit() {
  emit('close', stationPoint.value);
  destroy();
  dialogVisible.value = false;
}
</script>
<style lang="less">
#map_pickPoint_container {
  width: 100%;
  height: 100%;
  padding: 0;
}

.pickPointMap {
  .custom-content-marker {
    position: relative;
    // width: 34px;
    // height: 34px;
  }

  .custom-content-marker img {}

  .custom-content-marker .close-btn:hover {
    background: #666;
  }

  .marker {
    position: absolute;
    top: -20px;
    right: -145px;
    color: #fff;
    padding: 4px 10px;
    box-shadow: 1px 1px 1px rgba(10, 10, 10, .2);
    white-space: nowrap;
    font-size: 12px;
    font-family: "";
    background-color: #25A5F7;
    border-radius: 3px;
  }

  .el-dialog__body {
    width: 100%;
    height: calc(100% - 40px);
  }

  .bottom_wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    padding: 5px 0;
    border-top: 1px solid #eee;
  }
}
</style>
