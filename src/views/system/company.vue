<template>
    <div class="company page-wrap" ref="companyRef">
        <div class="header">
            <el-input v-model.trim="search.address" class="width-200 mr-10" placeholder="经营地址" :prefix-icon="Search"
                @keyup.enter="handleSearch" @clear="handleSearch" clearable />
            <el-input v-model.trim="search.companyName" class="width-200 mr-10" placeholder="公司名称" :prefix-icon="Search"
                @keyup.enter="handleSearch" @clear="handleSearch" clearable />
            <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
            <div class="flex-1"></div>
            <el-button type="primary" plain size="default" @click="handleClickAdd">新增</el-button>
        </div>
        <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
            row-key="id" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class"
            v-loading="loading">
            <el-table-column fixed type="index" label="编号" width="40" align="center" />
            <el-table-column label="公司名称" prop="companyName" width="auto" align="center" show-overflow-tooltip />
            <el-table-column label="公司简称" prop="shortName" width="auto" align="center" show-overflow-tooltip />
            <el-table-column label="经营主体名称" prop="customerName" width="auto" align="center" show-overflow-tooltip />
            <el-table-column label="站台名称" prop="stationName" width="auto" align="center" show-overflow-tooltip />
            <el-table-column label="统一社会信用代码" prop="usciCode" width="auto" align="center" show-overflow-tooltip />
            <el-table-column label="经营地址" prop="address" width="auto" align="center" show-overflow-tooltip />
            <el-table-column label="电话号码" prop="phoneNumber" width="auto" align="center" show-overflow-tooltip />
            <el-table-column label="开户行" prop="depositBank" width="auto" align="center" show-overflow-tooltip />
            <el-table-column label="银行账号" prop="bankAccount" width="auto" align="center" show-overflow-tooltip />
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
        <addCompany ref="addCompanyRef" @close="closeDialog" />
        <editCompany ref="editCompanyRef" @close="closeDialog" />
    </div>
</template>

<script setup>
import { ref, useTemplateRef, onMounted, nextTick, watch } from 'vue';
import { GlobalStore } from "@/store/index.js";
import { Search } from "@element-plus/icons-vue";
import { searchCompanyPageList } from '@/api/api.company';
import addCompany from './components/addCompany.vue';
import editCompany from './components/editCompany.vue';

const loading = ref(false);
/**
{
companyId:'',// 公司ID
customerName:'',// 经营主体名称
shortName:'',// 公司简称
stationName:'',// 站台名称
usciCode:'',// 统一社会信用代码
address:'',// 经营地址
phoneNumber:'',// 电话号码
remark:'',// 备注
createTime:'',// 创建时间
depositBank:'',// 开户行
bankAccount:'',// 银行账号
certificateId:'',// 营业执照ID
companyStatus:'',// 公司状态
companyName:'',// 公司名称
}
 */
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
    companyName: "", // 公司名称
    address: "" // 经营地址
})

function load() {
    loading.value = true;
    searchCompanyPageList({
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
const addCompanyRef = useTemplateRef('addCompanyRef');
function handleClickAdd() {
    addCompanyRef.value.open();
}
const editCompanyRef = useTemplateRef('editCompanyRef');
function handleClickEdit(item) {
    editCompanyRef.value.open(item);
}
function handleClickDelete(item) {
}
function handleRowClick(row, column, event) {
}
let tableHeight = ref(250);
const companyRef = useTemplateRef('companyRef');
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
    nextTick(() => {
        if (companyRef.value) {
            tableHeight.value = companyRef.value.clientHeight - 122;
        }
    })
}, { immediate: true })
onMounted(() => {
    load();
});

</script>

<style lang="less">
.company {}
</style>