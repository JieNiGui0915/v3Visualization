<template>
    <el-dialog v-model="dialogVisible" title="编辑货主" width="60%" center top="10px" class="editShipper"
        @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
            <div class="flex_row">
                <div class="flex-1">
                    <el-form-item label="托运人编码" prop="shipperCode">
                        <el-input v-model="form.shipperCode" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="托运人简称" prop="shipperName">
                        <el-input v-model="form.shipperName" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="主体类型" prop="subjectType">
                        <el-select v-model="form.subjectType" placeholder="" clearable>
                            <el-option :label="item.label" :value="item.value" v-for="item in subjectTypeList"
                                :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="公司" prop="companyId">
                        <!-- <el-input v-model="form.companyId" placeholder="" clearable></el-input> -->
                        <el-select v-model="form.companyId" placeholder="" clearable>
                            <el-option :label="item.shortName" :value="item.companyId" v-for="item in allCompanyList"
                                :key="item.companyId">
                                <span class="option_left">{{ item.companyName }}</span>
                                <span class="option_left">{{ item.shortName }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>

                </div>
                <div class="flex-1">
                    <el-form-item label="自然人" prop="naturalPersonName">
                        <el-input v-model="form.naturalPersonName" clearable>
                            <template #append>
                                <MySelectStaff @change="handleNaturalPersonChange" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="联系人" prop="contactStaffName">
                        <el-input v-model="form.contactStaffName" clearable>
                            <template #append>
                                <MySelectStaff @change="handleContactStaffChange" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="业务代表" prop="agentStaffName">
                        <el-input v-model="form.agentStaffName" clearable>
                            <template #append>
                                <MySelectStaff @change="handleAgentStaffChange" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="托运人状态" prop="shipperStatus">
                        <el-select v-model="form.shipperStatus" placeholder="" clearable>
                            <el-option :label="item.label" :value="item.value"
                                v-for="item in shipperStatusList"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
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
import * as shipperApi from "@/api/api.shipper.js";
import { ElMessage } from "element-plus";
import { shipperStatusList, subjectTypeList } from "@/config/const";
import MySelectStaff from "@/components/form/my-select-staff.vue";
import { getAllCompanyList } from "@/api/api.company.js";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
    shipperId: "",// 托运人ID
    shipperCode: "",// 托运人编码
    shipperName: "",// 托运人简称
    subjectType: "",// 主体类型
    naturalPersonId: "",// 自然人ID
    naturalPersonName: "",// 自然人名称
    contactStaffId: "",// 联系人ID
    contactStaffName: "",// 联系人名称
    agentStaffId: "",// 业务代表ID
    agentStaffName: "",// 业务代表名称
    companyId: "",// 公司ID
    shipperStatus: "",// 托运人状态
    remark: ""// 备注
});

const open = (item) => {
    dialogVisible.value = true;
    Object.assign(form.value, item);
    loadCompanyList();
};
defineExpose({
    open
});

/** @type {FormRef} */
const formRef = ref(null);
const emit = defineEmits(['close']);
const rules = ref({
    shipperName: [
        { required: true, message: "请输入名称", trigger: "blur" },
    ],
})

const allCompanyList = ref([]);
function loadCompanyList() {
    getAllCompanyList().then(res => {
        allCompanyList.value = res;
    })
}

function handleNaturalPersonChange(val) {
    form.value.naturalPersonId = val.staffId;
    form.value.naturalPersonName = val.fullName;
}

function handleContactStaffChange(val) {
    form.value.contactStaffId = val.staffId;
    form.value.contactStaffName = val.fullName;
}

function handleAgentStaffChange(val) {
    form.value.agentStaffId = val.staffId;
    form.value.agentStaffName = val.fullName;
}

const submit = (formRef) => {
    if (!formRef) return;
    formRef.validate((valid) => {
        if (valid) {
            loading.value = true;
            shipperApi.editShipper(form.value).then(res => {
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
.editShipper {}
</style>
