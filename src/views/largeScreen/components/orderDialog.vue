<template>
    <el-dialog v-model="dialogVisible" title="订单信息" width="70%" center align-center top="10px"
        class="screenDialog orderDialog" destroy-on-close @close="handleClosedDialog(formRef)"
        :close-on-click-modal="true">
        <div class="dialog_wrap">
            <div class="top">
                <div class="left">
                    <img :src="imgData" alt="地图截图" class="dialog-left-img" v-if="imgData" />
                </div>
                <div class="middle">
                    <div class="order-info">
                        <div class="info-row-top">
                            <div class="info-item">
                                <span class="label">委托人</span>
                                <span class="value">{{ orderData?.shipperName || '李林颖' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">装货点</span>
                                <span class="value">{{ orderData?.loadAddress || '上海' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">卸货点</span>
                                <span class="value">{{ orderData?.unloadAddress || '北京' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">货物</span>
                                <span class="value">{{ orderData?.goodsItemName || '设备' }}</span>
                            </div>
                        </div>
                        <div class="info-row-bottom">
                            <div class="info-item">
                                <span class="label">日期</span>
                                <span class="value">{{ formatDate(orderData?.beginTime) || '2025-06-28' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">计划运量</span>
                                <span class="value">{{ orderData?.freightVolume || '45645' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="statistics-info">
                        <div class="stat-row">
                            <div class="stat-item">
                                <span class="stat-label">投入车辆</span>
                                <span class="stat-value">{{ statisticsData?.vehicleCount || '356' }}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">投入司机</span>
                                <span class="stat-value">{{ statisticsData?.driverCount || '45754' }}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">完成运单</span>
                                <span class="stat-value">{{ statisticsData?.waybillCount || '4574' }}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">完成运量</span>
                                <span class="stat-value">{{ statisticsData?.completedVolume || '4346' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="bottom-header" style="display: flex; justify-content: space-between; margin-bottom: 5px; width: 100%;">
                    <div class="chart-title-left" style="color: #ffffff; font-size: 16px; font-weight: bold; text-align: left; flex: 1 1 0%;">车型比较</div>
                    <div class="chart-title-right" style="color: #ffffff; font-size: 16px; font-weight: bold; text-align: left; flex: 1 1 18%;">能耗分析</div>
                </div>
                <div class="bottom-content">
                    <div class="left">
                        <div class="chart-container">
                            <div id="vehicleTypeChart" class="chart"></div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="right-top">
                            <div class="chart-container">
                                <div class="legend-container">
                                    <div class="legend-left">
                                        <span class="legend-text">去程-电流</span>
                                    </div>
                                    <div class="legend-right">
                                        <div class="legend-item">
                                            <span class="legend-color" style="background: #00ffff;"></span>
                                            <span class="legend-text">总电流</span>
                                        </div>
                                    </div>
                                </div>
                                <div id="energyAnalysisChart" class="chart"></div>
                            </div>
                        </div>
                        <div class="right-bottom">
                            <div class="chart-container">
                                <div class="legend-container">
                                    <div class="legend-left">
                                        <span class="legend-text">去程-高程</span>
                                    </div>
                                </div>
                                <div id="elevationChart" class="chart"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script setup>
import { ref, nextTick, onUnmounted } from "vue";
import * as screenApi from "@/api/api.screen.js";
import { ElMessage } from "element-plus";
import { takeMapScreenshot } from "../largeScreenMap.js";
import * as echarts from 'echarts';

const dialogVisible = ref(false);
const imgData = ref("");
const orderData = ref(null);
const orderBase = ref(null);
const statisticsData = ref(null);

// 图表实例
let vehicleTypeChart = null;
let energyAnalysisChart = null;
let elevationChart = null;

const open = (item) => {
    console.log(item);  
    orderBase.value = item;
    load();
    dialogVisible.value = true;

    // 调用地图截图功能
    takeMapScreenshot()
        .then(imageData => {
            imgData.value = imageData;
        })
        .catch(() => {
            ElMessage.warning('地图截图功能暂时不可用');
        });

    // 等待DOM渲染完成后初始化图表
    nextTick(() => {
        setTimeout(() => {
            initCharts();
            // 确保图表适应容器大小
            setTimeout(() => {
                resizeCharts();
            }, 200);
        }, 100);
    });
};

defineExpose({
    open
});

const formRef = ref(null);
const emit = defineEmits(['close']);

const handleClosedDialog = (formRef) => {
    if (formRef) formRef.resetFields();
    // 销毁图表实例
    destroyCharts();
}

// 格式化日期
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function load() {
    if (!orderBase.value || !orderBase.value.properties || !orderBase.value.properties.orderId) {
        return;
    }
    screenApi.getOrderDetailInfoByOrderId(orderBase.value.properties.orderId).then(res => {
        console.log(res);
        orderData.value = res;
        // 模拟统计数据，实际应该从API获取
        statisticsData.value = {
            vehicleCount: 356,
            driverCount: 45754,
            waybillCount: 4574,
            completedVolume: 4346
        };
    })
}

// 初始化所有图表
function initCharts() {
    initVehicleTypeChart();
    initEnergyAnalysisChart();
    initElevationChart();
}

// 调整所有图表大小
function resizeCharts() {
    if (vehicleTypeChart) {
        vehicleTypeChart.resize();
    }
    if (energyAnalysisChart) {
        energyAnalysisChart.resize();
    }
    if (elevationChart) {
        elevationChart.resize();
    }
}

// 销毁所有图表
function destroyCharts() {
    if (vehicleTypeChart) {
        vehicleTypeChart.dispose();
        vehicleTypeChart = null;
    }
    if (energyAnalysisChart) {
        energyAnalysisChart.dispose();
        energyAnalysisChart = null;
    }
    if (elevationChart) {
        elevationChart.dispose();
        elevationChart = null;
    }
}

// 初始化车型比较饼图
function initVehicleTypeChart() {
    const chartDom = document.getElementById('vehicleTypeChart');
    if (!chartDom) return;

    vehicleTypeChart = echarts.init(chartDom);

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: '#00ffff',
            borderWidth: 1,
            textStyle: {
                color: '#ffffff',
                fontSize: 12
            }
        },
        visualMap: {
            show: false
        },
         series: [
            {
                type: 'pie',
                radius: ['50%', '80%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 0,
                    borderColor: 'transparent',
                    borderWidth: 0
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}\n{c}',
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                labelLine: {
                    show: true,
                    lineStyle: {
                        color: '#ffffff',
                        width: 1
                    },
                    length: 10,
                    length2: 5
                },
                emphasis: {
                    label: {
                        show: false
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 255, 255, 0.5)'
                    }
                },
                data: [
                    { value: 36475, name: '油车', itemStyle: { color: '#00ffff' } },
                    { value: 8000, name: '电车', itemStyle: { color: '#00ff88' } }
                ]
            }
        ]
    };

    vehicleTypeChart.setOption(option);
}

// 初始化能耗分析折线图
function initEnergyAnalysisChart() {
    const chartDom = document.getElementById('energyAnalysisChart');
    if (!chartDom) return;

    energyAnalysisChart = echarts.init(chartDom);

    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '0',
            right: '0',
            bottom: '5%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            axisLine: {
                lineStyle: {
                    color: '#35455C'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 50,
            interval: 10,
            axisLine: {
                lineStyle: {
                    color: '#35455C'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: 10
            },
            splitLine: {
                lineStyle: {
                    color: '#35455C',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '总电流',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                data: [15, 20, 18, 25, 30, 35, 40, 38, 35, 30, 42, 45],
                lineStyle: {
                    color: '#00ffff',
                    width: 3
                },
                itemStyle: {
                    color: '#00ffff',
                    borderColor: '#ffffff',
                    borderWidth: 2
                }
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

    energyAnalysisChart.setOption(option);
}

// 初始化高程图
function initElevationChart() {
    const chartDom = document.getElementById('elevationChart');
    if (!chartDom) return;

    elevationChart = echarts.init(chartDom);

    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '0',
            right: '0',
            bottom: '5%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            axisLine: {
                lineStyle: {
                    color: '#35455C'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 50,
            interval: 10,
            axisLine: {
                lineStyle: {
                    color: '#35455C'
                }
            },
            axisLabel: {
                color: '#ffffff',
                fontSize: 10
            },
            splitLine: {
                lineStyle: {
                    color: '#35455C',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '高程',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                data: [35, 40, 30, 45, 38, 35, 30, 25, 20, 28, 35, 15],
                lineStyle: {
                    color: '#00ffff',
                    width: 3
                },
                itemStyle: {
                    color: '#00ffff',
                    borderColor: '#ffffff',
                    borderWidth: 2
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
                                color: 'rgba(0, 255, 255, 0.3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(0, 255, 255, 0.05)'
                            }
                        ]
                    }
                }
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

    elevationChart.setOption(option);
}

// 组件卸载时清理图表
onUnmounted(() => {
    destroyCharts();
});
</script>
<style lang="less">
.orderDialog {
    .order-info {
        padding: 15px 10px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .info-row-top {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 25px;
        }

        .info-row-bottom {
            display: flex;
            justify-content: flex-start;
            gap: 80px;
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
            }
        }
    }

    .statistics-info {
        padding: 15px 10px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .stat-row {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            width: 100%;

            .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                flex: 1;
                min-width: 0;

                .stat-label {
                    color: #ffffff;
                    font-size: 16px;
                    margin-bottom: 8px;
                    font-weight: 400;
                    white-space: nowrap;
                }

                .stat-value {
                    font-family: 'YouSheBiaoTiHei';
                    font-size: 24px;
                    font-weight: 400;
                    letter-spacing: 0.24px;
                    background: linear-gradient(-62deg, #57D2FF, #3490E4);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    white-space: nowrap;
                    
                }
            }
        }
    }

    .chart-container {
        height: 100%;
        padding: 15px;
        display: flex;
        width: 100%;
        flex-direction: column;

        // .chart-title {
        //     color: #ffffff;
        //     font-size: 18px;
        //     margin: 0 0 10px 0;
        //     text-align: left;
        //     font-weight: bold;
        //     width: 100%;
        // }

        .legend-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;

            .legend-left {
                .legend-text {
                    color: #ffffff;
                    font-size: 16px;
                }
            }

            .legend-right {
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
                        font-size: 16px;
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
            gap: 20px;
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
