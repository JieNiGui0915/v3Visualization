<template>
    <el-dialog v-model="dialogVisible" title="修改公司" width="60%" center top="10px" class="editCompany" destroy-on-close
        @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
            <div class="flex_row">
                <div class="flex-1">
                    <el-form-item label="公司名称" prop="companyName">
                        <el-input v-model="form.companyName" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="公司简称" prop="shortName">
                        <el-input v-model="form.shortName" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="经营主体名称" prop="customerName">
                        <el-input v-model="form.customerName" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="统一社会信用代码" prop="usciCode">
                        <el-input v-model="form.usciCode" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phoneNumber">
                        <el-input v-model="form.phoneNumber" placeholder="" clearable></el-input>
                    </el-form-item>
                </div>
                <div class="flex-1">

                    <el-form-item label="开户行" prop="depositBank">
                        <el-input v-model="form.depositBank" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="银行账号" prop="bankAccount">
                        <el-input v-model="form.bankAccount" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="经营地址" prop="address">
                        <el-input v-model="form.address" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="站台名称" prop="stationName">
                        <el-input v-model="form.stationName" placeholder="" clearable></el-input>
                    </el-form-item>
                </div>
            </div>
            <!-- <el-form-item label="营业执照" prop="certificateId">

            </el-form-item> -->
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
import * as companyApi from "@/api/api.company.js";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
    companyName: '',// 公司名称
    customerName: '',// 经营主体名称
    shortName: '',// 公司简称
    stationName: '',// 站台名称
    usciCode: '',// 统一社会信用代码
    address: '',// 经营地址
    phoneNumber: '',// 电话号码
    remark: '',// 备注
    createTime: '',// 创建时间
    depositBank: '',// 开户行
    bankAccount: '',// 银行账号
    certificateId: '',// 营业执照ID
    companyStatus: '',// 公司状态
});

const open = (item) => {
    Object.assign(form.value, item);
    dialogVisible.value = true;
};
defineExpose({
    open
});

const formRef = ref(null);
const emit = defineEmits(['close']);
const rules = ref({
    companyName: [
        { required: true, message: "请输入名称", trigger: ["blur", "change"] },
    ],
    shortName: [
        { required: true, message: "请输入公司简称", trigger: ["blur", "change"] },
    ],
})

const submit = (formRef) => {
    if (!formRef) return;
    formRef.validate((valid) => {
        if (valid) {
            loading.value = true;
            companyApi.editCompany(form.value).then(res => {
                ElMessage.success("修改成功");
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
.editCompany {}
</style>
