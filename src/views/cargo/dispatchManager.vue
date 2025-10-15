<template>
  <div class="consignmentPlan page-wrap" ref="consignmentRef">
    <div class="header">
      <el-input v-model.trim="search.planSite" class="width-200 mr-10" placeholder="计划用车地点" :prefix-icon="Search"
                @keyup.enter="handleSearch" clearable @clear="handleSearch"/>
      <el-select v-model.trim="search.fleetId" class="width-150 mr-10" placeholder="所属车队" @focus="loadAllFleet"
                 @change="handleSearch" clearable>
        <el-option :label="item.fleetName" :value="item.fleetId" v-for="item in fleetList"></el-option>
      </el-select>
      <el-select v-model.trim="search.dispatchStatus" class="width-150 mr-10" placeholder="派车状态" @change="handleSearch" clearable>
        <el-option :label="item.label" :value="item.value" v-for="item in dispatchPlanStatusList"></el-option>
      </el-select>
      <el-button type="primary" size="default" @click="handleSearch" :icon="Search"><span
          class="max_width_display_none">查询</span></el-button>

      <div class="flex-1"></div>
      <el-icon color="#409eff" class="mr-10 a" @click="handleSwitchEdit" title="切换显示操作按钮">
        <Edit/>
      </el-icon>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" row-key="consignmentId"
              class="table" highlight-current-row border @row-click="handleTableRowClick"
              show-overflow-tooltip v-loading="loading" scrollbar-always-on row-class-name="a">
      <el-table-column fixed type="index" label="序号" width="50" align="center"/>
      <el-table-column label="订单号" prop="orderNumber" width="120" align="center"
                       show-overflow-tooltip/>
      <el-table-column label="车队" prop="fleetName" width="auto" align="center"
                       show-overflow-tooltip/>
      <el-table-column label="计划运量(吨)" prop="planVolume" width="auto" align="center"
                       show-overflow-tooltip/>
      <el-table-column label="计划用车地点" prop="planSite" width="auto" align="center"
                       show-overflow-tooltip/>
      <el-table-column label="计划装车时间" prop="planTime" width="120" align="center"
                       show-overflow-tooltip>
        <template #default="scope">
          {{ formatDateTimeString(scope.row.planTime) }}
          <el-tag type="primary" v-if="isToday(scope.row.planTime)" disable-transitions>今天</el-tag>
          <el-tag type="success" v-else-if="isTomorrow(scope.row.planTime)" disable-transitions>明天</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="派车描述" prop="dispatchDesc" width="auto" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="状态" prop="dispatchStatus" width="80" align="center" show-overflow-tooltip>
        <template #default="scope">
          <el-tag :type="dispatchPlanStatusTagTypeMap[scope.row.dispatchStatus]" disable-transitions>{{ dispatchPlanStatusMap[scope.row.dispatchStatus] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="80" align="center">
        <template #default="scope">
          <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)" v-if="showEditBtn">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
                   @current-change="load" :page-sizes="[20, 50, 100, 200]" background layout="total, prev, pager,sizes, next"
                   :total="totalSize" class="pagination"/>
  </div>
</template>
<script setup>
import {nextTick, onMounted, ref, useTemplateRef, watch} from "vue";
import * as dispatchApi from "@/api/api.dispatch.js";
import {Plus, Search} from "@element-plus/icons-vue";
import {GlobalStore} from "@/store/index.js";
import {formatDate, formatDateTimeString, isToday, isTomorrow} from "@/utils/util.js";
import {delegateStatus, dispatchPlanStatusList, dispatchPlanStatusMap, dispatchPlanStatusTagTypeMap} from "@/config/const.js";
import {getAllFleetSimpleList} from "@/api/api.fleet.js";

// region 派车计划
const tableData = ref([]);
let tableHeight = ref(250);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  dispatchStatus: '',// 派车状态
  // planTimeStart: '',// 计划用车时间开始
  // planTimeEnd: '',// 计划用车时间结束
  planSite: '',// 计划用车地点
  fleetId: '',// 所属车队ID
})
const isHistory = ref(0);
const loading = ref(false);
const showEditBtn = ref(true);

async function load() {
  loading.value = true;
  let data = await dispatchApi.searchDispatchPlanPageList({current: pageCurrent.value, size: pageSize.value, ...search.value});
  tableData.value = data.records || [];
  totalSize.value = data.total;
  loading.value = false;
}

function handleSwitchEdit() {
  showEditBtn.value = !showEditBtn.value;
}

function handleSearch() {
  pageCurrent.value = 1;
  load();
}

const addConsignmentPlanRef = useTemplateRef("addConsignmentPlanRef");

function handleClickAdd() {
  addConsignmentPlanRef.value.open();
}
function handleClickEdit(item) {

}

function handleTableRowClick(row) {

}

// endregion

// region 车队

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

// endregion

// region 全局
const globalStore = GlobalStore();
const consignmentRef = useTemplateRef("consignmentRef");
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (consignmentRef.value) {
      tableHeight.value = consignmentRef.value.clientHeight - 120;
      // batchTableHeight.value = consignmentRef.value.clientHeight + 8;
      // dispatchTableHeight.value = consignmentRef.value.clientHeight + 38;
    }
  })
}, {immediate: true})
onMounted(() => {
  load();
})
// endregion
</script>
<style lang="less">
.consignmentPlan {
  .width-100 {
    width: 100px;
  }

  .width-150 {
    width: 150px;
  }
}
</style>
