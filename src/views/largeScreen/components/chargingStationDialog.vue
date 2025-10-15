<template>
    <el-dialog v-model="dialogVisible" title="充电站信息" width="70%" center align-center top="10px"
        class="screenDialog chargingStationDialog" destroy-on-close @close="handleClosedDialog"
        :close-on-click-modal="true">
        <div class="dialog_wrap">
            <div class="top">
                <div class="left">
                    <!-- 大图标区域 -->
                    <div class="icon-placeholder">
                        <div class="icon-content">
                            <img src="@/assets/screen/icon_charging.png" alt="充电站图标" />
                        </div>
                    </div>
                </div>
                <div class="middle">
                    <div class="station-info">
                        <div class="info-row">     
                            <div class="info-item">
                                <span class="label">所在地址</span>
                                <span class="value">{{ stationData?.address || '北京市朝阳区' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">充电站类型</span>
                                <span class="value">{{ stationData?.stationType || '快充' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">充电站数量</span>
                                <span class="value">{{ stationData?.stationCount || '12' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">全站功率</span>
                                <span class="value">{{ stationData?.totalPower || '245' }}kW</span>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-item">
                                <span class="label">单桩功率</span>
                                <span class="value">{{ stationData?.singlePower || '245' }}W</span>
                            </div>
                            <div class="info-item">
                                <span class="label">充电车位</span>
                                <span class="value">{{ stationData?.chargingSpaces || '244' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">普通车位</span>
                                <span class="value">{{ stationData?.normalSpaces || '100' }}</span>
                            </div>
                            <div class="info-item">
                                <!-- 占位，保持对齐 -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="station-stats">
                        <div class="stats-row">
                            <div class="stat-item">
                                <div class="stat-label">运行天数</div>
                                <div class="stat-value">{{ stationData?.runningDays || '356' }}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">累计订单</div>
                                <div class="stat-value">{{ stationData?.totalOrders || '45754' }}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">累计时长</div>
                                <div class="stat-value">{{ stationData?.totalDuration || '4574' }}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">累计电量</div>
                                <div class="stat-value">{{ stationData?.totalEnergy || '4346' }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="bottom-content">
                    <div class="left">
                        <div class="charger-list">
                            <div class="list-header">
                                <div class="header-row">
                                    <div class="header-item">桩编号</div>
                                    <div class="header-item">E</div>
                                    <div class="header-item">电流值</div>
                                    <div class="header-item">图标</div>
                                    <div class="header-item">SOC(%)</div>
                                </div>
                            </div>
                            <div class="list-content" ref="listContent">
                                <div class="list-item" v-for="(item, index) in chargerList" :key="index">
                                    <div class="item-row">
                                        <div class="item-column">
                                            <div class="charger-icon">
                                                <div class="icon">⚡</div>
                                            </div>
                                        </div>
                                        <div class="item-column">
                                            <div class="type-main">{{ item.type1 }}</div>
                                        </div>
                                        <div class="item-column">
                                            <div class="charging-icon">⚡</div>
                                        </div>
                                        <div class="item-column">
                                            <div class="truck-icon">🚛</div>
                                        </div>
                                        <div class="item-column">
                                            <div class="vehicle-id">{{ item.vehicleId }}</div>
                                        </div>
                                    </div>
                                    <div class="item-row">
                                        <div class="item-column">
                                            <div class="charger-code">{{ item.code }}</div>
                                        </div>
                                        <div class="item-column">
                                            <div class="type-sub">{{ item.subType }}</div>
                                        </div>
                                        <div class="item-column">
                                            <div class="time-value">{{ item.chargingTime }}</div>
                                        </div>
                                        <div class="item-column">
                                            <div class="icon-placeholder-small">📱</div>
                                        </div>
                                        <div class="item-column">
                                            <div class="soc-value">{{ item.soc }}%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="right-top">
                            <div class="chart-container">
                                <div class="legend-container">
                                    <div class="legend-left">
                                        <span class="legend-text">充电态势</span>
                                    </div>
                                    <div class="legend-center" style="display: flex; gap: 15px;">
                                        <div class="legend-item" style="display: flex; align-items: center;">
                                            <span class="legend-color" style="background: #2A9CFF; display: inline-block; width: 15px; height: 3px;"></span>
                                            <span class="legend-text" style="margin-left: 5px;">充电量</span>
                                        </div>
                                        <div class="legend-item" style="display: flex; align-items: center;">
                                            <span class="legend-color" style="background: #27E89E; display: inline-block; width: 15px; height: 3px;"></span>
                                            <span class="legend-text" style="margin-left: 5px;">订单数</span>
                                        </div>
                                    </div>
                                    <div class="legend-right">
                                        <div class="time-buttons">
                                            <button class="time-btn active">按年</button>
                                            <button class="time-btn">按月</button>
                                            <button class="time-btn">按日</button>
                                        </div>
                                    </div>
                                </div>
                                <div id="powerAnalysisChart" class="chart"></div>
                            </div>
                        </div>
                        <div class="right-bottom">
                            <div class="chart-container">
                                <div class="legend-container">
                                    <div class="legend-left">
                                        <span class="legend-text">时段分布</span>
                                    </div>
                                    <div class="legend-right">
                                        <div class="time-buttons">
                                            <button class="time-btn active">按年</button>
                                            <button class="time-btn">按月</button>
                                            <button class="time-btn">按日</button>
                                        </div>
                                    </div>
                                </div>
                                <div id="chargingTimeChart" class="chart"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import * as echarts from 'echarts';

const dialogVisible = ref(false);
const stationData = ref(null);
const listContent = ref(null);

// 图表实例
let powerAnalysisChart = null;
let chargingTimeChart = null;

// 充电桩列表数据
const chargerList = ref([
    { type1: 'A', code: 'E02', type2: 'A', subType: 'E', chargingTime: '325', vehicleId: '京G0000D', soc: '68' },
    { type1: 'A', code: 'E02', type2: 'A', subType: 'E', chargingTime: '325', vehicleId: '京G0000D', soc: '68' },
    { type1: 'A', code: 'E02', type2: 'A', subType: 'E', chargingTime: '325', vehicleId: '京G0000D', soc: '68' },
    { type1: 'A', code: 'E02', type2: 'A', subType: 'E', chargingTime: '325', vehicleId: '京G0000D', soc: '68' },
    { type1: 'A', code: 'E02', type2: 'A', subType: 'E', chargingTime: '325', vehicleId: '京G0000D', soc: '68' },
    { type1: 'A', code: 'E02', type2: 'A', subType: 'E', chargingTime: '325', vehicleId: '京G0000D', soc: '68' },
]);

const open = (item) => {
    console.log('充电站信息:', item);
    stationData.value = item;
    dialogVisible.value = true;

    // 等待DOM渲染完成后初始化图表
    nextTick(() => {
        setTimeout(() => {
            initCharts();
            setTimeout(() => {
                resizeCharts();
            }, 200);
        }, 100);
    });
};

const handleClosedDialog = () => {
    // 销毁图表实例
    if (powerAnalysisChart) {
        powerAnalysisChart.dispose();
        powerAnalysisChart = null;
    }
    if (chargingTimeChart) {
        chargingTimeChart.dispose();
        chargingTimeChart = null;
    }
};

const initCharts = () => {
    // 初始化充电态势图表
    const powerAnalysisElement = document.getElementById('powerAnalysisChart');
    if (powerAnalysisElement) {
        powerAnalysisChart = echarts.init(powerAnalysisElement);
        const powerAnalysisOption = {
            tooltip: { trigger: 'axis' },
            grid: {
                top: '10%',
                left: '0',
                right: '0',
                bottom: '0',
                containLabel: true
            },
            xAxis: { 
                type: 'category', 
                data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                axisLine: {
                    lineStyle: {
                        color: '#0b3a58'
                    }
                },
                axisLabel: {
                    color: '#ffffff',
                    margin: 10
                }
            },
            yAxis: [{
                type: 'value',
                name: '',
                min: 0,
                max: 50,
                splitLine: {
                    lineStyle: {
                        color: '#0b3a58'
                    }
                },
                axisLabel: {
                    color: '#ffffff'
                }
            }, {
                type: 'value',
                name: '',
                min: 0,
                max: 50,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            }],
            series: [
                // 中间柱状图
                {
                    name: '充电量',
                    type: 'bar',
                    barWidth: 30,
                    barGap: 0,
                    yAxisIndex: 0,
                    z: 10,
                    data: [50, 40, 30, 40, 50, 40, 30, 40, 30, 40, 50, 40],
                    itemStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [
                                { offset: 0, color: "#2A9CFF" },
                                { offset: 0.49, color: "#2A9CFF" },
                                { offset: 0.50, color: "#004BA9" },
                                { offset: 1, color: "#003981" },
                            ],
                        }
                    }
                },
                // 顶部菱形面
                {
                    name: '充电量',
                    type: 'pictorialBar',
                    symbol: 'diamond',
                    symbolSize: [30, 15],
                    symbolOffset: [0, -7.5],
                    symbolPosition: 'end',
                    z: 12,
                    yAxisIndex: 0,
                    itemStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: "#00B8FF" },
                                { offset: 1, color: "#2A9CFF" },
                            ]
                        }
                    },
                    data: [50, 40, 30, 40, 50, 40, 30, 40, 30, 40, 50, 40].map((item) => {
                        return {
                            value: item,
                            itemStyle: {
                                opacity: item > 0 ? 1 : 0,
                            },
                        };
                    }),
                },
                // 底部菱形面
                {
                    name: '充电量',
                    type: 'pictorialBar',
                    symbol: 'diamond',
                    symbolSize: [30, 10],
                    symbolOffset: [0, 5],
                    z: 12,
                    yAxisIndex: 0,
                    itemStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [
                                { offset: 0, color: "#004BA9" },
                                { offset: 1, color: "#003981" },
                            ]
                        }
                    },
                    data: [50, 40, 30, 40, 50, 40, 30, 40, 30, 40, 50, 40].map((item) => {
                        return {
                            value: item,
                            itemStyle: {
                                opacity: item > 0 ? 1 : 0,
                            },
                        };
                    }),
                },
                {
                    name: '订单数',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    symbol: 'none',
                    z: 15,
                    data: [10, 20, 15, 25, 20, 30, 25, 35, 30, 40, 35, 45],
                    itemStyle: {
                        color: '#27E89E'
                    },
                    lineStyle: {
                        color: '#27E89E',
                        width: 2
                    }
                }
            ]
        };
        powerAnalysisChart.setOption(powerAnalysisOption);
    }

    // 初始化时段分布图表
    const chargingTimeElement = document.getElementById('chargingTimeChart');
    if (chargingTimeElement) {
        chargingTimeChart = echarts.init(chargingTimeElement);
        const chargingTimeOption = {
            tooltip: { trigger: 'axis' },
            grid: {
                top: '10%',
                left: '0',
                right: '0',
                bottom: '0',
                containLabel: true
            },
            xAxis: { 
                type: 'category', 
                data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
                axisLine: {
                    lineStyle: {
                        color: '#0b3a58'
                    }
                },
                axisLabel: {
                    color: '#ffffff',
                    margin: 10
                }
            },
            yAxis: { 
                type: 'value',
                min: 0,
                max: 50,
                splitLine: {
                    lineStyle: {
                        color: '#0b3a58'
                    }
                },
                axisLabel: {
                    color: '#ffffff'
                }
            },
            series: [
                // 中间柱状图
                {
                    name: '分布趋势',
                    type: 'bar',
                    barWidth: 30,
                    barGap: 0,
                    z: 10,
                    data: [45, 50, 42, 45, 48, 42, 20, 50, 42, 48, 50],
                    itemStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [
                                { offset: 0, color: "#2A9CFF" },
                                { offset: 0.49, color: "#2A9CFF" },
                                { offset: 0.50, color: "#004BA9" },
                                { offset: 1, color: "#003981" },
                            ]
                        }
                    }
                },
                // 顶部菱形面
                {
                    name: '分布趋势',
                    type: 'pictorialBar',
                    symbol: 'diamond',
                    symbolSize: [30, 15],
                    symbolOffset: [0, -7.5],
                    symbolPosition: 'end',
                    z: 12,
                    itemStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: "#00B8FF" },
                                { offset: 1, color: "#2A9CFF" },
                            ]
                        }
                    },
                    data: [45, 50, 42, 45, 48, 42, 20, 50, 42, 48, 50].map((item) => {
                        return {
                            value: item,
                            itemStyle: {
                                opacity: item > 0 ? 1 : 0,
                            },
                        };
                    }),
                },
                // 底部菱形面
                {
                    name: '分布趋势',
                    type: 'pictorialBar',
                    symbol: 'diamond',
                    symbolSize: [30, 10],
                    symbolOffset: [0, 5],
                    z: 12,
                    itemStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [
                                { offset: 0, color: "#004BA9" },
                                { offset: 1, color: "#003981" },
                            ]
                        }
                    },
                    data: [45, 50, 42, 45, 48, 42, 20, 50, 42, 48, 50].map((item) => {
                        return {
                            value: item,
                            itemStyle: {
                                opacity: item > 0 ? 1 : 0,
                            },
                        };
                    }),
                }
            ]
        };
        chargingTimeChart.setOption(chargingTimeOption);
    }
};

