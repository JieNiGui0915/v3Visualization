<template>
    <el-dialog v-model="dialogVisible" title="新增车队" width="60%" center top="10px" class="addFleet"
        @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
            <el-form-item label="车队编码" prop="fleetCode">
                <el-input v-model="form.fleetCode" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item label="车队名称" prop="fleetName">
                <el-input v-model="form.fleetName" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item label="主体类型" prop="subjectType">
                <el-select v-model="form.subjectType" placeholder="" clearable>
                    <el-option v-for="item in fleetSubjectTypeList" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="自然人" prop="naturalPersonId">
                <my-select-staff v-model="form.naturalPersonId" clearable @change="(data) => {
                    form.naturalPersonId = data.staffId;
                }"></my-select-staff>
            </el-form-item>
            <el-form-item label="联系人" prop="contactStaffId">
                <my-select-staff v-model="form.contactStaffId" clearable @change="(data) => {
                    form.contactStaffId = data.staffId;
                }"></my-select-staff>
            </el-form-item>
            <el-form-item label="业务代表" prop="agentStaffId">
                <my-select-staff v-model="form.agentStaffId" clearable @change="(data) => {
                    form.agentStaffId = data.staffId;
                }"></my-select-staff>
            </el-form-item>
            <el-form-item label="所属公司" prop="companyId">
                <el-select v-model="form.companyId" placeholder="" clearable filterable>
                    <el-option v-for="item in allCompanyList" :key="item.companyId" :label="item.customerName"
                        :value="item.companyId">
                        <span class="option_left">{{ item.shortName }}</span>
                        <span class="option_right">{{ item.customerName }}</span>
                    </el-option>
                </el-select>
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
import * as fleetApi from "@/api/api.fleet.js";
import { ElMessage } from "element-plus";
import mySelectStaff from "@/components/form/my-select-staff.vue";
import { getAllCompanyList } from "@/api/api.company.js";
import { fleetSubjectTypeList } from "@/config/const.js";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
    fleetId: "",// 车队ID
    fleetCode: "",// 车队编码
    fleetName: "",// 车队简称
    subjectType: "",// 主体类型，1-自然人，2-公司
    naturalPersonId: "",// 自然人ID
    contactStaffId: "",// 联系人ID，作为车队端用户
    agentStaffId: "",// 业务代表ID
    companyId: "",// 公司ID
    fleetStatus: "",// 车队状态，0-正常，1-停用，2-注册中
    remark: "",// 备注
    naturalPersonName: "",// 自然人姓名
    contactStaffName: "",// 联系人姓名
    agentStaffName: "",// 业务代表姓名
    companyName: "",// 公司名称
});

const open = (item) => {
    dialogVisible.value = true;
    loadCompanyList();
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
});

const allCompanyList = ref([]);
function loadCompanyList() {
    getAllCompanyList().then(res => {
        allCompanyList.value = res;
    })
}

const submit = (formRef) => {
    if (!formRef) return;
    formRef.validate((valid) => {
        if (valid) {
            loading.value = true;
            fleetApi.addFleet(form.value).then(res => {
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
.addFleet {}
</style>
