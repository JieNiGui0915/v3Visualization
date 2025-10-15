<template>
  <div class="home">
    <div id="map_container"></div>
    <!-- 添加坐标显示栏 -->
    <div class="coordinate_display" v-if="mouseCoordinate.show">
      经纬度: {{ mouseCoordinate.lng }},{{ mouseCoordinate.lat }}
    </div>
    <div class="vehicle_wrap map_list_wrap" :style="{ zIndex: showListType === 'vehicle' ? 100 : 0 }">
      <div class="map_list_wrap_title" @click="switchShowList('vehicle')">
        <div class="toggle_show_btn">
          <el-button :icon="ArrowDownBold" :class="showListType === 'vehicle' ? 'rotate_180' : ''" size="small"
            circle />
        </div>
        自有车辆({{ allVehicleList.length }}辆)
      </div>
      <el-collapse-transition>
        <div class="map_list_wrap_list" v-show="showListType === 'vehicle'">
          <div class="map_list_item"
            :class="currentSelectMarkerDataVin === item.vehicleVin ? 'selected_map_list_item' : ''"
            v-for="(item, i) in allVehicleList" :key="item.vehicleId" @click="zoomToCarView(item)">
            <div class="map_list_item_left">
              <div class="map_list_item_left_index">{{ item.dispatchNumber }}.</div>
              {{ item.licensePlateNumber }}
            </div>
            <div class="map_list_item_right">
              <div class="map_list_item_right_label">soc:</div>
              <div class="map_list_item_right_value">{{ item.realTimeData ? item.realTimeData.soc + "%" : '' }}</div>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="station_wrap map_list_wrap" :style="{ zIndex: showListType === 'cargo' ? 100 : 0 }">
      <div class="map_list_wrap_title" @click="switchShowList('cargo')">
        <div class="toggle_show_btn">
          <el-button :icon="ArrowDownBold" :class="showListType === 'cargo' ? 'rotate_180' : ''" size="small" circle />
        </div>
        货场({{ allStationList.length }}个)
      </div>
      <el-collapse-transition>
        <div class="map_list_wrap_list" v-show="showListType === 'cargo'">
          <div class="map_list_item"
            :class="currentSelectMarkerDataVin === item.vehicleVin ? 'selected_map_list_item' : ''"
            v-for="(item, i) in allStationList" :key="item.goodsYardId" @click="zoomToStationView(item)">
            <div class="map_list_item_left">
              <div class="map_list_item_left_index">{{ i + 1 }}.</div>
              {{ item.goodsYardName }}
            </div>
            <div class="map_list_item_right">
              <div class="map_list_item_right_value">
                <img class="station_img" v-if="item.goodsYardType === 1" src="/img/station/站台.png" alt="站台" title="站台">
                <img class="station_img" v-else-if="item.goodsYardType === 2" src="/img/station/煤矿.png" alt="煤矿"
                  title="煤矿">
                <img class="station_img" v-else-if="item.goodsYardType === 3" src="/img/station/电厂.png" alt="电厂"
                  title="电厂">
                <img class="station_img" v-else-if="item.goodsYardType === 4" src="/img/station/煤场.png" alt="煤场"
                  title="煤场">
                <img class="station_img" v-else-if="item.goodsYardType === 5" src="/img/station/工厂.png" alt="工厂"
                  title="工厂">
                <img class="station_img" v-else src="/img/station/其他.png" alt="其他" title="其他">
                <img class="station_img" src="@/assets/images/position.png" alt="查看定位" title="查看定位"
                  v-if="item.longitude && item.latitude">
                <img class="station_img" src="@/assets/images/position_disabled.png" alt="无定位" title="无定位" v-else>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="pile_wrap map_list_wrap" :style="{ zIndex: showListType === 'pile' ? 100 : 0 }">
      <div class="map_list_wrap_title" @click="switchShowList('pile')">
        <div class="toggle_show_btn">
          <el-button :icon="ArrowDownBold" :class="showListType === 'pile' ? 'rotate_180' : ''" size="small" circle />
        </div>
        补能站({{ allPileStationList.length }}个)
      </div>
      <el-collapse-transition>
        <div class="map_list_wrap_list" v-show="showListType === 'pile'">
          <div class="map_list_item"
            :class="currentSelectMarkerDataVin === item.vehicleVin ? 'selected_map_list_item' : ''"
            v-for="(item, i) in allPileStationList" :key="item.goodsYardId" @click="zoomToPileStationView(item)">
            <div class="map_list_item_left">
              <div class="map_list_item_left_index">{{ i + 1 }}.</div>
              {{ item.name }}
            </div>
            <div class="map_list_item_right">
              <div class="map_list_item_right_value">
                <img class="station_img" src="/img/station/pile.png" alt="充电站" title="充电站">
                <img class="station_img" src="@/assets/images/position.png" alt="查看定位" title="查看定位"
                  v-if="item.lng && item.lat">
                <img class="station_img" src="@/assets/images/position_disabled.png" alt="无定位" title="无定位" v-else>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <template v-if="weatherInfo">
      <el-tooltip :content="'更新时间:' + weatherInfo.reporttime" placement="top">
        <div class="weather_wrap">
          <span>实时天气: </span>
          <div class="weather_wrap_item">{{ weatherInfo.city }}</div>
          <div class="weather_wrap_item">{{ weatherInfo.weather }}</div>
          <div class="weather_wrap_item">{{ weatherInfo.winddirection }}风{{ weatherInfo.windpower }}级</div>
          <div class="weather_wrap_item">气温:{{ weatherInfo.temperature }}℃</div>
        </div>
      </el-tooltip>
    </template>
    <div class="statistics_wrap">
      <div class="statistics_item">
        <div class="statistics_item_title">订单总数</div>
        <div class="statistics_item_value">{{ orderCount }}</div>
      </div>
      <div class="statistics_item">
        <div class="statistics_item_title">调度总数</div>
        <div class="statistics_item_value">{{ dispatchCount }}</div>
      </div>
      <div class="statistics_item">
        <div class="statistics_item_title">运单总数</div>
        <div class="statistics_item_value">{{ waybillCount }}</div>
      </div>
      <div class="statistics_item">
        <div class="statistics_item_title">运单总重(t)</div>
        <div class="statistics_item_value">{{ waybillTotalSuttle }}</div>
      </div>
    </div>
    <div class="show_map_bound_wrap">
      <div class="show_map_bound" @click="showFullView" title="展示全景范围">
        <img class="show_map_bound_icon" src="../../assets/images/maximize.png" alt="trucks">
      </div>
      <div class="show_map_bound" @click="showAllOverlays" title="显示所有车辆">
        <img class="show_map_bound_icon" src="../../assets/images/trucks.png" alt="maximize">
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import AMapLoader from '@amap/amap-jsapi-loader';
import { AMAP_KEY, BASE_URL } from "@/config/config.js";
import { GlobalStore } from "@/store/index.js";
import { getAllSelfVehicleBaseList } from "@/api/api.vehicle.js";
import { getWeatherInfo } from "@/api/api.weather.js";
import { deepCopy, formatTime, toMap } from "@/utils/util.js";
import { ElCollapseTransition } from 'element-plus'
import { ArrowDownBold } from "@element-plus/icons-vue";
import { onBeforeRouteLeave } from "vue-router";
import { getStationList } from "@/api/api.station.js";
import "@amap/amap-jsapi-types";
import { stationTypeMap, holidayModeMap } from "@/config/const.js";
import { getOrderCount } from "@/api/api.order.js";
import { getDispatchCount } from "@/api/api.dispatch.js";
import { getWaybillCount, getWaybillTotalSuttle } from "@/api/api.waybill.js";
import { CONFIG } from "@/config/config.js";
import { getAllStationSimpleList } from "@/api/api.pile.js";

