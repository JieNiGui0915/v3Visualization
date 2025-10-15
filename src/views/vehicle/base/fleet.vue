<template>
  <div class="fleet page-wrap" ref="fleetRef">
    <div class="header">
      <el-input v-model.trim="search.fleetCode" class="width-200 mr-10" placeholder="车队编码" :prefix-icon="Search"
        @keyup.enter="handleSearch" @clear="handleSearch" clearable />
      <el-input v-model.trim="search.fleetName" class="width-200 mr-10" placeholder="车队名称" :prefix-icon="Search"
        @keyup.enter="handleSearch" @clear="handleSearch" clearable />
      <el-select v-model="search.subjectType" class="width-200 mr-10" placeholder="主体类型" @change="handleSearch"
        clearable>
        <el-option v-for="item in fleetSubjectTypeList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model.trim="search.fleetId" class="width-150 mr-10" placeholder="所属车队" @focus="loadAllFleet"
        @change="handleSearch" clearable filterable :loading="loadingFleet">
        <el-option :label="item.fleetName" :value="item.fleetId" v-for="item in fleetList"></el-option>
      </el-select>
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <div class="flex-1"></div>
      <el-button type="primary" plain size="default" @click="handleClickAdd">新增车队</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
      row-key="id" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class" v-loading="loading">
      <el-table-column fixed type="index" label="编号" width="80" align="center" />
      <el-table-column label="车队名称" prop="fleetName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="车队编码" prop="fleetCode" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="自然人" prop="naturalPersonName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="公司" prop="companyName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="业务代表" prop="agentStaffName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="主体类型" prop="subjectType" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ fleetSubjectTypeMap[scope.row.subjectType] || "" }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="fleetStatus" width="70" align="center" show-overflow-tooltip>
        <template #default="scope">
          <el-tag :type="scope.row.fleetStatus === 0 ? 'success' : 'danger'" disable-transitions>
            {{ scope.row.fleetStatus === 0 ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip />
      <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
        <template #default="scope">
          <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除该项吗？" @confirm="handleClickDelete(scope.row)" :loading="loadingDel">
            <template #reference>
              <el-button link type="danger" @click.prevent.stop :loading="loadingDel">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
      @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
      :total="totalSize" class="pagination" />
    <add-fleet ref="addFleetRef" @close="closeDialog" />
    <edit-fleet ref="editFleetRef" @close="closeDialog" />
  </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, nextTick, watch } from 'vue';
import { GlobalStore } from "@/store/index.js";
import { Search } from "@element-plus/icons-vue";
import { searchFleetPageList } from '@/api/api.fleet';
import { fleetSubjectTypeList, fleetSubjectTypeMap } from '@/config/const.js';
import { getAllFleetSimpleList, deleteFleet } from '@/api/api.fleet.js';
import addFleet from './components/addFleet.vue';
import editFleet from './components/editFleet.vue';
import { ElMessage } from 'element-plus';

const loading = ref(false);
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  fleetId: "",// 车队ID
  fleetCode: "",// 车队编码
  fleetName: "",// 车队简称
  subjectType: "",// 主体类型，1-自然人，2-公司
})

function load() {
  loading.value = true;
  searchFleetPageList({
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

const loadingFleet = ref(false);
const fleetList = ref([]);

async function loadAllFleet() {
  if (fleetList.value.length > 0) {
    return;
  }
  loadingFleet.value = true;
  fleetList.value = await getAllFleetSimpleList();
  loadingFleet.value = false;
}

function handleSearch() {
  pageCurrent.value = 1; // 重置当前页码
  load();
}

function closeDialog(reload) {
  if (reload) load();
}
const addFleetRef = useTemplateRef('addFleetRef');
function handleClickAdd() {
  addFleetRef.value.open();
}
const editFleetRef = useTemplateRef('editFleetRef');
function handleClickEdit(item) {
  editFleetRef.value.open(item);
}

const loadingDel = ref(false);
function handleClickDelete(item) {
  loadingDel.value = true;
  deleteFleet({ fleetId: item.fleetId }).then(() => {
    ElMessage.success("删除成功");
    load();
  }).finally(() => {
    loadingDel.value = false;
  });
}
function handleRowClick(row, column, event) {
}
let tableHeight = ref(250);
const fleetRef = useTemplateRef('fleetRef');
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (fleetRef.value) {
      tableHeight.value = fleetRef.value.clientHeight - 122;
    }
  })
}, { immediate: true })
onMounted(() => {
  load();
});

</script>

<style lang="less">
.fleet {}
</style>