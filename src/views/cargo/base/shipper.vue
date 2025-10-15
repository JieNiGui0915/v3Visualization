<template>
  <div class="shipper page-wrap" ref="shipperRef">
    <div class="header">
      <el-input v-model.trim="search.shipperCode" class="width-200 mr-10" placeholder="托运人编码" :prefix-icon="Search"
        @keyup.enter="handleSearch" clearable />
      <el-input v-model.trim="search.shipperName" class="width-200 mr-10" placeholder="托运人简称"
        @keyup.enter="handleSearch" clearable />
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <div class="flex-1"></div>
      <el-button type="primary" plain size="default" @click="handleClickAdd">新增货主</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
      row-key="id" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class" v-loading="loading">
      <el-table-column fixed type="index" label="编号" width="80" align="center" />
      <el-table-column label="托运人编码" prop="shipperCode" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="托运人简称" prop="shipperName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="主体类型" prop="subjectType" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ subjectTypeMap[scope.row.subjectType] || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="自然人名称" prop="naturalPersonName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="联系人名称" prop="contactStaffName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="业务代表名称" prop="agentStaffName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="公司名称" prop="companyName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="托运人状态" prop="shipperStatus" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ shipperStatusMap[scope.row.shipperStatus] || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
        <template #default="scope">
          <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
      @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
      :total="totalSize" class="pagination" />
    <add-shipper ref="addShipperRef" @close="closeDialog" />
    <edit-shipper ref="editShipperRef" @close="closeDialog" />
  </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, nextTick, watch } from 'vue';
import { GlobalStore } from "@/store/index.js";
import { Search } from "@element-plus/icons-vue";
import { searchShipperPageList } from '@/api/api.shipper';
import addShipper from './components/addShipper.vue';
import editShipper from './components/editShipper.vue';
import { subjectTypeMap, shipperStatusMap } from '@/config/const.js';

const loading = ref(false);
/*
shipperId:"",// 托运人ID
shipperCode:"",// 托运人编码
shipperName:"",// 托运人简称
subjectType:"",// 主体类型
naturalPersonName:"",// 自然人名称
contactStaffName:"",// 联系人名称
agentStaffName:"",// 业务代表名称
companyName:"",// 公司名称
shipperStatus:"",// 托运人状态
remark:"",// 备注
*/
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  shipperName: "",// 托运人简称
  shipperCode: ""// 托运人编码
})

function load() {
  loading.value = true;
  searchShipperPageList({
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
const addShipperRef = useTemplateRef('addShipperRef');
function handleClickAdd() {
  addShipperRef.value.open();
}
const editShipperRef = useTemplateRef('editShipperRef');
function handleClickEdit(item) {
  editShipperRef.value.open(item);
}
function handleRowClick(row, column, event) {
}
let tableHeight = ref(250);
const shipperRef = useTemplateRef('shipperRef');
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (shipperRef.value) {
      tableHeight.value = shipperRef.value.clientHeight - 122;
    }
  })
}, { immediate: true })
onMounted(() => {
  load();
});

</script>

<style lang="less">
.shipper {}
</style>