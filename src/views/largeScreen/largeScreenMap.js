import { AMAP_KEY, CONFIG } from "@/config/config.js";
import { getAllSelfVehicleBaseList } from "@/api/api.vehicle.js";
import { stationTypeMap, holidayModeMap } from "@/config/const.js";
import AMapLoader from '@amap/amap-jsapi-loader';
import { ref } from "vue";
import html2canvas from 'html2canvas';
import { toMap } from "@/utils/util.js";

let map = null;
let stationPoint = CONFIG.stationPoint || [116.407526, 39.90403]; // 默认北京天安门

let infoWindow = null;
export function initMap() {
    return new Promise((resolve, reject) => {
        //地图初始化应该在地图容器div已经添加到DOM树之后
        AMapLoader.load({
            key: AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
            version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            zooms: [2, 20],
            plugins: ["AMap.Scale", 'AMap.ControlBar', 'AMap.ToolBar', 'AMap.MapType', 'Loca.Container', 'AMap.LabelsLayer', 'AMap.MarkerCluster'],
            Loca: {
                version: '2.0'
            }
        }).then((AMap) => {
            map = new AMap.Map("mainMap", {
                // 设置地图容器id
                // mapStyle: "amap://styles/darkblue", //设置地图的显示样式
                viewMode: "3D", // 是否为3D地图模式
                terrain: true, //开启地形图
                pitch: 0,
                rotateEnable: true,
                pitchEnable: true,
                rotation: 0,
                zoom: 12, // 初始化地图级别
                center: stationPoint, // 初始化地图中心点位置
                // mapType: 1, // 卫星地图
                WebGLParams: {
                    preserveDrawingBuffer: true // 允许从WebGL上下文中读取像素数据
                }
            });


            // let controlBar = new AMap.ControlBar({ //控制地图旋转插件
            //     position: {
            //         right: '10px',
            //         top: '10px'
            //     }
            // });
            // map.addControl(controlBar);
            // let toolBar = new AMap.ToolBar({ //地图缩放插件
            //     position: {
            //         right: '40px',
            //         top: '110px'
            //     }
            // });
            // map.addControl(toolBar);
            let scale = new AMap.Scale();
            map.addControl(scale);
            map.addControl(new AMap.MapType({
                defaultType: 1, //0代表默认，1代表卫星
                showRoad: true,//显示路况（右上角也可点击）
                position: {
                    right: '10px',
                    bottom: '110px'
                }
            }));
            // 添加鼠标坐标监听
            setupMouseCoordinateListener(map);

            // showStation(map);
            show120KmView();
            resolve();
        }).catch((e) => {
            console.error(e);
            reject(e);
        });
    })
}

// 地图截图
export function takeMapScreenshot() {
    if (!map) {
        console.error("地图未初始化");
        return Promise.reject(new Error("地图未初始化"));
    }

    try {
        // 使用高德地图容器进行截图
        const mapContainer = map.getContainer();
        if (!mapContainer) {
            console.error("无法获取地图容器");
            return Promise.reject(new Error("无法获取地图容器"));
        }

        // 使用html2canvas库截图地图容器
        if (html2canvas) {
            return html2canvas(mapContainer, {
                useCORS: true,
                allowTaint: true,
                scale: 1,
                backgroundColor: '#ffffff',
                logging: false, // 关闭日志输出
                ignoreElements: (element) => {
                    // 忽略一些可能导致截图失败的元素
                    return element.classList && (
                        element.classList.contains('amap-copyright') ||
                        element.classList.contains('amap-logo') ||
                        element.classList.contains("amap-control")
                    );
                }
            }).then(canvas => {
                return canvas.toDataURL("image/png");
            }).catch(error => {
                console.error("截图失败:", error);
                throw error;
            });
        } else {
            // 备用方案：提示用户html2canvas库未加载
            const message = "html2canvas库未加载，无法进行截图";
            console.warn(message);
            return Promise.reject(new Error(message));
        }
    } catch (error) {
        console.error("截图过程中发生错误:", error);
        return Promise.reject(error);
    }
}


export function show120KmView() {
    if (!map) return;
    // map.setZoomAndCenter(12, stationPoint);
    // 设置上下左右四个点,分别扩展120km
    const southWest = new AMap.LngLat(stationPoint[0] - 1.08, stationPoint[1] - 0.72);
    const northEast = new AMap.LngLat(stationPoint[0] + 1.08, stationPoint[1] + 0.72);
    map.setBounds(new AMap.Bounds(southWest, northEast));
}

