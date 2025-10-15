<template>
    <el-dialog v-model="dialogVisible" title="确认关闭订单" width="60%" center top="10px" class="confirmCloseOrder"
        @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
        <el-form :model="data" class="view-form" :rules="rules" label-width="140" ref="formRef" status-icon
            v-loading="loading">
            <div class="flex_row">
                <div class="flex-1">
                    <el-form-item label="合同号" prop="contractNo">
                        {{ data.contractNo || form.contractNo }}
                    </el-form-item>
                    <el-form-item label="货主" prop="shipperName">
                        {{ data.shipperName || form.shipperName }}
                    </el-form-item>
                    <el-form-item label="货物" prop="goodsItemName">
                        {{ data.goodsItemName || form.goodsItemName }}
                    </el-form-item>
                    <el-form-item label="路线" prop="trucklineName">
                        {{ data.trucklineName || form.trucklineName }}
                    </el-form-item>
                    <el-form-item label="联系人姓名" prop="contactUserName">
                        {{ data.contactUserName }}
                    </el-form-item>
                    <el-form-item label="联系人电话" prop="contactPhone">
                        {{ data.contactPhone }}
                    </el-form-item>
                </div>
                <div class="flex-1">
                    <el-form-item label="订单号" prop="orderNumber">
                        {{ data.orderNumber }}
                    </el-form-item>
                    <el-form-item label="运量" prop="freightVolume">
                        {{ data.freightVolume }}
                    </el-form-item>
                    <el-form-item label="装货点" prop="loadAddress">
                        {{ data.loadAddress }}
                    </el-form-item>
                    <el-form-item label="卸货点" prop="unloadAddress">
                        {{ data.unloadAddress }}
                    </el-form-item>
                    <el-form-item label="起始时间" prop="beginTime">
                        {{ data.beginTime }}
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endTime">
                        {{ data.endTime }}
                    </el-form-item>
                </div>
                <div class="flex-1">
                    <el-form-item label="订单状态" prop="orderStatus">
                        <el-tag :type="orderStatusTagTypeMap[data.orderStatus]" disable-transitions>
                            {{ orderStatusMap[data.orderStatus] }}
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="运输要求" prop="transportRequire">
                        {{ data.transportRequire }}
                    </el-form-item>
                    <!-- <el-form-item label="订单文件集" prop="orderFileIds">
                        {{ data.orderFileIds }}
                    </el-form-item> -->
                    <el-form-item label="派车计划数量" prop="dispatchPlanCount">
                        {{ data.dispatchPlanCount }}
                    </el-form-item>
                    <el-form-item label="派车数量" prop="dispatchCount">
                        {{ data.dispatchCount }}
                    </el-form-item>
                    <el-form-item label="运单数量" prop="waybillCount">
                        {{ data.waybillCount }}
                    </el-form-item>
                    <el-form-item label="创建时间" prop="createTime">
                        {{ data.createTime }}
                    </el-form-item>
                </div>
            </div>
            <el-form-item label="备注" prop="remark">
                {{ data.remark }}
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="submit(formRef)" v-loading="loading" :disabled="countdown > 0">确定关闭 <span
                    v-if="countdown > 0">{{ countdown }}s</span></el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import * as orderApi from "@/api/api.order.js";
import { ElMessage } from "element-plus";
import { orderStatusTagTypeMap, orderStatusMap } from "@/config/const.js";

// 提交按钮倒数计时5秒
const countdown = ref(5);
const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({});
const data = ref({
    orderId: "",// 订单ID
    contractId: "",// 合同ID
    contractNo: "",// 合同号
    shipperId: "",// 货主ID
    shipperName: "",// 货主Name
    goodsItemId: "",// 货物ID
    goodsItemName: "",// 货物Name
    trucklineId: "",// 路线ID
    trucklineName: "",// 路线Name
    orderNumber: "",// 订单号
    freightVolume: "",// 运量
    loadAddress: "",// 装货点
    unloadAddress: "",// 卸货点
    beginTime: "",// 起始时间
    endTime: "",// 结束时间
    contactUserName: "",// 联系人姓名
    contactPhone: "",// 联系人电话
    orderStatus: "",// 订单状态
    transportRequire: "",// 运输要求
    orderFileIds: "",// 订单文件集
    remark: "",// 备注
    createTime: "",// 创建时间
    delFlag: "",// 删除标记
    dispatchPlanCount: "",// 派车计划数量
    dispatchCount: "",// 派车数量
    waybillCount: ""// 运单数量
})
/**
 * 打开弹窗
 * @param {form} item
 */
const open = (item) => {
    countdownTimer();
    dialogVisible.value = true;
    Object.assign(form.value, item);
    load();
};
defineExpose({
    open
});

const formRef = ref(null);
const emit = defineEmits(['close']);
const rules = ref({
    name: [
        { required: true, message: "请输入名称", trigger: ["blur", "change"] },
    ],
})


// 倒数计时
function countdownTimer() {
    if (countdown.value > 0) {
        countdown.value--;
        setTimeout(countdownTimer, 1000);
    }
}

function load() {
    loading.value = true;
    orderApi.getBeforeCloseOrderInfo(form.value.orderId).then(res => {
        data.value = res;
    }).finally(() => {
        loading.value = false;
    });
}


const submit = (formRef) => {
    if (!formRef) return;
    formRef.validate((valid) => {
        if (valid) {
            loading.value = true;
            orderApi.closeOrder(form.value.orderId).then(res => {
                ElMessage.success("订单关闭成功");
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
    countdown.value = 5; // 重置倒计时
}
</script>
<style lang="less">
.confirmCloseOrder {}
</style>
