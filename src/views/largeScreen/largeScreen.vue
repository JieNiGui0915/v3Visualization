<template>
    <div class="largeScreen">
        <!-- 顶部标题栏 -->
        <header class="screen-header">
            <div class="flex-1"></div>
            <div class="main-title">
                <img src="@/assets/screen/logo.png" alt="logo" class="logo">
                大宗货物整车区域物流平台
            </div>
            <div class="flex-1"></div>
        </header>
        <!-- 天气及日期-->
        <div class="screen-weather-date">
            <div class="weather-info" v-if="weatherInfo">
                <div class="temperature">
                    <span>{{ weatherInfo.city }}</span>
                    <span style="margin: 0 4px;color: #323232;"> | </span>
                    <template v-if="weatherInfo.casts">
                        <span>{{ weatherInfo.casts[0].dayweather }}</span>
                        <span style="margin: 0 4px;color: #323232;"> | </span>
                    </template>
                    <span v-if="weatherInfo.casts"> {{ weatherInfo.casts[0].nighttemp }} ~ {{
                        weatherInfo.casts[0].daytemp }}</span>
                    <span style="font-size: 12px;padding-left: 4px;">℃</span>


                    <template v-if="currentWeatherInfo && currentWeatherInfo.rh && currentWeatherInfo.temp">
                        <span style="margin: 0 4px;color: #323232;"> | </span>
                        <span>RH: {{ currentWeatherInfo.rh }}%</span>
                        <span style="margin: 0 4px;color: #323232;"> | </span>
                        <span>Temp: {{ currentWeatherInfo.temp }}℃</span>
                    </template>
                </div>
            </div>
            <div class="flex-1"></div>
            <div class="datetime">
                <div class="time">
                    <span>{{ currentDate }}</span>
                    <span style="margin: 0 4px;color: #323232;"> | </span>
                    <span>{{ currentWeek }}</span>
                    <span style="margin: 0 4px;color: #323232;"> | </span>
                    <span>{{ currentTime }}</span>
                </div>
            </div>
        </div>
        <!-- 主体内容区域 -->
        <main class="screen-main">
            <!-- 左侧面板 -->
            <section class="left-panel">
                <!-- 货运态势 -->
                <div class="panel-item freight-trend">
                    <div class="panel-header">
                        <h3>货运态势</h3>
                        <div class="panel-controls history-btn-wrap">
                            <el-date-picker v-model="searchParam.date" class="screen_date_picker" :clearable="false"
                                :editable="false" value-format="YYYY-MM-DD" :disabled-date="disabledDate" prefix-icon=""
                                size="default" :type="searchParam.type" placeholder=""
                                @change="handleHistoryRangeDateChange"
                                v-if="searchParam.type === 'year' || searchParam.type === 'month'" />
                            <el-select v-model="searchParam.type" placeholder="" class="screen_select"
                                style="width: 80px;" @change="handleHistoryRangeDateTypeChange">
                                <el-option v-for="(item, index) in historyRangeDateOptions" :key="item.label"
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="panel-header">
                        <div class="panel-controls">
                            <div class="control-item">
                                <div class="control-item_line" :style="{ backgroundColor: freightChartColors[0] }">
                                </div>
                                <div class="control-item_text">运单</div>
                            </div>
                            <div class="control-item">
                                <div class="control-item_line" :style="{ backgroundColor: freightChartColors[1] }">
                                </div>
                                <div class="control-item_text">运量(吨)</div>
                            </div>
                        </div>
                        <div class="flex-1"></div>
                    </div>
                    <div class="chart-container">
                        <div id="freightChart" class="chart"></div>
                    </div>
                </div>

                <!-- 运量占比 -->
                <div class="panel-item operation-ratio">
                    <div class="panel-header">
                        <h3>运量占比</h3>
                        <div class="panel-controls">
                            <el-select v-model="selectedTypeName" placeholder="" class="screen_select"
                                style="width: 110px;" @change="loadCargoTotalList">
                                <el-option v-for="(client, index) in operationTypeNameList" :key="index" :label="client"
                                    :value="client">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="chart-container">
                        <div id="operationChart" class="chart"></div>
                    </div>
                </div>

                <!-- 司机运量排名 -->
                <div class="panel-item driver-ranking">
                    <div class="panel-header">
                        <h3>司机运量排名</h3>
                        <span class="unit">运量(吨)</span>
                    </div>
                    <div class="ranking-list">
                        <div class="ranking-item" v-for="(driver, index) in driverRanking" :key="index">
                            <span class="driver-name">{{ driver.driverName }}</span>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: driver.percent + '%' }"></div>
                            </div>
                            <span class="driver-value">{{ driver.totalCargo }}</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 中间地图区域 -->
            <section class="center-map">
                <div class="map-container">
                    <div id="mainMap" class="map"></div>
                </div>
                <!-- 左侧按钮列 -->
                <div class="station_type_btn_wrap">
                    <template v-if="showStationType">
                        <div class="station_type_close_btn">
                            <img class="station_type_close_btn_img" src="../../assets/screen/box_btn_close.png"
                                alt="close" @click="handleCloseStationType">
                        </div>
                        <div class="station_type_btn" :class="{ active: currentStationType === item }"
                            v-for="(item, index) in allStationTypeList" :key="index"
                            @click="handleSelectStationType(item)">
                            <img class="station_icon" src="../../assets/screen/circle_green.png" alt=""
                                v-if="item.parentType === '补能站'" title="补能站">
                            <img class="station_icon" src="../../assets/screen/triangle_yellow.png" alt=""
                                v-if="item.parentType === '货场'" title="货场">
                            <img class="station_icon" src="../../assets/screen/rectangle_blue.png" alt=""
                                v-if="item.parentType === '车服站'" title="车服站">
                            <span class="station_type">{{ item.stationType }}</span>
                            <span class="station_count"> ({{ item.count }})</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="station_type_btn" @click="handleShowStationType">
                            <span class="station_type">场站</span>
                            <span class="station_count">({{allStationTypeList.reduce((total, item) => total +
                                item.count, 0)}})</span>
                            <el-icon style="margin-left: 5px;">
                                <ArrowDown />
                            </el-icon>
                        </div>
                    </template>
                </div>
                <!-- 底部数据指标 -->
                <div class="bottom-indicators">
                    <div class="indicator-item">
                        <div class="indicator-label">车辆总数</div>
                        <div class="indicator-value">{{ indicators.vehicleTotal }}</div>
                    </div>
                    <div class="indicator-item">
                        <div class="indicator-label">司机总数</div>
                        <div class="indicator-value">{{ indicators.driverTotal }}</div>
                    </div>
                    <div class="indicator-item">
                        <div class="indicator-label">充电桩数</div>
                        <div class="indicator-value">{{ indicators.chargingPiles }}</div>
                    </div>
                    <div class="indicator-item">
                        <div class="indicator-label">累计运单</div>
                        <div class="indicator-value">{{ indicators.totalWaybills }}</div>
                    </div>
                    <div class="indicator-item">
                        <div class="indicator-label">累计运量(t)</div>
                        <div class="indicator-value">{{ indicators.totalTransport }}</div>
                    </div>
                    <div class="indicator-item">
                        <div class="indicator-label">累计里程(km)</div>
                        <div class="indicator-value">{{ indicators.totalMileage }}</div>
                    </div>
                    <div class="indicator-item">
                        <div class="indicator-label">累计电耗(kWh)</div>
                        <div class="indicator-value">{{ indicators.totalPowerConsumption }}</div>
                    </div>
                </div>
                <!-- 地图操作按钮 -->
                <div class="show_map_bound_wrap">
                    <div class="show_map_bound" @click="largeScreenMap.show120KmView" title="展示120公里范围">
                        <img class="show_map_bound_icon" src="../../assets/images/maximize.png" alt="trucks">
                    </div>
                    <div class="show_map_bound" @click="largeScreenMap.showAllOverlays" title="显示所有车辆">
                        <img class="show_map_bound_icon" src="../../assets/images/trucks.png" alt="maximize">
                    </div>
                </div>
                <!-- 订单信息 -->
                <div class="order_info_btn_wrap">
                    <div class="order_info_btn">
                        <span class="order_info_text">进行中订单({{ executingOrderList.length }})</span>
                        <el-icon style="margin-left: 5px;">
                            <ArrowDown />
                        </el-icon>
                        <el-date-picker v-model="orderDate" class="order-date-picker" type="date" placeholder=""
                            :edit-able="false" :disabled-date="disabledDate" prefix-icon="" :shortcuts="shortcuts"
                            size="default" @change="loadOrderListByDate" />
                    </div>
                    <!-- 测试按钮 -->
                    <button @click="testOrderDialog" style="margin-left: 10px; padding: 5px 10px; background: #00ffff; color: #000; border: none; border-radius: 3px; cursor: pointer;">
                        测试订单弹窗
                    </button>
                    <button @click="testChargingStationDialog" style="margin-left: 10px; padding: 5px 10px; background: #00ff00; color: #000; border: none; border-radius: 3px; cursor: pointer;">
                        测试充电站弹窗
                    </button>
                    <button @click="testHeavyTruckDialog" style="margin-left: 10px; padding: 5px 10px; background: #ffff00; color: #000; border: none; border-radius: 3px; cursor: pointer;">
                        测试重型半挂弹窗
                    </button>
                </div>
            </section>

            <!-- 右侧面板 -->
            <section class="right-panel">
                <!-- 充电态势 -->
                <div class="panel-item charging-trend">
                    <div class="panel-header">
                        <h3>充电态势</h3>
                        <div class="panel-controls">
                            <div class="control-item" v-for="value in chargingStatusList" :key="value.stationName">
                                <div class="control-item_line" :style="{ background: value.color }"></div>
                                <div class="control-item_text">{{ value.stationName }}</div>
                            </div>
                        </div>
                    </div>

                    <div id="chargingChart" class="chart"></div>
                </div>

                <!-- 电能分析 -->
                <div class="panel-item energy-analysis">
                    <div class="panel-header">
                        <h3>电能分析</h3>
                        <div class="panel-controls">
                            <div class="control-item" v-for="(name, index) in energyChartNames" :key="name">
                                <div class="control-item_dash" v-if="name === 'SOC'">
                                </div>
                                <div class="control-item_line" :style="{ background: energyChartColors[index][2] }"
                                    v-else>
                                </div>
                                <div class="control-item_text">{{ name }}</div>
                            </div>
                        </div>
                    </div>
                    <div id="energyChart" class="chart"></div>
                </div>

                <!-- 碳排降碳 -->
                <div class="panel-item carbon-reduction">
                    <div class="panel-header">
                        <h3>减排降碳</h3>
                    </div>
                    <div class="carbon-stats">
                        <div class="carbon-item">
                            <div class="carbon-label">电车里程(km)</div>
                            <div class="carbon-value" style="color: #51c6fa;">{{ indicators.totalMileage }}
                            </div>
                        </div>
                        <div class="carbon-item">
                            <div class="carbon-label">电车电耗(kWh)</div>
                            <div class="carbon-value" style="color: #f5b24a;">{{ indicators.totalPowerConsumption }}
                            </div>
                        </div>
                        <div class="carbon-item">
                            <div class="carbon-label">电车占比</div>
                            <div class="carbon-value" style="color: #46f28c;">{{ indicators.electricVehicleProportion
                            }}<span class="unit">%</span>
                            </div>
                        </div>
                    </div>
                    <div class="carbon-comparison">
                        <div class="comparison-item fuel">
                            <img class="comparison-item-img" :src="oil_img" alt="">
                            <div class="label">减少油耗</div>
                            <div class="value">{{ carbonData.fuelConsumption }} <span style="font-size: 10px;">L</span>
                            </div>
                        </div>
                        <div class="comparison-item carbon">
                            <img class="comparison-item-img" :src="co2_img" alt="">
                            <div class="label">减少碳排放</div>
                            <div class="value">{{ carbonData.carbonEmission }} <span style="font-size: 10px;">t</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <!-- <div id="large_screen_map"></div> -->
        <order-dialog ref="orderDialogRef" @close="handleClosedDialog"></order-dialog>
        <charging-station-dialog ref="chargingStationDialogRef" @close="handleClosedDialog"></charging-station-dialog>
        <heavy-truck-dialog ref="heavyTruckDialogRef" @close="handleClosedDialog"></heavy-truck-dialog>
    </div>
