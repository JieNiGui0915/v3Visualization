<template>
    <el-dialog v-model="dialogVisible" title="重型半挂信息" width="70%" center align-center top="10px"
        class="screenDialog heavyTruckDialog" destroy-on-close @close="handleClosedDialog"
        :close-on-click-modal="true">
        <div class="dialog_wrap">
            <div class="top">
                <div class="left">
                    <!-- 大图标区域，暂时空出来 -->
                    <div class="icon-placeholder">
                        <div class="icon-content">
                            <img src="@/assets/screen/icon_car.png" alt="车辆图标" />
                        </div>
                    </div>
                </div>
                <div class="middle">
                    <div class="truck-info">
                        <div class="info-row">
                            <div class="info-item">
                                <span class="label">车牌号</span>
                                <span class="value">{{ truckData?.plateNumber || '京A12345' }} </span>
                            </div>
                            <div class="info-item">
                                <span class="label">车辆类型</span>
                                <span class="value">{{ truckData?.vehicleType || '重型半挂' }} </span>
                            </div>
                            <div class="info-item">
                                <span class="label">能源类型</span>
                                <span class="value">{{ truckData?.energyType || '纯电动' }} </span>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-item">
                                <span class="label">电机功率/发动机功率  </span>
                                <span class="value">{{ truckData?.motorPower || '245' }} w</span>
                            </div>
                            <div class="info-item">
                                <span class="label">电池容量</span>
                                <span class="value">{{ truckData?.batteryCapacity || '245' }} w</span>
                            </div>
                            <div class="info-item">
                                <span class="label">额定载重</span>
                                <span class="value">{{ truckData?.ratedLoad || '35' }} t</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="truck-stats">
                        <div class="stats-row">
                            <div class="stat-item">
                                <div class="stat-label">运行天数</div>
                                <div class="stat-value">{{ truckData?.runningDays || '356' }}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">累计运单</div>
                                <div class="stat-value">{{ truckData?.totalOrders || '1254' }}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">累计运量</div>
                                <div class="stat-value">{{ truckData?.totalCargo || '2580' }} t</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">累计里程</div>
                                <div class="stat-value">{{ truckData?.totalMileage || '12580' }}</div>
                            </div>
                        </div>
                        <div class="stats-row">
                            <div class="stat-item">
                                <div class="stat-label">累计电耗</div>
                                <div class="stat-value">{{ truckData?.totalPowerConsumption || '4346' }}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"></div>
                                <div class="stat-value"></div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"></div>
                                <div class="stat-value"></div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"></div>
                                <div class="stat-value"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="bottom-content">
                    <div class="chart-top">
                        <div class="chart-container">
                            <div class="legend-container">
                                <div class="legend-left">
                                    <span class="legend-text">货运态势</span>
                                </div>
                                <div class="legend-center">
                                    <div class="legend-item">
                                        <span class="legend-color" style="background: #009DFF;"></span>
                                        <span class="legend-text">运单</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-color" style="background: #1ED6FF;"></span>
                                        <span class="legend-text">运量</span>
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
                            <div id="routeTrendChart" class="chart"></div>
                        </div>
                    </div>
                    <div class="chart-bottom">
                        <div class="chart-container">
                            <div class="legend-container">
                                <div class="legend-left">
                                    <span class="legend-text">电耗分析</span>
                                </div>
                                <div class="legend-center">
                                    <div class="legend-item">
                                        <span class="legend-color" style="background: #2A9CFF;"></span>
                                        <span class="legend-text">公里耗电</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-color" style="background: #27E89E;"></span>
                                        <span class="legend-text">平均气温</span>
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
                            <div id="powerConsumptionChart" class="chart"></div>
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
const truckData = ref(null);

// 图表实例
let routeTrendChart = null;
let powerConsumptionChart = null;

const open = (item) => {
    console.log('重型半挂信息:', item);
    truckData.value = item;
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
    if (routeTrendChart) {
        routeTrendChart.dispose();
        routeTrendChart = null;
    }
    if (powerConsumptionChart) {
        powerConsumptionChart.dispose();
        powerConsumptionChart = null;
    }
};

