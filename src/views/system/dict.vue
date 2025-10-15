<template>
  <div class="dict page-wrap" ref="pageRef">
    <div class="header">
      <el-input v-model.trim="search.dictName" class="width-200 mr-10" placeholder="字典名称" :prefix-icon="Search" @keyup.enter="handleSearch" clearable/>
      <el-input v-model.trim="search.dictType" class="width-200 mr-10" placeholder="字典类型" :prefix-icon="Search" @keyup.enter="handleSearch" clearable/>
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <div class="flex-1"></div>
      <el-button type="primary" plain size="default" @click="handleClickAddAccount">新增字典</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row row-key="dictId" scrollbar-always-on @row-click="handleRowClick"
              row-class-name="table-row-class" v-loading="loading">
      <el-table-column fixed type="index" label="编号" width="80" align="center"/>
      <el-table-column label="字典名称" prop="dictName" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="字典类型编码" prop="dictType" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <a class="link-type" style="font-size: 16px">{{ scope.row.dictType }}</a>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column fixed="right" label="操作" width="110" align="center" @click.stop.prevent.self>
        <template #default="scope">
          <el-popconfirm :title="`确定删除该数据[${scope.row.dictName}]吗?`" @confirm="handleClickDelete(scope.row.dictId)" v-if="scope.row.delFlag===0">
            <template #reference>
              <el-button link type="danger" @click.prevent.stop>删除</el-button>
            </template>
          </el-popconfirm>
          <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)">编辑</el-button>
          <el-button link type="primary" @click.prevent.stop="handleRowClick(scope.row)">字典值</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
                   @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
                   :total="totalSize" class="pagination"/>
  </div>
  <edit-dict ref="editDictRef" @close="closeDialog"></edit-dict>
  <add-dict ref="addDictRef" @close="closeDialog"></add-dict>
  <edit-dict-data ref="editDictDataRef" @close="closeDataDialog"></edit-dict-data>
  <add-dict-data ref="addDictDataRef" @close="closeDataDialog"></add-dict-data>
  <el-drawer v-model="showDictData" size="50%" :show-close="false" class="dict-drawer">
    <template #header="{ close, titleId, titleClass }">
      <span style="flex: none"></span>
      <button aria-label="el.drawer.close" class="el-drawer__close-btn" type="button" @click="closeDraw"><i class="el-icon el-drawer__close">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
          <path fill="currentColor"
                d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path>
        </svg>
      </i></button>
      <div class="drawTitle">
        <strong>【{{ currentTypeRow ? currentTypeRow.dictName : '' }}】</strong> <span> 字典值列表</span>
      </div>
      <el-button link type="primary" style="padding: 0" @click="handleAddDictData">新增</el-button>
    </template>
    <template #default>
      <div v-loading="dataLoading">
        <el-table :data="dataList" class="table" border highlight-current-row row-key="dictCode">
          <el-table-column property="dictLabel" label="字典标签" width="auto" align="center" show-overflow-tooltip/>
          <el-table-column property="dictValue" label="字典键值" width="auto" align="center" show-overflow-tooltip/>
          <el-table-column property="dictSort" label="字典排序" width="auto" align="center" show-overflow-tooltip/>
          <el-table-column property="remark" label="备注" width="auto" align="center" show-overflow-tooltip/>
          <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
            <template #default="scope">
<!--              <el-popconfirm :title="`确定删除该数据[${scope.row.dictLabel}]吗?`" @confirm="handleClickDeleteDictData(scope.row.dictCode)">-->
<!--                <template #reference>-->
<!--                  <el-button link type="danger" @click.prevent.stop>删除</el-button>-->
<!--                </template>-->
<!--              </el-popconfirm>-->
              <el-button link type="warning" @click.prevent.stop="handleClickEditDictData(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </el-drawer>
</template>
<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import * as dictApi from "@/api/api.dict";
import {Search} from "@element-plus/icons-vue";
import editDict from "./components/editDict.vue";
import addDict from "./components/addDict.vue";
import editDictData from "./components/editDictData.vue";
import addDictData from "./components/addDictData.vue";
import {GlobalStore} from "@/store/index.js";
import {dictDataAll} from "@/api/api.dict";

const loading = ref(false);
const dataLoading = ref(false);
const editDictRef = ref();
const addDictRef = ref(null);
const editDictDataRef = ref();
const addDictDataRef = ref(null);
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  dictName: "",
  dictType: "",
})
const currentTypeRow = ref(null);
const dataList = ref([]);
const showDictData = ref(false);


const handleClickAddAccount = () => {
  addDictRef.value.open(null);
}

const tableRef = ref()

function handleSearch() {
  pageCurrent.value = 1;
  load();
}

let tableHeight = ref(250);
const pageRef = ref(null);
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (pageRef.value) {
      tableHeight.value = pageRef.value.clientHeight - 112;
    }
  })
}, {immediate: true})
onMounted(() => {
  nextTick(() => {
    load();
  });
});

function load() {
  loading.value = true;
  dictApi.typeAll({current: pageCurrent.value, size: pageSize.value, ...search.value}, false).then(res => {
    tableData.value = res.records;
    totalSize.value = res.total;
  }).finally(() => {
    loading.value = false;
  })
}


function getDictDataList(dictType) {
  dataLoading.value = true;
  dictApi.dictDataAll(dictType).then(res => {
    dataList.value = res;
  }).finally(() => {
    dataLoading.value = false;
  })
}

/**
 * 点击编辑账户
 * @param {*} item
 */
const handleClickEdit = (item) => {
  editDictRef.value.open(item);
}

const handleClickDelete = (item) => {
  dictApi.typeDel({id: item}, true).then(res => {
    load()
  })
}

function handleRowClick(row) {
  currentTypeRow.value = row;
  showDictData.value = true;
  getDictDataList(row.dictType);
}

function closeDialog(reload) {
  if (reload) load();
}

function closeDataDialog(reload) {
  if (reload) getDictDataList(currentTypeRow.value.dictType)
}

function closeDraw() {
  showDictData.value = false;
}


function handleAddDictData() {
  addDictDataRef.value.open(currentTypeRow.value);
}

const handleClickEditDictData = (item) => {
  editDictDataRef.value.open(item);
}
const handleClickDeleteDictData = (item) => {
  dictApi.dataDel({dictCode: item}, true).then(res => {
    getDictDataList(currentTypeRow.value.dictType)
  })
}
</script>
<style lang="less">
.dict {
}

.dict-drawer {
  .drawTitle {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