</template>
<script setup>
// 设计图: https://codesign.qq.com/app/s/573987615079335
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue';
import * as echarts from 'echarts';
import { ArrowDown } from '@element-plus/icons-vue';
import { getWeatherForecastInfo } from "@/api/api.weather.js";
import { GlobalStore } from "@/store/index.js";
import * as largeScreenMap from './largeScreenMap.js';
import * as largeScreenWebSocket from './largeScreenWebSocket.js';
import * as screenApi from "@/api/api.screen.js";
import { getVehicleCount } from "@/api/api.vehicle.js";
import { getDriverCount } from "@/api/api.driver.js";
import { getPileCount } from "@/api/api.pile.js";
import { getWayBillTotalCount, getWayBillTotalSettleWeight } from "@/api/api.waybill.js";
import { getOrderListByDate } from "@/api/api.order.js";
import { CONFIG } from "@/config/config.js";
import co2_img from "@/assets/screen/co2.png";
import oil_img from "@/assets/screen/oil.png";
import orderDialog from './components/orderDialog.vue';
import chargingStationDialog from './components/chargingStationDialog.vue';
import heavyTruckDialog from './components/heavyTruckDialog.vue';
import { formatDate, removeYearStr } from "@/utils/util.js";

// 响应式数据
const currentTime = ref('');
const currentDate = ref('');
const currentWeek = ref('');
let weatherIntervalInstance = null;
const globalStore = GlobalStore();
const historyRangeDateOptions = ref([{ label: '30天', value: 'r30' }, { label: '月', value: 'month' }, { label: '年', value: 'year' }]);
const searchParam = ref({
    type: historyRangeDateOptions.value[0].value,
    date: ''
});

