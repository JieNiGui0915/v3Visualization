<template>
  <div class="compactSubstation page-wrap" ref="pageRef">
    <div class="header">
      <el-select v-model.trim="search.stationId" class="width-200 mr-10" placeholder="场站" @change="handleSearch" @focus="loadStationList" clearable>
        <el-option :label="item.name" :value="item.stationId" v-for="item in stationList" :key="item.stationId">
          <template #default>
            <span class="el-option-left">{{ item.name }}</span>
            <span class="el-option-right">{{ item.stationCode }}</span>
          </template>
        </el-option>
      </el-select>
      <el-input v-model.trim="search.compactSubstationCode" class="width-150 mr-10" placeholder="箱变编码"
                @keyup.enter="handleSearch" clearable @clear="handleSearch"/>
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <div class="flex-1"></div>
      <!--      <el-button type="primary" plain size="default" @click="handleClickAdd">新增场站</el-button>-->
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
              row-key="vehicleId" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class"
              v-loading="loading">
      <el-table-column fixed type="index" label="#" width="40" align="center"/>
      <el-table-column fixed label="编码" prop="compactSubstationCode" width="60" align="center" show-overflow-tooltip/>

      <el-table-column label="变压器类型" prop="transformerType" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="进线电压" prop="incomingVoltage" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="出线电压" prop="outVoltage" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="站点照片" prop="fileIds" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="!scope.row.fileIds">-</span>
          <span v-else class="link" @click.self.stop="handleViewFiles(scope.row.stationFileIds)">查看图片({{ scope.row.stationFileIds.split(",").length }}个)</span>
        </template>
      </el-table-column>
      <el-table-column label="位置" prop="address" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="创建时间" prop="createTime" width="140" align="center" show-overflow-tooltip/>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
                   @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
                   :total="totalSize" class="pagination"/>
  </div>
  <image-dialog ref="imageDialogRef"></image-dialog>
</template>
<script setup>
import {nextTick, onMounted, ref, useTemplateRef, watch} from "vue";
import * as pileApi from "@/api/api.pile.js";
import {GlobalStore} from "@/store/index.js";
import ImageDialog from "@/components/form/image-dialog.vue";
import {vehicleStatusList} from "@/config/const.js";

const loading = ref(false);
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  stationId: "",// 场站id
  compactSubstationCode: "",// 编码
  transformerType: "",// 变压器类型 油浸式
})

function handleSearch() {
  pageCurrent.value = 1;
  load();
}

async function load() {
  loading.value = true;
  let res = await pileApi.searchAllCompactSubstationList({current: pageCurrent.value, size: pageSize.value, ...search.value}, false)
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
onMounted(() => {
  nextTick(() => {
    load();
  });
});

function handleClickAdd() {

}

function handleRowClick(row) {

}

const imageDialogRef = useTemplateRef("imageDialogRef");

function handleViewFiles(fileIdStr) {
  imageDialogRef.value.open(fileIdStr)
}
</script>
<style lang="less">
.compactSubstation {
  .width-200 {
    width: 200px;
  }
}
</style>