const resizeCharts = () => {
    if (powerAnalysisChart) powerAnalysisChart.resize();
    if (chargingTimeChart) chargingTimeChart.resize();
};

defineExpose({
    open
});
</script>

<style lang="less">
.chargingStationDialog {
    .icon-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-content {
            width: 100%;
            height: 100%;
            background: transparent;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4dbdf7;
            font-size: 24px;
            padding: 0;
            margin: 0;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
            }
        }
    }

    .charger-list {
        height: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(77, 189, 247, 0.3);

        .list-header {
            background: rgba(77, 189, 247, 0.1);
            border-bottom: 1px solid rgba(77, 189, 247, 0.3);

            .header-row {
                display: flex;
                padding: 8px 10px;

                .header-item {
                    flex: 1;
                    color: #ffffff;
                    font-size: 12px;
                    text-align: center;
                    font-weight: bold;
                }
            }
        }

        .list-content {
            flex: 1;
            overflow-y: auto;
            height: calc(100% - 60px); // 减去表头高度

            .list-item {
                border-bottom: 1px solid rgba(77, 189, 247, 0.2);

                &:hover {
                    background: rgba(77, 189, 247, 0.05);
                }

                .item-row {
                    display: flex;
                    padding: 6px 10px;
                    align-items: center;

                    .item-column {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;

                        .charger-icon {
                            width: 24px;
                            height: 24px;
                            background: #4dbdf7;
                            border-radius: 4px;
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            .icon {
                                color: #ffffff;
                                font-size: 14px;
                            }
                        }

                        .charging-icon {
                            color: #00ff00;
                            font-size: 16px;
                        }

                        .truck-icon {
                            color: #4dbdf7;
                            font-size: 16px;
                        }

                        .icon-placeholder-small {
                            color: #4dbdf7;
                            font-size: 14px;
                        }

                        .type-main, .charger-code {
                            color: #ffffff;
                            font-size: 13px;
                            font-weight: bold;
                        }

                        .type-sub {
                            color: #4dbdf7;
                            font-size: 13px;
                        }

                        .time-value {
                            color: #4dbdf7;
                            font-size: 13px;
                            font-weight: bold;
                        }

                        .vehicle-id {
                            color: #4dbdf7;
                            font-size: 12px;
                            font-weight: bold;
                        }

                        .soc-value {
                            color: #4dbdf7;
                            font-size: 13px;
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }
    .station-info {
        padding: 15px 10px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .info-row {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 15px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            flex: 1;
            min-width: 0;

            .label {
                color: #ffffff;
                font-size: 14px;
                margin-bottom: 8px;
                font-weight: 400;
                white-space: nowrap;
            }

            .value {
                // font-family: 'YouSheBiaoTiHei';
                font-size: 24px;
                font-weight: 400;
                letter-spacing: 0.24px;
                background: linear-gradient(-62deg, #57D2FF, #3490E4);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                white-space: nowrap;
                
                /* 单位样式 */
                & > span {
                    font-size: 15px;
                    background: inherit;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
        }

        .info-item-wide {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            flex: 1;
            min-width: 0;

            .label {
                color: #ffffff;
                font-size: 14px;
                margin-bottom: 8px;
                font-weight: 400;
                white-space: nowrap;
            }

            .value {
                font-family: 'YouSheBiaoTiHei';
                font-size: 24px;
                font-weight: 400;
                letter-spacing: 0.24px;
                background: linear-gradient(-62deg, #57D2FF, #3490E4);
                -webkit-text-fill-color: transparent;
                white-space: nowrap;
            }
        }
    }

    .station-stats {
        padding: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border: 1px solid rgba(77, 189, 247, 0.3);

        .stats-row {
            display: flex;
            justify-content: space-around;
            align-items: center;

            .stat-item {
                text-align: center;
                flex: 1;

                .stat-label {
                    color: #ffffff;
                    font-size: 14px;
                    margin-bottom: 10px;
                }

                .stat-value {
                    font-family: 'YouSheBiaoTiHei';
                    font-size: 24px;
                    font-weight: 400;
                    letter-spacing: 0.24px;
                    background: linear-gradient(-62deg, #57D2FF, #3490E4);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
        }
    }

    .chart-container {
        height: 100%;
        padding: 10px;
        display: flex;
        width: 100%;
        flex-direction: column;

        .legend-container {
            display: flex;
            justify-content: space-between;

            .legend-left {
                .legend-text {
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: bold;
                }
            }

            .legend-center {
                display: flex;
                gap: 20px;
                
                .legend-item {
                    display: flex;
                    align-items: center;

                    .legend-color {
                        width: 15px;
                        height: 3px;
                        margin-right: 8px;
                        display: inline-block;
                    }

                    .legend-text {
                        color: #ffffff;
                        font-size: 14px;
                    }
                }
            }

            .legend-right {
                display: flex;
                align-items: center;
                gap: 15px;

                .legend-item {
                    display: flex;
                    align-items: center;

                    .legend-color {
                        width: 12px;
                        height: 2px;
                        margin-right: 6px;
                    }

                    .legend-text {
                        color: #ffffff;
                        font-size: 12px;
                    }
                }

                .time-buttons {
                    display: inline-flex;
                    overflow: hidden;
                    border-radius: 4px;
                    background: rgba(0, 0, 0, 0.3);
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3) inset;
                    border: 1px solid rgb(46, 67, 84);

                    .time-btn {
                        padding: 4px 15px;
                        background: transparent;
                        border: none;
                        color: #8FA3B8;
                        font-size: 12px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        position: relative;
                        margin: 0;
                        border-radius: 4px;

                        &:hover {
                            color: #00D4FF;
                        }

                        &.active {
                            background: linear-gradient(169deg, #3EA3F0 1.31%, #003ea3f0 80.52%);
                            color: #FFFFFF;
                            box-shadow: 0 0 10px rgba(0, 212, 255, 0.5) inset, 0 2px 4px rgba(0, 0, 0, 0.3);
                            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                            border: 1px solid #A8D9FF;
                            margin: 1px;
                        }
                    }
                }
            }
        }

        .chart {
            flex: 1;
            min-height: 0;
            width: 100%;
            height: 100%;
        }
    }

    .bottom {
        height: 100%;
        display: flex;
        flex-direction: column;

        .bottom-content {
            display: flex;
            gap: 30px;
            height: 100%;
            flex: 1;
        }

        .chart-title {
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
            text-align: left;
            margin: 0 0 15px 0;
        }

        .left {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
            justify-content: flex-start !important;
            align-items: stretch !important;
        }

        .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
            min-height: 0;
            justify-content: flex-start !important;
            align-items: stretch !important;

            .right-top {
                flex: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
            }

            .right-bottom {
                flex: 1;
                min-height: 0;
                display: flex;
                flex-direction: column;
            }
        }
    }
}
</style>
