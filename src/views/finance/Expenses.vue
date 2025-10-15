<template>
  <div class="expenses page-wrap" ref="expensesRef">
    <div class="header">
      <el-input v-model.trim="searchForm.expensePayeeName" class="width-200 mr-10" placeholder="收款方名称" :prefix-icon="Search"
        @keyup.enter="handleSearch" clearable />
      <el-input v-model.trim="searchForm.licensePlateNumber" class="width-150 mr-10" placeholder="车牌号"
        @keyup.enter="handleSearch" clearable />
      <el-select v-model="searchForm.expenseType" class="width-150 mr-10" placeholder="费用类型" @change="handleSearch" clearable>
        <el-option v-for="item in expenseTypeList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="searchForm.expenseStatus" class="width-150 mr-10" placeholder="费用状态" @change="handleSearch" clearable>
        <el-option v-for="item in expenseStatusList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker v-model="searchForm.startDate" type="date" class="width-150 mr-10" placeholder="开始日期"
        @change="handleSearch" clearable />
      <el-date-picker v-model="searchForm.endDate" type="date" class="width-150 mr-10" placeholder="结束日期"
        @change="handleSearch" clearable />
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <el-button size="default" @click="handleReset">重置</el-button>
      <div class="flex-1"></div>
      <el-button type="primary" size="default" @click="handleExport">导出</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
      row-key="expenseRecordId" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class"
      v-loading="loading">
      <el-table-column prop="expensePayeeName" label="收款方名称" width="180" fixed="left" align="center" header-align="center" show-overflow-tooltip />
      <el-table-column prop="licensePlateNumber" label="车牌号" width="120" align="center" header-align="center" show-overflow-tooltip />
      <el-table-column prop="dispatchNumber" label="调度号" width="120" align="center" header-align="center" show-overflow-tooltip />
      <el-table-column prop="expenseType" label="费用类型" width="120" align="center" header-align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <span>{{ getExpenseTypeLabel(row.expenseType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expenseAmount" label="费用金额" width="120" align="center" header-align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <span>¥{{ row.expenseAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expenseDate" label="费用发生日期" width="140" align="center" header-align="center" show-overflow-tooltip />
      <el-table-column prop="handlerName" label="经办人" width="120" align="center" header-align="center" show-overflow-tooltip />
      <el-table-column prop="expenseSettlementMethod" label="结算方式" width="120" align="center" header-align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <span>{{ getSettlementMethodLabel(row.expenseSettlementMethod) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expenseStatus" label="费用状态" width="120" align="center" header-align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.expenseStatus)">{{ getStatusLabel(row.expenseStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="purposeDesc" label="用途说明" width="180" align="center" header-align="center" show-overflow-tooltip />
      <el-table-column prop="paymentAmount" label="支付金额" width="120" align="center" header-align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <span>¥{{ row.paymentAmount || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentMethod" label="支付方式" width="140" align="center" header-align="center" show-overflow-tooltip />
      <el-table-column fixed="right" label="操作" width="100" align="center" header-align="center" @click.stop.prevent.self>
        <template #default="scope">
          <el-button link type="primary" @click.prevent.stop="handleClickView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
      @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager, sizes, next"
      :total="totalSize" class="pagination" />
    
    <!-- 费用详情弹窗 -->
    <ExpenseDetailDialog 
      ref="expenseDetailDialogRef"
      :expense-type-map="expenseTypeMap"
      :expense-status-map="expenseStatusMap"
      :expense-status-tag-type-map="expenseStatusTagTypeMap"
      :expense-settlement-method-map="expenseSettlementMethodMap"
    />
  </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, nextTick, watch } from 'vue';
import { GlobalStore } from "@/store/index.js";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { searchExpensePageList, exportExpenseList } from "@/api/api.finance.js";
import { downloadStreamFile, formatDateTimeThinString } from "@/utils/util.js";
import * as dictApi from "@/api/api.dict.js";
import ExpenseDetailDialog from './components/ExpenseDetailDialog.vue';

const loading = ref(false);
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const tableHeight = ref(500); 
const expensesRef = useTemplateRef('expensesRef');
const tableRef = useTemplateRef('tableRef');
const expenseDetailDialogRef = useTemplateRef('expenseDetailDialogRef');
const globalStore = GlobalStore();

// 搜索条件
const searchForm = ref({
  expensePayeeName: "", // 收款方名称
  licensePlateNumber: "", // 车牌号
  expenseType: "", // 费用类型
  expenseStatus: "", // 费用状态
  startDate: "", // 开始日期
  endDate: "" // 结束日期
});

// 表格列定义
const columns = [
  { prop: 'expenseRecordId', label: '费用记录ID', width: 120, fixed: 'left' },
  { prop: 'expensePayeeName', label: '收款方名称', width: 150 },
  { prop: 'licensePlateNumber', label: '车牌号', width: 120 },
  { prop: 'dispatchNumber', label: '调度号', width: 120 },
  { prop: 'expenseType', label: '费用类型', width: 100 },
  { prop: 'expenseAmount', label: '费用金额', width: 120 },
  { prop: 'expenseDate', label: '费用发生日期', width: 120 },
  { prop: 'handlerName', label: '经办人', width: 100 },
  { prop: 'expenseSettlementMethod', label: '结算方式', width: 120 },
  { prop: 'expenseStatus', label: '费用状态', width: 100 },
  { prop: 'purposeDesc', label: '用途说明', width: 150 },
  { prop: 'paymentAmount', label: '支付金额', width: 120 },
  { prop: 'paymentMethod', label: '支付方式', width: 120 },
  { prop: 'actions', label: '操作', width: 150, fixed: 'right' }
]

// 费用类型映射
// 费用类型和费用状态从字典获取
const expenseTypeList = ref([]);
const expenseTypeMap = ref({});
const expenseStatusList = ref([]);
const expenseStatusMap = ref({});

// 加载字典数据
const loadDictData = async () => {
  try {
    // 加载费用类型字典
    const expenseTypeData = await dictApi.dictDataAllZRC('expense_type');
    expenseTypeList.value = expenseTypeData.map(item => ({
      label: item.dictLabel,
      value: parseInt(item.dictValue)
    }));
    expenseTypeMap.value = expenseTypeData.reduce((map, item) => {
      map[parseInt(item.dictValue)] = item.dictLabel;
      return map;
    }, {});
    
    // 加载费用状态字典
    const expenseStatusData = await dictApi.dictDataAllZRC('expense_status');
    expenseStatusList.value = expenseStatusData.map(item => ({
      label: item.dictLabel,
      value: parseInt(item.dictValue)
    }));
    expenseStatusMap.value = expenseStatusData.reduce((map, item) => {
      map[parseInt(item.dictValue)] = item.dictLabel;
      return map;
    }, {});
  } catch (error) {
    console.error('字典数据加载失败:', error);
    ElMessage.error('字典数据加载失败');
    
    // 清空字典数据
    expenseTypeList.value = [];
    expenseTypeMap.value = {};
    expenseStatusList.value = [];
    expenseStatusMap.value = {};
  }
};

const expenseStatusTagTypeMap = {
  0: "warning",
  1: "primary",
  2: "success",
  3: "danger",
  4: "info",
};

// 结算方式映射
const expenseSettlementMethodMap = {
  1: "垫付报销",
  2: "企业支付",
};

// 日期格式化函数
const formatDate = (date) => {
  if (!date) return '';
  if (typeof date === 'string') return date;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 加载数据
const load = async () => {
  loading.value = true;
  try {
    const params = {
      current: pageCurrent.value,
      size: pageSize.value,
      expensePayeeName: searchForm.value.expensePayeeName || null,
      licensePlateNumber: searchForm.value.licensePlateNumber || null,
      expenseType: searchForm.value.expenseType || null,
      expenseStatus: searchForm.value.expenseStatus || null,
      startDate: formatDate(searchForm.value.startDate) || null,
      endDate: formatDate(searchForm.value.endDate) || null
    };
    
    const response = await searchExpensePageList(params);
    if (response && response.records) {
      tableData.value = response.records;
      totalSize.value = Number(response.total) || 0;
    } else {
      tableData.value = [];
      totalSize.value = 0;
      ElMessage.warning('暂无数据或数据加载失败');
    }
  } catch (error) {

    tableData.value = [];
    totalSize.value = 0;
    ElMessage.error('数据加载失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 搜索
function handleSearch() {
  pageCurrent.value = 1;
  load();
}

// 重置
function handleReset() {
  searchForm.value = {
    expensePayeeName: "",
    licensePlateNumber: "",
    expenseType: "",
    expenseStatus: "",
    startDate: "",
    endDate: ""
  };
  pageCurrent.value = 1;
  load();
}

// 导出费用数据
async function handleExport() {
  try {
    loading.value = true;
    
    // 检查必填参数
    if (!searchForm.value.startDate || !searchForm.value.endDate) {
      ElMessage.warning('请选择起始时间和结束时间');
      loading.value = false;
      return;
    }
    
    // 准备导出参数
    const exportParams = {
      expenseStatus: searchForm.value.expenseStatus || null,
      expenseType: searchForm.value.expenseType || null,
      handlerName: searchForm.value.handlerName || null,
      startDate: formatDate(searchForm.value.startDate),
      endDate: formatDate(searchForm.value.endDate)
    };
    
    // 调用导出API
    const response = await exportExpenseList(exportParams);
    
    // 处理文件名
    let dateString = formatDateTimeThinString(new Date(), false);
    let fileName = `费用数据_${dateString}.xlsx`;
    let contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      let fileNameString = contentDisposition.split(";").map(p => p.trim()).find(p => p.startsWith("filename="));
      if (fileNameString) {
        fileNameString = fileNameString.replace(/"/ig, "");
        fileName = decodeURIComponent(fileNameString.split("=")[1]);
      }
    }
    
    // 使用统一的下载函数
    downloadStreamFile(response.data, fileName);
    
    ElMessage.success('导出成功');
  } catch (error) {

    ElMessage.error('导出失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}

// 查看
function handleClickView(row) {

  if (expenseDetailDialogRef.value) {
    expenseDetailDialogRef.value.open(row);
  }
}



// 计算表格高度
function calcTableHeight() {
  nextTick(() => {
    // 设置一个合适的固定高度，确保表格能够显示内容
    const windowHeight = window.innerHeight || globalStore.screenSize.height;
    const headerHeight = 120; // 头部搜索区域高度
    const paginationHeight = 80; // 分页区域高度
    const padding = 60; // 内边距和其他元素高度
    const calculatedHeight = windowHeight - headerHeight - paginationHeight - padding;
    // 确保最小高度为400px
    tableHeight.value = Math.max(calculatedHeight, 400);
  
  });
}

// 监听屏幕尺寸变化
watch(() => globalStore.screenSize, () => {
  calcTableHeight();
}, { deep: true });

// 获取费用类型标签
const getExpenseTypeLabel = (type) => {
  return expenseTypeMap.value[type] || type;
};

// 获取状态标签
const getStatusLabel = (status) => {
  return expenseStatusMap.value[status] || status;
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  return expenseStatusTagTypeMap[status] || 'info';
};

// 获取结算方式标签
const getSettlementMethodLabel = (method) => {
  return expenseSettlementMethodMap[method] || method;
};

onMounted(async () => {
  calcTableHeight();
  await loadDictData();
  load();
});

// 导出方法供父组件调用
defineExpose({
  load,
  handleSearch,
  handleReset,
  handleExport
});
</script>

<style lang="less">
.expenses {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
    flex-shrink: 0;
  }

  .table {
    flex: 1;
    min-height: 400px;
    
    .table-tag {
      border: none;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
  }

  .width-150 {
    width: 150px;
  }

  .width-200 {
    width: 200px;
  }

  .mr-10 {
    margin-right: 10px;
  }

  .flex-1 {
    flex: 1;
  }
}
</style>
