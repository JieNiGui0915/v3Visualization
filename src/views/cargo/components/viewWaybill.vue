<template>
    <el-dialog v-model="dialogVisible" title="查看运单" width="60%" center top="10px" class="viewWaybill"
        :close-on-click-modal="false">
        <el-form class="view-form" :model="form" label-width="140" ref="formRef" status-icon v-loading="loading">
            <div class="flex_row">
                <div class="flex-1">
                    <el-form-item label="运单号" prop="">
                        {{ form.orderNo }}
                    </el-form-item>
                    <el-form-item label="车队" prop="">
                        {{ form.fleetName }}
                    </el-form-item>
                    <el-form-item label="司机姓名" prop="">
                        {{ form.driverFullName }}
                    </el-form-item>
                    <el-form-item label="车牌号" prop="">
                        {{ form.licensePlateNumber }}
                    </el-form-item>
                    <el-form-item label="运单时间" prop="">
                        {{ form.waybillTime }}
                    </el-form-item>
                    <el-form-item label="发货净重(t)" prop="">
                        {{ form.sendSuttle }}
                    </el-form-item>
                    <el-form-item label="收货净重(t)" prop="">
                        {{ form.receiveSuttle }}
                    </el-form-item>
                    <el-form-item label="结算重量(t)" prop="">
                        {{ form.settleWeight }}
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        {{ form.remark }}
                    </el-form-item>
                    <el-form-item label="运单文件" prop="">
                        <span v-if="!form.waybillFileIds">-</span>
                        <span v-else class="link" @click.self.stop="handleViewFiles(form.waybillFileIds)">查看文件({{
                            form.waybillFileIds.split(",").length }}个)</span>
                    </el-form-item>
                </div>
                <div class="flex-1">
                    <el-form-item label="损耗量(t)" prop="">
                        {{ form.lossWeight }}
                    </el-form-item>
                    <el-form-item label="损耗率(%)" prop="">
                        {{ form.lossRate }}
                    </el-form-item>
                    <el-form-item label="损耗率异常(%)" prop="">
                        {{ form.lossRateAbnormal }}
                    </el-form-item>
                    <el-form-item label="装车方式" prop="">
                        {{ form.loadingWay }}
                    </el-form-item>
                    <el-form-item label="装车铲数" prop="">
                        {{ form.spadeNumber }}
                    </el-form-item>
                    <el-form-item label="毛重磅号" prop="">
                        {{ form.grossWeighbridge }}
                    </el-form-item>
                    <el-form-item label="皮重磅号" prop="">
                        {{ form.tareWeighbridge }}
                    </el-form-item>
                    <el-form-item label="运单状态" prop="">
                        <el-tag :type="waybillStatusTagTypeMap[form.waybillStatus] || ''" disable-transitions>
                            {{ waybillStatusMap[form.waybillStatus] || "" }}
                        </el-tag>
                    </el-form-item>
                </div>
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
import { waybillStatusMap, waybillStatusTagTypeMap } from "@/config/const.js";
import ImageDialog from "@/components/form/image-dialog.vue";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
    waybillTime: "",// 运单时间，刚发货时为发货时间，收货后为收货时间
    sendSuttle: "",// 发货净重
    receiveSuttle: "",// 收货净重
    settleWeight: "",// 结算重量，刚发货时为发货净重，收货后为收货净重
    lossWeight: "",// 损耗量
    lossRate: "",// 损耗率
    lossRateAbnormal: "",// 损耗率异常
    loadingWay: "",// 装车方式
    spadeNumber: "",// 装车铲数
    grossWeighbridge: "",// 毛重磅号
    tareWeighbridge: "",// 皮重磅号
    waybillStatus: "",// 运单状态，0
    remark: "",// 备注
    createUser: "",// 创建人
    createTime: "",// 创建时间
    waybillFileIds: "",// 运单图片集
    driverFullName: "",// 司机姓名
    licensePlateNumber: "",// 车牌号
    dispatchNumber: "",// 派车单号
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
.viewWaybill {}
</style>
