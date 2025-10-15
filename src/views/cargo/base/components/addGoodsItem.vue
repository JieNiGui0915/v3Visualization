<template>
    <el-dialog v-model="dialogVisible" title="新增货物" width="60%" center top="10px" class="addGoodsItem"
        @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
            <el-form-item label="货物编码" prop="goodsItemCode">
                <el-input v-model="form.goodsItemCode" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item label="货物名称" prop="goodsItemName">
                <el-input v-model="form.goodsItemName" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item label="货物种类" prop="goodsType">
                <el-select v-model="form.goodsType" placeholder="请选择货物种类" clearable>
                    <el-option v-for="item in goodsTypeList" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="首选车型" prop="primaryVehicleType">
                <el-select v-model="form.primaryVehicleType" placeholder="请选择首选车型" clearable>
                    <el-option v-for="item in primaryVehicleTypeList" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="货物状态" prop="goodsItemStatus">
                <el-select v-model="form.goodsItemStatus" placeholder="请选择货物状态" clearable>
                    <el-option v-for="item in goodsStatusList" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="" clearable></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="submit(formRef)" v-loading="loading">提交</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import * as goodsApi from "@/api/api.goods.js";
import { ElMessage } from "element-plus";
import { goodsTypeList, goodsStatusList, primaryVehicleTypeList } from "@/config/const.js";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
    goodsItemId: "",// 货物ID
    goodsItemCode: "",// 货物编码
    goodsItemName: "",// 货物名称
    goodsType: "",// 货物种类
    primaryVehicleType: "",// 首选车型
    goodsItemStatus: "",// 货物状态
    remark: "",// 备注
});

const open = (item) => {
    dialogVisible.value = true;
};
defineExpose({
    open
});

/** @type {FormRef} */
const formRef = ref(null);
const emit = defineEmits(['close']);
const rules = ref({
    goodsItemName: [
        { required: true, message: "请输入名称", trigger: "blur" },
    ],
})

const submit = (formRef) => {
    if (!formRef) return;
    formRef.validate((valid) => {
        if (valid) {
            loading.value = true;
            goodsApi.addGoodsItem(form.value).then(res => {
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
.addGoodsItem {}
</style>