function handleHistoryRangeDateTypeChange() {
    if (!searchParam.value.date) {
        let now = new Date();
        searchParam.value.date = formatDate(now);
    }

    // 触发数据加载
    handleHistoryRangeDateChange();
}


function handleHistoryRangeDateChange() {
    load(searchParam.value);
}


// 碳排数据
const carbonData = ref({
    electricMileage: 245,
    electricConsumption: 245,
    electricRatio: 80,
    fuelConsumption: 245,
    carbonEmission: 245
});

// 时间更新
let timeInterval = null;

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTime.value = `${hours}:${minutes}:${seconds}`;

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    currentDate.value = `${year}/${month}/${day}`;
    currentWeek.value = weekday;
};


//#region 货运态势
const monthsCargoTransportSituationList = ref([]);
function loadCargoTransportSituation(param) {
    screenApi.getCargoTransportSituationReq(param).then(res => {
        monthsCargoTransportSituationList.value = res;
        initFreightChart(res);
    });
}


let freightChart = null;
const freightChartColors = ref(["#d6c819", "#00ffff"])

function initFreightChart(dataList = []) {
    // 货运态势折线图 - 带面积渐变
    if (!freightChart) {
        const chartDom = document.getElementById('freightChart');
        if (!chartDom) return;

        freightChart = echarts.init(chartDom);
    }

    let axisLabelRotate = 0;
    if (searchParam.value.type === 'r30') {
        axisLabelRotate = 60;
    } else if (searchParam.value.type === 'month') {
        axisLabelRotate = 45;
    } else {
        axisLabelRotate = 0;
    }

    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            top: '20%',
            containLabel: true
        },
        // legend: {
        //     data: ["运单", "运量(吨)"],
        //     right: '15%',
        //     // 文字颜色
        //     textStyle: {
        //         color: '#a0a0a0',
        //         fontSize: 12
        //     }
        // },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: dataList.map(item => removeYearStr(item.date) + (searchParam.value.type === 'year' ? '' : '')),
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            // 倾斜30度显示,显示全部
            axisLabel: {
                color: '#a0a0a0',
                fontSize: 10,
                rotate: axisLabelRotate,
                // formatter: function (value) {
                //     return value.split("").join("\n");
                // }
            },
            axisTick: {
                show: false
            }
        }],
        // 左右两个竖轴
        yAxis: [{
            type: 'value',
            name: '运单数',
            nameTextStyle: {
                color: '#a0a0a0',
                fontSize: 10
            },
            position: 'left',
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#a0a0a0',
                fontSize: 10
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.1)',
                    type: 'dashed'
                }
            },
            axisTick: {
                show: false
            }
        }, {
            type: 'value',
            name: '运量(吨)',
            nameTextStyle: {
                color: '#a0a0a0',
                fontSize: 10
            },
            position: 'right',
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#a0a0a0',
                fontSize: 10
            },
            splitLine: {
                show: false  // 右轴不显示分割线，避免重复
            },
            axisTick: {
                show: false
            }
        }],
        series: [
            {
                name: '运单',
                type: 'line',
                yAxisIndex: 0,  // 使用左侧Y轴
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                showSymbol: false,
                data: dataList.map(item => item.wayBillCount),
                lineStyle: {
                    color: freightChartColors.value[0],
                    width: 3,
                    shadowColor: 'rgba(13, 57, 139, 0.5)',
                    shadowBlur: 10
                },
                itemStyle: {
                    color: freightChartColors.value[0],
                    borderColor: '#fff',
                    borderWidth: 2
                },
                areaStyle: {
                    // 向下渐变的面积填充
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1, // 从上到下的渐变方向
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(0, 155, 255, 0.6)' // 顶部颜色 - 较浓
                            },
                            {
                                offset: 0.3,
                                color: 'rgba(0, 155, 255, 0.3)' // 中上部颜色
                            },
                            {
                                offset: 0.7,
                                color: 'rgba(0, 155, 255, 0.1)' // 中下部颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(0, 155, 255, 0.02)' // 底部颜色 - 几乎透明
                            }
                        ]
                    }
                },
                z: 2  // 设置较高的层级，显示在上方
            },
            {
                name: '运量(吨)',
                type: 'line',
                yAxisIndex: 1,  // 使用右侧Y轴
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                showSymbol: false,
                data: dataList.map(item => item.cargoCount),
                lineStyle: {
                    color: freightChartColors.value[1],
                    width: 3,
                    shadowColor: 'rgba(0, 255, 255, 0.5)',
                    shadowBlur: 10
                },
                itemStyle: {
                    color: freightChartColors.value[1],
                    borderColor: '#fff',
                    borderWidth: 2
                },
                areaStyle: {
                    // 向下渐变的面积填充
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1, // 从上到下的渐变方向
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(0, 255, 255, 0.4)' // 顶部颜色 - 较淡
                            },
                            {
                                offset: 0.3,
                                color: 'rgba(0, 255, 255, 0.2)' // 中上部颜色
                            },
                            {
                                offset: 0.7,
                                color: 'rgba(0, 255, 255, 0.08)' // 中下部颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(0, 255, 255, 0.01)' // 底部颜色 - 几乎透明
                            }
                        ]
                    }
                },
                z: 1  // 设置较低的层级，显示在下方
            },
        ],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: '#00ffff',
            borderWidth: 1,
            textStyle: {
                color: '#ffffff',
                fontSize: 12
            },
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.5)',
                    type: 'dashed'
                }
            }
        }
    };

    freightChart.setOption(option);
};

