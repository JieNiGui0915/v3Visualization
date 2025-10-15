<template>
    <el-dialog v-model="dialogVisible" title="编辑停车位" width="600" center top="10px" class="editParkingSpace"
        @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
            <el-form-item label="充电站" prop="stationId">
                <el-select v-model="form.stationId" placeholder="选择充电站" :prefix-icon="Search" clearable
                    v-loading="loadingStationList">
                    <el-option v-for="item in stationList" :key="item.stationId" :label="item.name"
                        :value="item.stationId" />
                </el-select>
            </el-form-item>
            <el-form-item label="停车位编号" prop="parkingSpaceCode">
                <el-input v-model="form.parkingSpaceCode" placeholder="" clearable></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="submit(formRef)" v-loading="loading">提交</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import * as parkingApi from "@/api/api.parkingSpace.js";
import { ElMessage } from "element-plus";
import { getAllStationSimpleList } from '@/api/api.pile';

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
    parkingSpaceId: "",//停车位ID
    stationId: "",// 场站ID
    parkingSpaceCode: "",// 停车位编号
});

const open = (item) => {
    dialogVisible.value = true;
    Object.assign(form.value, item);
    loadStationList();
};
defineExpose({
    open
});

const stationList = ref([]);
const loadingStationList = ref(false);
function loadStationList() {
    loadingStationList.value = true;
    getAllStationSimpleList().then(res => {
        stationList.value = res;
        if (res.length === 1) {
            form.value.stationId = res[0].stationId;
        }
    }).finally(() => {
        loadingStationList.value = false;
    });
}

/** @type {formRef} */
const formRef = ref(null);
const emit = defineEmits(['close']);
const rules = ref({
    stationId: [
        { required: true, message: "请选择充电站", trigger: ["blur", "change"] },
    ],
    parkingSpaceCode: [
        { required: true, message: "请输入停车位编号", trigger: ["blur", "change"] },
    ],
})

const submit = (formRef) => {
    if (!formRef) return;
    formRef.validate((valid) => {
        if (valid) {
            loading.value = true;
            parkingApi.editParkingSpace(form.value).then(res => {
                ElMessage.success("编辑成功");
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
.editParkingSpace {}
</style>
