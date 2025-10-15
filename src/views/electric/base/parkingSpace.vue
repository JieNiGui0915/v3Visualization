<template>
    <div class="parkingSpace page-wrap" ref="parkingSpaceRef">
        <div class="header">
            <el-input v-model.trim="search.parkingSpaceCode" class="width-200 mr-10" placeholder="停车位编号"
                :prefix-icon="Search" @keyup.enter="handleSearch" @clear="handleSearch" clearable />
            <el-select v-model="search.stationId" class="width-200 mr-10" placeholder="选择充电站" :prefix-icon="Search"
                @keyup.enter="handleSearch" @change="handleSearch" clearable>
                <el-option v-for="item in stationList" :key="item.stationId" :label="item.name"
                    :value="item.stationId" />
            </el-select>
            <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
            <div class="flex-1"></div>
            <el-button type="primary" plain size="default" @click="handleClickAdd">新增停车位</el-button>
        </div>
        <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
            row-key="id" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class"
            v-loading="loading">
            <el-table-column fixed type="index" label="编号" width="80" align="center" />
            <el-table-column label="充电站名称" prop="stationName" width="auto" align="center" show-overflow-tooltip />
            <el-table-column label="车位编号" prop="parkingSpaceCode" width="auto" align="center" show-overflow-tooltip />
            <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
                <template #default="scope">
                    <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)">编辑</el-button>
                    <el-popconfirm title="确认删除该停车位吗？" @confirm="handleClickDelete(scope.row)">
                        <template #reference>
                            <el-button link type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
            @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
            :total="totalSize" class="pagination" />
        <add-parking-space ref="addParkingSpaceRef" @close="closeDialog"></add-parking-space>
        <edit-parking-space ref="editParkingSpaceRef" @close="closeDialog"></edit-parking-space>
    </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, nextTick, watch } from 'vue';
import { GlobalStore } from "@/store/index.js";
import { Search } from "@element-plus/icons-vue";
import { searchParkingSpacePageList, delParkingSpace } from '@/api/api.parkingSpace';
import { getAllStationSimpleList } from '@/api/api.pile';
import addParkingSpace from './components/addParkingSpace.vue';
import editParkingSpace from './components/editParkingSpace.vue';
import { ElMessage } from "element-plus";

const loading = ref(false);
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
    stationId: "",// 场站ID
    parkingSpaceCode: ""//停车位编号
})

function load() {
    loading.value = true;
    searchParkingSpacePageList({
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

const stationList = ref([]);
const loadingStationList = ref(false);
function loadStationList() {
    loadingStationList.value = true;
    getAllStationSimpleList().then(res => {
        stationList.value = res;
    }).finally(() => {
        loadingStationList.value = false;
    });
}

function closeDialog(reload) {
    if (reload) load();
}
const addParkingSpaceRef = useTemplateRef('addParkingSpaceRef');
function handleClickAdd() {
    addParkingSpaceRef.value.open();
}
const editParkingSpaceRef = useTemplateRef('editParkingSpaceRef');
function handleClickEdit(item) {
    editParkingSpaceRef.value.open(item);
}
function handleClickDelete(item) {
    loading.value = true;
    delParkingSpace(item.parkingSpaceId).then(() => {
        ElMessage.success("删除成功");
        load();
    }).finally(() => {
        loading.value = false;
    });
}
function handleRowClick(row, column, event) {
}
let tableHeight = ref(250);
const parkingSpaceRef = useTemplateRef('parkingSpaceRef');
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
    nextTick(() => {
        if (parkingSpaceRef.value) {
            tableHeight.value = parkingSpaceRef.value.clientHeight - 122;
        }
    })
}, { immediate: true })
onMounted(() => {
    load();
    setTimeout(() => {
        loadStationList();
    }, 1000);
});

</script>

<style lang="less">
.parkingSpace {}
</style>