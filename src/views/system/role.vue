<template>
  <div class="role page-wrap" ref="roleRef">
    <div class="header">
      <el-input v-model.trim="search.roleName" class="width-200 mr-10" placeholder="角色名称" :prefix-icon="Search"
                @keyup.enter="handleSearch" clearable @clear="handleSearch"/>
      <el-input v-model.trim="search.roleNickname" class="width-200 mr-10" placeholder="角色编码" :prefix-icon="Search"
                @keyup.enter="handleSearch" clearable @clear="handleSearch"/>
      <el-button type="primary" size="default" @click="handleSearch" :icon="Search"><span
          class="max_width_display_none">查询</span></el-button>
      <div class="flex-1"></div>
      <el-button type="primary" plain size="default" @click="handleClickAdd" :icon="Plus"><span
          class="max_width_display_none">新增角色</span></el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" row-key="roleId" class="table"
              highlight-current-row border @row-click="handleTableRowClick" show-overflow-tooltip v-loading="loading"
              scrollbar-always-on row-class-name="a">
      <el-table-column fixed type="index" label="#" width="40" align="center"/>
      <el-table-column label="角色名称" prop="roleName" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="角色编码" prop="roleNickname" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="角色描述" prop="remark" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template #default="scope">
          <el-button link type="danger" @click.prevent.stop="handleClickEdit(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
                   @current-change="load" :page-sizes="[20, 50, 100, 200]" background layout="total, prev, pager,sizes, next"
                   :total="totalSize" class="pagination"/>
    <add-role ref="addRoleRef" @close="closeDialog"/>
    <edit-role ref="editRoleRef" @close="closeDialog"/>
  </div>
</template>
<script setup>
import {ref, watch, nextTick, useTemplateRef} from 'vue';
import {getAllRolePage} from '@/api/api.role';
import {onMounted} from 'vue';
import {GlobalStore} from '@/store/index.js';
import {Search, Plus} from "@element-plus/icons-vue";
import addRole from "./components/addRole.vue";
import editRole from "./components/editRole.vue";


/**
 * 角色数据
 * @typedef {Object} RoleData
 * @property {string} roleId - 角色ID
 * @property {string} roleName - 角色名称
 * @property {string} roleNickname - 角色编码
 * @property {string} remark - 角色描述
 */
const tableData = ref([]);
const tableHeight = ref(250);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const loading = ref(false);
const search = ref({
  roleName: "",
  roleNickname: ""
})

function load() {
  loading.value = true;
  getAllRolePage(search.value).then(res => {
    tableData.value = res.records;
    totalSize.value = res.total;
  }).finally(() => {
    loading.value = false;
  });
}

function handleSearch() {
  pageCurrent.value = 1;
  load();
}

function handleTableRowClick(row) {

}

const addRoleRef = useTemplateRef("addRoleRef");

function handleClickAdd() {
  addRoleRef.value.open();
}

const editRoleRef = useTemplateRef("editRoleRef");

function handleClickEdit(row) {
  editRoleRef.value.open(row);
}

function closeDialog(reload) {
  if (reload) {
    load();
  }
}

// region 全局
const globalStore = GlobalStore();
const roleRef = useTemplateRef("roleRef");
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (roleRef.value) {
      tableHeight.value = roleRef.value.clientHeight - 120;
    }
  })
}, {immediate: true})
onMounted(() => {
  load();
})
// endregion
</script>
<style lang="less">
.role {
}
</style>
