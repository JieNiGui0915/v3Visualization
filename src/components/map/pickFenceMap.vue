<template>
  <el-dialog v-model="dialogVisible" title="拾取电子围栏数据" width="80%" top="10px" center custom-class="pickFenceMap"
    @close="handleClosedDialog" destroy-on-close :close-on-click-modal="false" :style="{ height: dialogHeight + 'px' }"
    class="pickFenceMap">
    <div id="map_pickFence_container"></div>
    <!-- <div class="map_search_wrap">
      <el-input v-model="searchValue" placeholder="地址搜索" clearable @clear="handleSearchClear" @keyup.enter="handleSearch">
        <template #append>
          <el-button class="map_search_btn" type="primary" @click="handleSearch">搜索</el-button>
        </template>
</el-input>
</div> -->
    <div class="bottom_wrap">
      <div class="flex_row flex-justify-center mt-10">
        <span class="lnglat_tip ml-10">提示: 选择新增按钮在地图画多边形,鼠标右键结束画图,选中多边形后点击编辑按钮可修改</span>
      </div>

      <div class="flex_row flex-justify-center mt-10">
        <el-button class="ml-10" type="primary" @click="handleSubmit">保存</el-button>
        <el-button class="ml-10" type="success" @click="drawPolygon"
          :disabled="drawing || polygonPointList.length > 0">新增</el-button>
        <el-button class="ml-10" type="primary" @click="editPolygon" :disabled="!currentPolygon"
          v-if="!polyEditing">编辑</el-button>
        <el-button class="ml-10" type="warning" @click="endEditPolygon" v-else>结束编辑</el-button>
        <!-- <el-button class="ml-10" type="warning" @click="handleClearCurrentPolygon"
          :disabled="!currentPolygon">删除已选中</el-button> -->
        <el-button class="ml-10" type="danger" @click="handleClear"
          :disabled="polygonPointList.length === 0">清除</el-button>
        <el-button class="ml-10" type="info" @click="handleClosedDialog">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
import { shallowRef, ref, watch, onUnmounted } from "vue";
import AMapLoader from '@amap/amap-jsapi-loader';
import { AMAP_KEY } from "@/config/config.js";
import { GlobalStore } from "@/store/index.js";
import { ElMessage } from "element-plus";
import { CONFIG } from '@/config/config.js';

const emit = defineEmits(['close']);

let dialogVisible = ref(false);
let map = null;
let polygonPointList = ref([]);
let defaultPoint = ref(CONFIG.stationPoint); // 默认中心点
function open(item = "", point = []) {
  dialogVisible.value = true;
  polygonPointList.value = JSON.parse(item || "[]").map(p => p.split(",")); // 如果传入的item是字符串，则解析为数组
  // 如果没有item , 则使用point作为默认点
  if (polygonPointList.value.length === 0 && point.length === 2 && point[0] && point[1]) {
    defaultPoint.value = point;
  }
  initMap();
}

defineExpose({
  open
});
let mouseTool = null;
let drawing = ref(false);
let currentPolygon = shallowRef(null); // 当前绘制的多边形
let polyEditor = null;
let polyEditing = ref(false);
let firstShow = ref(true); // 是否是第一次显示地图
function initMap() {
  //地图初始化应该在地图容器div已经添加到DOM树之后
  AMapLoader.load({
    key: AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale", 'AMap.ControlBar', 'AMap.ToolBar', 'AMap.MapType', 'AMap.MouseTool', 'AMap.PolygonEditor', 'AMap.PlaceSearch', 'AMap.Geocoder']
  }).then((AMap) => {
    map = new AMap.Map("map_pickFence_container", {
      // 设置地图容器id
      //mapStyle: "amap://styles/whitesmoke", //设置地图的显示样式
      viewMode: "3D", // 是否为3D地图模式
      terrain: true, //开启地形图
      pitch: 0,
      rotateEnable: true,
      pitchEnable: true,
      rotation: 0,
      zoom: 12, // 初始化地图级别
      // center: polygonPointList.value, // 初始化地图中心点位置
    });
    // 设置地图中心点为第一个多边形的第一个点
    if (polygonPointList.value.length === 0) {
      map.setCenter(defaultPoint.value); // 默认中心点
    }
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
    showPolygon(); // 显示多边形
    // drawPolygon();
    // map.on("click", function (e) {
    //   if (!drawing.value) {
    //     // 点击地图时，清除之前的标记
    //     map.clearMap(); // 清除地图上的所有覆盖物
    //     // 清除之前的点标记
    //     if (polygonPointList.value.length > 0) {
    //       polygonPointList.value = [];
    //     }
    //     const lnglat = e.lnglat;
    //     polygonPointList.value = [[lnglat.lng, lnglat.lat]];
    //     drawPolygon();
    //   }
    // })
  }).catch((e) => {
    console.error(e);
  });
}

