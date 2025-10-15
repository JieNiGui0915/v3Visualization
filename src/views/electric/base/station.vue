<template>
  <div class="station page-wrap" ref="pageRef">
    <div class="header">
      <el-input v-model.trim="search.name" class="width-150 mr-10" placeholder="站点名称" @keyup.enter="handleSearch"
        clearable @clear="handleSearch" />
      <el-input v-model.trim="search.orgName" class="width-150 mr-10" placeholder="公司名称" @keyup.enter="handleSearch"
        clearable @clear="handleSearch" />
      <el-input v-model.trim="search.stationCode" class="width-150 mr-10" placeholder="站点编码" @keyup.enter="handleSearch"
        clearable @clear="handleSearch" />
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <div class="flex-1"></div>
      <el-button type="primary" plain size="default" @click="handleClickAdd">新增充电站</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
      row-key="vehicleId" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class"
      v-loading="loading">
      <el-table-column fixed type="index" label="#" width="40" align="center" />
      <el-table-column fixed label="编码" prop="stationCode" width="60" align="center" show-overflow-tooltip />
      <el-table-column label="所属运营商" prop="orgName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="站点名称" prop="name" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="地址路径" prop="areaNamePath" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <a class="link" title="点击查看地图" @click.stop.self="handleShowStationMap(scope.row)">{{ scope.row.areaNamePath
            }}</a>
        </template>
      </el-table-column>
      <el-table-column label="经纬度" prop="lat" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.lat">{{ scope.row.lat }},{{ scope.row.lng }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" prop="principal" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.principal }}</span><span v-if="scope.row.tel">{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="全站功率" prop="totalStationPower" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.totalStationPower }} kVA</span>
        </template>
      </el-table-column>
      <el-table-column label="电桩类型" prop="pileType" width="auto" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="场站型号" prop="stationModel" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="站点照片" prop="stationFileIds" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="!scope.row.stationFileIds">-</span>
          <span v-else class="link" @click.self.stop="handleViewFiles(scope.row.stationFileIds)">查看图片({{
            scope.row.stationFileIds.split(",").length }}个)</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="箱变" prop="compactSubstationList" width="60px" align="center" show-overflow-tooltip>
        <template #default="scope">
          <a class="link"> {{ scope.row.compactSubstationList.length }} 个</a>
        </template>
      </el-table-column>
      <el-table-column label="充电桩" prop="pile" width="60px" align="center" show-overflow-tooltip>
        <template #default="scope">
          <a class="link" @click.stop="handleShowPile(scope.row)">{{ scope.row.pileList.length }} 个</a>
        </template>
      </el-table-column>
      <el-table-column label="充电车位" prop="chargingSpaceList" align="center" width="70px" show-overflow-tooltip>
        <template #default="scope">
          <a class="link">{{ scope.row.chargingSpaceList.length }} 个</a>
        </template>
      </el-table-column>
      <el-table-column label="停车位" prop="parkingSpaceList" align="center" width="60px" show-overflow-tooltip>
        <template #default="scope">
          <a class="link">{{ scope.row.parkingSpaceList.length }} 个</a>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
        <template #default="scope">
          <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除该停充电站吗？" @confirm="handleClickDelete(scope.row)">
            <template #reference>
              <el-button link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
      @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
      :total="totalSize" class="pagination" />
    <pile-view ref="pileViewRef" @close="closeDialog"></pile-view>
  </div>
  <image-dialog ref="imageDialogRef"></image-dialog>
  <station-map ref="stationMapRef"></station-map>
  <add-station ref="addStationRef" @close="closeDialog"></add-station>
  <edit-station ref="editStationRef" @close="closeDialog"></edit-station>
</template>
<script setup>
import { nextTick, onMounted, ref, useTemplateRef, watch } from "vue";
import * as pileApi from "@/api/api.pile.js";
import { GlobalStore } from "@/store/index.js";
import ImageDialog from "@/components/form/image-dialog.vue";
import StationMap from "@/components/map/stationMap.vue";
import pileView from "./components/pileView.vue";
import addStation from "./components/addStation.vue";
import editStation from "./components/editStation.vue";
import { ElMessage, ElMessageBox } from "element-plus";


const loading = ref(false);
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  stationCode: "",// 充电站编码
  orgName: "",// 组织名称
  name: "",// 站点名称
})

function handleSearch() {
  load();
}

async function load() {
  loading.value = true;
  let res = await pileApi.searchAllStationList({ current: pageCurrent.value, size: pageSize.value, ...search.value }, false)
  tableData.value = res.records;
  totalSize.value = res.total;
  loading.value = false;
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
}, { immediate: true })
onMounted(() => {
  nextTick(() => {
    load();
  });
});

const addStationRef = useTemplateRef("addStationRef");
function handleClickAdd() {
  addStationRef.value.open();
}

const editStationRef = useTemplateRef("editStationRef");
function handleClickEdit(item) {
  editStationRef.value.open(item);
}

function handleClickDelete(item) {
  pileApi.deletePileStation(item.stationId).then(() => {
    ElMessage.success("删除成功");
    load();
  })
}

function handleRowClick(row) {

}

const stationMapRef = useTemplateRef("stationMapRef");

function handleShowStationMap(row) {
  stationMapRef.value.open([row.lng, row.lat], row.name, 'pile');
}

const imageDialogRef = useTemplateRef("imageDialogRef");

function handleViewFiles(fileIdStr) {
  imageDialogRef.value.open(fileIdStr)
}

const pileViewRef = useTemplateRef("pileViewRef");
function handleShowPile(row) {
  pileViewRef.value.open(row);
}

function closeDialog(reload) {
  if (reload) {
    load();
  }
}
</script>
<style lang="less">
.station {}
</style>