export function showAllOverlays() {
    if (!map) return;

    const allOverlays = map.getAllOverlays();
    const markers = allOverlays.filter(overlay => overlay.CLASS_NAME === 'AMap.Marker');

    if (markers.length > 0) {
        map.setFitView(markers, false, [300, 300, 300, 300]);
    }
}


export function showStationListOnMap(stationParentType = '', dataList) {
    if (!map) return;
    if (!dataList) return;
    // 清除之前的站点
    map.clearMap();
    // stationList.forEach(station => {
    //     let lat = station.lat || station.latitude;
    //     let lng = station.lng || station.longitude;
    //     if (!lat || !lng) {
    //         console.warn(`站点 ${station.name} 的经纬度信息不完整，无法显示在地图上。`);
    //         return;
    //     }
    //     const marker = new AMap.Marker({
    //         position: [lng, lat],
    //         title: station.name,
    //         label: {
    //             content: station.name,
    //             offset: new AMap.Pixel(0, -20)
    //         }
    //     });
    //     marker.setMap(map);
    // });
    // showAllOverlays();

    if (stationParentType === "货场") {
        showCargoStationOnMap(dataList);
    } else if (stationParentType === "补能站") {
        showPileStationOnMap(dataList);
    }

    showAllOverlays();
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

const currentSelectPileStation = ref(null);
function zoomToPileStationView(item) {
    currentSelectPileStation.value = item;
    setMapCenterSafely(null, [item.lng, item.lat], () => {
        // 地图移动完成后显示InfoWindow
        openPileStationInfoWindow(item);
    });
}

const currentSelectCargoStation = ref(null);
function zoomToStationView(item) {
    currentSelectCargoStation.value = item;
    setMapCenterSafely(null, [item.longitude, item.latitude], () => {
        // 地图移动完成后显示InfoWindow
        openStationInfoWindow(item);
    });
}


// 辅助函数：安全地设置地图中心并在完成后执行回调
function setMapCenterSafely(zoom, center, callback) {
    if (!map) return;

    // 设置地图中心和缩放级别
    if (zoom) {
        map.setZoomAndCenter(zoom, center);
    }

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
        infoWindow.open(map, false); // 第二个参数设为 false，不自动调整地图视野
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
        infoWindow.open(map, false);
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
    });
}

const mouseCoordinate = ref({
    lng: '0.000000',
    lat: '0.000000',
    show: false
});


// 设置鼠标坐标监听器
function setupMouseCoordinateListener(map) {
    map.on('click', function (e) {
        // 清除windowInfo
        // if (infoWindow) {
        //     infoWindow.close();
        //     infoWindow = null;
        // }
        mouseCoordinate.value.lng = e.lnglat.lng;
        mouseCoordinate.value.lat = e.lnglat.lat;
        mouseCoordinate.value.show = true;
    });

    // map.on('mouseleave', function () {
    //   mouseCoordinate.value.show = false;
    // });
}

function justHourMinute(timeString = "") {
    if (!timeString) return '';

    // 形式为: 12:34:56 转为 "12:34"
    let timeParts = timeString.split(':');
    if (timeParts.length < 2) return timeString; // 如果没有冒号，直接返回原字符串
    return `${timeParts[0]}:${timeParts[1]}`;
}


/* 示例
executingOrderList  = [{
  "orderId": "A1952716861846196224",
  "contractId": "",
  "contractItemId": "",
  "shipperId": "A1934870275632013312",
  "goodsItemId": "A1934870274826706944",
  "trucklineId": "",
  "orderNumber": "TC20250805003",
  "freightVolume": 2000,
  "loadAddress": "南露天矿",
  "unloadAddress": "创源金属",
  "beginTime": "2025-08-06 06:30:00",
  "endTime": "2025-08-06 21:00:00",
  "contactUserName": "",
  "contactPhone": "",
  "orderStatus": 2,
  "transportRequire": "",
  "orderFileIds": "",
  "remark": "",
  "createUser": "A1948292612726235136",
  "createTime": "2025-08-05 21:02:34",
  "modifyUser": "",
  "modifyTime": null,
  "delFlag": 0,
  "proxyWay": "2",
  "pricingMethod": 1,
  "unitPrice": 15.5,
  "estimatedTonnage": 2000,
  "estimatedTrips": 30,
  "estimatedAmount": 31000,
  "settlementMethod": 3,
  "settlementPlatform": "创源智运",
  "loadAddressStation": {
    "locationId": "A1952532793863049216",
    "locationName": "",
    "address": "",
    "longitude": 119.603761,
    "latitude": 45.515596,
    "remark": "",
    "locationRange": ""
  },
  "unloadAddressStation": {
    "locationId": "A1951887793739403264",
    "locationName": "",
    "address": "",
    "longitude": 119.447307,
    "latitude": 45.447721,
    "remark": "",
    "locationRange": ""
  }
}]
*/
export function showOrderLineOnMap(executingOrderList = [], lineClickCallback = null) {
    if (!executingOrderList || executingOrderList.length === 0) {
        return;
    }

    // 清除之前的传统标记和线条
    map.remove(map.getAllOverlays('polyline'));
    map.remove(map.getAllOverlays('marker'));

    // 清除Loca.Container
    if (loca) {
        loca.remove(outLinelayer);
        loca.remove(startScatter);
        loca.remove(endScatter);
    }
    // 重新绘制订单线路
    drawOrderLineOnMap(executingOrderList, lineClickCallback);
}