function destroy() {
  // 清除搜索标记
  clearSearchMarkers();
  // 销毁地图
  map?.destroy();
  // 清空引用
  map = null;
  placeSearch = null;
  currentPolygon.value = null;
  polygonPointList.value = [];
}

function showPolygon() {
  if (polygonPointList.value.length === 0) {
    return;
  }
  // 清除地图上的所有覆盖物
  map.clearMap();
  // 创建多边形对象

  let polygonList = [];
  // polygonPointList.value.forEach(path => {

  // });

  let polygon = new AMap.Polygon({
    path: polygonPointList.value,
    strokeColor: "#FF33FF",
    strokeWeight: 6,
    strokeOpacity: 0.2,
    fillOpacity: 0.4,
    fillColor: '#1791fc',
    zIndex: 50,
    bubble: true,
  });
  polygon.on("click", function (e) {
    if (currentPolygon.value && polygon !== currentPolygon.value) {
      currentPolygon.value.setOptions({
        strokeColor: '#FF33FF', // 鼠标点击时边框颜色变为默认颜色
        fillColor: '#1791fc', // 鼠标点击时填充颜色变为默认颜色
        fillOpacity: 0.4 // 鼠标点击时填充透明度变为默认值
      });
    }
    currentPolygon.value = polygon;
    // 设置多边形的选中状态
    polygon.setOptions({
      strokeColor: '#FF0000', // 鼠标点击时边框颜色变为红色
      fillColor: '#FFCCCC', // 鼠标点击时填充颜色变为浅红色
      fillOpacity: 0.6 // 鼠标点击时填充透明度变为0.6
    });
  });
  polygon.on("mouseover", function (e) {
    if (polygon === currentPolygon.value) return; // 如果是当前选中的多边形，则不处理鼠标悬停事件
    // 鼠标悬停时，输出坐标
    polygon.setOptions({
      fillOpacity: 0.7,
      fillColor: '#7bccc4'
    });
  });
  polygon.on('mouseout', () => {
    if (polygon === currentPolygon.value) return; // 如果是当前选中的多边形，则不处理鼠标移出事件
    polygon.setOptions({
      fillOpacity: 0.4,
      fillColor: '#1791fc'
    })
  })
  polygonList.push(polygon);
  map.add([polygon]);
  if (firstShow.value) {
    firstShow.value = false; // 设置为false，表示已经显示过多边形
    map.setFitView(polygonList, true, [160, 160, 160, 160], 24); // 完整显示全部多边形
  }
}

// 利用mouseTool实现点击地图拾取坐标
function drawPolygon() {
  firstShow.value = false; // 设置为false，表示已经显示过多边形
  currentPolygon.value = null; // 清除当前选中的多边形
  mouseTool = new AMap.MouseTool(map); // 鼠标工具
  // 监听绘制完成事件
  mouseTool.on("draw", function (e) {
    // 绘制完成后获取多边形的坐标
    const polygon = e.obj;
    let path = polygon.getPath();
    polygonPointList.value = path.map(point => [point.lng, point.lat]);
    // 在地图上显示多边形的坐标
    drawing.value = false;
    showPolygon();
    mouseTool.close(); // 关闭鼠标工具
    mouseTool = null; // 清除鼠标工具引用
  });
  // 清除之前的覆盖物
  // map.clearMap(); // 清除地图上的所有覆盖物
  // 清除之前的点标记
  // if (polygonPointList.value.length > 0) {
  //   polygonPointList.value = [];
  // }
  // 开始绘制多边形
  mouseTool.polygon({
    strokeColor: "#FF33FF",
    strokeOpacity: 1,
    strokeWeight: 6,
    strokeOpacity: 0.2,
    fillColor: '#1791fc',
    fillOpacity: 0.4,
    // 线样式还支持 'dashed'
    strokeStyle: "solid",
    // strokeStyle是dashed时有效
    // strokeDasharray: [30,10],
  })
  drawing.value = true; // 设置绘制状态为true
}

