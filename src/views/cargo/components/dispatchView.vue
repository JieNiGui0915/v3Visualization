<template>
  <el-drawer v-model="showDrawer" :with-header="true" size="80%" destroy-on-close :show-close="false"
    @close="handleDrawerClose" class="dispatchView my-drawer">
    <template #header="{ close, titleId, titleClass }">
      <span style="flex: none"></span>
      <button aria-label="el.drawer.close" class="el-drawer__close-btn" type="button" @click="handleDrawerClose"><i
          class="el-icon el-drawer__close">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path fill="currentColor"
              d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z">
            </path>
          </svg>
        </i></button>
      <div class="drawTitle">
        派车单
      </div>
      <el-button plain type="primary" size="small" @click="handleAddDispatchData" :disabled="dispatchPlan.dispatchStatus === 2">批量添加派车单</el-button>
    </template>
    <template #default>
      <div class="draw_row_first">
        <div>筛选:</div>
        <el-segmented v-model="currentTransportCompany" :options="Array.from(transportCompanyMapList.keys())">
          <template #default="scope">
            {{ scope.item }}
            <span style="font-size: 10px">({{ transportCompanyMapList.get(scope.item) ?
              transportCompanyMapList.get(scope.item).length : 0 }}个)</span>
          </template>
        </el-segmented>
        <div class="flex-1"></div>
        <el-button link type="danger" size="small" @click="handleBatchDel" :loading="loadingDel"
          :disabled="multipleSelection.length === 0">批量删除</el-button>
      </div>
      <el-table :data="transportCompanyMapList.get(currentTransportCompany)" row-key="dispatchId" highlight-current-row
        border v-loading="dispatchDrawLoading" row-class-name="a" :height="dispatchTableHeight"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column fixed type="index" label="序号" width="50" align="center" />
        <el-table-column label="司机姓名" prop="driverName" width="auto" align="center" show-overflow-tooltip />
        <el-table-column label="车牌号" prop="vehicleNumber" width="90" align="center" show-overflow-tooltip />
        <el-table-column label="车队" prop="fleetName" width="auto" align="center" show-overflow-tooltip />
        <el-table-column label="计划用车地点" prop="planSite" width="180" align="center" show-overflow-tooltip />
        <el-table-column label="计划装车时间" prop="planTime" width="180" align="center" show-overflow-tooltip>
          <template #default="scope">
            {{ formatDateTimeString(scope.row.planTime) }}
            <el-tag type="primary" v-if="isToday(scope.row.planTime)" disable-transitions>今天</el-tag>
            <el-tag type="success" v-else-if="isTomorrow(scope.row.planTime)" disable-transitions>明天</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="派发日期" prop="dispatchDate" width="auto" align="center" show-overflow-tooltip>
          <template #default="scope">
            {{ formatDate(scope.row.dispatchDate) }}
          </template>
        </el-table-column>
        <el-table-column label="装车描述" prop="dispatchDesc" width="auto" align="center"
          show-overflow-tooltip></el-table-column>
        <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态" prop="dispatchStatus" width="auto" align="center" show-overflow-tooltip>
          <template #default="scope">
            <el-tag :type="dispatchStatusTagTypeMap[scope.row.dispatchStatus] || 'info'" disable-transitions>
              {{ dispatchStatusMap[scope.row.dispatchStatus] || "" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template #default="scope">
            <el-button link type="warning" @click.prevent.stop="handleClickEditDispatch(scope.row)">
              编辑
            </el-button>
            <el-popconfirm title="确认删除?" confirm-button-text="删除" cancel-button-text="取消"
              @confirm="handleDel(scope.row)">
              <template #reference>
                <el-button link type="danger" :loading="loadingDel" @click.prevent.stop>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </el-drawer>
  <add-dispatch ref="addDispatchRef" @close="closeDialog"></add-dispatch>
  <edit-dispatch ref="editDispatchRef" @close="closeDialog"></edit-dispatch>
</template>
<script setup>

import { formatDate, formatDateTimeString, isToday, isTomorrow, toMapList } from "@/utils/util.js";
import { nextTick, ref, useTemplateRef, watch } from "vue";
import * as dispatchApi from "@/api/api.dispatch.js";
import AddDispatch from "./addDispatch.vue";
import EditDispatch from "./editDispatch.vue";
import { GlobalStore } from "@/store/index.js";
import { ElMessage } from "element-plus";
import { dispatchStatusTagTypeMap, dispatchStatusMap } from "@/config/const.js";

const emit = defineEmits(['close']);
const showDrawer = ref(false);
const dispatchPlan = ref({
  orderId: "",             // 订单ID
  shipperId: "",           // 货主ID
  shipperName: "",         // 货主Name
  goodsItemId: "",         // 货物ID
  goodsItemName: "",       // 货物Name
  trucklineId: "",         // 路线ID
  trucklineName: "",       // 路线Name
  orderNumber: "",         // 订单号
  freightVolume: "",       // 运量
  loadAddress: "",         // 装货点
  unloadAddress: "",       // 卸货点
  beginTime: "",           // 起始时间
  endTime: "",             // 结束时间
  contactUserName: "",     // 联系人姓名
  contactPhone: "",        // 联系人电话
  orderStatus: "",         // 订单状态
  transportRequire: "",    // 运输要求
  orderFileIds: "",        // 订单文件集
  remark: "",              // 备注
  createTime: "",          // 创建时间
});

const defaultFleetName = "所有车队";
const dispatchTableHeight = ref(100);
const dispatchList = ref([]);
const dispatchDrawLoading = ref(false);
const transportCompanyMapList = ref(new Map());
const currentTransportCompany = ref(defaultFleetName);
const addDispatchRef = useTemplateRef("addDispatchRef");
const editDispatchRef = useTemplateRef("editDispatchRef");


const open = (data) => {
  Object.assign(dispatchPlan.value, data);
  showDrawer.value = true;
  load();
}

defineExpose({
  open
})

async function load() {
  dispatchDrawLoading.value = true;
  dispatchList.value = await dispatchApi.getDispatchListByDispatchPlanId({ dispatchPlanId: dispatchPlan.value.dispatchPlanId });
  let mapList = toMapList(dispatchList.value, item => item.transportCompanyName);

  transportCompanyMapList.value = new Map([...new Map().set("所有车队", [...dispatchList.value]), ...mapList]);

  dispatchDrawLoading.value = false;
}

let shouldReload = false;

function handleDrawerClose() {
  showDrawer.value = false;
  emit("close", shouldReload)
}

function handleAddDispatchData() {
  addDispatchRef.value.open(dispatchPlan.value);
}

const multipleSelection = ref([]);
function handleSelectionChange(rows) {
  multipleSelection.value = rows;
}

function handleClickEditDispatch(row) {
  editDispatchRef.value.open(row);
}
const loadingDel = ref(false);
function handleDel(row) {
  loadingDel.value = true;
  dispatchApi.delDispatchBatch({ dispatchIds: [row.dispatchId] }).then(() => {
    ElMessage.success("删除成功");
    load();
  }).finally(() => {
    loadingDel.value = false;
  });
}

function handleBatchDel() {
  if (multipleSelection.value.length === 0) {
    return;
  }
  loadingDel.value = true;
  const ids = multipleSelection.value.map(item => item.dispatchId);
  dispatchApi.delDispatchBatch({ dispatchIds: ids }).then(() => {
    ElMessage.success("批量删除成功");
    load();
  }).finally(() => {
    loadingDel.value = false;
  });
}

function closeDialog(bool) {
  if (bool) load();
  if (!shouldReload) {
    shouldReload = bool;
  }
}

const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (val && val.length === 2) {
      dispatchTableHeight.value = val[1] - 80;
    }
  })
}, { immediate: true })
</script>
<style lang="less">
.dispatchView {}
</style>