let loca = null;
let outLinelayer = null;
let startScatter = null;
let endScatter = null;
function drawOrderLineOnMap(executingOrderList = [], lineClickCallback = null) {
    loca = new Loca.Container({
        map,
    });
    var labelLayer = new AMap.LabelsLayer({
        rejectMapMask: true,
        collision: true,
        animation: true,
    });
    map.add(labelLayer);
    // 颜色配置
    var headColors = ['#ECFFB1', '#146968', '#146968', '#146968'];
    var trailColors = [
        'rgba(255,178,6, 0.2)',
        'rgba(255,178,6, 0.2)',
        'rgba(20,105,104, 0.2)',
        'rgba(20,105,104, 0.2)',
    ];


    // 出北京方向的线
    // var outLineSource = new Loca.GeoJSONSource({
    //     url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/data-line-out.json',
    // });

    let genLineGeoJSON = () => {
        let newJSON = {
            'type': 'FeatureCollection',
            'features': executingOrderList.map(order => {
                return {
                    'type': 'Feature',
                    'properties': {
                        type: 'order',
                        orderId: order.orderId,
                        loadAddress: order.loadAddress,
                        unloadAddress: order.unloadAddress,
                    },
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [[order.loadAddressStation.longitude, order.loadAddressStation.latitude], [order.unloadAddressStation.longitude, order.unloadAddressStation.latitude]],
                    },
                };
            }).flat(),
        };
        return newJSON;
    }
    let lineGeoJson = genLineGeoJSON();

    let lineSource = new Loca.GeoJSONSource({
        data: lineGeoJson,
    });

    outLinelayer = new Loca.PulseLineLayer({
        // loca,
        zIndex: 1000, // 提高 zIndex 确保在最上层
        opacity: 1,
        visible: true,
        zooms: [2, 22],
    });

    outLinelayer.setStyle({
        altitude: 0,
        lineWidth: (_, feature) => 8, // 增加线条宽度便于点击
        headColor: (_, feature) => headColors[0],
        trailColor: (_, feature) => trailColors[0],
        interval: 0.4,
        duration: 20000,
    });
    outLinelayer.setSource(lineSource);
    loca.add(outLinelayer);

    // 起始点呼吸点层
    startScatter = new Loca.ScatterLayer({
        // loca,
        zIndex: 10,
        opacity: 1,
        visible: true,
        zooms: [2, 22],
    });

    let genStartPointGeoJSON = () => {
        let newJSON = {
            'type': 'FeatureCollection',
            'features': executingOrderList.map(order => {
                return [
                    {
                        'type': 'Feature',
                        'properties': {
                            lineWidthRatio: 1, // 用于控制点的大小
                            orderId: order.orderId,
                            loadAddress: order.loadAddress,
                            unloadAddress: order.unloadAddress,
                        },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [order.loadAddressStation.longitude, order.loadAddressStation.latitude],
                        },
                    },
                    // {
                    //     'type': 'Feature',
                    //     'properties': {
                    //         lineWidthRatio: 1, // 用于控制点的大小
                    //         orderId: order.orderId,
                    //         loadAddress: order.loadAddress,
                    //         unloadAddress: order.unloadAddress,
                    //     },
                    //     'geometry': {
                    //         'type': 'Point',
                    //         'coordinates': [order.unloadAddressStation.longitude, order.unloadAddressStation.latitude],
                    //     },
                    // },
                ]
            }).flat(),
        };
        return newJSON;
    }
    let startPointGeoJson = genStartPointGeoJSON();
    let startPointSource = new Loca.GeoJSONSource({
        data: startPointGeoJson,
    });
    startScatter.setSource(startPointSource);
    startScatter.setStyle({
        unit: 'px',
        size: (_, feature) => {
            var size = feature.properties.lineWidthRatio * 2 + 30;
            return [size, size];
        },
        borderWidth: 0,
        texture: 'https://a.amap.com/Loca/static/static/green.png',
        duration: 1500,
        animate: true,
    });
    loca.add(startScatter);


    // 终点呼吸点层
    endScatter = new Loca.ScatterLayer({
        // loca,
        zIndex: 10,
        opacity: 1,
        visible: true,
        zooms: [2, 22],
    });

    let genEndPointGeoJSON = () => {
        let newJSON = {
            'type': 'FeatureCollection',
            'features': executingOrderList.map(order => {
                return [
                    // {
                    //     'type': 'Feature',
                    //     'properties': {
                    //         lineWidthRatio: 1, // 用于控制点的大小
                    //         orderId: order.orderId,
                    //         loadAddress: order.loadAddress,
                    //         unloadAddress: order.unloadAddress,
                    //     },
                    //     'geometry': {
                    //         'type': 'Point',
                    //         'coordinates': [order.loadAddressStation.longitude, order.loadAddressStation.latitude],
                    //     },
                    // },
                    {
                        'type': 'Feature',
                        'properties': {
                            lineWidthRatio: 1, // 用于控制点的大小
                            orderId: order.orderId,
                            loadAddress: order.loadAddress,
                            unloadAddress: order.unloadAddress,
                        },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [order.unloadAddressStation.longitude, order.unloadAddressStation.latitude],
                        },
                    },
                ]
            }).flat(),
        };
        return newJSON;
    }
    let endPointGeoJson = genEndPointGeoJSON();
    let endPointSource = new Loca.GeoJSONSource({
        data: endPointGeoJson,
    });
    endScatter.setSource(endPointSource);
    endScatter.setStyle({
        unit: 'px',
        size: (_, feature) => {
            var size = feature.properties.lineWidthRatio * 2 + 30;
            return [size, size];
        },
        borderWidth: 0,
        texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_yellow.png',
        duration: 1500,
        animate: true,
    });

    loca.add(endScatter);



    // 文字图层
    var setLabelsLayer = (dataList) => {
        labelLayer.clear();
        dataList.forEach((item) => {
            var labelsMarker = new AMap.LabelMarker({
                name: item.loadAddress,
                position: [item.loadAddressStation.longitude, item.loadAddressStation.latitude],
                zooms: [2, 22],
                opacity: 1,
                zIndex: 10,
                text: {
                    content: item.loadAddress,
                    direction: 'bottom',
                    offset: [0, -5],
                    style: {
                        fontSize: 13,
                        fontWeight: 'normal',
                        fillColor: '#fff',
                    },
                },
            });
            labelLayer.add(labelsMarker);

            var labelsMarker = new AMap.LabelMarker({
                name: item.loadAddress,
                position: [item.unloadAddressStation.longitude, item.unloadAddressStation.latitude],
                zooms: [2, 22],
                opacity: 1,
                zIndex: 10,
                text: {
                    content: item.unloadAddress,
                    direction: 'bottom',
                    offset: [0, -5],
                    style: {
                        fontSize: 13,
                        fontWeight: 'normal',
                        fillColor: '#fff',
                    },
                },
            });
            labelLayer.add(labelsMarker);
        });
    };

    setLabelsLayer(executingOrderList);

    loca.animate.start();

    // 通过地图点击事件查询 Loca 图层
    map.on("click", (e) => {
        // 使用正确的方法查询点击位置的要素
        const pixel = [e.pixel.x, e.pixel.y];

        // 查询所有 Loca 图层中的要素
        const lineFeatures = outLinelayer.queryFeature(pixel);

        console.log('点击查询结果:', lineFeatures);
        if (lineClickCallback && typeof lineClickCallback === 'function') {
            lineClickCallback(lineFeatures);
        }
        return;
    });
}



let currentSelectMarkerDataVin = ref("");



export function showAllVehicleOnMap(realTimeDataList = []) {
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


// region 车辆

const loadingVehicle = ref(false);
const allVehicleList = ref([]);
let allVehicleMap = new Map();

export async function loadAllVehicleList() {
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
        // let zoom = map.getZoom();
        setMapCenterSafely(null, [data.lnglat.lng, data.lnglat.lat], () => {
            // 地图移动完成后更新InfoWindow位置
            if (infoWindow) {
                infoWindow.setPosition(data.lnglat);
            }
        });
    }
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
// endregion