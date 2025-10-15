<template>
    <el-dialog v-model="dialogVisible" title="新增合同" width="98%" center top="10px" class="addContract"
        @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
            <div class="flex_row">
                <div class="flex-1">
                    <el-form-item label="合同号" prop="contractNo">
                        <el-input v-model="form.contractNo" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="甲方单位" prop="partyACompanyId">
                        <el-select v-model="form.partyACompanyId" placeholder="" clearable
                            :loading="loadingCompanyList">
                            <el-option v-for="item in allCompanyList" :key="item.companyId" :label="item.shortName"
                                :value="item.companyId">
                                <span class="option_left">{{ item.shortName }}</span>
                                <span class="option_right">{{ item.customerName }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="乙方单位" prop="partyBCompanyId">
                        <el-select v-model="form.partyBCompanyId" placeholder="" clearable
                            :loading="loadingCompanyList">
                            <el-option v-for="item in allCompanyList" :key="item.companyId" :label="item.shortName"
                                :value="item.companyId">
                                <span class="option_left">{{ item.shortName }}</span>
                                <span class="option_right">{{ item.customerName }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="flex-1">
                    <el-form-item label="合同开始日期" prop="startDate">
                        <el-date-picker v-model="form.startDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                            type="date" placeholder="" clearable></el-date-picker>
                    </el-form-item>
                    <el-form-item label="合同结束日期" prop="endDate">
                        <el-date-picker v-model="form.endDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date"
                            placeholder="" clearable></el-date-picker>
                    </el-form-item>
                    <el-form-item label="合同状态" prop="contractStatus">
                        <el-select v-model="form.contractStatus" placeholder="">
                            <el-option v-for="(item, index) in contractStatusList" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div class="flex_row">
                <el-form-item label="合同子项" required>
                    <div class="table_wrap">
                        <el-table :data="form.items" border>
                            <el-table-column prop="contractItemName" label="子项名称" align="center">
                                <template #default="{ row }">
                                    <el-input v-model="row.contractItemName" placeholder="" clearable></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="goodsItemName" label="货物名称" align="center">
                                <template #default="{ row }">
                                    <el-select v-model="row.goodsItemId" placeholder="" clearable
                                        :loading="loadingGoodsItem">
                                        <el-option v-for="item in goodsItemList" :key="item.goodsItemId"
                                            :label="item.goodsItemName" :value="item.goodsItemId"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="deliveryCompanyName" label="发货单位" align="center">
                                <template #default="{ row }">
                                    <el-select v-model="row.deliveryCompanyId" placeholder="" clearable
                                        :loading="loadingCompanyList">
                                        <el-option v-for="item in allCompanyList" :key="item.companyId"
                                            :label="item.shortName" :value="item.companyId">
                                            <span class="option_left">{{ item.shortName }}</span>
                                            <span class="option_right">{{ item.customerName }}</span>
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="loadingGoodsYardName" label="装货点" align="center">
                                <template #default="{ row }">
                                    <el-select v-model="row.loadingGoodsYardId" placeholder="" clearable
                                        :loading="loadingStationList">
                                        <el-option v-for="item in allStationList" :key="item.goodsYardId"
                                            :label="item.goodsYardName" :value="item.goodsYardId"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="receivingCompanyName" label="收货单位" align="center">
                                <template #default="{ row }">
                                    <el-select v-model="row.receivingCompanyId" placeholder="" clearable
                                        :loading="loadingCompanyList">
                                        <el-option v-for="item in allCompanyList" :key="item.companyId"
                                            :label="item.shortName" :value="item.companyId">
                                            <span class="option_left">{{ item.shortName }}</span>
                                            <span class="option_right">{{ item.customerName }}</span>
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="unloadingGoodsYardName" label="卸货点" align="center">
                                <template #default="{ row }">
                                    <el-select v-model="row.unloadingGoodsYardId" placeholder="" clearable
                                        :loading="loadingStationList">
                                        <el-option v-for="item in allStationList" :key="item.goodsYardId"
                                            :label="item.goodsYardName" :value="item.goodsYardId"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="pricingMethod" label="计价方式" align="center">
                                <template #default="{ row }">
                                    <el-select v-model="row.pricingMethod" placeholder="" clearable>
                                        <el-option v-for="item in pricingMethodList" :key="item.value"
                                            :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="unitPrice" label="单价（元）" align="center" width="80">
                                <template #default="{ row }">
                                    <el-input v-model="row.unitPrice" placeholder="" clearable></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="estimatedTonnage" label="预计吨数" align="center">
                                <template #default="{ row }">
                                    <el-input v-model="row.estimatedTonnage" placeholder="" clearable></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="estimatedTrips" label="预计趟数" align="center">
                                <template #default="{ row }">
                                    <el-input v-model="row.estimatedTrips" type="number" placeholder=""
                                        clearable></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="estimatedAmount" label="预计金额（元）" align="center">
                                <template #default="{ row }">
                                    <el-input v-model="row.estimatedAmount" type="number" placeholder=""
                                        clearable></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="assessmentLossTonnage" label="考核亏吨" align="center">
                                <template #default="{ row }">
                                    <el-select v-model="row.assessmentLossTonnage" placeholder="" clearable>
                                        <el-option v-for="item in [{ value: 1, label: '是' }, { value: 0, label: '否' }]"
                                            :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="lossTonnageAssessmentIndex" label="亏吨考核指标(%)" align="center">
                                <template #default="{ row }">
                                    <el-input v-model="row.lossTonnageAssessmentIndex" type="number" placeholder=""
                                        clearable></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="settlementMethod" label="结算方式" align="center">
                                <template #default="{ row }">
                                    <el-select v-model="row.settlementMethod" placeholder="" clearable>
                                        <el-option v-for="item in settlementMethodList" :key="item.value"
                                            :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="settlementPlatform" label="结算平台" align="center">
                                <template #default="{ row }">
                                    <el-input v-model="row.settlementPlatform" placeholder="" clearable></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="操作" align="center" width="50">
                                <template #default="{ $index }">
                                    <el-button link type="danger" @click="form.items.splice($index, 1)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="width-100p text-align-right">
                            <el-button class="" type="primary" :icon="Plus" link
                                @click="handleAddNewItem">新增子项</el-button>
                        </div>
                    </div>
                </el-form-item>
            </div>
            <el-form-item label="合同文件" prop="contractFileIds">
                <my-upload ref="myUploadRef" :file-ids="form.contractFileIds" type="contract" @success="uploadSuccessFn"
                    @uploading="uploadingFn"></my-upload>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="form.remark" placeholder="" autosize clearable></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="submit(formRef)" v-loading="loading">提交</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import * as contractApi from "@/api/api.contract.js";
import { ElMessage } from "element-plus";
import { Plus } from '@element-plus/icons-vue'
import { pricingMethodList, settlementMethodList } from "@/config/const.js";
import { getAllCompanyList } from "@/api/api.company.js";
import { getStationList } from "@/api/api.station.js";
import { getGoodsSimpleList } from "@/api/api.goods.js";
import MyUpload from "@/components/form/my-upload.vue";
import { deepCopy } from "@/utils/util";
import { contractStatusList } from "@/config/const.js";

const dialogVisible = ref(false);
const loading = ref(false);
const formCache = {
    contractId: "",// 主键
    contractNo: "",// 合同号
    partyACompanyName: "",// 甲方单位
    partyBCompanyName: "",// 乙方单位
    startDate: "",// 起始日期
    endDate: "",// 结束日期
    contractStatus: "",// 合同状态
    delFlag: "",// 删除标志 0.未删除 1.已删除
    createUser: "",// 创建人
    createTime: "",// 创建时间
    remark: "",// 备注
    contractFileIds: "",// 合同附件ID列表
    items: [{
        contractItemId: "",// 合同子项ID
        contractItemName: "",// 合同子项名称
        goodsItemName: "",// 
        deliveryCompanyName: "",// 发货单位
        loadingGoodsYardName: "",// 装货点
        receivingCompanyName: "",// 收货单位
        unloadingGoodsYardName: "",// 卸货点
        pricingMethod: "",// 计价方式（1.计吨 2.计趟 3.一口价）
        unitPrice: "",// 单价（元）
        estimatedTonnage: "",// 预计吨数
        estimatedTrips: "",// 预计趟数
        estimatedAmount: "",// 预计金额（元）
        assessmentLossTonnage: "",// 是否考核亏吨 1.是 0.否
        lossTonnageAssessmentIndex: "",// 亏吨考核指标(%)
        settlementMethod: "",// 结算方式（1.月结 2.现结 3.第三方平台）
        settlementPlatform: "",// 结算平台
        remark: "" // 备注
    }]
}
const form = ref(deepCopy(formCache));

const open = (item) => {
    dialogVisible.value = true;
    form.value = deepCopy(formCache);
    loadCompanyList();
    loadAllGoodsItem();
    loadStationList();
};
defineExpose({
    open
});

const formRef = ref(null);
const emit = defineEmits(['close']);
const rules = ref({
    contractNo: [
        { required: true, message: "请输入合同号", trigger: ["blur", "change"] },
    ],
    contractStatus: [
        { required: true, message: "请选择合同状态", trigger: ["blur", "change"] },
    ],
})


const allCompanyList = ref([]);
const loadingCompanyList = ref(false);
function loadCompanyList() {
    loadingCompanyList.value = true;
    getAllCompanyList().then(res => {
        allCompanyList.value = res;
    }).finally(() => {
        loadingCompanyList.value = false;
    });
}

const loadingGoodsItem = ref(false);
const goodsItemList = ref([]);

function loadAllGoodsItem() {
    loadingGoodsItem.value = true;
    getGoodsSimpleList().then(res => {
        goodsItemList.value = res;
    }).finally(() => {
        loadingGoodsItem.value = false;
    });
}

const allStationList = ref([]);
const loadingStationList = ref(false);
function loadStationList() {
    getStationList().then(res => {
        allStationList.value = res;
    });
}

// region 上传
function uploadSuccessFn(res) {
    form.value.contractFileIds = res.map(p => p.data.fileId).join(",");
}

function uploadingFn(val) {
    loading.value = val;
}

// endregion

function handleAddNewItem() {
    form.value.items.push(deepCopy(formCache.items[0]));
}

const submit = (formRef) => {
    if (!formRef) return;
    if (!form.value.items || form.value.items.length === 0) {
        ElMessage.error("请至少添加一个合同子项");
        return;
    }

    formRef.validate((valid) => {
        if (valid) {
            let errMsg = "";
            form.value.items.forEach((item, index) => {
                if (!item.contractItemName) {
                    errMsg += `第${index + 1}行合同子项名称不能为空；`;
                }
                if (!item.goodsItemId) {
                    errMsg += `第${index + 1}行货物名称不能为空；`;
                }
                if (item.assessmentLossTonnage) {
                    if (!item.lossTonnageAssessmentIndex) {
                        errMsg += `第${index + 1}行亏吨考核指标不能为空；`;
                    }
                }
            });
            if (errMsg) {
                ElMessage.error(errMsg);
                return;
            }

            loading.value = true;
            contractApi.addContract(form.value).then(res => {
                ElMessage.success("添加成功");
                emit("close", true);
                dialogVisible.value = false;
            }).finally(() => {
                loading.value = false;
            })
        }
    });
}

const handleClosedDialog = (formRef) => {
    if (formRef) formRef.resetFields();
}
</script>
<style lang="less">
.addContract {}
</style>
