<template>
    <el-dialog v-model="dialogVisible" title="新增充电车位" width="600" center top="10px" class="addChargingSpace"
        @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
            <el-form-item label="充电站" prop="stationId">
                <el-select v-model="form.stationId" placeholder="选择充电站" clearable v-loading="loadingStationList"
                    @change="handleStationChange">
                    <el-option v-for="item in stationList" :key="item.stationId" :label="item.name"
                        :value="item.stationId" />
                </el-select>
            </el-form-item>
            <el-form-item label="充电枪" prop="pileGunIds">
                <el-select v-model="form.pileGunIdList" placeholder="选择充电枪" clearable v-loading="loadingPileGunList"
                    @change="handlePileGunChange" multiple>
                    <el-option v-for="item in pileGunList" :key="item.pileGunId" :label="item.pileGunCode"
                        :value="item.pileGunId">
                        <span class="option_left">{{ item.pileGunCode }}</span>
                        <span class="option_right">{{ item.ratePower }} W</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="充电车位编号" prop="chargingSpaceCode">
                <el-input v-model="form.chargingSpaceCode" placeholder="" clearable></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="submit(formRef)" v-loading="loading">提交</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import * as chargingSpaceApi from "@/api/api.chargingSpace.js";
import { ElMessage } from "element-plus";
import { getAllStationSimpleList, getPileGunListByStationId } from '@/api/api.pile';

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
    chargingSpaceId: "",// 充电车位ID
    stationId: "",// 充电站ID
    chargingSpaceCode: "",// 充电车位编号
    pileIds: "",// 充电桩IDs
    pileIdList: [],// 充电桩IDs
    pileGunIds: "",// 充电枪IDs
    pileGunIdList: [],// 充电枪IDs
});

const open = (item) => {
    dialogVisible.value = true;
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
            loadPileGunList();
        }
    }).finally(() => {
        loadingStationList.value = false;
    });
}

function handleStationChange() {
    form.value.pileGunIds = "";
    loadPileGunList();
}

const pileGunList = ref([]);
let pileGunMap = {};
const loadingPileGunList = ref(false);
function loadPileGunList() {
    if (!form.value.stationId) {
        pileGunList.value = [];
        pileGunMap = {};
        return;
    };
    loadingPileGunList.value = true;
    getPileGunListByStationId(form.value.stationId).then(res => {
        pileGunList.value = res;
        pileGunMap = res.reduce((map, item) => {
            map[item.pileGunId] = item;
            return map;
        }, {});
        if (res.length === 1) {
            form.value.pileGunIds = res[0].pileGunIds;
        }
    }).finally(() => {
        loadingPileGunList.value = false;
    });
}

function handlePileGunChange() {
    form.value.pileGunIds = form.value.pileGunIdList.map(p => {
        return pileGunMap[p].pileGunId;
    }).join(",")
    form.value.pileIds = form.value.pileGunIdList.map(p => {
        return pileGunMap[p].pileId;
    }).join(",");
}

/** @type {formRef} */
const formRef = ref(null);
const emit = defineEmits(['close']);
const rules = ref({
    stationId: [
        { required: true, message: "请选择充电站", trigger: ["blur", "change"] },
    ],
    chargingSpaceCode: [
        { required: true, message: "请输入充电车位编号", trigger: ["blur", "change"] },
    ]
})

const submit = (formRef) => {
    if (!formRef) return;
    formRef.validate((valid) => {
        if (valid) {
            loading.value = true;
            chargingSpaceApi.addChargingSpace(form.value).then(res => {
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
.addChargingSpace {}
</style>
