<template>
    <div class="waybill page-wrap" ref="waybillRef">
        <div class="header">
            <el-input v-model.trim="search.orderNo" class="width-200 mr-10" placeholder="订单号" :prefix-icon="Search"
                @keyup.enter="handleSearch" @clear="handleSearch" clearable />
            <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
            <div class="flex-1"></div>
        </div>
        <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
            row-key="waybillId" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class"
            v-loading="loading">
            <el-table-column fixed type="index" label="编号" width="40" align="center" />
            <el-table-column prop="orderNo" label="订单号" width="150" align="center" />
            <el-table-column prop="fleetName" label="车队" width="100" align="center" />
            <el-table-column prop="driverFullName" label="司机姓名" width="100" align="center" />
            <el-table-column prop="licensePlateNumber" label="车牌号" width="100" align="center" />
            <el-table-column prop="waybillTime" label="运单时间" width="150" align="center" />
            <el-table-column prop="sendSuttle" label="发货净重(t)" width="100" align="center" />
            <el-table-column prop="receiveSuttle" label="收货净重(t)" width="100" align="center" />
            <el-table-column prop="settleWeight" label="结算重量(t)" width="100" align="center" />
            <el-table-column prop="lossWeight" label="损耗量(t)" width="100" align="center" />
            <el-table-column prop="lossRate" label="损耗率(%)" width="100" align="center" />
            <el-table-column prop="lossRateAbnormal" label="损耗率异常(%)" width="100" align="center" />
            <el-table-column prop="loadingWay" label="装车方式" width="100" align="center" />
            <el-table-column prop="spadeNumber" label="装车铲数" width="100" align="center" />
            <el-table-column prop="grossWeighbridge" label="毛重磅号" width="100" align="center" />
            <el-table-column prop="tareWeighbridge" label="皮重磅号" width="100" align="center" />
            <el-table-column prop="remark" label="备注" width="auto" align="center" />
            <el-table-column prop="waybillFileIds" label="运单图片" width="110" align="center">
                <template #default="scope">
                    <span v-if="!scope.row.waybillFileIds">-</span>
                    <span v-else class="link" @click.self.stop="handleViewFiles(scope.row.waybillFileIds)">查看图片({{
                        scope.row.waybillFileIds.split(",").length }}个)</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" prop="waybillStatus" label="运单状态" width="100" align="center">
                <template #default="scope">
                    <el-tag :type="waybillStatusTagTypeMap[scope.row.waybillStatus]" class="table-tag">{{
                        waybillStatusMap[scope.row.waybillStatus] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
                <template #default="scope">
                    <el-button link type="warning" @click.prevent.stop="handleClickView(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
            @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
            :total="totalSize" class="pagination" />
        <image-dialog ref="imageDialogRef"></image-dialog>
        <view-waybill ref="viewWaybillRef"></view-waybill>
    </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, nextTick, watch } from 'vue';
import { GlobalStore } from "@/store/index.js";
import { Search } from "@element-plus/icons-vue";
import * as waybillApi from "@/api/api.waybill.js";
import { waybillStatusList, waybillStatusMap, waybillStatusTagTypeMap } from '@/config/const';
import ImageDialog from "@/components/form/image-dialog.vue";
import viewWaybill from './components/viewWaybill.vue';

const loading = ref(false);
/*
// waybillId:"",// 运单ID
// dispatchId:"",// 派车单ID
// driverId:"",// 司机ID
// vehicleId:"",// 车辆ID
waybillTime:"",// 运单时间，刚发货时为发货时间，收货后为收货时间
sendSuttle:"",// 发货净重
receiveSuttle:"",// 收货净重
settleWeight:"",// 结算重量，刚发货时为发货净重，收货后为收货净重
lossWeight:"",// 损耗量
lossRate:"",// 损耗率
lossRateAbnormal:"",// 损耗率异常
loadingWay:"",// 装车方式
spadeNumber:"",// 装车铲数
grossWeighbridge:"",// 毛重磅号
tareWeighbridge:"",// 皮重磅号
waybillStatus:"",// 运单状态，0
remark:"",// 备注
createUser:"",// 创建人
createTime:"",// 创建时间
waybillFileIds:"",// 运单图片集
driverFullName:"",// 司机姓名
licensePlateNumber:"",// 车牌号
dispatchNumber:"",// 派车单号
*/
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
    orderNo: "",// 订单号
    dispatchPlanId: "", // 派车计划ID
    dispatchId: "", // 派车单ID
})

function load() {
    loading.value = true;
    waybillApi.searchWaybillPageList({
        current: pageCurrent.value,
        size: pageSize.value,
        ...search.value
    }).then(res => {
        tableData.value = res.records;
        totalSize.value = res.total;
    }).finally(() => {
        loading.value = false;
    });
}

function handleSearch() {
    pageCurrent.value = 1; // 重置当前页码
    load();
}

function closeDialog(reload) {
    if (reload) load();
}

const viewWaybillRef = useTemplateRef('viewWaybillRef');
function handleClickView(item) {
    viewWaybillRef.value.open(item);
}
function handleRowClick(row, column, event) {
    handleClickView(row);
}

const imageDialogRef = useTemplateRef("imageDialogRef");
function handleViewFiles(fileIdStr) {
    imageDialogRef.value.open(fileIdStr)
}

let tableHeight = ref(250);
const waybillRef = useTemplateRef('waybillRef');
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
    nextTick(() => {
        if (waybillRef.value) {
            tableHeight.value = waybillRef.value.clientHeight - 122;
        }
    })
}, { immediate: true })
onMounted(() => {
    load();
});

</script>

<style lang="less">
.waybill {}
</style>