let map = null;
let stationPoint = CONFIG.stationPoint;
let globalStore = GlobalStore();
let isFirstView = true;
const showListType = ref('');
const showVehicleList = ref(false);
const mouseCoordinate = ref({
  lng: '0.000000',
  lat: '0.000000',
  show: false
});


function initMap() {
  return new Promise((resolve, reject) => {
    //地图初始化应该在地图容器div已经添加到DOM树之后
    AMapLoader.load({
      key: AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["AMap.Scale", 'AMap.ControlBar', 'AMap.ToolBar', 'AMap.MapType', 'AMap.MarkerCluster', 'AMap.Weather']
    }).then((AMap) => {
      map = new AMap.Map("map_container", {
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
      map.addControl(new AMap.MapType({
        defaultType: 0, //0代表默认，1代表卫星
        showRoad: true,//显示路况（右上角也可点击）
        position: {
          right: '10px',
          bottom: '110px'
        }
      }));
      // 添加鼠标坐标监听
      setupMouseCoordinateListener(map);

      // showStation(map);
      showFullView();
      resolve();
    }).catch((e) => {
      console.error(e);
      reject(e);
    });
  })
}

// 设置鼠标坐标监听器
function setupMouseCoordinateListener(map) {
  map.on('click', function (e) {
    // 清除windowInfo
    if (infoWindow) {
      infoWindow.close();
      infoWindow = null;
    }
    mouseCoordinate.value.lng = e.lnglat.lng;
    mouseCoordinate.value.lat = e.lnglat.lat;
    mouseCoordinate.value.show = true;
  });

  // map.on('mouseleave', function () {
  //   mouseCoordinate.value.show = false;
  // });
}

function showStation(map) {
  const markerContent = `<div class="custom-content-marker">
    <img src="./img/station/pile.png" alt="" id="station_id"></div>`;
  const position = new AMap.LngLat(stationPoint[0], stationPoint[1]); //Marker 经纬度
  const marker = new AMap.Marker({
    position: position,
    content: markerContent, //将 html 传给 content
    offset: new AMap.Pixel(-13, -30), //以 icon 的 [center bottom] 为原点
  });
  marker.setTitle("内蒙古通辽国润充电场站");
  let infoWindow = openSimpleInfoWindow("内蒙古通辽国润充电场站", stationPoint);
  marker.on("click", function (e) {
    currentSelectMarkerDataVin.value = "";
    infoWindow.open(map, position);
    infoWindowOnClose();
  })
  map.add(marker);
}

function showFullView() {
  switch (CONFIG.mapFullViewRange) {
    case 120:
      show120KmView();
      break;
    case 200:
      show200KmView();
      break;
    default:
      show200KmView();
  }
}


function show120KmView() {
  if (!map) return;
  // map.setZoomAndCenter(12, stationPoint);
  // 设置上下左右四个点,分别扩展120km
  const southWest = new AMap.LngLat(stationPoint[0] - 1.08, stationPoint[1] - 0.72);
  const northEast = new AMap.LngLat(stationPoint[0] + 1.08, stationPoint[1] + 0.72);
  map.setBounds(new AMap.Bounds(southWest, northEast));
}

function show200KmView() {
  if (!map) return;
  // map.setZoomAndCenter(12, stationPoint);
  // 设置上下左右四个点,分别扩展200km
  const southWest = new AMap.LngLat(stationPoint[0] - 1.68, stationPoint[1] - 1.44);
  const northEast = new AMap.LngLat(stationPoint[0] + 1.68, stationPoint[1] + 1.44);
  map.setBounds(new AMap.Bounds(southWest, northEast));
}

function switchShowList(type) {
  if (showListType.value === type) {
    showListType.value = '';
  } else {
    showListType.value = type;
  }
}

// region 车辆

const loadingVehicle = ref(false);
const allVehicleList = ref([]);
let allVehicleMap = new Map();

async function loadAllVehicleList() {
  loadingVehicle.value = true;
  let data = await getAllSelfVehicleBaseList();
  allVehicleList.value = data.map(p => {
    p.realTimeData = {
      position: null,
      marker: null,
      soc: "",
    };

    return p;
  })
  allVehicleMap = toMap(allVehicleList.value, item => item.vehicleVin);
  loadingVehicle.value = false;
}

// endregion

// region 处理地图数据
let carMakerMap = {};
let currentSelectMarkerDataVin = ref("");

function parseSocketData(realTimeDataList = []) {
  showAllVehicleOnMap(realTimeDataList)
}


function showAllVehicleOnMap(realTimeDataList = []) {
  let points = [];
  for (let i = 0; i < realTimeDataList.length; i++) {
    let p = realTimeDataList[i];
    let data = allVehicleMap.get(p.vin);
    if (!data) continue;
    Object.assign(data.realTimeData, p);
    let point = { "lnglat": [p.longitude, p.latitude], 'vin': p.vin };
    points.push(point);
    // showCarMarker(data);
  }

  showCluster(points);

}

let cluster = null;

function showCluster(points = []) {
  let _renderMarker = function (context) {
    if (context.data.length === 0) {
      return;
    }
    let vin = context.data[0].vin;
    if (!vin) {
      return;
    }
    let data = allVehicleMap.get(vin);
    if (!data) return;

    let content = createMarkerContent(data.vehicleVin, data.realTimeData.soc, data.dispatchNumber);
    context.marker.setContent(content);

    // 设置marker旋转角度
    const angle = data.realTimeData.direction || 0;
    context.marker.setAngle(angle);

    // 设置文本反向旋转以保持水平
    const textElement = content.querySelector('.car_marker');
    if (textElement) {
      textElement.style.transform = `translateX(-50%) rotate(${-angle}deg)`;
    }

    context.marker.on('click', function (e) {
      openVehicleInfoWindow(data);
    })
  }
  if (!map) {
    return;
  }
  if (cluster) {
    cluster.setData(points);

    // 动态调整infoWindow
    changePointInfoWindowPosition(points);
  } else {
    cluster = new AMap.MarkerCluster(map, points, {
      gridSize: 40,
      maxZoom: 19,
      clusterByZoomChange: true,
      renderMarker: _renderMarker, // 自定义非聚合点样式
    });
    cluster.on("click", function (item) {
      if (!item.clusterData || item.clusterData.length !== 1) {
        return;
      }
      let data = item.clusterData[0];
      // let vehicleData = allVehicleList.value.find(p => p.vehicleVin === data.vin);
      // if (!vehicleData) {
      //   return;
      // }
      // let soc = vehicleData.realTimeData ? vehicleData.realTimeData.soc : '';
      // let content = `<div class="info_window_tip">
      //   <span class="info_window_tip_1">${vehicleData.licensePlateNumber}</span>
      //   ${soc ? `<span class="info_window_tip_2">soc:${soc}%</span>` : ''}
      // </div>`;
      // openSimpleInfoWindow(content, [data.lnglat.lng, data.lnglat.lat]);
      currentSelectMarkerDataVin.value = data.vin;
    })
  }
}

function createMarkerContent(vin = "", soc = 0, licensePlateNumber = "", forceColor = "") {
  let color = "blur";
  if (forceColor) {
    color = forceColor;
  } else {
    if (currentSelectMarkerDataVin.value === vin) {
      color = "red";
    }
  }
  // 自定义点标记内容
  const markerContent = document.createElement("div");
  markerContent.style.position = "relative";

  // 点标记中的图标
  const markerImg = document.createElement("img");
  markerImg.className = "markerlnglat";
  markerImg.src = getCarImgPathBySoc(soc);
  markerImg.setAttribute('width', '35px');
  markerImg.setAttribute('height', '34px');
  markerContent.appendChild(markerImg);

  // 点标记中的文本,文本不要跟随marker旋转,保持绝对水平,且放到marker正上方
  const markerSpan = document.createElement("span");
  markerSpan.className = 'car_marker car_marker_' + color;
  markerSpan.innerHTML = licensePlateNumber;
  markerSpan.setAttribute('data-vin', vin); // 添加vin标识用于后续更新旋转
  markerContent.appendChild(markerSpan);
  return markerContent;
}

function getCarImgPathBySoc(soc) {
  if (soc >= 90) {
    return "./img/car05.png";
  } else if (soc >= 70) {
    return "./img/car04.png";
  } else if (soc >= 50) {
    return "./img/car03.png";
  } else if (soc >= 30) {
    return "./img/car02.png";
  } else if (soc >= 10) {
    return "./img/car01.png"
  } else {
    return "./img/car00.png"
  }
}

function zoomToCarView(item) {
  currentSelectMarkerDataVin.value = item.vehicleVin;
  let content = item.licensePlateNumber + "  soc:" + item.realTimeData.soc + "%";

  // 先关闭现有的InfoWindow
  if (infoWindow) {
    infoWindow.close();
    infoWindow = null;
  }

  // 使用辅助函数安全地设置地图中心
  setMapCenterSafely(19, [item.realTimeData.longitude, item.realTimeData.latitude], () => {
    // 地图移动完成后显示InfoWindow
    openSimpleInfoWindow(content, [item.realTimeData.longitude, item.realTimeData.latitude]);
  });
}

let infoWindow = null;

// 辅助函数：安全地设置地图中心并在完成后执行回调
function setMapCenterSafely(zoom, center, callback) {
  if (!map) return;

  // 设置地图中心和缩放级别
  map.setZoomAndCenter(zoom, center);

  if (callback && typeof callback === 'function') {
    // 监听地图移动完成事件
    const moveEndHandler = () => {
      map.off('moveend', moveEndHandler);
      map.off('zoomend', moveEndHandler);
      callback();
    };

    map.on('moveend', moveEndHandler);
    map.on('zoomend', moveEndHandler);
  }
}

function openSimpleInfoWindow(content, position = []) {
  if (!position || position.length !== 2) {
    console.error("windowInfo open error,position param is invalid");
    return;
  }
  let wrapContent = `<div class="my_text_info_window">${content}</div>`
  infoWindow = new AMap.InfoWindow({
    anchor: 'bottom-left',
    content: wrapContent,
    offset: new AMap.Pixel(20, -30)
  });

  const LngLatPosition = new AMap.LngLat(position[0], position[1]); //Marker 经纬度
  infoWindow.open(map, LngLatPosition);
  infoWindowOnClose();
  return infoWindow;
}

function openVehicleInfoWindow(data) {
  let position = [data.realTimeData.longitude, data.realTimeData.latitude];
  if (!position || position.length !== 2) {
    console.error("send msg windowInfo open error,position param is invalid");
    return;
  }
  let infoWindowContent = `<div class="my_info_window">
      <div class="my_info_window_title">${data.licensePlateNumber}</div>
      <table class="my_info_window_table">
      <tr class="my_info_window_table_row">
        <td class="my_info_window_table_col my_info_window_table_col_1">定位时间</td>
        <td class="my_info_window_table_col">${data.realTimeData.dataTime}</td>
      </tr>
      <tr>
      <td class="my_info_window_table_col my_info_window_table_col_1">行驶速度</td>
        <td class="my_info_window_table_col">${data.realTimeData.speed} km/h</td>
      </tr>
      <tr>
        <td class="my_info_window_table_col my_info_window_table_col_1">SOC</td>
        <td class="my_info_window_table_col">${data.realTimeData.soc} %</td>
      </tr>
      <tr>
        <td class="my_info_window_table_col my_info_window_table_col_1">总里程</td>
        <td class="my_info_window_table_col">${data.realTimeData.attributes_1} km</td>
      </tr>
      <tr>
        <td class="my_info_window_table_col my_info_window_table_col_1">车辆状态</td>
        <td class="my_info_window_table_col">${data.realTimeData.vehicleStatus} / ${data.realTimeData.chargeStatus}</td>
      </tr>
</table>
</div>`

  // 创建一个自定义内容的 infowindow 实例
  let lnglat = new AMap.LngLat(position[0], position[1]);
  infoWindow = new AMap.InfoWindow({
    position: lnglat,
    offset: new AMap.Pixel(0, -30),
    content: infoWindowContent
  });
  if (map) {
    infoWindow.open(map);
    infoWindowOnClose();
  }
}

function infoWindowOnClose() {
  if (!infoWindow) {
    return;
  }
  infoWindow.on("close", function () {
    // 关闭infoWindow时清除相关数据
    infoWindow = null;
    currentSelectMarkerDataVin.value = "";
  });
}

function changePointInfoWindowPosition(points) {
  if (!infoWindow) {
    return;
  }
  if (!currentSelectMarkerDataVin.value) {
    return;
  }
  let data = points.find(p => p.vin === currentSelectMarkerDataVin.value);
  if (data) {
    // 使用辅助函数安全地设置地图中心
    let zoom = map.getZoom();
    setMapCenterSafely(zoom, [data.lnglat.lng, data.lnglat.lat], () => {
      // 地图移动完成后更新InfoWindow位置
      if (infoWindow) {
        infoWindow.setPosition(data.lnglat);
      }
    });
  }
}

// endregion

// region 实时天气
let weatherInfo = ref();

function loadWeatherInfo() {
  getWeatherInfo(CONFIG.weatherAdCode).then(res => {
    weatherInfo.value = res;
  });
}

// endregion

// region WebSocket连接
let ws = null;
let heartbeatTimer = null;
let heartbeatInterval = 60000; // 60秒发送一次心跳
let isReceiveHeartbeat = true; // 是否收到心跳回复

function initWebSocketAsync() {
  return new Promise((resolve, reject) => {
    const url = BASE_URL + "/go-api/vehicle/ws";
    ws = new WebSocket(url + "?token=" + globalStore.token);

    try {
      ws.onopen = function () {
        clearWebSocketTimeout();
        startHeartbeat(); // 开始心跳
        resolve();
      };
      // ws connection closed
      ws.onclose = function () {
        stopHeartbeat(); // 停止心跳
        if (ws) {
          ws.close();
          ws = null;
        }
        console.info("WebSocket Server [" + url + "] Connection Closed!");
        lazyInit();
      };
      // ws connection error
      ws.onerror = function () {
        stopHeartbeat(); // 停止心跳
        if (ws) {
          ws.close();
          ws = null;
        }
        console.error("WebSocket Server [" + url + "] Connection Error!");
        // lazyInit();
        reject();
      };
      // ws response message.
      ws.onmessage = function (result) {
        if (result.data === "pong") {
          isReceiveHeartbeat = true; // 收到心跳回复
          return;
        }
        parseSocketData(JSON.parse(result.data));
      };
    } catch (e) {
      alert(e.message);
    }
  })
}

function closeWebSocket() {
  clearWebSocketTimeout();
  stopHeartbeat(); // 停止心跳
  if (ws) {
    ws.close();
    ws = null;
  }
}

function clearWebSocketTimeout() {
  if (initWebSocketTimeoutId) {
    clearTimeout(initWebSocketTimeoutId);
    initWebSocketTimeoutId = null;
  }
}

function clearTimeoutInstance() {
  clearInterval(weatherInternalId);
  clearInterval(statisticsIntervalId);
  weatherInternalId = null;
  statisticsIntervalId = null;
}

window.onbeforeunload = function () {
  closeWebSocket();
}

function lazyInit() {
  clearWebSocketTimeout();
  initWebSocketTimeoutId = setTimeout(() => {
    if (initWebSocketTimeoutId) {
      initWebSocketAsync();
    }
  }, 1000)
}


// 开始心跳
function startHeartbeat() {
  stopHeartbeat(); // 先清除之前的定时器
  isReceiveHeartbeat = true;

  heartbeatTimer = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      if (!isReceiveHeartbeat) {
        // 如果上次心跳没有收到回复，认为连接可能有问题，重连
        console.warn('心跳超时，尝试重连WebSocket');
        closeWebSocket();
        lazyInit();
        return;
      }

      // 发送心跳包
      isReceiveHeartbeat = false;
      try {
        // ws.send(JSON.stringify({ messageType: 'ping', message: 'ping', timestamp: Date.now() }));
        sendPing();
      } catch (e) {
        console.error('发送心跳包失败:', e);
        closeWebSocket();
        lazyInit();
      }
    }
  }, heartbeatInterval);
}

