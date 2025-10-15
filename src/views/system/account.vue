<template>
  <div class="account page-wrap" ref="accountRef">
    <div class="header">
      <el-input v-model.trim="search.userName" class="width-200 mr-10" placeholder="用户名" :prefix-icon="Search"
        @keyup.enter="handleSearch" clearable @clear="handleSearch" />
      <el-input v-model.trim="search.idCardNumber" class="width-200 mr-10" placeholder="身份证号" :prefix-icon="Search"
        @keyup.enter="handleSearch" clearable @clear="handleSearch" />
      <el-input v-model.trim="search.mobileNumber" class="width-200 mr-10" placeholder="手机号" :prefix-icon="Search"
        @keyup.enter="handleSearch" clearable @clear="handleSearch" />
      <el-button type="primary" size="default" @click="handleSearch" :icon="Search"><span
          class="max_width_display_none">查询</span></el-button>
      <div class="flex-1"></div>
      <el-button type="primary" plain size="default" @click="handleClickAdd" :icon="Plus"><span
          class="max_width_display_none">新增账户</span></el-button>
    </div>

    <el-table ref="tableRef" :data="tableData" :height="tableHeight" row-key="userId" class="table"
      highlight-current-row border @row-click="handleTableRowClick" show-overflow-tooltip v-loading="loading"
      scrollbar-always-on row-class-name="a">
      <el-table-column fixed type="index" label="#" width="40" align="center" />
      <el-table-column label="账户名称" prop="userName" width="120" align="center" show-overflow-tooltip />
      <el-table-column label="真实姓名" prop="fullName" width="110" align="center" show-overflow-tooltip />
      <el-table-column label="手机号" prop="mobileNumber" width="110" align="center" show-overflow-tooltip />
      <el-table-column label="年龄" prop="age" width="50" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="性别" prop="sex" width="50" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ sexMap[scope.row.sex] || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学历" prop="education" width="80" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ educationMap[scope.row.education] || "" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" prop="idCardNumber" width="160" align="center" show-overflow-tooltip />
      <el-table-column label="民族" prop="nation" width="60" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="身份证地址" prop="cardAddress" width="auto" align="center" show-overflow-tooltip />
      <el-table-column label="角色" prop="roleNames" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.roleNames.join("/") }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template #default="scope">
          <el-button link type="danger" @click.prevent.stop="handleClickEdit(scope.row)">
            编辑
          </el-button>

          <el-button link type="warning" @click.prevent.stop="handleClickResetPassword(scope.row)">
            重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
      @current-change="load" :page-sizes="[20, 50, 100, 200]" background layout="total, prev, pager,sizes, next"
      :total="totalSize" class="pagination" />
    <add-account ref="addAccountRef" @close="closeDialog" />
    <edit-account ref="editAccountRef" @close="closeDialog" />
    <reset-password ref="resetPasswordRef" @close="closeDialog" />
  </div>
</template>
<script setup>
import { ref, watch, nextTick, onMounted, useTemplateRef } from "vue";
import { searchAllUserPageList } from '@/api/api.account.js';
import { GlobalStore } from '@/store/index.js';
import { Plus, Search } from "@element-plus/icons-vue";
import { sexMap, educationMap } from "@/config/const.js";
import addAccount from './components/addAccount.vue';
import editAccount from './components/editAccount.vue';
import ResetPassword from "./components/resetPassword.vue";

const tableData = ref([]);
const tableHeight = ref(250);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const loading = ref(false);
const search = ref({
  userName: "",
  idCardNumber: "",
  mobileNumber: "",
  userType: 1 // 用户类型, 0:全部, 1:系统用户, 2:人员用户
})

function load() {
  loading.value = true;
  searchAllUserPageList({ ...search.value, current: pageCurrent.value, size: pageSize.value }).then(res => {
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

const addAccountRef = useTemplateRef("addAccountRef");

function handleClickAdd() {
  addAccountRef.value.open();
}

const editAccountRef = useTemplateRef("editAccountRef");
function handleClickEdit(row) {
  editAccountRef.value.open(row);
}

const resetPasswordRef = useTemplateRef("resetPasswordRef")
function handleClickResetPassword(row) {
  resetPasswordRef.value.open(row);
}


function handleTableRowClick(row) {

}

function closeDialog(reload) {
  if (reload) load();
}


// region 全局
const globalStore = GlobalStore();
const accountRef = useTemplateRef("accountRef");
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (accountRef.value) {
      tableHeight.value = accountRef.value.clientHeight - 120;
    }
  })
}, { immediate: true })
onMounted(() => {
  load();
})
// endregion
</script>
<style lang="less">
.account {}
</style>