const initCharts = () => {
    // 初始化货运态势图表
    const routeTrendElement = document.getElementById('routeTrendChart');
    if (routeTrendElement) {
        routeTrendChart = echarts.init(routeTrendElement);
        const routeTrendOption = {
            tooltip: { trigger: 'axis' },
            grid: {
                top: '5%',
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
                {
                    name: '运单',
                    data: [20, 32, 25, 38, 28, 35, 22, 30, 36, 26, 33, 30],
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                        color: '#009DFF'
                    },
                    lineStyle: {
                        color: '#009DFF',
                        width: 2
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#009DFF'
                        },
                        lineStyle: {
                            color: '#009DFF'
                        }
                    }
                },
                {
                    name: '运量',
                    data: [25, 22, 35, 28, 38, 25, 32, 35, 26, 36, 30, 35],
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                        color: '#1ED6FF'
                    },
                    lineStyle: {
                        color: '#1ED6FF',
                        width: 2
                    },
                    emphasis: {
                        itemStyle: {
                            color: '#1ED6FF'
                        },
                        lineStyle: {
                            color: '#1ED6FF'
                        }
                    }
                }
            ]
        };
        routeTrendChart.setOption(routeTrendOption);
    }

    // 初始化电耗分析图表
    const powerConsumptionElement = document.getElementById('powerConsumptionChart');
    if (powerConsumptionElement) {
        powerConsumptionChart = echarts.init(powerConsumptionElement);
        const powerConsumptionOption = {
            tooltip: { trigger: 'axis' },
            grid: {
                top: '5%',
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
                min: 0,
                max: 60,
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
                max: 40,
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
                    name: '公里耗电',
                    type: 'bar',
                    barWidth: 30,
                    barGap: 0,
                    yAxisIndex: 0,
                    z: 10,
                    data: [40, 50, 40, 30, 50, 40, 50, 40, 30, 50, 40, 50],
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
                        },
                    }
                },
                // 顶部菱形面
                {
                    name: '公里耗电',
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
                            ],
                        },
                        borderColor: '#4DFFFFFF',
                        borderWidth: 0.5
                    },
                    data: [40, 50, 40, 30, 50, 40, 50, 40, 30, 50, 40, 50].map((item) => {
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
                    name: '总电耗',
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
                            ],
                        },
                    },
                    data: [40, 50, 40, 30, 50, 40, 50, 40, 30, 50, 40, 50].map((item) => {
                        return {
                            value: item,
                            itemStyle: {
                                opacity: item > 0 ? 1 : 0,
                            },
                        };
                    }),
                },
                {
                    name: '平均气温',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    symbol: 'none',
                    z: 15,
                    data: [30, 35, 30, 25, 35, 30, 35, 30, 25, 35, 30, 35],
                    itemStyle: {
                        color: '#ff6600'
                    },
                    lineStyle: {
                        color: '#27E89E',
                        width: 2
                    }
                }
            ]
        };
        powerConsumptionChart.setOption(powerConsumptionOption);
    }
};

const resizeCharts = () => {
    if (routeTrendChart) routeTrendChart.resize();
    if (powerConsumptionChart) powerConsumptionChart.resize();
};

defineExpose({
    open
});
</script>

<style lang="less">
.heavyTruckDialog {
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

    .truck-info {
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
                font-family: 'YouSheBiaoTiHei';
                font-size: 24px;
                font-weight: 400;
                letter-spacing: 0.24px;
                background: linear-gradient(-62deg, #57D2FF, #3490E4);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                white-space: nowrap;
                
                /* 单位样式 */
                & > span {
                    font-size: 18px;
                    background: inherit;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
        }
    }

    .truck-stats {
        padding: 15px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border: 1px solid rgba(77, 189, 247, 0.3);

        .stats-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;

            &:last-child {
                margin-bottom: 0;
                justify-content: space-between;
            }

            .stat-item {
                text-align: center;
                flex: 1;

                .stat-label {
                    color: #ffffff;
                    font-size: 14px;
                    margin-bottom: 8px;
                }

                .stat-value {
                    font-family: 'YouSheBiaoTiHei';
                    font-size: 24px;
                    font-weight: 400;
                    letter-spacing: 0.24px;
                    background: linear-gradient(-62deg, #57D2FF, #3490E4);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    
                    /* 单位样式 */
                    & > span {
                        font-size: 18px;
                        background: inherit;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }
            }
            
            /* 最后一行的累计电耗居中排列，与上面保持一致 */
            &:last-child .stat-item {
                text-align: center;
            }
        }
    }

    .chart-container {
        height: 100%;
        padding: 10px;
        display: flex;
        width: 100%;
        flex-direction: column;
        border: 1px solid rgba(77, 189, 247, 0.3);
        background: rgba(0, 0, 0, 0.2);

        .legend-container {
            display: flex;
            justify-content: space-between;
            align-items: center;

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
                        width: 12px;
                        height: 2px;
                        margin-right: 6px;
                    }

                    .legend-text {
                        color: #ffffff;
                        font-size: 12px;
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
            flex-direction: column;
            gap: 15px;
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

        .chart-top {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
            justify-content: flex-start !important;
            align-items: stretch !important;
        }

        .chart-bottom {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
            justify-content: flex-start !important;
            align-items: stretch !important;
        }
    }
}
</style>
