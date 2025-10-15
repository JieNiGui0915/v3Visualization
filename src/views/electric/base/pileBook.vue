<template>
  <div class="pileBook page-wrap" ref="pageRef">
    <div class="header">
      <el-input v-model.trim="search.pileGunCode" class="width-150 mr-10" placeholder="充电枪编码"
                @keyup.enter="handleSearch" clearable @clear="handleSearch"/>
      <el-input v-model.trim="search.pileName" class="width-150 mr-10" placeholder="桩名称"
                @keyup.enter="handleSearch" clearable @clear="handleSearch"/>
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <div class="flex-1"></div>
      <!--      <el-button type="primary" plain size="default" @click="handleClickAdd">新增场站</el-button>-->
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" stripe border highlight-current-row
              row-key="pileGunId" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class"
              v-loading="loading">
      <el-table-column fixed type="index" label="#" width="40" align="center"/>
      <el-table-column fixed label="编码" prop="pileGunCode" width="160" align="center" show-overflow-tooltip/>
      <el-table-column fixed label="桩名称" prop="pileName" width="60" align="center" show-overflow-tooltip/>
      <el-table-column label="枪口号" prop="pileGunNo" width="60" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ String.fromCharCode(64 + parseInt(scope.row.pileGunNo)) }}枪
        </template>
      </el-table-column>
      <el-table-column label="运行状态" prop="gunState" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <template v-if="scope.row.gunState === 4">
            <el-tag type="success">{{ gunStateMap[scope.row.gunState] }}</el-tag>
          </template>
          <template v-else>
            {{ gunStateMap[scope.row.gunState] }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="枪连车状态" prop="connectState" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <template v-if="scope.row.connectState===1">
            <el-tag :type="connectStateTagTypeMap[scope.row.connectState]">{{ connectStateMap[scope.row.connectState] }}</el-tag>
          </template>
          <template v-else>
            <span>{{ connectStateMap[scope.row.connectState] }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" prop="plateNumber" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.plateNumber }}
        </template>
      </el-table-column>
      <el-table-column label="车辆VIN" prop="pileStatus" width="160" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.brmVin }}
        </template>
      </el-table-column>

      <el-table-column label="枪功率(kWh)" prop="ratePower" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="充电枪类型" prop="acDcType" width="80" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ acDcTypeMap[scope.row.acDcType] }}
        </template>
      </el-table-column>
      <el-table-column label="设备型号" prop="deviceMode" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="运营商名称" prop="operatorCompanyName" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="站点名称" prop="stationName" width="auto" align="center" show-overflow-tooltip/>

      <el-table-column label="设备生产生" prop="supplierName" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="站点照片" prop="fileIds" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="!scope.row.fileIds">-</span>
          <span v-else class="link" @click.self.stop="handleViewFiles(scope.row.stationFileIds)">查看图片({{ scope.row.stationFileIds.split(",").length }}个)</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip/>-->
      <!--      <el-table-column label="创建时间" prop="createTime" width="140" align="center" show-overflow-tooltip/>-->
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
                   @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
                   :total="totalSize" class="pagination"/>
  </div>
  <image-dialog ref="imageDialogRef"></image-dialog>
</template>
<script setup>
import {nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch} from "vue";
import * as pileApi from "@/api/api.pile.js";
import {GlobalStore} from "@/store/index.js";
import ImageDialog from "@/components/form/image-dialog.vue";
import {connectStateMap, connectStateTagTypeMap, gunStateMap, acDcTypeMap, vehicleStatusList} from "@/config/const.js";
import {BASE_URL} from "@/config/config.js";
import {onBeforeRouteLeave} from "vue-router";
import {toMap} from "@/utils/util.js";

const loading = ref(false);
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  pileGunCode: "",// 设备编码
  pileName: "",// 桩名称
})

function handleSearch() {
  pageCurrent.value = 1;
  load();
}

async function load() {
  loading.value = true;
  let res = await pileApi.searchAllPileGunList({current: pageCurrent.value, size: pageSize.value, ...search.value}, false)
  tableData.value = res.records;
  totalSize.value = res.total;
  loading.value = false;
}

const stationList = ref([]);

async function loadStationList() {
  stationList.value = await pileApi.getAllStationSimpleList();
}

let tableHeight = ref(250);
const pageRef = useTemplateRef("pageRef");
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (pageRef.value) {
      tableHeight.value = pageRef.value.clientHeight - 120;
    }
  })
}, {immediate: true})


function handleClickAdd() {

}

function handleRowClick(row) {

}

const imageDialogRef = useTemplateRef("imageDialogRef");

function handleViewFiles(fileIdStr) {
  imageDialogRef.value.open(fileIdStr)
}

// region WebSocket连接
let ws = null;

function initWebSocket() {
  const url = BASE_URL + "/go-api/pile/ws";
  ws = new WebSocket(url + "?token=" + globalStore.token);

  try {
    ws.onopen = function () {
      clearTimeoutInstance();
    };
    // ws connection closed
    ws.onclose = function () {
      if (ws) {
        ws.close();
        ws = null;
      }
      console.info("WebSocket Server [" + url + "] Connection Closed!");
      lazyInit();
    };
    // ws connection error
    ws.onerror = function () {
      if (ws) {
        ws.close();
        ws = null;
      }
      console.error("WebSocket Server [" + url + "] Connection Error!");
      lazyInit();
    };
    // ws response message.
    ws.onmessage = function (result) {
      parseSocketData(JSON.parse(result.data));
    };
  } catch (e) {
    alert(e.message);
  }
}

function closeWebSocket() {
  clearTimeoutInstance();
  if (ws) {
    ws.close();
    ws = null;
  }
}

function clearTimeoutInstance() {
  clearTimeout(initWebSocketTimeoutId);
  initWebSocketTimeoutId = null;
}

window.onbeforeunload = function () {
  closeWebSocket();
}

function lazyInit() {
  clearTimeoutInstance();
  initWebSocketTimeoutId = setTimeout(() => {
    if (initWebSocketTimeoutId) {
      initWebSocket();
    }
  }, 1000)
}

function parseSocketData(data) {
  let dataMap = toMap(data, item => item.gunCode);
  tableData.value.forEach(p => {
    let d = dataMap.get(p.pileGunCode);
    if (d) {
      p.gunState = d.gunState;
      p.runningState = d.runningState;
      p.connectState = d.connectState;
      p.plateNumber = d.plateNumber;
      p.brmVin = d.brmVin;
    }
  })
}

// endregion
let initWebSocketTimeoutId = null;
onMounted(() => {
  load().then(_ => {
    initWebSocket();
  });
});
onUnmounted(() => {
  closeWebSocket();
})
onBeforeRouteLeave((to, from) => {
  closeWebSocket();
})
</script>
<style lang="less">
.pileBook {
  .width-200 {
    width: 200px;
  }
}
</style>
