<template>
  <div class="payrollMonthly page-wrap" ref="payrollMonthlyRef">
    <div class="header">
      <el-date-picker v-model="search.date" type="month" class="width-200 mr-10" placeholder="选择月份"
        @change="handleSearch" clearable />
      <el-select v-model="search.fleetId" filterable placeholder="请选择车队" class="width-200 mr-10" @change="handleSearch">
        <el-option :value="item.fleetId" :label="item.fleetName" v-for="item in allFleetList">
          <span class="el-option-left">{{ item.fleetName }}</span>
          <span class="el-option-right">{{ item.fleetCode }}</span>
        </el-option>
      </el-select>
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <div class="flex-1"></div>
      <el-button type="primary" plain size="default" @click="handleClickExport" :loading="exportloading">导出</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
      row-key="id" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class" v-loading="loading">
      <el-table-column fixed type="index" label="编号" width="40" align="center" />
      <el-table-column label="司机姓名" prop="driverFullName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="性质" prop="driverNature" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ driverNatureTypeMap[scope.row.driverNature] || scope.row.driverNature }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车队" prop="fleetName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="提成(元)" prop="income" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="运单数" prop="waybillCount" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="运单总重量(吨)" prop="waybillWeight" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="运单日期" prop="dateStr" width="auto" align="center" show-overflow-tooltip />
      <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
        <template #default="scope">
          <el-button link type="warning" @click.prevent.stop="handleClickViewDetail(scope.row)">查看运单明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
      @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
      :total="totalSize" class="pagination" />
    <el-drawer v-model="showDetailList" size="95%" :show-close="false" class="dict-drawer">
      <template #header="{ close, titleId, titleClass }">
        <span style="flex: none"></span>
        <button aria-label="el.drawer.close" class="el-drawer__close-btn" type="button" @click="closeDraw"><i
            class="el-icon el-drawer__close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
              <path fill="currentColor"
                d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z">
              </path>
            </svg>
          </i></button>
        <div class="drawTitle flex-center flex-1">
          <span v-if="currentData">{{ currentData.driverFullName }} {{ currentData.dateStr }}运单明细</span>
        </div>
      </template>
      <template #default>
        <div>
          <el-table :data="currentData ? currentData.wayBillList : []" class="table" border highlight-current-row
            row-key="dictCode" :height="tableHeight + 150">
            <el-table-column fixed type="index" label="编号" width="40" align="center" />
            <el-table-column prop="vehicleCode" label="车牌号" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="dispatchNumber" label="调度号" width="50" align="center" show-overflow-tooltip />
            <el-table-column prop="sendSuttle" label="发货净重(吨)" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="receiveSuttle" label="收货净重(吨)" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="settleWeight" label="结算净重(吨)" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="lossWeight" label="损耗量(吨)" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="lossRate" label="损耗率(%)" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="lossRateAbnormal" label="损耗是否异常" width="auto" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <el-tag type="danger" disable-transitions v-if="row.lossRateAbnormal">异常</el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="loadingWayName" label="装车方式" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="spadeNumber" label="装车铲数" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="grossWeighbridge" label="毛重磅号" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="tareWeighbridge" label="皮重磅号" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="shippingUnit" label="发货单位" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="receivingUnit" label="收货单位" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="sendTime" label="发货时间" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="receivingTime" label="收货时间" width="auto" align="center" show-overflow-tooltip />

            <el-table-column prop="transferStatus" label="转账状态" width="auto" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ transferStatusMap[row.transferStatus] || row.transferStatus }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="waybillFileIds" label="运单图片集" width="auto" align="center" show-overflow-tooltip>
              <template #default="scope">
                <span v-if="!scope.row.waybillFileIds">-</span>
                <span v-else class="link" @click.self.stop="handleViewFiles(scope.row.waybillFileIds)">图片({{
                  scope.row.waybillFileIds.split(",").length }}个)</span>
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice" label="单价" width="auto" align="center" show-overflow-tooltip />
            <el-table-column prop="pricingMethod" label="计价方式" width="auto" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ pricingMethodMap[row.pricingMethod] || row.pricingMethod }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="auto" align="center" show-overflow-tooltip />
          </el-table>
        </div>
      </template>
    </el-drawer>
    <image-dialog ref="imageDialogRef"></image-dialog>
  </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, nextTick, watch } from 'vue';
