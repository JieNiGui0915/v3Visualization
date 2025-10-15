<template>
    <el-dialog v-model="dialogVisible" title="查看合同" width="98%" center top="10px" class="viewContract"
        :close-on-click-modal="false">
        <el-form class="view-form" :model="form" label-width="140" ref="formRef" status-icon v-loading="loading">
            <div class="flex_row">
                <div class="flex-1">
                    <el-form-item label="合同号" prop="contractNo">
                        {{ form.contractNo }}
                    </el-form-item>
                    <el-form-item label="甲方单位" prop="">
                        {{ form.partyACompanyName }}
                    </el-form-item>
                    <el-form-item label="乙方单位" prop="">
                        {{ form.partyBCompanyName }}
                    </el-form-item>
                    <!-- <el-form-item label="货物" prop="">
                        {{ form.goodsItemName }}
                    </el-form-item>
                    <el-form-item label="发货单位" prop="">
                        {{ form.deliveryCompanyName }}
                    </el-form-item>
                    <el-form-item label="装货点" prop="">
                        {{ form.loadingGoodsYardName }}
                    </el-form-item>
                    <el-form-item label="收货单位" prop="">
                        {{ form.receivingCompanyName }}
                    </el-form-item>
                    <el-form-item label="卸货点" prop="">
                        {{ form.unloadingGoodsYardName }}
                    </el-form-item> -->
                    <el-form-item label="备注" prop="remark">
                        {{ form.remark }}
                    </el-form-item>
                    <el-form-item label="合同文件" prop="contractFileIds">
                        <span v-if="!form.contractFileIds">-</span>
                        <span v-else class="link" @click.self.stop="handleViewFiles(form.contractFileIds)">查看文件({{
                            form.contractFileIds.split(",").length }}个)</span>
                    </el-form-item>
                </div>
                <div class="flex-1">
                    <!-- <el-form-item label="计价方式" prop="pricingMethod">
                        {{ pricingMethodMap[form.pricingMethod] || "" }}
                    </el-form-item>
                    <el-form-item label="单价（元）" prop="unitPrice">
                        {{ form.unitPrice }}
                    </el-form-item>
                    <el-form-item label="预计吨数" prop="estimatedTonnage">
                        {{ form.estimatedTonnage }}
                    </el-form-item>
                    <el-form-item label="预计趟数" prop="estimatedTrips">
                        {{ form.estimatedTrips }}
                    </el-form-item>
                    <el-form-item label="预计金额（元）" prop="estimatedAmount">
                        {{ form.estimatedAmount }}
                    </el-form-item>
                    <el-form-item label="结算方式" prop="settlementMethod">
                        {{ settlementMethodMap[form.settlementMethod] || "" }}
                    </el-form-item>
                    <el-form-item label="结算平台" prop="settlementPlatform">
                        {{ form.settlementPlatform }}
                    </el-form-item> -->
                    <el-form-item label="合同开始日期" prop="startDate">
                        {{ formatDate(form.startDate) }}
                    </el-form-item>
                    <el-form-item label="合同结束日期" prop="endDate">
                        {{ formatDate(form.endDate) }}
                    </el-form-item>
                    <el-form-item label="合同状态" prop="contractStatus">
                        <el-tag :type="contractStatusTagTypeMap[form.contractStatus] || ''" disable-transitions>
                            {{ contractStatusMap[form.contractStatus] || "" }}
                        </el-tag>
                    </el-form-item>
                </div>
            </div>
            <div class="flex_row">
                <el-form-item label="合同子项" required>
                    <div class="table_wrap">
                        <el-table :data="form.items" border>
                            <el-table-column prop="contractItemName" label="子项名称" align="center">
                                <template #default="{ row }">
                                    {{ row.contractItemName || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="goodsItemName" label="货物名称" align="center">
                                <template #default="{ row }">
                                    {{ row.goodsItemName || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="deliveryCompanyName" label="发货单位" align="center">
                                <template #default="{ row }">
                                    {{ row.deliveryCompanyName || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="loadingGoodsYardName" label="装货点" align="center">
                                <template #default="{ row }">
                                    {{ row.loadingGoodsYardName || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="receivingCompanyName" label="收货单位" align="center">
                                <template #default="{ row }">
                                    {{ row.receivingCompanyName || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="unloadingGoodsYardName" label="卸货点" align="center">
                                <template #default="{ row }">
                                    {{ row.unloadingGoodsYardName || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="pricingMethod" label="计价方式" align="center">
                                <template #default="{ row }">
                                    {{ pricingMethodMap[row.pricingMethod] || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="unitPrice" label="单价（元）" align="center" width="80">
                                <template #default="{ row }">
                                    {{ row.unitPrice || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="estimatedTonnage" label="预计吨数" align="center">
                                <template #default="{ row }">
                                    {{ row.estimatedTonnage || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="estimatedTrips" label="预计趟数" align="center">
                                <template #default="{ row }">
                                    {{ row.estimatedTrips || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="estimatedAmount" label="预计金额（元）" align="center">
                                <template #default="{ row }">
                                    {{ row.estimatedAmount || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="assessmentLossTonnage" label="考核亏吨" align="center">
                                <template #default="{ row }">
                                    {{ row.assessmentLossTonnage ? '是' : '否' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="lossTonnageAssessmentIndex" label="亏吨考核指标(%)" width="120"
                                align="center">
                                <template #default="{ row }">
                                    {{ row.lossTonnageAssessmentIndex || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="settlementMethod" label="结算方式" align="center">
                                <template #default="{ row }">
                                    {{ settlementMethodMap[row.settlementMethod] || '-' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="settlementPlatform" label="结算平台" align="center">
                                <template #default="{ row }">
                                    {{ row.settlementPlatform || '-' }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="close(formRef)" v-loading="loading">关闭</el-button>
        </template>
        <image-dialog ref="imageDialogRef"></image-dialog>
    </el-dialog>
</template>
<script setup>
import { ref, useTemplateRef } from "vue";
import * as contractApi from "@/api/api.contract.js";
import { ElMessage } from "element-plus";
import { pricingMethodMap, settlementMethodMap } from "@/config/const.js";
import { getAllCompanyList } from "@/api/api.company.js";
import { getStationList } from "@/api/api.station.js";
import { getGoodsSimpleList } from "@/api/api.goods.js";
import { formatDate } from "@/utils/util.js";
import { contractStatusMap, contractStatusTagTypeMap } from "@/config/const.js";
import ImageDialog from "@/components/form/image-dialog.vue";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
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
        contractItemId: "",// 主键
        contractId: "",// 合同id
        contractItemName: "",// 合同子项名称
        goodsItemName: "",// 货物名称
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
});

const open = (item) => {
    Object.assign(form.value, item);
    dialogVisible.value = true;
};
defineExpose({
    open
});

const imageDialogRef = useTemplateRef("imageDialogRef");
function handleViewFiles(fileIdStr) {
    imageDialogRef.value.open(fileIdStr)
}
const close = () => {
    dialogVisible.value = false;
}
</script>
<style lang="less">
.viewContract {}
</style>