//#endregion

//#region 运量占比

// 按委托人/按货场/按车队/按车型
const operationTypeNameList = ref(["按委托人", "按货场", "按车队", "按车型"]);
const selectedTypeName = ref("按委托人");
const cargoTotalList = ref([]);
function loadCargoTotalList() {
    let params = {
        typeName: selectedTypeName.value,
        ...searchParam.value
    }
    screenApi.getCargoTransportSituationRatio(params).then(res => {
        cargoTotalList.value = res;
        initOperationChart(res);
    })
}


let operationChart = null;
function initOperationChart(dataList = []) {
    // 运量占比饼图
    if (!operationChart) {
        const chartDom = document.getElementById('operationChart');
        if (!chartDom) return;

        operationChart = echarts.init(chartDom);
    }

    // 饼图配置,配置成空心环,中间显示文字:运量(吨)
    const option = {
        grid: {
            left: '15%',
            right: '15%',
            bottom: '0%',
            top: '18%',
            containLabel: true
        },
        tooltip: {
            trigger: 'item'
        },
        backgroundColor: 'transparent',
        graphic: [
            {
                type: 'text',
                left: 'center',
                top: 'center',
                style: {
                    text: '运量(吨)',
                    fontSize: 16,
                    fontWeight: 'bold',
                    fill: '#ffffff',
                    textAlign: 'center'
                }
            }
        ],
        series: [
            {
                name: '运量占比',
                type: 'pie',
                radius: ['40%', '60%'], // 内半径30%，外半径60%，形成空心环
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    // borderRadius: 8,
                    // borderColor: '#fff',
                    // borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'outside',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 'normal',
                    formatter: '{b}\n{d}%'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 255, 255, 0.5)'
                    }
                },
                data: dataList.map(item => {
                    return {
                        name: item.typeValue,
                        value: item.amount
                    };
                })
            }
        ],
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: '#00ffff',
            borderWidth: 1,
            textStyle: {
                color: '#ffffff',
                fontSize: 12
            },
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        }
    };

    operationChart.setOption(option);
};