// 停止心跳
function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

function sendPing() {
  ws.send("ping");
}

// endregion

// region 货场
let allStationList = ref([]);

function loadStationList() {
  getStationList().then(res => {
    allStationList.value = res;
    showCargoStationOnMap(res);
  });
}

function showCargoStationOnMap(stationList = []) {
  if (!map) {
    return;
  }
  // 显示点
  for (let i = 0; i < stationList.length; i++) {
    let item = stationList[i];
    if (!item.longitude || !item.latitude) {
      continue; // 跳过无效坐标
    }
    let imgPath = "";
    switch (item.goodsYardType) {
      case 1:
        imgPath = "./img/station/站台.png";
        break;
      case 2:
        imgPath = "./img/station/煤矿.png";
        break;
      case 3:
        imgPath = "./img/station/电厂.png";
        break;
      case 4:
        imgPath = "./img/station/煤场.png";
        break;
      case 5:
        imgPath = "./img/station/工厂.png";
        break;
      default:
        imgPath = "./img/station/其他.png";
    }
    let markerContent = `<div class="custom-content-marker">
      <img src="${imgPath}" alt="" id="station_id_${item.goodsYardId}"></div>`;
    let position = new AMap.LngLat(item.longitude, item.latitude); //Marker 经纬度
    let marker = new AMap.Marker({
      position: position,
      content: markerContent, //将 html 传给 content
      offset: new AMap.Pixel(-13, -30), //以 icon 的 [center bottom] 为原点
    });
    marker.setTitle(item.goodsYardName);
    marker.on("click", function (e) {
      zoomToStationView(item);
    })
    map.add(marker);
  }
  // 显示地理围栏
  for (let i = 0; i < stationList.length; i++) {
    let item = stationList[i];
    if (!item.locationRange || item.locationRange.length === 0) {
      continue; // 跳过无效地理围栏
    }
    let locationRange = JSON.parse(item.locationRange);
    if (!Array.isArray(locationRange) || locationRange.length === 0) {
      continue; // 确保locationRange是一个有效的数组
    }

    if (locationRange && locationRange.length > 0) {
      let polygon = new AMap.Polygon({
        path: locationRange.map(data => {
          let coord = data.split(",");
          if (coord.length !== 2) {
            console.error("Invalid coordinate format:", data);
            return null; // 跳过无效坐标
          }
          return new AMap.LngLat(coord[0], coord[1]);
        }).filter(coord => coord !== null), // 过滤掉无效坐标
        fillColor: '#ccebc5',
        strokeOpacity: 1,
        fillOpacity: 0.01,
        strokeColor: '#2b8cbe',
        strokeWeight: 1,
        strokeStyle: 'dashed',
        strokeDasharray: [5, 5],
      });
      polygon.on('mouseover', () => {
        polygon.setOptions({
          fillOpacity: 0.7,
          fillColor: '#7bccc4'
        })
      })
      polygon.on('mouseout', () => {
        polygon.setOptions({
          fillOpacity: 0.01,
          fillColor: '#ccebc5'
        });
      })
      polygon.on('click', () => {
        // 显示货场信息的infoWindow
        currentSelectMarkerDataVin.value = "";
        openStationInfoWindow(item);
      })
      map.add(polygon);
    }
  }
}

