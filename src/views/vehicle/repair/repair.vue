<template>
  <div class="repair page-wrap" ref="pageRef">
    <div class="header">
      <el-input v-model.trim="search.dictName" class="width-200 mr-10" placeholder="物品名称" :prefix-icon="Search" @keyup.enter="handleSearch" clearable/>
      <el-input v-model.trim="search.dictType" class="width-200 mr-10" placeholder="物品类型" :prefix-icon="Search" @keyup.enter="handleSearch" clearable/>
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <div class="flex-1"></div>
      <el-button type="primary" plain size="default" @click="handleClickAddAccount">新增维修</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row row-key="repairId" scrollbar-always-on @row-click="handleRowClick"
              row-class-name="table-row-class" v-loading="loading">
      <el-table-column fixed type="index" label="编号" width="80" align="center"/>
      <el-table-column label="目标类型" prop="targetType" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ repairTargetTypeMap[scope.row.targetType] }}
        </template>
      </el-table-column>
      <el-table-column label="目标描述" prop="targetDesc" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="报修人" prop="reportStaffName" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="报修时间" prop="reportTime" width="140" align="center" show-overflow-tooltip/>
      <el-table-column label="故障描述" prop="reportDesc" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="报修图片" prop="targetDesc" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.reportPhotosId === ''">-</span>
          <span v-else class="link" @click.self.stop="handleViewFiles(scope.row.reportPhotosId)">查看图片({{ scope.row.reportPhotosId.split(",").length }}个)</span>
        </template>
      </el-table-column>
      <el-table-column label="处理人" prop="handleStaffName" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="处理时间" prop="handleTime" width="140" align="center" show-overflow-tooltip/>
      <el-table-column label="严重程度" prop="faultLevel" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ faultLevelMap[scope.row.faultLevel] }}
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column prop="repairStatus" label="状态" width="80" align="center" show-overflow-tooltip>
        <template #default="scope">
          <template v-if="scope.row.repairStatus != null">
            <el-tag :type="repairStatusTagTypeMap[scope.row.repairStatus]" disable-transitions>{{ repairStatusMap[scope.row.repairStatus] }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
        <template #default="scope">
          <el-popconfirm :title="`确定删除该数据[${scope.row.dictName}]吗?`" @confirm="handleClickDelete(scope.row.dictId)" v-if="scope.row.delFlag===0">
            <template #reference>
              <el-button link type="danger" @click.prevent.stop>删除</el-button>
            </template>
          </el-popconfirm>
          <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
                   @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
                   :total="totalSize" class="pagination"/>
  </div>
  <edit-repair ref="editRepairRef" @close="closeDialog"></edit-repair>
  <add-repair ref="addRepairRef" @close="closeDialog"></add-repair>
  <image-dialog ref="imageDialogRef"></image-dialog>
</template>
<script setup>
import {nextTick, onMounted, ref, useTemplateRef, watch} from "vue";
import * as repairApi from "@/api/api.repair.js";
import {Search} from "@element-plus/icons-vue";
import editRepair from "./components/editRepair.vue";
import addRepair from "./components/addRepair.vue";
import imageDialog from "@/components/form/image-dialog.vue";
import {GlobalStore} from "@/store/index.js";
import {faultLevelMap, repairStatusMap, repairStatusTagTypeMap, repairTargetTypeMap} from "@/config/const.js";
import {MenuStore} from "@/store/modules/menu";

let menuStore = MenuStore();
const loading = ref(false);
const editRepairRef = useTemplateRef("editRepairRef");
const addRepairRef = useTemplateRef("addRepairRef");
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  dictName: "",
  dictType: "",
})
const handleClickAddAccount = () => {
  addRepairRef.value.open(null);
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
      tableHeight.value = pageRef.value.clientHeight - 120;
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
  repairApi.getAllRepairList({current: pageCurrent.value, size: pageSize.value, ...search.value}, false).then(res => {
    tableData.value = res.records;
    totalSize.value = res.total;
  }).finally(() => {
    loading.value = false;
  })
}


/**
 * 点击编辑账户
 * @param {*} item
 */
const handleClickEdit = (item) => {
  editRepairRef.value.open(item);
}

const handleClickDelete = (item) => {

}

function handleRowClick(row, column, event) {
  handleClickEdit(row)
}

function closeDialog(reload) {
  if (reload) {
    load();
    menuStore.loadMenuTodoCount();
  }
}

const imageDialogRef = useTemplateRef("imageDialogRef");

function handleViewFiles(fileIdStr) {
  imageDialogRef.value.open(fileIdStr)
}
</script>
<style lang="less">
.repair {
}
</style>
