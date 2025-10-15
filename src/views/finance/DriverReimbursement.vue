<template>
  <div class="invoice page-wrap" ref="invoiceRef">
    <div class="header">
      <el-input v-model.trim="searchForm.reimbursementNumber" class="width-200 mr-10" placeholder="报销单号" :prefix-icon="Search"
        @keyup.enter="handleSearch" clearable />
      <el-input v-model.trim="searchForm.reimbursementPerson" class="width-150 mr-10" placeholder="报销人"
        @keyup.enter="handleSearch" clearable />
      <el-select v-model="searchForm.reimbursementStatus" class="width-150 mr-10" placeholder="报销单状态" @change="handleSearch" clearable>
        <el-option v-for="item in reimbursementStatusList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="searchForm.fleetName" class="width-150 mr-10" placeholder="车队" @change="handleSearch" clearable>
        <el-option v-for="item in fleetList" :key="item.value" :label="item.label" :value="item.value" />
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
      row-key="reimbursementId" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class"
      v-loading="loading">
      <el-table-column prop="reimbursementNumber" label="报销单号" width="250" fixed="left" align="center" header-align="center" show-overflow-tooltip />
      <el-table-column prop="reimbursementPerson" label="报销人" width="150" align="center" header-align="center" show-overflow-tooltip />
      <el-table-column prop="applicationTime" label="报销申请时间" width="175" align="center" header-align="center" show-overflow-tooltip />
      <el-table-column prop="reimbursementAmount" label="报销金额" width="150" align="center" header-align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <span>¥{{ row.reimbursementAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fleetName" label="车队" width="150" align="center" header-align="center" show-overflow-tooltip />
      <el-table-column prop="reimbursementStatus" label="报销单状态" width="150" align="center" header-align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.reimbursementStatus)">{{ getStatusLabel(row.reimbursementStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceType" label="发票类型" width="150" align="center" header-align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <span>{{ getInvoiceTypeLabel(row.invoiceType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceReceiveStatus" label="是否收到纸质发票" width="150" align="center" header-align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <span v-if="row.invoiceType === '1'">{{ row.invoiceReceiveStatus === 1 ? '是' : '否' }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300" align="center" header-align="center" @click.stop.prevent.self>
        <template #default="scope">
          <el-button link type="primary" @click.prevent.stop="handleClickView(scope.row)">查看</el-button>
          
          <!-- 审核按钮 - 只在运管已审状态下显示 -->
          <el-button 
            v-if="scope.row.reimbursementStatus === 1"
            link 
            type="success" 
            @click.prevent.stop="handleAudit(scope.row)"
          >
            审核
          </el-button>
          
          <!-- 确认收到发票 - 纸质发票且未收到状态时显示 -->
          <el-button 
            v-if="scope.row.invoiceType === '1' && scope.row.invoiceReceiveStatus === 0" 
            link 
            type="warning" 
            @click.prevent.stop="handleConfirmReceiveInvoice(scope.row)"
          >
            确认收到发票
          </el-button>
          
          <!-- 确认发放 - 已批准状态时显示 -->
          <el-button 
            v-if="scope.row.reimbursementStatus === 3" 
            link 
            type="info" 
            @click.prevent.stop="handleConfirmDistribute(scope.row)"
          >
            确认发放
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
      @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager, sizes, next"
      :total="totalSize" class="pagination" />
    
    <!-- 报销单详情弹窗 -->
    <InvoiceDetailDialog 
      ref="invoiceDetailDialogRef"
      :invoice-type-map="invoiceTypeMap"
      :reimbursement-status-map="reimbursementStatusMap"
      :reimbursement-status-tag-type-map="reimbursementStatusTagTypeMap"
      @audit-success="handleAuditSuccess"
    />
  </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, nextTick, watch } from 'vue';
import { GlobalStore } from "@/store/index.js";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { searchInvoicePageList, exportInvoiceList } from "@/api/api.finance.js";
import { downloadStreamFile, formatDateTimeThinString } from "@/utils/util.js";
import * as dictApi from "@/api/api.dict.js";
import InvoiceDetailDialog from './components/DriverReimbursementDialog.vue';

const loading = ref(false);
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const tableHeight = ref(500); 
const invoiceRef = useTemplateRef('invoiceRef');
const tableRef = useTemplateRef('tableRef');
const invoiceDetailDialogRef = useTemplateRef('invoiceDetailDialogRef');
const globalStore = GlobalStore();

// 搜索条件
const searchForm = ref({
  reimbursementNumber: "", // 报销单号
  reimbursementPerson: "", // 报销人
  reimbursementStatus: "", // 报销单状态
  fleetName: "", // 车队
  startDate: "", // 开始日期
  endDate: "" // 结束日期
});

// 报销单状态、发票类型、车队从字典获取
const reimbursementStatusList = ref([]);
const reimbursementStatusMap = ref({});
const invoiceTypeList = ref([]);
const invoiceTypeMap = ref({});
const fleetList = ref([]);
const fleetMap = ref({});

// 加载字典数据
const loadDictData = async () => {
  try {
    // 模拟报销单状态字典数据
    const mockReimbursementStatusData = [
      { dictValue: '0', dictLabel: '待提交' },
      { dictValue: '1', dictLabel: '运管已审' },
      { dictValue: '2', dictLabel: '财务已审' },
      { dictValue: '3', dictLabel: '已批准' },
      { dictValue: '4', dictLabel: '已发放' },
      { dictValue: '5', dictLabel: '已退回' }
    ];
    reimbursementStatusList.value = mockReimbursementStatusData.map(item => ({
      label: item.dictLabel,
      value: parseInt(item.dictValue)
    }));
    reimbursementStatusMap.value = mockReimbursementStatusData.reduce((map, item) => {
      map[parseInt(item.dictValue)] = item.dictLabel;
      return map;
    }, {});
    
    // 模拟发票类型字典数据
    const mockInvoiceTypeData = [
      { dictValue: '1', dictLabel: '纸质' },
      { dictValue: '2', dictLabel: '电子' }
    ];
    invoiceTypeList.value = mockInvoiceTypeData.map(item => ({
      label: item.dictLabel,
      value: parseInt(item.dictValue)
    }));
    invoiceTypeMap.value = mockInvoiceTypeData.reduce((map, item) => {
      map[parseInt(item.dictValue)] = item.dictLabel;
      return map;
    }, {});
    
    // 模拟车队字典数据
    const mockFleetData = [
      { dictValue: '1', dictLabel: '第一车队' },
      { dictValue: '2', dictLabel: '第二车队' },
      { dictValue: '3', dictLabel: '第三车队' }
    ];
    fleetList.value = mockFleetData.map(item => ({
      label: item.dictLabel,
      value: item.dictValue
    }));
    fleetMap.value = mockFleetData.reduce((map, item) => {
      map[item.dictValue] = item.dictLabel;
      return map;
    }, {});
  } catch (error) {
    console.error('字典数据加载失败:', error);
    ElMessage.error('字典数据加载失败');
    
    // 清空字典数据
    reimbursementStatusList.value = [];
    reimbursementStatusMap.value = {};
    invoiceTypeList.value = [];
    invoiceTypeMap.value = {};
    fleetList.value = [];
    fleetMap.value = {};
  }
};

const reimbursementStatusTagTypeMap = {
  0: "warning", // 待提交
  1: "primary", // 运管已审
  2: "success", // 财务已审
  3: "success", // 已批准
  4: "info", // 已发放
  5: "danger", // 已退回
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

// 生成费用记录模拟数据
const generateExpenseRecords = (reimbursementId) => {
  const expenseTypes = [
    { code: 1, name: '充电' },
    { code: 2, name: '加油' },
    { code: 3, name: '高速' },
    { code: 4, name: '过路' },
    { code: 5, name: '维保' },
    { code: 6, name: '罚款' },
    { code: 12, name: '其他' }
  ];
  const handlers = ['张经办', '李经办', '王经办', '赵经办', '钱经办'];
  const payees = ['中石油加油站', '中石化加油站', '高速公路管理处', '停车场管理', '汽修服务中心', '交通管理局'];
  const vehicles = ['京A12345', '京B67890', '京C11111', '京D22222', '京E33333'];
  const drivers = ['张司机', '李司机', '王司机', '赵司机', '钱司机'];
  const recordCount = 3; // 固定生成3条费用记录
  const records = [];
  
  for (let j = 1; j <= recordCount; j++) {
    const expenseType = expenseTypes[Math.floor(Math.random() * expenseTypes.length)];
    const handler = handlers[Math.floor(Math.random() * handlers.length)];
    const payee = payees[Math.floor(Math.random() * payees.length)];
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const amount = (Math.random() * 2000 + 100).toFixed(2);
    const expenseDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const reimbursementStatus = Math.floor(Math.random() * 3); // 0-待报销, 1-已申请, 2-已完成
    
    // 模拟图片数据
    const expenseImageCount = Math.floor(Math.random() * 3) + 1; // 1-3张费用图片
    const invoiceImageCount = Math.floor(Math.random() * 2) + 1; // 1-2张发票图片
    
    const expenseImages = [];
    for (let k = 1; k <= expenseImageCount; k++) {
      expenseImages.push({
        id: `expense_img_${j}_${k}`,
        name: `费用图片${k}.jpg`,
        url: `https://via.placeholder.com/300x200?text=费用图片${k}`
      });
    }
    
    const invoiceImages = [];
    for (let k = 1; k <= invoiceImageCount; k++) {
      invoiceImages.push({
        id: `invoice_img_${j}_${k}`,
        name: `发票图片${k}.jpg`,
        url: `https://via.placeholder.com/300x200?text=发票图片${k}`
      });
    }
    
    records.push({
      expenseId: `E${reimbursementId.substring(1)}_${j}`,
      handlerName: handler,
      payeeName: payee,
      vehicleName: vehicle,
      driverName: driver,
      expenseDate: formatDate(expenseDate),
      expenseAmount: parseFloat(amount),
      expenseType: expenseType.code,
      purposeDescription: `${expenseType.name}相关费用支出，用于车辆运营维护`,
      settlementMethod: 1, // 1-垫付报销
      expenseImages: expenseImages,
      invoiceImages: invoiceImages,
      reimbursementStatus: reimbursementStatus
    });
  }
  
  return records;
};

// 生成模拟数据
const generateMockData = () => {
  const mockData = [];
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
  const payees = ['中国银行', '工商银行', '建设银行', '农业银行', '招商银行'];
  const drivers = ['司机A', '司机B', '司机C', '司机D', '司机E'];
  const fleets = ['第一车队', '第二车队', '第三车队'];
  
  for (let i = 1; i <= 50; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomPayee = payees[Math.floor(Math.random() * payees.length)];
    const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
    const randomFleet = fleets[Math.floor(Math.random() * fleets.length)];
    const randomDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const invoiceType = Math.random() > 0.5 ? '1' : '2'; // 1-纸质, 2-电子
    const reimbursementId = `R${String(i).padStart(6, '0')}`;
    
    // 生成费用记录
    const expenseRecords = generateExpenseRecords(reimbursementId);
    // 计算总金额（基于费用记录）
    const totalAmount = expenseRecords.reduce((sum, record) => sum + record.expenseAmount, 0);
    
    mockData.push({
      reimbursementId: reimbursementId,
      reimbursementNumber: `BX${String(i).padStart(8, '0')}`,
      reimbursementPerson: randomName,
      applicationTime: formatDate(randomDate),
      reimbursementAmount: parseFloat(totalAmount.toFixed(2)),
      reimbursementStatus: Math.floor(Math.random() * 5) + 1, // 1-运管已审, 2-财务已审, 3-已批准, 4-已发放, 5-已退回
      remark: `报销备注信息${i}`,
      payeeName: randomPayee,
      invoiceType: invoiceType,
      invoiceReceiveStatus: invoiceType === '1' ? Math.floor(Math.random() * 2) : 1, // 纸质发票随机状态，电子发票默认已收到
      fleetName: randomFleet,
      driverName: randomDriver,
      reimbursementDescription: `这是第${i}条报销单的详细说明，包含${expenseRecords.length}项费用。`,
      expenseRecords: expenseRecords
    });
  }
  return mockData;
};

// 加载数据
const load = async () => {
  loading.value = true;
  try {
    // 使用模拟数据
    const allMockData = generateMockData();
    
    // 模拟搜索过滤
    let filteredData = allMockData;
    
    if (searchForm.value.reimbursementNumber) {
      filteredData = filteredData.filter(item => 
        item.reimbursementNumber.includes(searchForm.value.reimbursementNumber)
      );
    }
    
    if (searchForm.value.reimbursementPerson) {
      filteredData = filteredData.filter(item => 
        item.reimbursementPerson.includes(searchForm.value.reimbursementPerson)
      );
    }
    
    if (searchForm.value.reimbursementStatus) {
      filteredData = filteredData.filter(item => 
        item.reimbursementStatus === searchForm.value.reimbursementStatus
      );
    }
    
    if (searchForm.value.fleetName) {
      filteredData = filteredData.filter(item => 
        item.fleetName === fleetMap.value[searchForm.value.fleetName]
      );
    }
    
    // 模拟分页
    const startIndex = (pageCurrent.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    tableData.value = paginatedData;
    totalSize.value = filteredData.length;
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
  } catch (error) {
    console.error('数据加载失败:', error);
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
    reimbursementNumber: "",
    reimbursementPerson: "",
    reimbursementStatus: "",
    fleetName: "",
    startDate: "",
    endDate: ""
  };
  pageCurrent.value = 1;
  load();
}

// 导出报销单数据
async function handleExport() {
  try {
    loading.value = true;
    
    ElMessage.success('模拟导出功能：报销单数据导出成功');
    
    // 模拟导出延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败，请稍后重试');
  } finally {
    loading.value = false;
  }
}
// 查看
function handleClickView(row) {
  console.log('查看报销单详情:', row);
  if (invoiceDetailDialogRef.value) {
    invoiceDetailDialogRef.value.open(row, false); // 第二个参数表示不显示审核功能
  }
}

// 审核
function handleAudit(row) {
  console.log('审核报销单:', row);
  if (invoiceDetailDialogRef.value) {
    invoiceDetailDialogRef.value.open(row, true); // 第二个参数表示显示审核功能
  }
}

// 审核成功回调
function handleAuditSuccess(auditData) {
  console.log('审核成功:', auditData);
  
  // 模拟更新报销单状态
  const targetRow = tableData.value.find(item => item.reimbursementId === auditData.reimbursementId);
  if (targetRow) {
    if (auditData.auditResult === 1) {
      // 审核通过
      if (auditData.invoiceStatus === 1) {
        // 发票齐全 -> 财务已审
        targetRow.reimbursementStatus = 2;
      } else {
        // 发票不齐 -> 已批准
        targetRow.reimbursementStatus = 3;
      }
    } else {
      // 审核不通过 -> 已退回
      targetRow.reimbursementStatus = 5;
    }
  }
  
  ElMessage.success('审核操作完成');
  // 重新加载数据以确保状态同步
  load();
}

// 确认收到发票
function handleConfirmReceiveInvoice(row) {
  console.log('确认收到发票:', row);
  
  // 模拟更新发票状态
  const targetRow = tableData.value.find(item => item.reimbursementId === row.reimbursementId);
  if (targetRow) {
    targetRow.invoiceReceiveStatus = 1; // 已收到
    ElMessage.success('已确认收到发票');
  }
}

// 确认发放
function handleConfirmDistribute(row) {
  console.log('确认发放:', row);
  
  // 模拟更新报销单状态和费用记录状态
  const targetRow = tableData.value.find(item => item.reimbursementId === row.reimbursementId);
  if (targetRow) {
    // 报销单状态变为已发放
    targetRow.reimbursementStatus = 4;
    
    // 更新费用记录的报销状态为已完成
    if (targetRow.expenseRecords) {
      targetRow.expenseRecords.forEach(record => {
        if (record.reimbursementStatus === 1) { // 已申请 -> 已完成
          record.reimbursementStatus = 2;
        }
      });
    }
    
    ElMessage.success('已确认发放，费用记录状态已更新');
  }
}

// 行点击事件
function handleRowClick(row) {
  console.log('行点击:', row);
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

// 获取发票类型标签
const getInvoiceTypeLabel = (type) => {
  return invoiceTypeMap.value[type] || type;
};

// 获取状态标签
const getStatusLabel = (status) => {
  return reimbursementStatusMap.value[status] || status;
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  return reimbursementStatusTagTypeMap[status] || 'info';
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
.invoice {
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