function showPileStationOnMap(stationList = []) {
  if (!map) {
    return;
  }
  // 显示点
  for (let i = 0; i < stationList.length; i++) {
    let item = stationList[i];
    if (!item.lng || !item.lat) {
      continue; // 跳过无效坐标
    }
    let imgPath = "./img/station/pile.png";

    let markerContent = `<div class="custom-content-marker">
      <img src="${imgPath}" alt="" id="pile_station_id_${item.stationId}"></div>`;
    let position = new AMap.LngLat(item.lng, item.lat); //Marker 经纬度
    let marker = new AMap.Marker({
      position: position,
      content: markerContent, //将 html 传给 content
      offset: new AMap.Pixel(-13, -30), //以 icon 的 [center bottom] 为原点
    });
    marker.setTitle(item.name);
    marker.on("click", function (e) {
      zoomToPileStationView(item);
    })
    map.add(marker);
  }
}

const currentSelectCargoStation = ref(null);
function zoomToStationView(item) {
  currentSelectMarkerDataVin.value = "";
  currentSelectCargoStation.value = item;
  setMapCenterSafely(15, [item.longitude, item.latitude], () => {
    // 地图移动完成后显示InfoWindow
    openStationInfoWindow(item);
  });
}

const currentSelectPileStation = ref(null);
function zoomToPileStationView(item) {
  currentSelectMarkerDataVin.value = "";
  currentSelectPileStation.value = item;
  setMapCenterSafely(15, [item.lng, item.lat], () => {
    // 地图移动完成后显示InfoWindow
    openPileStationInfoWindow(item);
  });
}

