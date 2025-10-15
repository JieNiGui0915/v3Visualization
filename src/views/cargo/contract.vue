<template>
    <div class="contract page-wrap" ref="contractRef">
        <div class="header">
            <el-select v-model="search.partyACompanyId" class="width-200 mr-10" placeholder="甲方单位"
                @change="handleSearch" @focus="loadAllCompanyList" clearable @clear="handleSearch">
                <el-option v-for="item in allCompanyList" :key="item.companyId" :label="item.shortName"
                    :value="item.companyId">
                    <span class="option_left">{{ item.shortName }}</span>
                </el-option>
            </el-select>
            <el-select v-model="search.partyBCompanyId" class="width-200 mr-10" placeholder="乙方单位"
                @change="handleSearch" @focus="loadAllCompanyList" clearable @clear="handleSearch">
                <el-option v-for="item in allCompanyList" :key="item.companyId" :label="item.shortName"
                    :value="item.companyId">
                    <span class="option_left">{{ item.shortName }}</span>
                </el-option>
            </el-select>
            <!-- <el-select v-model="search.goodsItemId" class="width-200 mr-10" placeholder="货物" @change="handleSearch"
                @focus="loadAllGoodsItemList" clearable @clear="handleSearch">
                <el-option v-for="item in allGoodsItemList" :key="item.goodsItemId" :label="item.goodsItemName"
                    :value="item.goodsItemId">
                    <span class="option_left">{{ item.goodsItemName }}</span>
                </el-option>
            </el-select> -->
            <el-input v-model.trim="search.contractNo" class="width-200 mr-10" placeholder="合同号" :prefix-icon="Search"
                @keyup.enter="handleSearch" @clear="handleSearch" clearable />
            <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
            <div class="flex-1"></div>
            <el-button type="primary" plain size="default" @click="handleClickAdd">新增合同</el-button>
        </div>
        <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
            row-key="id" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class"
            v-loading="loading">
            <el-table-column fixed type="index" label="编号" width="40" align="center" />
            <el-table-column label="合同号" prop="contractNo" width="auto" align="center" show-overflow-tooltip />
            <el-table-column label="甲方单位" prop="partyACompanyName" width="auto" align="center" show-overflow-tooltip />
            <el-table-column label="乙方单位" prop="partyBCompanyName" width="auto" align="center" show-overflow-tooltip />
            <el-table-column label="合同开始结束日期" prop="startDate" width="180" align="center" show-overflow-tooltip>
                <template #default="scope">
                    <span v-if="!scope.row.startDate || !scope.row.endDate">-</span>
                    <span v-else>
                        {{ formatDate(scope.row.startDate) }} 至 {{ formatDate(scope.row.endDate) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="文件" prop="contractFileIds" width="auto" align="center" show-overflow-tooltip>
                <template #default="scope">
                    <span v-if="!scope.row.contractFileIds">-</span>
                    <span v-else class="link" @click.self.stop="handleViewFiles(scope.row.contractFileIds)">查看图片({{
                        scope.row.contractFileIds.split(",").length }}个)</span>
                </template>
            </el-table-column>
            <el-table-column label="合同状态" prop="contractStatus" width="auto" align="center" show-overflow-tooltip>
                <template #default="scope">
                    <el-tag :type="contractStatusTagTypeMap[scope.row.contractStatus] || ''" disable-transitions>
                        {{ contractStatusMap[scope.row.contractStatus] || "" }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="210" align="center" @click.stop.prevent.self>
                <template #default="scope">
                    <el-button link type="primary" @click.prevent.stop="handleClickView(scope.row)">查看</el-button>
                    <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)">编辑</el-button>
                    <el-popconfirm title="确认删除该项吗？" @confirm="handleClickDelete(scope.row)">
                        <template #reference>
                            <el-button link type="danger" @click.prevent.stop>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
            @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
            :total="totalSize" class="pagination" />
        <add-contract ref="addContractRef" @close="closeDialog" />
        <edit-contract ref="editContractRef" @close="closeDialog" />
        <view-contract ref="viewContractRef" />
        <image-dialog ref="imageDialogRef"></image-dialog>
    </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, nextTick, watch } from 'vue';
import { GlobalStore } from "@/store/index.js";
import { Search } from "@element-plus/icons-vue";
import { searchContractPageList, deleteContract } from '@/api/api.contract';
import addContract from './components/addContract.vue';
import editContract from './components/editContract.vue';
import viewContract from './components/viewContract.vue';
import { ElMessage } from 'element-plus';
import { getAllCompanyList } from "@/api/api.company.js";
import { getGoodsSimpleList } from "@/api/api.goods.js";
import { contractStatusMap, contractStatusTagTypeMap } from '@/config/const.js';
import { formatDate } from '@/utils/util.js';
import ImageDialog from "@/components/form/image-dialog.vue";


const loading = ref(false);
/**
{
contractId:"",// 主键
contractNo:"",// 合同号
partyACompanyName:"",// 甲方单位
partyBCompanyName:"",// 乙方单位
startDate:"",// 起始日期
endDate:"",// 结束日期
contractStatus:"",// 合同状态
delFlag:"",// 删除标志 0.未删除 1.已删除
createUser:"",// 创建人
createTime:"",// 创建时间
remark:"",// 备注
contractFileIds:"",// 合同附件ID列表
items:[{
goodsItemName:"",// 货物
deliveryCompanyName:"",// 发货单位
loadingGoodsYardName:"",// 装货点
receivingCompanyName:"",// 收货单位
unloadingGoodsYardName:"",// 卸货点
pricingMethod:"",// 计价方式（1.计吨 2.计趟 3.一口价）
unitPrice:"",// 单价（元）
estimatedTonnage:"",// 预计吨数
estimatedTrips:"",// 预计趟数
estimatedAmount:"",// 预计金额（元）
settlementMethod:"",// 结算方式（1.月结 2.现结 3.第三方平台）
settlementPlatform:"",// 结算平台
remark: "" // 备注
}]
}
 */
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
    contractNo: "",// 合同号
    partyACompanyId: "",// 甲方单位
    partyBCompanyId: "",// 乙方单位
    // goodsItemId: "",// 货物
})