//#endregion
const chargingStatusList = ref([]);
let chargingStatusColors = [['rgba(0, 255, 255, 0.8)', 'rgba(0, 255, 255, 0.2)'], ['rgba(0, 150, 255, 0.8)', 'rgba(0, 150, 255, 0.2)'], ['rgba(255, 0, 0, 0.8)', 'rgba(255, 0, 0, 0.2)']];
function loadTotalChargingStatus(param) {
    screenApi.getTotalChargingStatus(param).then(res => {
        res = res.map((item, index) => {
            return {
                ...item,
                color: chargingStatusColors[index][0]
            }
        })
        chargingStatusList.value = res;
        initChargingChart(res);
    });
}

let chargingChart = null;
function initChargingChart(dataList = []) {
    // 充电态势柱状图 - 带面积渐变效果
    if (!chargingChart) {
        const chartDom = document.getElementById('chargingChart');
        if (!chartDom) return;

        chargingChart = echarts.init(chartDom);
    }


    let axisLabelRotate = 0;
    if (searchParam.value.type === 'r30') {
        axisLabelRotate = 60;
    } else if (searchParam.value.type === 'month') {
        axisLabelRotate = 45;
    } else {
        axisLabelRotate = 0;
    }
    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: dataList[0].dataList.map(p => removeYearStr(p.date) + (searchParam.value.type === 'year' ? '' : '')),
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#a0a0a0',
                fontSize: 8,
                rotate: axisLabelRotate
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            name: "充电量(kWh)",
            axisLine: {
                show: false
            },
            axisLabel: {
                color: '#a0a0a0',
                fontSize: 10
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.1)',
                    type: 'dashed'
                }
            }
        },
        series: dataList.map((p, i) => {
            return {
                name: p.stationName,
                type: 'bar',
                data: p.dataList.map(d => d.powerInCount),
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: chargingStatusColors[i][0]
                            },
                            {
                                offset: 1,
                                color: chargingStatusColors[i][1]
                            }
                        ]
                    },
                    borderRadius: [4, 4, 0, 0]
                },
                barWidth: '25%'
            }
        }),
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: '#00ffff',
            borderWidth: 1,
            textStyle: {
                color: '#ffffff',
                fontSize: 12
            }
        }
    };

    chargingChart.setOption(option);
};