function openStationInfoWindow(data) {
  if (!data.longitude || !data.latitude) {
    return;
  }
  let position = [data.longitude, data.latitude];
  if (!position || position.length !== 2) {
    console.error("send msg windowInfo open error,position param is invalid");
    return;
  }
  let infoWindowContent = `<div class="my_info_window">
      <div class="my_info_window_title">${data.goodsYardName}</div>
      <table class="my_info_window_table">
      <td class="my_info_window_table_col my_info_window_table_col_1">场站类型</td>
        <td class="my_info_window_table_col">${stationTypeMap[data.goodsYardType] || ''}</td>
      </tr>
      <tr class="my_info_window_table_row">
        <td class="my_info_window_table_col my_info_window_table_col_1">地址</td>
        <td class="my_info_window_table_col">${data.address}</td>
      </tr>
      <tr>
      <td class="my_info_window_table_col my_info_window_table_col_1">运营时间</td>
        <td class="my_info_window_table_col">${justHourMinute(data.openingTime)}${data.openingTime ? '->' : ''}${justHourMinute(data.closingTime)}</td>
      </tr>
      <tr>
        <td class="my_info_window_table_col my_info_window_table_col_1">休息模式</td>
        <td class="my_info_window_table_col">${holidayModeMap[data.holidayMode] || ''}</td>
      </tr>
      <tr>
        <td class="my_info_window_table_col my_info_window_table_col_1">所属公司</td>
        <td class="my_info_window_table_col">${data.companyName}</td>
      </tr>
</table>
</div>`

  // 创建一个自定义内容的 infowindow 实例
  let lnglat = new AMap.LngLat(position[0], position[1]);
  infoWindow = new AMap.InfoWindow({
    position: lnglat,
    offset: new AMap.Pixel(0, -30),
    content: infoWindowContent
  });
  if (map) {
    infoWindow.open(map);
    infoWindowOnClose();
  }
}