function load() {
    loading.value = true;
    searchContractPageList({
        page: pageCurrent.value,
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
const addContractRef = useTemplateRef('addContractRef');
function handleClickAdd() {
    addContractRef.value.open();
}
const viewContractRef = useTemplateRef('viewContractRef');
function handleClickView(item) {
    viewContractRef.value.open(item);
}
const editContractRef = useTemplateRef('editContractRef');
function handleClickEdit(item) {
    editContractRef.value.open(item);
}
const loadingDelete = ref(false);
function handleClickDelete(item) {
    loadingDelete.value = true;
    deleteContract({ contractId: item.contractId }).then(() => {
        ElMessage.success("删除成功");
        load();
    }).finally(() => {
        loadingDelete.value = false;
    });
}
function handleRowClick(row, column, event) {
    handleClickView(row);
}

function handleClickChangeStatus(row) {
    ElMessage.warning("变更状态功能暂未实现");
}

const allCompanyList = ref([]);
// const allGoodsItemList = ref([]);
function loadAllCompanyList() {
    if (allCompanyList.value.length > 0) return; // 如果已经加载过公司列表，则不再加载
    getAllCompanyList().then(res => {
        allCompanyList.value = res;
    });
}
// function loadAllGoodsItemList() {
//     if (allGoodsItemList.value.length > 0) return; // 如果已经加载过货物列表，则不再加载
//     getGoodsSimpleList().then(res => {
//         allGoodsItemList.value = res;
//     });
// }

const imageDialogRef = useTemplateRef('imageDialogRef');
function handleViewFiles(fileIdStr) {
    imageDialogRef.value.open(fileIdStr)
}
let tableHeight = ref(250);
const contractRef = useTemplateRef('contractRef');
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
    nextTick(() => {
        if (contractRef.value) {
            tableHeight.value = contractRef.value.clientHeight - 122;
        }
    })
}, { immediate: true })
onMounted(() => {
    load();
});

</script>

<style lang="less">
.contract {}
</style>