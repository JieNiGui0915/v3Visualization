<template>
  <el-dialog v-model="dialogVisible" title="费用详情" width="80%" top="5vh" destroy-on-close :close-on-click-modal="false">
    <div v-loading="loading" class="expense-detail">
      <!-- 基本信息 -->
      <div class="detail-section">
        <h3 class="section-title">基本信息</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="detail-item">
              <label>收款方名称：</label>
              <span>{{ expenseDetail.expensePayeeName || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="detail-item">
              <label>车牌号：</label>
              <span>{{ expenseDetail.licensePlateNumber || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="detail-item">
              <label>调度号：</label>
              <span>{{ expenseDetail.dispatchNumber || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="detail-item">
              <label>费用类型：</label>
              <span>{{ getExpenseTypeLabel(expenseDetail.expenseType) }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="detail-item">
              <label>费用金额：</label>
              <span>¥{{ expenseDetail.expenseAmount || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="detail-item">
              <label>费用发生日期：</label>
              <span>{{ expenseDetail.expenseDate || '-' }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="detail-item">
              <label>经办人：</label>
              <span>{{ expenseDetail.handlerName || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="detail-item">
              <label>结算方式：</label>
              <span>{{ getSettlementMethodLabel(expenseDetail.expenseSettlementMethod) }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="detail-item">
              <label>费用状态：</label>
              <el-tag :type="getStatusTagType(expenseDetail.expenseStatus)">{{ getStatusLabel(expenseDetail.expenseStatus) }}</el-tag>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="detail-item">
              <label>用途说明：</label>
              <span>{{ expenseDetail.purposeDesc || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="detail-item">
              <label>支付金额：</label>
              <span>¥{{ expenseDetail.paymentAmount || '-' }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="detail-item">
              <label>支付方式：</label>
              <span>{{ expenseDetail.paymentMethod || '-' }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 图片信息 -->
      <div class="detail-section">
        <h3 class="section-title">相关图片</h3>
        <el-row :gutter="20">
          <!-- 费用文件 -->
          <el-col :span="8">
            <div class="image-section">
              <h4 class="image-title">费用文件</h4>
              <div class="image-list">
                <div v-if="!expenseDetail.expenseFileList || expenseDetail.expenseFileList.length === 0" class="no-image">
                  暂无图片
                </div>
                <div v-else class="image-grid">
                  <div 
                    v-for="(file, index) in expenseDetail.expenseFileList" 
                    :key="file.fileId || index"
                    class="image-item"
                    @click="handleViewImage(expenseDetail.expenseFileList, index)"
                  >
                    <img :src="file.thumbnailUrl" :alt="file.fileName" class="thumbnail" />
                    <div class="image-overlay">
                      <span class="image-name">{{ file.fileName }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          
          <!-- 费用发票文件 -->
          <el-col :span="8">
            <div class="image-section">
              <h4 class="image-title">费用发票文件</h4>
              <div class="image-list">
                <div v-if="!expenseDetail.expenseInvoiceFileList || expenseDetail.expenseInvoiceFileList.length === 0" class="no-image">
                  暂无图片
                </div>
                <div v-else class="image-grid">
                  <div 
                    v-for="(file, index) in expenseDetail.expenseInvoiceFileList" 
                    :key="file.fileId || index"
                    class="image-item"
                    @click="handleViewImage(expenseDetail.expenseInvoiceFileList, index)"
                  >
                    <img :src="file.thumbnailUrl" :alt="file.fileName" class="thumbnail" />
                    <div class="image-overlay">
                      <span class="image-name">{{ file.fileName }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          
          <!-- 付款文件图片 -->
          <el-col :span="8">
            <div class="image-section">
              <h4 class="image-title">付款文件图片</h4>
              <div class="image-list">
                <div v-if="!expenseDetail.paymentFileList || expenseDetail.paymentFileList.length === 0" class="no-image">
                  暂无图片
                </div>
                <div v-else class="image-grid">
                  <div 
                    v-for="(file, index) in expenseDetail.paymentFileList" 
                    :key="file.fileId || index"
                    class="image-item"
                    @click="handleViewImage(expenseDetail.paymentFileList, index)"
                  >
                    <img :src="file.thumbnailUrl" :alt="file.fileName" class="thumbnail" />
                    <div class="image-overlay">
                      <span class="image-name">{{ file.fileName }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  
  <!-- 图片查看器 -->
  <el-image-viewer 
    v-if="showImageViewer" 
    :url-list="imageUrls" 
    :initial-index="currentImageIndex"
    :hide-on-click-modal="true"
    @close="closeImageViewer"
  />
</template>

<script setup>
import { ref } from 'vue';
import { getFileListByIdStr } from '@/api/api.file.js';
import { ElMessage } from 'element-plus';
import { BASE_URL_IMG } from '@/config/config.js';

const dialogVisible = ref(false);
const loading = ref(false);
const expenseDetail = ref({});
const showImageViewer = ref(false);
const imageUrls = ref([]);
const currentImageIndex = ref(0);

// Props - 接收父组件传递的映射数据
const props = defineProps({
  expenseTypeMap: {
    type: Object,
    default: () => ({})
  },
  expenseStatusMap: {
    type: Object,
    default: () => ({})
  },
  expenseStatusTagTypeMap: {
    type: Object,
    default: () => ({})
  },
  expenseSettlementMethodMap: {
    type: Object,
    default: () => ({})
  }
});

// 打开弹窗
const open = async (rowData) => {
  dialogVisible.value = true;
  loading.value = true;
  
  try {
    // 直接使用传入的行数据
    expenseDetail.value = { ...rowData };
    
    // 加载图片数据
    await loadImageData();
    

  } catch (error) {

    ElMessage.error('加载图片数据失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 加载图片数据
const loadImageData = async () => {
  const promises = [];
  
  // 加载费用文件
  if (expenseDetail.value.expenseFileIds) {
    promises.push(
      getFileListByIdStr(expenseDetail.value.expenseFileIds)
        .then(files => {
          expenseDetail.value.expenseFileList = processFileList(files);
        })
        .catch(error => {

          expenseDetail.value.expenseFileList = [];
        })
    );
  } else {
    expenseDetail.value.expenseFileList = [];
  }
  
  // 加载费用发票文件
  if (expenseDetail.value.expenseInvoiceFileIds) {
    promises.push(
      getFileListByIdStr(expenseDetail.value.expenseInvoiceFileIds)
        .then(files => {
          expenseDetail.value.expenseInvoiceFileList = processFileList(files);
        })
        .catch(error => {

          expenseDetail.value.expenseInvoiceFileList = [];
        })
    );
  } else {
    expenseDetail.value.expenseInvoiceFileList = [];
  }
  
  // 加载付款文件图片
  if (expenseDetail.value.paymentFileIds) {
    promises.push(
      getFileListByIdStr(expenseDetail.value.paymentFileIds)
        .then(files => {
          expenseDetail.value.paymentFileList = processFileList(files);
        })
        .catch(error => {

          expenseDetail.value.paymentFileList = [];
        })
    );
  } else {
    expenseDetail.value.paymentFileList = [];
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
    fileUrl: file.fileUrl ? (file.fileUrl.startsWith('http') ? file.fileUrl : `${BASE_URL_IMG}/${file.fileUrl}`) : file.thumbnailUrl
  }));
};

// 查看图片
const handleViewImage = (fileList, index) => {
  if (!fileList || fileList.length === 0) return;
  
  imageUrls.value = fileList.map(file => file.fileUrl || file.thumbnailUrl);
  currentImageIndex.value = index;
  showImageViewer.value = true;
};

// 关闭图片查看器
const closeImageViewer = () => {
  showImageViewer.value = false;
  imageUrls.value = [];
  currentImageIndex.value = 0;
};

// 获取费用类型标签
const getExpenseTypeLabel = (type) => {
  return props.expenseTypeMap[type] || type || '-';
};

// 获取状态标签
const getStatusLabel = (status) => {
  return props.expenseStatusMap[status] || status || '-';
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  return props.expenseStatusTagTypeMap[status] || 'info';
};

// 获取结算方式标签
const getSettlementMethodLabel = (method) => {
  return props.expenseSettlementMethodMap[method] || method || '-';
};

// 暴露方法给父组件
defineExpose({
  open
});
</script>

<style lang="less" scoped>
.expense-detail {
  .detail-section {
    margin-bottom: 30px;
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #409EFF;
    }
    
    .detail-item {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      
      label {
        font-weight: 500;
        color: #606266;
        min-width: 100px;
        margin-right: 8px;
      }
      
      span {
        color: #303133;
        flex: 1;
      }
    }
  }
  
  .image-section {
    .image-title {
      font-size: 14px;
      font-weight: 500;
      color: #409EFF;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .image-list {
      min-height: 120px;
      border: 1px solid #EBEEF5;
      border-radius: 4px;
      padding: 10px;
      
      .no-image {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        color: #909399;
        font-size: 14px;
      }
      
      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 8px;
        
        .image-item {
          position: relative;
          cursor: pointer;
          border-radius: 4px;
          overflow: hidden;
          transition: transform 0.2s;
          
          &:hover {
            transform: scale(1.05);
            
            .image-overlay {
              opacity: 1;
            }
          }
          
          .thumbnail {
            width: 100%;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
          }
          
          .image-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 4px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.2s;
            
            .image-name {
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

.dialog-footer {
  text-align: right;
}
</style>