function openPileStationInfoWindow(data) {
  if (!data.lng || !data.lat) {
    return;
  }
  let position = [data.lng, data.lat];
  if (!position || position.length !== 2) {
    console.error("send msg windowInfo open error,position param is invalid");
    return;
  }
  let infoWindowContent = `<div class="my_info_window">
      <div class="my_info_window_title">${data.name}</div>
      <table class="my_info_window_table">
      <td class="my_info_window_table_col my_info_window_table_col_1">所属运营商</td>
        <td class="my_info_window_table_col">${data.orgName}</td>
      </tr>
      <tr class="my_info_window_table_row">
        <td class="my_info_window_table_col my_info_window_table_col_1">地址</td>
        <td class="my_info_window_table_col">${data.areaNamePath}</td>
      </tr>
      <tr>
      <td class="my_info_window_table_col my_info_window_table_col_1">全站功率</td>
        <td class="my_info_window_table_col">${data.totalStationPower ? data.totalStationPower + 'kW' : ''}</td>
      </tr>
      <tr>
        <td class="my_info_window_table_col my_info_window_table_col_1">电装类型</td>
        <td class="my_info_window_table_col">${data.pileType}</td>
      </tr>
      <tr>
        <td class="my_info_window_table_col my_info_window_table_col_1">电桩数量</td>
        <td class="my_info_window_table_col">${data.pileCount}</td>
      </tr>
      <tr>
        <td class="my_info_window_table_col my_info_window_table_col_1">电站型号</td>
        <td class="my_info_window_table_col">${data.stationModel}</td>
      </tr>
</table>
</div>`

  // 创建一个自定义内容的 infowindow 实例
  let lnglat = new AMap.LngLat(position[0], position[1]);
  infoWindow = new AMap.InfoWindow({
    position: lnglat,
    offset: new AMap.Pixel(0, -30),
    content: infoWindowContent
  });
  if (map) {
    infoWindow.open(map);
    infoWindowOnClose();
  }
}