import { GlobalStore } from "@/store/index.js";
import { Search } from "@element-plus/icons-vue";
import { searchFleetDriverMonthFinancePageList, exportFleetDriverMonthFinance } from "@/api/api.finance.js";
import { getAllFleetSimpleList } from "@/api/api.fleet.js";
import { driverNatureTypeMap, transferStatusMap, pricingMethodMap, waybillStatusMap, waybillStatusTagTypeMap } from "@/config/const.js";
import ImageDialog from "@/components/form/image-dialog.vue";
import { ElMessage } from 'element-plus';
import { formatDateTimeThinString, downloadStreamFile } from "@/utils/util.js";

const loading = ref(false);
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const showDetailList = ref(false);
const search = ref({
  date: "2025-07-31",
  fleetId: ""
})

function load() {
  loadFleet().then(() => {
    if (search.value.fleetId === "") {
      return;
    }
    loading.value = true;
    let param = {
      current: pageCurrent.value,
      size: pageSize.value,
      ...search.value
    }
    searchFleetDriverMonthFinancePageList(param).then(res => {
      tableData.value = res.records || [];
      totalSize.value = res.total || 0;
    }).finally(() => {
      loading.value = false;
    });
  })
}

function handleSearch() {
  pageCurrent.value = 1; // 重置当前页码
  load();
}


const allFleetList = ref([]);

async function loadFleet() {
  if (allFleetList.value.length > 0) {
    return;
  }
  loading.value = true;
  let res = await getAllFleetSimpleList();
  allFleetList.value = res;
  loading.value = false;
  if (res.length > 0 && !search.value.fleetId) {
    search.value.fleetId = res[0].fleetId; // 默认选择第一个车队
  }
}


function closeDialog(reload) {
  if (reload) load();
}

const exportloading = ref(false);
function handleClickExport() {
  if (exportloading.value) return;
  exportloading.value = true;
  let param = {
    ...search.value,
  }
  exportFleetDriverMonthFinance(param).then(res => {
    ElMessage.success("导出成功");
    exportloading.value = false;
    let dateString = formatDateTimeThinString(new Date(), false);
    let fileName = `货运数据统计_${dateString}.xlsx`;
    let contentDisposition = res.headers["content-disposition"];
    if (contentDisposition) {
      let fileNameString = contentDisposition.split(";").map(p => p.trim()).find(p => p.startsWith("filename="));
      if (fileNameString) {
        fileNameString = fileNameString.replace(/"/ig, "");
        fileName = decodeURIComponent(fileNameString.split("=")[1]);
      }
    }

    downloadStreamFile(res.data, fileName);
  }).finally(() => {
    exportloading.value = false;
  });
}
const currentData = ref(null);
function handleClickViewDetail(item) {
  currentData.value = null;
  showDetailList.value = true;
  setTimeout(() => {
    currentData.value = item;
  }, 100);
}
const imageDialogRef = useTemplateRef('imageDialogRef');
function handleViewFiles(fileIdStr) {
  imageDialogRef.value.open(fileIdStr)
}
function closeDraw() {
  showDetailList.value = false;
}
function handleRowClick(row, column, event) {
}
let tableHeight = ref(250);
const payrollMonthlyRef = useTemplateRef('payrollMonthlyRef');
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (payrollMonthlyRef.value) {
      tableHeight.value = payrollMonthlyRef.value.clientHeight - 122;
    }
  })
}, { immediate: true })
onMounted(() => {
  load();
});

</script>

<style lang="less">
.payrollMonthly {}
</style>