function editPolygon() {
  if (polygonPointList.value.length === 0) {
    ElMessage.error("请先绘制多边形");
    return;
  }
  // 清除地图上的所有覆盖物
  map.clearMap(); // 清除地图上的所有覆盖物
  showPolygon();
  // 如果没有编辑，则开始编辑
  let polygon = new AMap.Polygon({
    path: currentPolygon.value ? currentPolygon.value.getPath() : polygonPointList.value[0],
    strokeColor: "#FF33FF",
    strokeWeight: 6,
    strokeOpacity: 0.2,
    fillOpacity: 0.4,
    fillColor: '#1791fc',
    zIndex: 50,
    bubble: true,
  })
  map.add([polygon]);
  polyEditor = new AMap.PolygonEditor(map, polygon);
  polyEditor.open();
  polyEditing.value = true;
  ElMessage.success("已开始多边形编辑");
}

function endEditPolygon() {
  if (!polyEditor) {
    ElMessage.error("请先初始化地图");
    return;
  }
  // 如果正在编辑多边形，则结束编辑
  polyEditor.close();
  polyEditing.value = false;
  ElMessage.success("已结束多边形编辑");
}

function handleClosedDialog() {
  dialogVisible.value = false;
  handleClose();
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
  if (polygonPointList.value.length > 0) {
    polygonPointList.value = [];
    map.clearMap(); // 清除地图上的所有覆盖物
  }
}

function handleClearCurrentPolygon() {
  if (!currentPolygon.value) {
    ElMessage.error("请先选中多边形");
    return;
  }
  // 清除当前选中的多边形
  map.remove(currentPolygon.value);
  currentPolygon.value = null;

  // 获取map中所有polygon的路径
  let polygonArr = Array.from(map.getAllOverlays('polygon'));
  let paths = [];

  // 遍历所有多边形，提取坐标路径
  polygonArr.forEach(polygon => {
    let path = polygon.getPath();
    if (path && path.length > 0) {
      paths.push(path.map(point => [point.lng, point.lat]));
    }
  });

  // 更新多边形点列表
  polygonPointList.value = paths;

  ElMessage.success("已删除当前选中多边形");
  if (polygonPointList.value.length === 0) {
    ElMessage.warning("已清除所有多边形");
  } else {
    showPolygon(); // 重新显示剩余的多边形
  }
}


const searchValue = ref("");
let placeSearch = null; // 地点搜索对象
let searchMarkers = []; // 存储搜索结果标记

function handleSearchClear() {
  searchValue.value = "";
  // 清除所有搜索标记
  clearSearchMarkers();
}

function clearSearchMarkers() {
  if (searchMarkers.length > 0) {
    searchMarkers.forEach(marker => {
      marker.setMap(null);
    });
    searchMarkers = [];
  }
}

function handleSearch() {

}

function handleSubmit() {
  let pathArr = polygonPointList.value.map(point => point.join());
  emit('close', JSON.stringify(pathArr));
  handleClose();
}

function handleClose() {
  destroy();
  dialogVisible.value = false;
  firstShow.value = true;
}
</script>
<style lang="less">
#map_pickFence_container {
  width: 100%;
  height: 100%;
  padding: 0;
}

.pickFenceMap {
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

  .map_search_wrap {
    position: absolute;
    top: 60px;
    left: 20px;
    z-index: 2;
    width: 300px;

    .map_search_btn {
      background-color: #eee;
      color: #333;
      border: 1px solid #ccc;

      &:hover {
        background-color: #ddd;
      }
    }
  }

  .amap-geo-control {
    position: absolute;
    z-index: 2;
    right: 20px;
    top: 180px;

    button {
      width: 40px;
      height: 40px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 3px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: #f5f5f5;
      }

      i {
        font-size: 18px;
        color: #1791fc;
      }
    }
  }
}
</style>