function justHourMinute(timeString = "") {
  if (!timeString) return '';

  // 形式为: 12:34:56 转为 "12:34"
  let timeParts = timeString.split(':');
  if (timeParts.length < 2) return timeString; // 如果没有冒号，直接返回原字符串
  return `${timeParts[0]}:${timeParts[1]}`;
}

// endregion

// region 货运概况
const orderCount = ref(null);
async function loadOrderCount() {
  const res = await getOrderCount();
  orderCount.value = res.count;
}
const dispatchCount = ref(null);
async function loadDispatchCount() {
  const res = await getDispatchCount();
  dispatchCount.value = res[1].count;
}
const waybillCount = ref(null);
async function loadWaybillCount() {
  const res = await getWaybillCount();
  waybillCount.value = res[1].count;
}
const waybillTotalSuttle = ref(null);
async function loadWaybillTotalSuttle() {
  const res = await getWaybillTotalSuttle();
  waybillTotalSuttle.value = res[1].count;
}

function loadAllStatistics() {
  loadOrderCount().then(() => {
    loadDispatchCount().then(() => {
      loadWaybillCount().then(() => {
        loadWaybillTotalSuttle();
      });
    });
  });
}
let statisticsIntervalId = null;
function setIntervalLoadStatistics() {
  statisticsIntervalId = setInterval(() => {
    loadAllStatistics();
  }, 60 * 1000);
}
// endregion