const useElectricPowerList = ref([]);
function loadElectricityAnalysisData(param) {
    screenApi.getElectricityAnalysis(param).then(res => {
        useElectricPowerList.value = res;
        initEnergyChart(res);
    });
}

let energyChart = null;
let energyChartColors = [["rgba(0, 255, 136,0.4)", "rgba(0, 255, 136,0.05)", "rgba(0, 255, 136)"], ['rgba(214, 200, 25, 0.3)', 'rgba(214, 200, 25, 0.05)', 'rgba(214, 200, 25)'], ['rgba(0, 255, 255)', 'rgba(0, 255, 255)', 'rgba(0, 255, 255)']];
let energyChartNames = ["充电量", "耗电量", "SOC"];
function initEnergyChart(dataList = []) {
    // 电能分析混合图表 - 带面积和线条
    if (!energyChart) {
        const chartDom = document.getElementById('energyChart');
        if (!chartDom) return;

        energyChart = echarts.init(chartDom);
    }

    let axisLabelRotate = 0;
    if (searchParam.value.type === 'r30') {
        axisLabelRotate = 60;
    } else if (searchParam.value.type === 'month') {
        axisLabelRotate = 45;
    } else {
        axisLabelRotate = 0;
    }
    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: dataList.map(p => removeYearStr(p.date) + (searchParam.value.type === 'year' ? '' : '')),
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: '#a0a0a0',
                fontSize: 10,
                rotate: axisLabelRotate
            },
            axisTick: {
                show: false
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '电量(kWh)',
                nameTextStyle: {
                    color: '#a0a0a0',
                    fontSize: 10
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#a0a0a0',
                    fontSize: 10
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(0, 255, 255, 0.1)',
                        type: 'dashed'
                    }
                }
            },
            {
                type: 'value',
                name: 'SOC(%)',
                nameTextStyle: {
                    color: '#a0a0a0',
                    fontSize: 10
                },
                position: 'right',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#a0a0a0',
                    fontSize: 10
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name: energyChartNames[0],
                type: 'line',
                yAxisIndex: 0,
                data: dataList.map(p => p.charging.powerInCount),
                lineStyle: {
                    color: energyChartColors[0][2],
                    width: 2
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: energyChartColors[0][0]
                            },
                            {
                                offset: 1,
                                color: energyChartColors[0][1]
                            }
                        ]
                    }
                },
                smooth: true,
                symbol: 'none'
            },
            {
                name: energyChartNames[1],
                type: 'line',
                yAxisIndex: 0,
                data: dataList.map(p => p.useElectric.totalElectricity),
                lineStyle: {
                    color: energyChartColors[1][2],
                    width: 2
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: energyChartColors[1][0]
                            },
                            {
                                offset: 1,
                                color: energyChartColors[1][1]
                            }
                        ]
                    }
                },
                smooth: true,
                symbol: 'none'
            },
            {
                name: energyChartNames[2],
                type: 'line',
                yAxisIndex: 1,
                data: dataList.map(p => p.soc.soc),
                lineStyle: {
                    color: energyChartColors[2][0],
                    width: 2,
                    type: 'dashed'
                },
                itemStyle: {
                    color: energyChartColors[2][1]
                },
                symbol: 'circle',
                symbolSize: 4,
                smooth: true
            }
        ],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: '#00ffff',
            borderWidth: 1,
            textStyle: {
                color: '#ffffff',
                fontSize: 12
            }
        }
    };

    energyChart.setOption(option);
};

