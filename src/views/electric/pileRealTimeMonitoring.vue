<template>
    <div class="pileRealTimeMonitoring page-wrap" ref="pileRealTimeMonitoringRef">
        <div class="header">
            <el-input v-model.trim="search.name" class="width-200 mr-10" placeholder="名称" :prefix-icon="Search"
                @keyup.enter="handleSearch" clearable />
            <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
            <div class="flex-1"></div>
            <el-button type="primary" plain size="default" @click="handleClickAdd">新增</el-button>
        </div>
        <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
            row-key="id" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class"
            v-loading="loading">
            <el-table-column fixed type="index" label="编号" width="80" align="center" />
            <el-table-column label="名称" prop="name" width="auto" align="center" show-overflow-tooltip />
            <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
                <template #default="scope">
                    <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
            @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
            :total="totalSize" class="pagination" />
    </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, nextTick, watch } from 'vue';
import { GlobalStore } from "@/store/index.js";
import { Search } from "@element-plus/icons-vue";

const loading = ref(false);
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
    name: ""
})

function load() { }

function handleSearch() {
    pageCurrent.value = 1; // 重置当前页码
    load();
}

function closeDialog(reload) {
    if (reload) load();
}

function handleClickAdd() {
}
function handleClickEdit(item) {
}
function handleRowClick(row, column, event) {
}
let tableHeight = ref(250);
const pileRealTimeMonitoringRef = useTemplateRef('pileRealTimeMonitoringRef');
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
    nextTick(() => {
        if (pileRealTimeMonitoringRef.value) {
            tableHeight.value = pileRealTimeMonitoringRef.value.clientHeight - 122;
        }
    })
}, { immediate: true })
onMounted(() => {
    load();
});

</script>

<style lang="less">
.pileRealTimeMonitoring {}
</style>