//#region 补能站
const showPileStationList = ref(false);
const allPileStationList = ref([]);
function loadAllPileStation() {
  getAllStationSimpleList().then(res => {
    allPileStationList.value = res;

    showPileStationOnMap(res);
  })
}
//#endregion


// region 生命周期
let initWebSocketTimeoutId = null;
let weatherInternalId = null;
onMounted(() => {
  loadAllStatistics();
  setIntervalLoadStatistics();
  initMap().then(_ => {
    loadAllVehicleList().then(res => {
      initWebSocketAsync();
      setTimeout(() => {
        loadStationList();
      }, 1000);

      setTimeout(() => {
        loadAllPileStation();
      }, 1100);
    });
  });
  loadWeatherInfo();
  weatherInternalId = setInterval(() => {
    loadWeatherInfo();
  }, 10 * 1000)
})
onUnmounted(() => {
  map?.destroy();
  map = null;
  closeWebSocket();
  clearWebSocketTimeout();
  clearTimeoutInstance();
});
onBeforeRouteLeave(() => {
  map?.destroy();
  map = null;
  closeWebSocket();
  clearWebSocketTimeout();
  clearTimeoutInstance();
})
// endregion

// 显示所有覆盖物（包括车辆marker和场站marker）
function showAllOverlays() {
  if (!map) return;

  const allOverlays = map.getAllOverlays();
  const markers = allOverlays.filter(overlay => overlay.CLASS_NAME === 'AMap.Marker');

  if (markers.length > 0) {
    map.setFitView(markers, false, [50, 50, 50, 50]);
  }
}
</script>

<style lang="less">
@import "./index.less";
</style>