const weatherInfo = ref(null);

function loadWeatherInfo() {
    getWeatherForecastInfo(CONFIG.weatherAdCode).then(res => {
        weatherInfo.value = res;

        if (!weatherInfo.value || weatherInfo.value.casts.length === 0) {
            setTimeout(() => {
                loadWeatherInfo();
            }, 3000);
        }
    });
}



function clear() {
    if (weatherIntervalInstance) {
        clearInterval(weatherIntervalInstance);
        weatherIntervalInstance = null;
    }
    if (timeInterval) {
        clearInterval(timeInterval);
        timeInterval = null;
    }
}


//#region 司机运量排名
// 司机排名数据
const driverRanking = ref([]);
function loadCargoTransportSituationDriverRanking(param) {
    screenApi.getCargoTransportSituationDriverRanking(param).then(res => {
        driverRanking.value = res;
    });
}
//#endregion

//#region 统计数量
// 底部指标数据
const indicators = ref({
    vehicleTotal: 0,
    driverTotal: null,
    chargingPiles: null,
    chargingPileGuns: null,
    totalWaybills: null,
    totalTransport: null,
    totalMileage: null,
    totalPowerConsumption: null,
    electricVehicleProportion: null
});

function loadVehicleCount() {
    getVehicleCount().then(res => {
        indicators.value.vehicleTotal = res.count;
    });
}

function loadDriverCount() {
    getDriverCount().then(res => {
        indicators.value.driverTotal = res.count;
    });
}

function loadPileCount() {
    getPileCount().then(res => {
        indicators.value.chargingPiles = res.pileCount;
        indicators.value.chargingPileGuns = res.pileGunCount;
    });
}

function loadWayBillTotalCount(param) {
    getWayBillTotalCount(param).then(res => {
        indicators.value.totalWaybills = res.total;
    });
}

function loadWayBillTotalSettleWeight(param) {
    getWayBillTotalSettleWeight(param).then(res => {
        indicators.value.totalTransport = res.totalWeight;
    });
}

function loadTotalMileage(param) {
    screenApi.getTotalMileage(param).then(res => {
        indicators.value.totalMileage = res.count;
    });
}

function loadTotalElectricityCost(param) {
    screenApi.getTotalElectricityCos(param).then(res => {
        indicators.value.totalPowerConsumption = res.count;
    });
}

function loadElectricVehicleProportion(param) {
    screenApi.getElectricVehicleProportion(param).then(res => {
        indicators.value.electricVehicleProportion = res.proportion;
    });
}

const currentWeatherInfo = ref({
    rh: "",// 湿度
    temp: "",// 温度
})
function loadCaiJiStationInfo() {
    screenApi.getCaiJiStationDataInfo().then(res => {
        if (res == null) {
            return;
        }
        currentWeatherInfo.value.rh = res.currentWeatherInfo.rh;
        currentWeatherInfo.value.temp = res.currentWeatherInfo.temp;
    })
}
//#endregion

//#region 地图场站数据
const allStationTypeList = ref([]);
function loadAllStationType() {
    screenApi.getStationTypeAll().then(res => {
        allStationTypeList.value = res;
    });
}

