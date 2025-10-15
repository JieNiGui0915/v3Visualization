<template>
  <div class="station page-wrap" ref="stationRef">
    <div class="header">
      <el-input v-model.trim="search.stationName" class="width-200 mr-10" placeholder="站点名称" :prefix-icon="Search"
        @keyup.enter="handleSearch" @clear="handleSearch" clearable />
      <el-input v-model.trim="search.stationCode" class="width-200 mr-10" placeholder="站点编码" @keyup.enter="handleSearch"
        @clear="handleSearch" clearable />
      <el-select v-model="search.stationType" class="width-200 mr-10" placeholder="站点类型" @change="handleSearch"
        clearable>
        <el-option v-for="(item, key) in stationTypeList" :key="item.label" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <div class="flex-1"></div>
      <el-button type="primary" plain size="default" @click="handleClickAdd">新增</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
      row-key="id" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class" v-loading="loading">
      <el-table-column fixed type="index" label="编号" width="80" align="center" />
      <el-table-column label="货场简称" prop="goodsYardShortName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="货场名称" prop="goodsYardName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="货场类型" prop="goodsYardType" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ stationTypeMap[scope.row.goodsYardType] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行政归属" prop="goodsYardAdmin" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="位置" prop="address" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="坐标" prop="coordinate" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <a class="link" title="点击查看地图" @click.stop.self="handleShowStationMap(scope.row)" v-if="scope.row.latitude">{{
            scope.row.latitude ?
              scope.row.latitude + ',' + scope.row.longitude : ''
          }}</a>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="占地面积" prop="goodsYardArea" width="auto" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column label="年运量" prop="goodsYardAnnualCapacity" width="auto" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column label="装车限重" prop="goodsYardLoadingLimit" width="auto" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column label="煤炭品种" prop="goodsYardCoalType" width="auto" align="center"
        show-overflow-tooltoip></el-table-column>
      <el-table-column label="煤炭形态" prop="goodsYardCoalForm" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="堆放形式" prop="goodsYardStorageForm" width="auto" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column label="装车方式" prop="goodsYardLoadingMethod" width="auto" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column label="装卸机械" prop="goodsYardUnloadingMechanism" width="auto" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column label="地磅配置" prop="goodsYardWeighbridge" width="auto" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column label="说明" prop="remark" width="auto" align="center" show-overflow-tooltip />
      <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
        <template #default="scope">
          <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除吗？" @confirm="handleClickDelete(scope.row)">
            <template #reference>
              <el-button link type="danger" :loading="loadingDelete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
      @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
      :total="totalSize" class="pagination" />
    <add-station ref="addStationRef" @close="closeDialog" />
    <edit-station ref="editStationRef" @close="closeDialog" />
    <station-map ref="stationMapRef"></station-map>
  </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, nextTick, watch } from 'vue';
import { GlobalStore } from "@/store/index.js";
import { getAllStationPageList, deleteStation } from '@/api/api.station';
import { Search } from "@element-plus/icons-vue";
import { holidayModeMap, stationTypeList, stationTypeMap } from '@/config/const.js';
import addStation from './components/addStation.vue';
import editStation from './components/editStation.vue';
import StationMap from "@/components/map/stationMap.vue";

const loading = ref(false);
/*
    goodsYardArea: '',// 占地面积
    goodsYardAnnualCapacity: '',// 年运量
    goodsYardLoadingLimit: '',// 装车限重
    goodsYardCoalType: '',// 煤炭品种
    goodsYardCoalForm: '',// 煤炭形态
    goodsYardStorageForm: '',// 堆放形式
    goodsYardLoadingMethod: '',// 装车方式
    goodsYardUnloadingMechanism: '',// 装卸机械
    goodsYardWeighbridge: '',// 地磅配置
*/
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  stationName: '',// 站点名称
  stationCode: '',// 站点编码
  stationType: '',// 站点类型
})

function load() {
  loading.value = true;
  getAllStationPageList({
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
const addStationRef = useTemplateRef('addStationRef');
function handleClickAdd() {
  addStationRef.value.open();
}
const editStationRef = useTemplateRef('editStationRef');
function handleClickEdit(item) {
  editStationRef.value.open(item);
}
const loadingDelete = ref(false);
function handleClickDelete(row) {
  if (loadingDelete.value) return;
  deleteStation(row.goodsYardId).then(() => {
    load();
  }).finally(() => {
    loadingDelete.value = false;
  });
}
function handleRowClick(row, column, event) {
}

const stationMapRef = useTemplateRef("stationMapRef");

function handleShowStationMap(row) {
  stationMapRef.value.open([row.longitude, row.latitude], row.goodsYardName, 'cargo');
}

let tableHeight = ref(250);
const stationRef = useTemplateRef('stationRef');
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (stationRef.value) {
      tableHeight.value = stationRef.value.clientHeight - 122;
    }
  })
}, { immediate: true })
onMounted(() => {
  load();
});

</script>

<style lang="less">
.station {
  .width-200 {
    width: 200px;
  }
}
</style>