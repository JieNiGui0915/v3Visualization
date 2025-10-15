<template>
  <div class="order page-wrap" ref="orderRef">
    <div class="header">
      <el-select ref="shipperSelectRef" v-model="search.shipperId" class="width-150 mr-10" placeholder="货主"
        @focusin="loadShipper" v-loading="loadingShipper" @change="handleSearch" clearable>
        <el-option v-for="item in shipperList" :label="item.shipperName" :value="item.shipperId">
          <span class="el-option-left">{{ item.shipperName }}</span>
          <span class="el-option-right">{{ item.shipperCode }}</span>
        </el-option>
      </el-select>
      <el-select ref="goodsItemSelectRef" v-model="search.goodsItemId" class="width-150 mr-10" placeholder="货物"
        @focusin="loadGoodsItem" v-loading="loadingGoodsItem" @change="handleSearch" clearable>
        <el-option v-for="item in goodsItemList" :label="item.goodsItemName" :value="item.goodsItemId">
          <span class="el-option-left">{{ item.goodsItemName }}</span>
          <span class="el-option-right">{{ item.goodsItemCode }}</span>
        </el-option>
      </el-select>
      <el-select ref="truckLineSelectRef" v-model="search.trucklineId" class="width-150 mr-10" placeholder="路线"
        @focusin="loadTruckLine" v-loading="loadingTruckLine" @change="handleSearch" clearable>
        <el-option v-for="item in truckLineList" :label="item.trucklineName" :value="item.trucklineId"></el-option>
      </el-select>
      <el-select v-model="search.orderStatus" class="width-150 mr-10" placeholder="状态" @change="handleSearch" clearable>
        <el-option v-for="item in orderStatusList" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input v-model.trim="search.orderNumber" class="width-200 mr-10" placeholder="订单号" :prefix-icon="Search"
        @keyup.enter="handleSearch" clearable @clear="handleSearch" />
      <el-button type="primary" size="default" @click="handleSearch" :icon="Search"><span
          class="max_width_display_none">查询</span></el-button>
      <div class="flex-1">
      </div>
      <el-icon color="#409eff" class="mr-10 a" @click="handleSwitchEdit" title="切换显示操作按钮">
        <Edit />
      </el-icon>
      <el-button type="primary" plain size="default" @click="handleClickAdd" :icon="Plus"><span
          class="max_width_display_none">新增订单</span></el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" row-key="consignmentId" class="table"
      highlight-current-row border @row-click="handleTableRowClick" show-overflow-tooltip v-loading="loading"
      scrollbar-always-on row-class-name="a">
      <el-table-column fixed type="index" label="#" width="40" align="center" />
      <el-table-column label="定单号" prop="orderNumber" width="120" align="center" show-overflow-tooltip />
      <el-table-column label="合同号" prop="contractNo" width="120" align="center" show-overflow-tooltip />
      <el-table-column label="合同子项" prop="contractItemName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="货主" prop="shipperName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="线路名称" prop="trucklineName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="货物名称" prop="goodsItemName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="开始时间" prop="beginTime" width="120" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ formatDateTimeString(scope.row.beginTime) }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="endTime" width="120" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ formatDateTimeString(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column label="运量(吨)" prop="freightVolume" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="装货地点" prop="loadAddress" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="卸货地点" prop="unloadAddress" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="委托方式" prop="proxyWay" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ proxyWayMap[scope.row.proxyWay] }}
        </template>
      </el-table-column>
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
      <el-table-column label="联系人" prop="contactUserName" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.contactUserName }}
          <span v-if="scope.row.contactPhone" class="font-small">{{ scope.row.contactPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="创建时间" prop="createTime" width="auto" align="center" show-overflow-tooltip />
      <el-table-column fixed="right" label="状态" prop="orderStatus" width="80" align="center" show-overflow-tooltip>
        <template #default="scope">
          <el-tag :type="orderStatusTagTypeMap[scope.row.orderStatus]" disable-transitions>
            {{ orderStatusMap[scope.row.orderStatus] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="240" align="center">
        <template #default="scope">
          <el-button link type="primary" @click.prevent.stop="handleClickDispatch(scope.row)"
            :disabled="scope.row.orderStatus === 3">
            去下计划
          </el-button>
          <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)"
            :disabled="scope.row.orderStatus === 3" v-if="showEditBtn">
            编辑
          </el-button>
          <el-button link type="warning" @click.prevent.stop="handleClickCloseOrder(scope.row)"
            :disabled="scope.row.orderStatus === 3">
            关闭订单
          </el-button>
          <el-popconfirm v-if="showEditBtn" title="删除订单?" :confirm-button-text="'删除'" :cancel-button-text="'取消'"
            :loading="loadingDel" @confirm="handleClickDel(scope.row)">
            <template #reference>
              <el-button link type="danger" @click.prevent.stop :loading="loadingDel">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
      @current-change="load" :page-sizes="[20, 50, 100, 200]" background layout="total, prev, pager,sizes, next"
      :total="totalSize" class="pagination" />
    <add-order ref="addOrderRef" @close="closeDialog"></add-order>
    <edit-order ref="editOrderRef" @close="closeDialog"></edit-order>
    <dispatch-plan-view ref="dispatchPlanViewRef" @close="closeDialog"></dispatch-plan-view>
    <confirm-close-order ref="confirmCloseOrderRef" @close="closeDialog"></confirm-close-order>
  </div>
</template>
<script setup>
import { nextTick, onMounted, ref, useTemplateRef, watch } from "vue";
import * as orderApi from "@/api/api.order.js";
import { Plus, Search } from "@element-plus/icons-vue";
import { GlobalStore } from "@/store/index.js";
import { formatDateTimeString } from "@/utils/util.js";
import { orderStatusList, orderStatusMap, orderStatusTagTypeMap, settlementMethodMap, proxyWayMap } from "@/config/const.js";
import addOrder from "./components/addOrder.vue";
import editOrder from "./components/editOrder.vue";
import { getShipperSimpleList } from "@/api/api.shipper.js";
import { getGoodsSimpleList } from "@/api/api.goods.js";
import { getTruckLineSimpleList } from "@/api/api.truckline.js";
import dispatchPlanView from "./components/dispatchPlanView.vue";
import confirmCloseOrder from "./components/confirmCloseOrder.vue";

// region 订单
/*
  "orderId": "", // 合同id
  "orderNumber": "",// 订单号
  "contractId": "", // 合同id
  "contractItemId":"",// 合同子项ID
  "contractItemName":"",// 合同子项名称
  "contractNo": "", // 合同编号
  "shipperId": "", // 货主ID
  "goodsItemId": "", // 货物ID
  "trucklineId": "", // 路线ID
  "freightVolume": null, // 运量(吨)
  "loadAddress": "", // 装货点
  "unloadAddress": "", // 卸货点
  "beginTime": "", // 起始时间
  "endTime": "", // 结束时间
  "contactUserName": "", // 联系人姓名
  "contactPhone": "", // 联系电话
  "transportRequire": "", // 运输要求
  "orderFileIds": "", // 订单文件集
  "remark": "", // 备注
  "proxyWay":"",// 委托方式
  "pricingMethod": "",// 计价方式(1.计吨 2.计趟 3.一口价)
  "unitPrice": "",// 单价(元)
  "estimatedTonnage": "",// 预计吨数
  "estimatedTrips": "",// 预计趟数
  "estimatedAmount": "",// 预计金额(元)
  "settlementMethod": "",// 结算方式(1.月结 2.现结 3.第三方平台)
  "settlementPlatform": "",// 结算平台
  */
const tableData = ref([]);
const tableHeight = ref(250);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  shipperId: "",//货主ID
  goodsItemId: "",//货物ID
  trucklineId: "",//路线ID
  orderNumber: "",//订单号
  orderStatus: undefined,//订单状态  0.已下单 1.已接单 2.执行中 3.已结束
})
const loading = ref(false);
const showEditBtn = ref(true);

async function load() {
  loading.value = true;
  let data = [];
  data = await orderApi.searchOrderPageList({ current: pageCurrent.value, size: pageSize.value, ...search.value });
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

const addOrderRef = useTemplateRef("addOrderRef");

function handleClickAdd() {
  addOrderRef.value.open();
}

const editOrderRef = useTemplateRef("editOrderRef");

function handleClickEdit(item) {
  editOrderRef.value.open(item);
}
const loadingDel = ref(false);
function handleClickDel(row) {
  loadingDel.value = true;
  orderApi.deleteOrder({ orderIds: [row.orderId] }).then(() => {
    load();
  }).finally(() => {
    loadingDel.value = false;
  });
}

function handleTableRowClick(row) {
  handleClickDispatch(row);
}

const confirmCloseOrderRef = useTemplateRef("confirmCloseOrderRef");
function handleClickCloseOrder(row) {
  confirmCloseOrderRef.value.open(row);
}

function closeDialog(reload) {
  if (reload) {
    load();
  }
}

// endregion


// region 货主
const loadingShipper = ref(false);
const shipperList = ref([]);
const shipperSelectRef = useTemplateRef("shipperSelectRef");

function loadShipper() {
  if (shipperList.value.length > 0) {
    return;
  }
  loadingShipper.value = true;
  getShipperSimpleList().then(res => {
    shipperList.value = res;
    nextTick(() => {
      shipperSelectRef.value.toggleMenu();
    })
  }).finally(() => {
    loadingShipper.value = false;
  })
}

// endregion
// region 货物
const loadingGoodsItem = ref(false);
const goodsItemList = ref([]);
const goodsItemSelectRef = useTemplateRef("goodsItemSelectRef");

function loadGoodsItem() {
  if (goodsItemList.value.length > 0) {
    return;
  }
  loadingGoodsItem.value = true;
  getGoodsSimpleList().then(res => {
    goodsItemList.value = res;
    nextTick(() => {
      goodsItemSelectRef.value.toggleMenu();
    })
  }).finally(() => {
    loadingGoodsItem.value = false;
  })
}

// endregion
// region 货物
const loadingTruckLine = ref(false);
const truckLineList = ref([]);
const truckLineSelectRef = useTemplateRef("truckLineSelectRef");

function loadTruckLine() {
  if (truckLineList.value.length > 0) {
    return;
  }
  loadingTruckLine.value = true;
  getTruckLineSimpleList().then(res => {
    truckLineList.value = res;
    nextTick(() => {
      truckLineSelectRef.value.toggleMenu();
    })
  }).finally(() => {
    loadingTruckLine.value = false;
  })
}

// endregion
// region 派车计划

const dispatchPlanViewRef = useTemplateRef("dispatchPlanViewRef");

function handleClickDispatch(row) {
  dispatchPlanViewRef.value.open(row);
}

// endregion
// region 全局
const globalStore = GlobalStore();
const orderRef = useTemplateRef("orderRef");
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (orderRef.value) {
      tableHeight.value = orderRef.value.clientHeight - 120;
    }
  })
}, { immediate: true })
onMounted(() => {
  load();
})
// endregion
</script>
<style lang="less">
.order {
  .width-100 {
    width: 100px;
  }

  .width-150 {
    width: 150px;
  }

  .width-200 {
    width: 200px;
  }
}
</style>