function loadStationListByType() {
    if (currentStationType.value == null) {
        return;
    }
    screenApi.getStationTypeList(currentStationType.value).then(res => {
        largeScreenMap.showStationListOnMap(currentStationType.value.parentType, res);
    });
}

const showStationType = ref(false);
const currentStationType = ref(null);
function handleSelectStationType(item) {
    currentStationType.value = item;
    loadStationListByType();
}

function handleCloseStationType() {
    currentStationType.value = null;
    showStationType.value = false;
}

function handleShowStationType() {
    showStationType.value = !showStationType.value;
}
//#endregion

//#region 订单相关
const orderDate = ref(new Date());
const executingOrderList = ref([]);
function loadOrderListByDate() {
    getOrderListByDate({ date: orderDate.value }).then(res => {
        executingOrderList.value = res;
        largeScreenMap.showOrderLineOnMap(res, handleShowOrderInfo);
    });
}

const shortcuts = ref([
    {
        text: '今天',
        value: new Date(),
    },
    {
        text: '昨天',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
        },
    },
    {
        text: "前天",
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
            return date
        },
    }
])

const disabledDate = (time) => {
    return time.getTime() > Date.now()
}
//#endregion

//#region 弹窗相关
const orderDialogRef = useTemplateRef("orderDialogRef");
const chargingStationDialogRef = useTemplateRef("chargingStationDialogRef");
const heavyTruckDialogRef = useTemplateRef("heavyTruckDialogRef");

function handleShowOrderInfo(data) {
    orderDialogRef.value.open(data);
    console.log("handleShowOrderInfo", data);
}

function testOrderDialog() {
    // 模拟订单数据
    const mockOrderData = {
        properties: {
            orderId: "TEST12345"
        }
    };
    orderDialogRef.value.open(mockOrderData);
}

function testChargingStationDialog() {
    // 模拟充电站数据
    const mockStationData = {
        stationId: "CS12345",
        stationName: "测试充电站",
        operator: "国家电网",
        chargerCount: 12,
        address: "北京市朝阳区",
        status: "正常运营",
        todayCharge: "1,250",
        availableChargers: "8",
        chargingRate: "1.2"
    };
    chargingStationDialogRef.value.open(mockStationData);
}

function testHeavyTruckDialog() {
    // 模拟重型半挂数据
    const mockTruckData = {
        truckId: "TR12345",
        plateNumber: "京A12345",
        driverName: "张师傅",
        truckType: "重型半挂",
        currentLocation: "北京市朝阳区",
        status: "运行中",
        todayMileage: "328",
        batteryLevel: "85",
        loadWeight: "25.8"
    };
    heavyTruckDialogRef.value.open(mockTruckData);
}

function handleClosedDialog() {
    // 关闭弹窗时的处理逻辑
}
//#endregion

function load(param) {
    loadCargoTotalList(param);
    loadCargoTransportSituation(param);
    loadCargoTransportSituationDriverRanking(param);
    loadVehicleCount(param);
    loadDriverCount(param);
    loadPileCount(param);
    loadWayBillTotalCount(param);
    loadWayBillTotalSettleWeight(param);
    loadCaiJiStationInfo(param);
    loadAllStationType(param);
    loadTotalMileage(param);
    loadTotalElectricityCost(param);
    loadTotalChargingStatus(param);
    loadElectricityAnalysisData(param);
    loadElectricVehicleProportion(param);


    loadOrderListByDate();
}


// 生命周期
onMounted(() => {
    updateTime();
    timeInterval = setInterval(updateTime, 1000);

    // 加载天气数据
    loadWeatherInfo();
    // 半小时更新一次
    weatherIntervalInstance = setInterval(() => {
        loadWeatherInfo();
    }, 30 * 60 * 1000);

    largeScreenMap.initMap().then(res => {
        largeScreenMap.loadAllVehicleList().then(res => {
            largeScreenWebSocket.initWebSocketAsync(largeScreenMap.showAllVehicleOnMap);
        })
    });
    setTimeout(() => {
        handleHistoryRangeDateChange();
    }, 1000);
});

onUnmounted(() => {
    clear();

    // 清理ECharts实例
    const chartElements = ['freightChart', 'operationChart', 'chargingChart', 'energyChart'];
    chartElements.forEach(id => {
        const chartDom = document.getElementById(id);
        if (chartDom && chartDom._echarts_instance) {
            chartDom._echarts_instance.dispose();
        }
    });
});
</script>
<style lang="less">
@import "./largeScreen.less";
</style>