<template>
  <el-dialog v-model="dialogVisible" title="报销单详情" width="85%" top="5vh" :before-close="handleClose" destroy-on-close>
    <div class="invoice-detail-dialog" v-loading="loading">
      <div class="detail-content">
        <!-- 基本信息 -->
        <div class="section">
          <h3 class="section-title">基本信息</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="detail-item">
                  <label>报销单号：</label>
                <span>{{ invoiceDetail.reimbursementNumber || '-' }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                  <label>报销单号：</label>
                <span>{{ invoiceDetail.reimbursementNumber || '-' }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                 <label>报销申请时间：</label>
                <span>{{ invoiceDetail.reimbursementApplyTime || '-' }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="detail-item">
                <label>发票类型：</label>
                <span>{{ getInvoiceTypeLabel(invoiceDetail.invoiceType) }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                <label>报销金额：</label>
                <span>¥{{ invoiceDetail.reimbursementAmount || '-' }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                  <label>收款人：</label>
                <span>{{ invoiceDetail.payee || '-' }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="detail-item">
                <label>车队：</label>
                <span>{{ invoiceDetail.fleetName || '-' }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                <label>司机：</label>
                <span>{{ invoiceDetail.driverName || '-' }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                <label>报销单状态：</label>
                <el-tag :type="getStatusTagType(invoiceDetail.reimbursementStatus)">{{ getStatusLabel(invoiceDetail.reimbursementStatus) }}</el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="detail-item">
                 <label>财务是否收到纸质发票：</label>
                <el-tag :type="invoiceDetail.financeReceivedPaperInvoice === 1 ? 'success' : 'danger'">
                  {{ invoiceDetail.financeReceivedPaperInvoice === 1 ? '是' : '否' }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                <label>纸质发票是否齐备：</label>
                <el-tag :type="invoiceDetail.paperInvoiceComplete === 1 ? 'success' : 'danger'">
                  {{ invoiceDetail.paperInvoiceComplete === 1 ? '是' : '否' }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="detail-item">
                 <label>备注：</label>
                <span>{{ invoiceDetail.remark || '-' }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="detail-item">
                <label>报销单说明：</label>
                <span>{{ invoiceDetail.reimbursementDescription || '-' }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 费用记录 -->
        <div class="section">
          <h3 class="section-title">费用记录</h3>
          <div class="table-container">
            <el-table :data="invoiceDetail.expenseRecords || []" border style="width: 100%">
              <el-table-column prop="handlerName" label="经办人" width="80" align="center" show-overflow-tooltip />
              <el-table-column prop="payeeName" label="收款方名称" width="120" align="center" show-overflow-tooltip />
              <el-table-column prop="vehicleName" label="车辆" width="100" align="center" show-overflow-tooltip />
              <el-table-column prop="driverName" label="经办司机" width="80" align="center" show-overflow-tooltip />
              <el-table-column prop="expenseDate" label="费用发生日期" width="110" align="center" />
              <el-table-column prop="expenseAmount" label="金额" width="80" align="center">
                <template #default="{ row }">
                  <span>¥{{ row.expenseAmount }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="expenseType" label="费用类型" width="80" align="center">
                <template #default="{ row }">
                  <span>{{ getExpenseTypeLabel(row.expenseType) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="invoiceType" label="发票类型" width="80" align="center">
                <template #default="{ row }">
                  <span>{{ getInvoiceTypeLabel(invoiceDetail.invoiceType) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="purposeDescription" label="用途说明" min-width="120" align="center" show-overflow-tooltip />
              <el-table-column prop="settlementMethod" label="费用结算方式" width="100" align="center">
                <template #default="{ row }">
                  <span>{{ getSettlementMethodLabel(row.settlementMethod) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="expenseImages" label="费用图片" width="80" align="center">
                <template #default="{ row }">
                  <el-button v-if="row.expenseImages && row.expenseImages.length > 0" type="text" size="small" @click="viewExpenseImages(row.expenseImages)">
                    查看({{ row.expenseImages.length }})
                  </el-button>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column prop="invoiceImages" label="费用发票图片" width="100" align="center">
                <template #default="{ row }">
                  <el-button v-if="row.invoiceImages && row.invoiceImages.length > 0" type="text" size="small" @click="viewInvoiceImages(row.invoiceImages)">
                    查看({{ row.invoiceImages.length }})
                  </el-button>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column prop="reimbursementStatus" label="垫付报销状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getReimbursementStatusTagType(row.reimbursementStatus)" size="small">
                    {{ getReimbursementStatusLabel(row.reimbursementStatus) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="!invoiceDetail.expenseRecords || invoiceDetail.expenseRecords.length === 0" class="no-data">
            暂无费用记录
          </div>
        </div>

        <!-- 报销单文件 -->
        <div class="section">
          <h3 class="section-title">报销单文件</h3>
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="image-section">
                <div class="image-list">
                  <div class="no-image">
                    暂无图片
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <!-- 审核表单 -->
    <div v-if="showAuditSection" class="audit-section">
      <el-divider content-position="left">
        <h3>审核操作</h3>
      </el-divider>
      <el-form ref="auditFormRef" :model="auditForm" :rules="auditRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审核结果" prop="auditResult">
              <el-radio-group v-model="auditForm.auditResult">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="0">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="auditForm.auditResult === 1">
            <el-form-item label="纸质发票" prop="invoiceStatus">
              <el-radio-group v-model="auditForm.invoiceStatus">
                <el-radio :label="1">发票齐全</el-radio>
                <el-radio :label="0">发票不齐</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审核意见" prop="auditComment">
          <el-input
            v-model="auditForm.auditComment"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="auditLoading" @click="handleAuditSubmit">提交审核</el-button>
          <el-button @click="hideAuditForm">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 图片预览弹窗 -->
    <el-dialog v-model="imagePreviewVisible" title="图片预览" width="80%" append-to-body>
      <div class="image-preview-container">
        <div class="image-preview-main">
          <img :src="currentPreviewImage.url" :alt="currentPreviewImage.name" class="preview-image" />
        </div>
        <!-- <div class="image-preview-info">
          <p><strong>文件名：</strong>{{ currentPreviewImage.name }}</p>
          <p><strong>文件大小：</strong>{{ formatFileSize(currentPreviewImage.size) }}</p>
        </div> -->
        <div class="image-preview-controls" v-if="previewImageList.length > 1">
          <el-button @click="prevImage" :disabled="currentImageIndex === 0">上一张</el-button>
          <span>{{ currentImageIndex + 1 }} / {{ previewImageList.length }}</span>
          <el-button @click="nextImage" :disabled="currentImageIndex === previewImageList.length - 1">下一张</el-button>
        </div>
      </div>
    </el-dialog>

    <template #footer>
      <div class="dialog-footer">
        <!-- 审核按钮 - 仅在启用审核模式且运管已审状态时显示 -->
        <el-button 
          v-if="showAuditButton && invoiceDetail.reimbursementStatus === 1" 
          type="success" 
          @click="showAuditForm"
        >
          审核
        </el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getFileListByIdStr } from '@/api/api.file.js';

// 组件属性
const props = defineProps({
  invoiceTypeMap: {
    type: Object,
    default: () => ({})
  },
  reimbursementStatusMap: {
    type: Object,
    default: () => ({})
  },
  reimbursementStatusTagTypeMap: {
    type: Object,
    default: () => ({})
  }

});

// 响应式数据
const dialogVisible = ref(false);
const loading = ref(false);
const invoiceDetail = ref({});
const showAuditButton = ref(false); // 控制是否显示审核按钮

// 审核相关数据
const showAuditSection = ref(false);
const auditLoading = ref(false);
const auditFormRef = ref(null);
const auditForm = ref({
  auditResult: null,
  invoiceStatus: null,
  auditComment: ''
});

// 审核表单验证规则
const auditRules = {
  auditResult: [
    { required: true, message: '请选择审核结果', trigger: 'change' }
  ],
  invoiceStatus: [
    { 
      required: true, 
      message: '请选择发票状态', 
      trigger: 'change',
      validator: (rule, value, callback) => {
        if (auditForm.value.auditResult === 1 && value === null) {
          callback(new Error('审核通过时必须选择发票状态'));
        } else {
          callback();
        }
      }
    }
  ]
};

// 图片预览相关
const imagePreviewVisible = ref(false);
const previewImageList = ref([]);
const currentImageIndex = ref(0);

// 当前预览图片信息
const currentPreviewImage = computed(() => {
  if (previewImageList.value.length > 0 && currentImageIndex.value >= 0) {
    return previewImageList.value[currentImageIndex.value];
  }
  return { url: '', name: '', size: 0 };
});

// 基础URL配置
const BASE_URL_IMG = import.meta.env.VITE_BASE_URL_IMG || '';

// 打开弹窗
const open = async (reimbursement, enableAudit = false) => {
  dialogVisible.value = true;
  loading.value = true;
  showAuditButton.value = enableAudit; // 设置是否显示审核按钮
  
  try {
    // 设置报销单详情数据
    invoiceDetail.value = { ...reimbursement };
  } catch (error) {
    console.error('加载报销单详情失败:', error);
    ElMessage.error('加载报销单详情失败');
  } finally {
    loading.value = false;
  }
};

// 加载发票文件
const loadInvoiceFiles = async () => {
  const promises = [];
  
  // 加载发票文件
  if (invoiceDetail.value.invoiceFileIds) {
    promises.push(
      getFileListByIdStr(invoiceDetail.value.invoiceFileIds)
        .then(files => {
          invoiceDetail.value.invoiceFileList = processFileList(files);
        })
        .catch(error => {
          console.error('发票文件加载失败:', error);
          invoiceDetail.value.invoiceFileList = [];
        })
    );
  } else {
    invoiceDetail.value.invoiceFileList = [];
  }
  
  // 等待所有图片加载完成
  await Promise.all(promises);
};

// 处理文件列表数据
const processFileList = (files) => {
  if (!files || !Array.isArray(files)) {
    return [];
  }
  
  return files.map(file => ({
    ...file,
    thumbnailUrl: file.thumbnailUrl ? (file.thumbnailUrl.startsWith('http') ? file.thumbnailUrl : `${BASE_URL_IMG}/${file.thumbnailUrl}`) : '',
    fileUrl: file.fileUrl ? (file.fileUrl.startsWith('http') ? file.fileUrl : `${BASE_URL_IMG}/${file.fileUrl}`) : ''
  }));
};

// 查看图片
const handleViewImage = (imageList, index) => {
  previewImageList.value = imageList.map(file => ({
    url: file.fileUrl || file.thumbnailUrl,
    name: file.fileName || '未知文件',
    size: file.fileSize || 0
  }));
  currentImageIndex.value = index;
  imagePreviewVisible.value = true;
};

// 上一张图片
const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

// 下一张图片
const nextImage = () => {
  if (currentImageIndex.value < previewImageList.value.length - 1) {
    currentImageIndex.value++;
  }
};

// 格式化文件大小
const formatFileSize = (size) => {
  if (!size) return '未知';
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
  return (size / (1024 * 1024)).toFixed(2) + ' MB';
};

// 获取发票类型标签
const getInvoiceTypeLabel = (type) => {
  return props.invoiceTypeMap[type] || type || '-';
};

// 显示审核表单
const showAuditForm = () => {
  showAuditSection.value = true;
  // 重置表单
  auditForm.value = {
    auditResult: null,
    invoiceStatus: null,
    auditComment: ''
  };
};

// 隐藏审核表单
const hideAuditForm = () => {
  showAuditSection.value = false;
  // 重置表单
  auditForm.value = {
    auditResult: null,
    invoiceStatus: null,
    auditComment: ''
  };
};

// 提交审核
const handleAuditSubmit = async () => {
  if (!auditFormRef.value) return;
  
  try {
    // 表单验证
    await auditFormRef.value.validate();
    
    auditLoading.value = true;
    
    // 构建审核数据
    const auditData = {
      reimbursementId: invoiceDetail.value.reimbursementId,
      auditResult: auditForm.value.auditResult,
      invoiceStatus: auditForm.value.invoiceStatus,
      auditComment: auditForm.value.auditComment
    };
    
    // TODO: 调用审核API
    console.log('提交审核数据:', auditData);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    ElMessage.success('审核提交成功');
    
    // 隐藏审核表单
    hideAuditForm();
    
    // 触发审核成功事件，通知父组件更新数据
    emit('audit-success', auditData);
    
    // 关闭弹窗
    handleClose();
    
  } catch (error) {
    console.error('审核提交失败:', error);
    ElMessage.error('审核提交失败，请重试');
  } finally {
    auditLoading.value = false;
  }
};

// 获取状态标签
const getStatusLabel = (status) => {
  return props.reimbursementStatusMap[status] || status || '-';
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  return props.reimbursementStatusTagTypeMap[status] || 'info';
};

// 获取费用类型标签
const getExpenseTypeLabel = (type) => {
  const expenseTypeMap = {
    1: '充电',
    2: '加油',
    3: '高速',
    4: '过路',
    5: '维保',
    6: '罚款',
    12: '其他'
  };
  return expenseTypeMap[type] || type || '-';
};

// 获取结算方式标签
const getSettlementMethodLabel = (method) => {
  const settlementMethodMap = {
    1: '垫付报销'
  };
  return settlementMethodMap[method] || method || '-';
};

// 获取垫付报销状态标签
const getReimbursementStatusLabel = (status) => {
  const reimbursementStatusMap = {
    0: '待报销',
    1: '已申请',
    2: '已完成'
  };
  return reimbursementStatusMap[status] || status || '-';
};

// 获取垫付报销状态标签类型
const getReimbursementStatusTagType = (status) => {
  const tagTypeMap = {
    0: 'warning',
    1: 'primary',
    2: 'success'
  };
  return tagTypeMap[status] || 'info';
};

// 查看费用图片
const viewExpenseImages = (images) => {
  if (images && images.length > 0) {
    handleViewImage(images, 0);
  }
};

// 查看发票图片
const viewInvoiceImages = (images) => {
  if (images && images.length > 0) {
    handleViewImage(images, 0);
  }
};

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false;
  imagePreviewVisible.value = false;
  invoiceDetail.value = {};
  previewImageList.value = [];
  currentImageIndex.value = 0;
  // 重置审核表单状态
  showAuditSection.value = false;
  auditForm.value = {
    auditResult: null,
    invoiceStatus: null,
    auditComment: ''
  };
};

// 定义事件
const emit = defineEmits(['audit-success']);

// 暴露方法
defineExpose({
  open
});
</script>

<style lang="less" scoped>
.invoice-detail-dialog {
  .detail-content {
    max-height: 70vh;
    overflow: hidden; // 隐藏所有滚动条
  }

  .section {
    margin-bottom: 30px;
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #409eff;
    }
  }

  .detail-item {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    
    label {
      font-weight: bold;
      color: #606266;
      min-width: 120px;
      margin-right: 10px;
    }
    
    span {
      color: #303133;
      flex: 1;
    }
  }

  .no-data {
    text-align: center;
    color: #909399;
    padding: 40px 0;
    background-color: #f5f7fa;
    border-radius: 4px;
    margin-top: 15px;
  }

  // 审核表单样式
  .audit-section {
    margin-top: 20px;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;

    .el-divider {
      margin: 0 0 20px 0;

      h3 {
        color: #409eff;
        font-size: 16px;
        font-weight: bold;
        margin: 0;
      }
    }

    .el-form {
      .el-form-item {
        margin-bottom: 20px;
      }

      .el-radio-group {
        .el-radio {
          margin-right: 20px;
        }
      }

      .el-textarea {
        .el-textarea__inner {
          resize: vertical;
        }
      }
    }
  }

  // 表格容器样式
  .table-container {
    overflow-x: auto;
    
    .el-table {
      min-width: 100%;
    }
  }

  .image-section {
    .image-list {
      .no-image {
        text-align: center;
        color: #909399;
        padding: 40px 0;
        background-color: #f5f7fa;
        border-radius: 4px;
      }
      
      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
        
        .image-item {
          position: relative;
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
            
          .thumbnail {
            width: 100%;
            height: 120px;
            object-fit: cover;
            display: block;
          }
          
          .image-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
            color: white;
            padding: 8px;
            
            .image-name {
              font-size: 12px;
              display: block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}

.image-preview-container {
  text-align: center;
  
  .image-preview-main {
    margin-bottom: 20px;
    
    .preview-image {
      max-width: 100%;
      max-height: 60vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
  
  .image-preview-info {
    margin-bottom: 20px;
    text-align: left;
    
    p {
      margin: 5px 0;
      color: #606266;
    }
  }
  
  .image-preview-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    
    span {
      color: #606266;
      font-size: 14px;
    }
  }
}

.dialog-footer {
  text-align: right;
}
</style>