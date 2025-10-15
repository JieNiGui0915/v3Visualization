<template>
  <el-drawer v-model="showDrawer" :with-header="true" size="96%" destroy-on-close :show-close="false"
    @close="handleDrawerClose" class="dispatchPlanView my-drawer">
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
        派车计划
      </div>
      <el-button plain type="primary" size="small" @click="handleAddDispatchData"
        :disabled="order.orderStatus === 3">添加派车计划</el-button>
    </template>
    <template #default>
      <el-table :data="transportCompanyMapList.get(currentTransportCompany)" row-key="dispatchPlanId"
        highlight-current-row border @row-click="handleTableRowClick" v-loading="dispatchDrawLoading" row-class-name="a"
        :height="dispatchTableHeight">
        <el-table-column fixed type="index" label="序号" width="50" align="center" />
        <el-table-column label="订单号" prop="orderNumber" width="120" align="center" show-overflow-tooltip />
        <el-table-column label="车队" prop="fleetName" width="auto" align="center" show-overflow-tooltip />
        <el-table-column label="计划运量(吨)" prop="planVolume" width="100" align="center" show-overflow-tooltip />
        <el-table-column label="计划用车地点" prop="planSite" width="110" align="center" show-overflow-tooltip />
        <el-table-column label="计划装车时间" prop="planTime" width="120" align="center" show-overflow-tooltip>
          <template #default="scope">
            {{ formatDateTimeString(scope.row.planTime) }}
            <!-- <el-tag type="primary" v-if="isToday(scope.row.planTime)" disable-transitions>今天</el-tag>
            <el-tag type="success" v-else-if="isTomorrow(scope.row.planTime)" disable-transitions>明天</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column label="计划结束时间" prop="planEndTime" width="120" align="center" show-overflow-tooltip>
          <template #default="scope">
            {{ formatDateTimeString(scope.row.planEndTime) }}
          </template>
        </el-table-column>
        <el-table-column label="派车描述" prop="dispatchDesc" width="auto" align="center"
          show-overflow-tooltip></el-table-column>
        <el-table-column label="计价方式" prop="pricingMethod" width="auto" align="center" show-overflow-tooltip />
        <el-table-column label="单价" prop="unitPrice" width="auto" align="center" show-overflow-tooltip />
        <el-table-column label="预计吨数" prop="estimatedTonnage" width="auto" align="center" show-overflow-tooltip />
        <el-table-column label="预计趟数" prop="estimatedTrips" width="auto" align="center" show-overflow-tooltip />
        <el-table-column label="预计金额" prop="estimatedAmount" width="auto" align="center" show-overflow-tooltip />
        <el-table-column label="结算方式" prop="settlementMethod" width="auto" align="center" show-overflow-tooltip>
          <template #default="scope">
            {{ settlementMethodMap[scope.row.settlementMethod] }}
          </template>
        </el-table-column>
        <el-table-column label="结算平台" prop="settlementPlatform" width="auto" align="center" show-overflow-tooltip />
        <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column fixed="right" label="状态" prop="dispatchStatus" width="auto" align="center"
          show-overflow-tooltip>
          <template #default="scope">
            <el-tag :type="dispatchPlanStatusTagTypeMap[scope.row.dispatchStatus]" disable-transitions>{{
              dispatchPlanStatusMap[scope.row.dispatchStatus] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="scope">
            <el-button link type="primary" @click.prevent.stop="handleAddDispatch(scope.row)"
              :disabled="scope.row.dispatchStatus === 2">
              去派车
            </el-button>
            <el-button link type="warning" @click.prevent.stop="handleClickEditDispatchPlan(scope.row)"
              :disabled="scope.row.dispatchStatus === 2">
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
      <dispatch-view ref="dispatchViewRef" @close="closeDialog"></dispatch-view>
    </template>
  </el-drawer>
  <add-dispatch ref="addDispatchRef" @close="closeDialog"></add-dispatch>
  <edit-dispatch ref="editDispatchRef" @close="closeDialog"></edit-dispatch>
  <add-dispatch-plan ref="addDispatchPlanRef" @close="closeDialog"></add-dispatch-plan>
  <edit-dispatch-plan ref="editDispatchPlanRef" @close="closeDialog"></edit-dispatch-plan>

</template>
<script setup>

import { formatDate, formatDateTimeString, isToday, isTomorrow, toMapList } from "@/utils/util.js";
import { nextTick, ref, useTemplateRef, watch } from "vue";
import * as dispatchApi from "@/api/api.dispatch.js";
import AddDispatch from "./addDispatch.vue";
import EditDispatch from "./editDispatch.vue";
import { GlobalStore } from "@/store/index.js";
import addDispatchPlan from "./addDispatchPlan.vue";
import editDispatchPlan from "./editDispatchPlan.vue";
import dispatchView from "./dispatchView.vue";
import { dispatchPlanStatusMap, dispatchPlanStatusTagTypeMap, settlementMethodMap } from "@/config/const.js";

const emit = defineEmits(['close']);
const showDrawer = ref(false);
const order = ref({
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
const addDispatchPlanRef = useTemplateRef("addDispatchPlanRef");
const editDispatchPlanRef = useTemplateRef("editDispatchPlanRef");


const open = (data) => {
  Object.assign(order.value, data);
  showDrawer.value = true;
  load();
}

defineExpose({
  open
})

async function load() {
  dispatchDrawLoading.value = true;
  dispatchList.value = await dispatchApi.getDispatchPlanListByOrderId({ orderId: order.value.orderId });
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
  addDispatchPlanRef.value.open(order.value);
}

const dispatchViewRef = useTemplateRef("dispatchViewRef")

function handleAddDispatch(row) {
  dispatchViewRef.value.open(row);
}

function handleTableRowClick(row) {
  handleAddDispatch(row)
}

function handleClickEditDispatchPlan(row) {
  editDispatchPlanRef.value.open(row);
}
const loadingDel = ref(false);
function handleDel(row) {
  loadingDel.value = true;
  dispatchApi.delDispatchPlan({ dispatchPlanIds: [row.dispatchPlanId] }).then(() => {
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
.dispatchPlanView {}
</style>
