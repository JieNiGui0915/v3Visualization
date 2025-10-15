<template>
  <div class="goods page-wrap" ref="goodsRef">
    <div class="header">
      <el-input v-model.trim="search.goodsItemCode" class="width-200 mr-10" placeholder="编码" :prefix-icon="Search"
        @keyup.enter="handleSearch" clearable />
      <el-input v-model.trim="search.goodsItemName" class="width-200 mr-10" placeholder="名称" @keyup.enter="handleSearch"
        clearable />
      <el-select v-model="search.goodsType" class="width-200 mr-10" placeholder="货物种类" clearable @change="handleSearch">
        <el-option v-for="item in goodsTypeList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <div class="flex-1"></div>
      <el-button type="primary" plain size="default" @click="handleClickAdd">新增货物</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
      row-key="id" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class" v-loading="loading">
      <el-table-column fixed type="index" label="编号" width="80" align="center" />
      <el-table-column label="编码" prop="goodsItemCode" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="名称" prop="goodsItemName" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="种类" prop="goodsType" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ goodsTypeMap[scope.row.goodsType] || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="首选车型" prop="primaryVehicleType" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ primaryVehicleTypeMap[scope.row.primaryVehicleType] || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="goodsItemStatus" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ goodsStatusMap[scope.row.goodsItemStatus] || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip />
      <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
        <template #default="scope">
          <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
      @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
      :total="totalSize" class="pagination" />
    <add-goods-item ref="addGoodsItemRef" @close="closeDialog" />
    <edit-goods-item ref="editGoodsItemRef" @close="closeDialog" />
  </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, nextTick, watch } from 'vue';
import { GlobalStore } from "@/store/index.js";
import { Search } from "@element-plus/icons-vue";
import { searchGoodsItemPageList } from '@/api/api.goods';
import addGoodsItem from './components/addGoodsItem.vue';
import editGoodsItem from './components/editGoodsItem.vue';
import { goodsTypeList, goodsTypeMap, goodsStatusMap, primaryVehicleTypeMap } from "@/config/const.js";

const loading = ref(false);
/*
goodsItemId:"",// 货物ID
goodsItemCode:"",// 货物编码
goodsItemName:"",// 货物名称
goodsType:"",// 货物种类
primaryVehicleType:"",// 首选车型
goodsItemStatus:"",// 货物状态
remark:"",// 备注
*/
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  goodsItemCode: "",// 货物编码
  goodsItemName: "",// 货物名称
  goodsType: ""// 货物种类
})

function load() {
  loading.value = true;
  searchGoodsItemPageList({
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

const addGoodsItemRef = useTemplateRef('addGoodsItemRef');
function handleClickAdd() {
  addGoodsItemRef.value.open();
}
const editGoodsItemRef = useTemplateRef('editGoodsItemRef');
function handleClickEdit(item) {
  editGoodsItemRef.value.open(item);
}
function handleRowClick(row, column, event) {
}
let tableHeight = ref(250);
const goodsRef = useTemplateRef('goodsRef');
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (goodsRef.value) {
      tableHeight.value = goodsRef.value.clientHeight - 122;
    }
  })
}, { immediate: true })
onMounted(() => {
  load();
});

</script>

<style lang="less">
.goods {}
</style>