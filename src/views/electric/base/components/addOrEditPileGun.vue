<template>
    <el-dialog v-model="dialogVisible" title="充电枪" width="60%" center top="10px" class="addOrEditPileGun"
        destroy-on-close :close-on-click-modal="false">
        <el-table :data="form.pileGunList" class="table" border highlight-current-row scrollbar-always-on
            row-class-name="table-row-class">
            <el-table-column fixed type="index" label="#" width="40" align="center" />
            <el-table-column fixed label="数字编码" prop="pileGunNo" width="auto" align="center" show-overflow-tooltip>
                <template #default="scope">
                    <el-input v-model="scope.row.pileGunNo" placeholder="请输入数字编码" clearable></el-input>
                </template>
            </el-table-column>
            <el-table-column fixed label="设备编码" prop="pileGunCode" width="auto" align="center" show-overflow-tooltip>
                <template #default="scope">
                    <el-input v-model="scope.row.pileGunCode" placeholder="请输入设备编码" clearable></el-input>
                </template>
            </el-table-column>
            <el-table-column fixed label="枪口号" prop="pileGunName" width="auto" align="center" show-overflow-tooltip>
                <template #default="scope">
                    <el-input v-model="scope.row.pileGunName" placeholder="请输入枪口号" clearable>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="功率(kWh)" prop="ratePower" width="auto" align="center" show-overflow-tooltip>
                <template #default="scope">
                    <el-input v-model.number="scope.row.ratePower" placeholder="请输入功率(kWh)" clearable></el-input>
                </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip>
                <template #default="scope">
                    <el-input v-model="scope.row.remark" type="textarea" autosize placeholder="请输入备注"
                        clearable></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center" @click.stop.prevent.self>
                <template #default="scope">
                    <el-button link type="danger" @click.stop="handleClickDelete(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="flex_row">
            <div class="flex-1"></div>
            <el-button type="default" class="mt-10" @click="handleAddNew">新增充电桩</el-button>
        </div>
        <template #footer>
            <el-button type="primary" @click="submit(formRef)" v-loading="loading">确定</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import * as dictApi from "@/api/api.dict.js";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
    "pileId": "",
    "stationId": "",
    "pileCode": "",
    "pileType": "",
    "pileName": "",
    "pileStatus": null,
    "gunNum": null,
    "deviceMode": "",
    "operatorCompanyName": "",
    "stationName": "",
    "acDcType": null,
    "ratePower": null,
    "supplierName": "",
    "protocolName": "",
    "remark": "",
    "pileGunList": [
        {
            "pileGunId": "", //充电桩枪id
            "pileId": "", // 充电桩id
            "pileGunNo": null,// 数字编号
            "pileGunCode": "",// 设备编码
            "pileGunName": "",// 枪口号
            "ratePower": null,// 功率(kWh)
            "remark": "", // 备注
        }
    ],
});

const open = (item) => {
    if (item) {
        form.value = { ...item };
    } else {
        form.value = {};
    }
    if (!form.value.pileGunList) {
        form.value.pileGunList = [{
            "pileGunId": "",
            "pileId": "",
            "pileGunNo": null,
            "pileGunCode": "",
            "pileGunName": "",
            "ratePower": null,
            "remark": "",
        }];
    }

    dialogVisible.value = true;
};
defineExpose({
    open
});
const emit = defineEmits(['close']);

function handleAddNew() {
    form.value.pileGunList.push({
        "pileGunId": "",
        "pileId": "",
        "pileGunNo": null,
        "pileGunCode": "",
        "pileGunName": "",
        "ratePower": null,
        "remark": "",
    });
}

function handleClickDelete(index) {
    form.value.pileGunList.splice(index, 1);
}


const submit = () => {
    if (form.value.pileGunList.length > 0 && form.value.pileGunList.some(item => !item.pileGunCode)) {
        ElMessage.error("请填写充电枪的数字编码");
        return;
    }
    emit('close', 'value', form.value.pileGunList);
    dialogVisible.value = false;
    ElMessage.success("已临时保存,请在充电站中提交");
}
</script>
<style lang="less">
.addOrEditPileGun {}
</style>
