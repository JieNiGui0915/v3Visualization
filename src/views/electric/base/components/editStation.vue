<template>
    <el-dialog v-model="dialogVisible" title="修改充电站" width="90%" center top="10px" class="editStation" destroy-on-close
        @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">

            <div class="flex_row">
                <div class="flex-1">
                    <el-form-item label="编码" prop="stationCode">
                        <el-input v-model="form.stationCode" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="所属运营商" prop="orgName">
                        <el-input v-model="form.orgName" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="站点名称" prop="name">
                        <el-input v-model="form.name" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="地址路径" prop="areaNamePath">
                        <el-input v-model="form.areaNamePath" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="地理坐标" prop="lngLat">
                        <el-input v-model="form.lng" placeholder="经度" clearable
                            style="display: inline-block;width: 100%;"></el-input>
                        <el-input v-model="form.lat" placeholder="纬度" clearable
                            style="display: inline-block;width: 100%;"></el-input>
                        <el-button class="ml-10" type="primary"
                            @click="$refs.pickPointMapRef.open([form.lng, form.lat])">
                            拾取坐标
                        </el-button>
                    </el-form-item>
                </div>
                <div class="flex-1">
                    <el-form-item label="联系人" prop="principal">
                        <el-input v-model="form.principal" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="tel">
                        <el-input v-model="form.tel" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="电桩类型" prop="pileType">
                        <el-input v-model="form.pileType" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="场站型号" prop="stationModel">
                        <el-input v-model="form.stationModel" placeholder="" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="全站功率(kVA)" prop="totalStationPower">
                        <el-input v-model.number="form.totalStationPower" placeholder="" clearable></el-input>
                    </el-form-item>
                </div>
            </div>
            <el-form-item label="站点照片" prop="stationFileIds">
                <my-upload ref="myUploadRef" :file-ids="form.stationFileIds" type="station" @success="uploadSuccessFn"
                    @uploading="uploadingFn"></my-upload>
            </el-form-item>
            <el-form-item label="箱变">
                <div class="flex_column">
                    <el-table :data="form.compactSubstationList" class="table" border highlight-current-row
                        scrollbar-always-on row-class-name="table-row-class">
                        <el-table-column fixed type="index" label="#" width="40" align="center" />
                        <el-table-column fixed label="编码" prop="compactSubstationCode" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model="scope.row.compactSubstationCode" placeholder="请输入编码" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.compactSubstationCode }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="变压器类型" prop="transformerType" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model="scope.row.transformerType" placeholder="请输入变压器类型" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.transformerType }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="进线电压(kVA)" prop="incomingVoltage" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model="scope.row.incomingVoltage" placeholder="请输入进线电压(kVA)" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.incomingVoltage }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="出线电压(kVA)" prop="outVoltage" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model="scope.row.outVoltage" placeholder="请输入出线电压(kVA)" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.outVoltage }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="位置" prop="address" width="auto" align="center" show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model="scope.row.address" placeholder="请输入位置" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.address }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center" @click.stop.prevent.self>
                            <template #default="scope">
                                <el-button link type="warning"
                                    @click.prevent.stop="handleClickEdit('compactSubstationList', scope.$index)">
                                    <span v-if="scope.row.isEdit">确认</span>
                                    <span v-else>编辑</span>
                                </el-button>
                                <el-popconfirm title="确认删除该箱变吗？"
                                    @confirm="handleClickDelete('compactSubstationList', scope.$index)">
                                    <template #reference>
                                        <el-button link type="danger">删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="flex_row">
                        <div class="flex-1"></div>
                        <el-button type="default" class="mt-10"
                            @click="handleAddNew('compactSubstationList')">新增箱变</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="充电桩">
                <div class="flex_column">
                    <el-table :data="form.pileList" class="table" border height="200px" highlight-current-row
                        scrollbar-always-on row-class-name="table-row-class">
                        <el-table-column fixed type="index" label="#" width="40" align="center" />
                        <el-table-column fixed label="编码" prop="pileGunCode" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model="scope.row.pileGunCode" placeholder="请输入编码" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.pileGunCode }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="充电桩类型" prop="pileType" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model="scope.row.pileType" placeholder="请输入充电桩类型" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.pileType }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="设备名称" prop="pileName" width="auto" align="center" show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model="scope.row.pileName" placeholder="请输入设备名称" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.pileName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="设备型号" prop="deviceMode" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model="scope.row.deviceMode" placeholder="请输入设备型号" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.deviceMode }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="运营商名称" prop="operatorCompanyName" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model="scope.row.operatorCompanyName" placeholder="请输入运营商名称" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.operatorCompanyName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="电流类型" prop="acDcType" width="auto" align="center" show-overflow-tooltip>
                            <template #default="scope">
                                <el-select v-model="scope.row.acDcType" placeholder="请选择电流类型" v-if="scope.row.isEdit">
                                    <el-option v-for="item in acDcTypeList" :key="item.value" :label="item.label"
                                        :value="item.value">
                                        <span class="el-option-left">{{ item.label }}</span>
                                    </el-option>
                                </el-select>
                                <span v-else>{{ acDcTypeMap[scope.row.acDcType] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="功率(kWh)" prop="ratePower" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model.number="scope.row.ratePower" placeholder="请输入功率" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.ratePower }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="设备生产厂商" prop="supplierName" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model.number="scope.row.supplierName" placeholder="请输入设备生产厂商" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.supplierName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="通讯协议名称" prop="protocolName" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model.number="scope.row.protocolName" placeholder="请输入通讯协议名称" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.protocolName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="回路编号" prop="loopNo" width="auto" align="center" show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model.number="scope.row.loopNo" placeholder="请输入回路编号" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.loopNo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="充电枪" prop="pileGunList" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <a class="link" @click.stop="handleShowPileGun(scope.row)">{{
                                    scope.row.pileGunList.length }}个</a>

                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center" @click.stop.prevent.self>
                            <template #default="scope">
                                <el-button link type="warning"
                                    @click.prevent.stop="handleClickEdit('pileList', scope.$index)">
                                    <span v-if="scope.row.isEdit">确认</span>
                                    <span v-else>编辑</span>
                                </el-button>
                                <el-popconfirm title="确认删除该充电桩吗？"
                                    @confirm="handleClickDelete('pileList', scope.$index)">
                                    <template #reference>
                                        <el-button link type="danger">删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="flex_row">
                        <div class="flex-1"></div>
                        <el-button type="default" class="mt-10" @click="handleAddNew('pileList')">新增充电桩</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="充电车位">
                <div class="flex_column">
                    <el-table :data="form.chargingSpaceList" class="table" height="200px" border highlight-current-row
                        scrollbar-always-on row-class-name="table-row-class">
                        <el-table-column fixed type="index" label="#" width="40" align="center" />
                        <el-table-column fixed label="编码" prop="chargingSpaceCode" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model="scope.row.chargingSpaceCode" placeholder="请输入编码" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.chargingSpaceCode }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" width="100" align="center" @click.stop.prevent.self>
                            <template #default="scope">
                                <el-button link type="warning"
                                    @click.prevent.stop="handleClickEdit('chargingSpaceList', scope.$index)">
                                    <span v-if="scope.row.isEdit">确认</span>
                                    <span v-else>编辑</span>
                                </el-button>
                                <el-popconfirm title="确认删除该充电车位吗？"
                                    @confirm="handleClickDelete('chargingSpaceList', scope.$index)">
                                    <template #reference>
                                        <el-button link type="danger">删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="flex_row">
                        <div class="flex-1"></div>
                        <el-button type="default" class="mt-10"
                            @click="handleAddNew('chargingSpaceList')">新增充电车位</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="停车位">
                <div class="flex_column">
                    <el-table :data="form.parkingSpaceList" class="table" height="200px" border highlight-current-row
                        scrollbar-always-on row-class-name="table-row-class">
                        <el-table-column fixed type="index" label="#" width="40" align="center" />
                        <el-table-column fixed label="编码" prop="parkingSpaceCode" width="auto" align="center"
                            show-overflow-tooltip>
                            <template #default="scope">
                                <el-input v-model="scope.row.parkingSpaceCode" placeholder="请输入编码" clearable
                                    v-if="scope.row.isEdit"></el-input>
                                <span v-else>{{ scope.row.parkingSpaceCode }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" width="100" align="center" @click.stop.prevent.self>
                            <template #default="scope">
                                <el-button link type="warning"
                                    @click.prevent.stop="handleClickEdit('parkingSpaceList', scope.$index)">
                                    <span v-if="scope.row.isEdit">确认</span>
                                    <span v-else>编辑</span>
                                </el-button>
                                <el-popconfirm title="确认删除该停车位吗？"
                                    @confirm="handleClickDelete('parkingSpaceList', scope.$index)">
                                    <template #reference>
                                        <el-button link type="danger">删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="flex_row">
                        <div class="flex-1"></div>
                        <el-button type="default" class="mt-10"
                            @click="handleAddNew('parkingSpaceList')">新增停车位</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="form.remark" placeholder="" autosize clearable></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="submit(formRef)" v-loading="loading">提交</el-button>
        </template>
        <add-or-edit-pile-gun ref="addOrEditPileGunRef" @close="handleClosePileGun"></add-or-edit-pile-gun>
        <pickPointMap ref="pickPointMapRef" @close="handlePickPointMapClose"></pickPointMap>
    </el-dialog>
</template>
<script setup>
import { ref, useTemplateRef } from "vue";
import * as pileApi from "@/api/api.pile.js";
import { ElMessage } from "element-plus";
import myUpload from "@/components/form/my-upload.vue";
import { acDcTypeList, acDcTypeMap } from "@/config/const.js";
import addOrEditPileGun from "./addOrEditPileGun.vue";
import pickPointMap from "@/components/map/pickPointMap.vue";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
    stationId: '',// 充电站id
    stationCode: '',// 充电站编码
    orgCode: '',// 组织编码
    orgName: '',// 组织名称
    name: '',// 站点名称
    address: '',// 地址
    lng: '',// 精度
    lat: '',// 维度
    country: '',// 国家编码
    areaNamePath: '',// 区域名地址路径
    principal: '',// 联系人
    tel: '',// 联系电话
    stationFileIds: '',// 站点照片ids
    stationModel: '',// 场站型号
    createUser: '',// 创建人
    createTime: '',// 创建时间
    modifyUser: '',// 修改人
    modifyTime: '',// 修改时间
    remark: '',// 备注
    pileType: '',// 电桩类型
    pileCount: '',// 电桩数量
    totalStationPower: '',// 全站功率kVA
    singlePilePower: '',// 单桩功率kW
    chargingSpaceCount: '',// 充电车位数量
    parkingSpaceCount: '',// 普通车位数量
    ratePower: '',// 单枪功率
    compactSubstationList: [],// 箱变列表
    pileList: [],// 充电桩列表
    chargingSpaceList: [],// 充电车位列表
    parkingSpaceList: [],// 普通车位列表
});

const open = (item) => {
    dialogVisible.value = true;
    item.compactSubstationList = (item.compactSubstationList || []).map(p => {
        p.isEdit = false;
        return p;
    });
    item.pileList = (item.pileList || []).map(p => {
        p.isEdit = false;
        return p;
    });
    item.chargingSpaceList = (item.chargingSpaceList || []).map(p => {
        p.isEdit = false;
        return p;
    });
    item.parkingSpaceList = (item.parkingSpaceList || []).map(p => {
        p.isEdit = false;
        return p;
    });
    form.value = { ...item };
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

function uploadSuccessFn(res) {
    form.value.stationFileIds = res.map(p => p.data.fileId).join(",");
}

function uploadingFn(val) {
    loading.value = val;
}

function handlePickPointMapClose(val) {
    if (!val || val.length !== 2) {
        form.value.lng = "";
        form.value.lat = "";
    } else {
        form.value.lng = val[0];
        form.value.lat = val[1];
    }
}

function handleClickEdit(listName, index) {
    form.value[listName][index].isEdit = !form.value[listName][index].isEdit;
}

function handleAddNew(listName) {
    // const item = form.value[listName];
    switch (listName) {
        case 'compactSubstationList':
            form.value.compactSubstationList.push({
                compactSubstationCode: '',
                transformerType: '',
                incomingVoltage: '',
                outVoltage: '',
                address: '',
                isEdit: true
            });
            break;
        case 'pileList':
            form.value.pileList.push({
                pileGunCode: '',
                pileType: '',
                pileName: '',
                deviceMode: '',
                operatorCompanyName: '',
                acDcType: null,
                ratePower: '',
                supplierName: '',
                protocolName: '',
                loopNo: '',
                isEdit: true,
                pileGunList: []
            });
            break;
        case 'chargingSpaceList':
            form.value.chargingSpaceList.push({
                chargingSpaceCode: '',
                isEdit: true
            });
            break;
        case 'parkingSpaceList':
            form.value.parkingSpaceList.push({
                parkingSpaceCode: '',
                isEdit: true
            });
            break;
    }
}

function handleClickDelete(listName, index) {
    form.value[listName].splice(index, 1);
    ElMessage.success("已临时删除,提交后生效");
}

const selectCurrentPile = ref(null);
const addOrEditPileGunRef = useTemplateRef("addOrEditPileGunRef");
function handleShowPileGun(row) {
    selectCurrentPile.value = row;
    addOrEditPileGunRef.value.open(row);
}

function handleClosePileGun(returnName, pileGunList = []) {
    if (returnName === 'value') {
        selectCurrentPile.value.pileGunList = pileGunList;
    }
}

const submit = (formRef) => {
    if (!formRef) return;

    // 每个类型的编号是必填项
    if (form.value.compactSubstationList.length > 0 && form.value.compactSubstationList.some(p => !p.compactSubstationCode)) {
        ElMessage.error("请填写箱变编码");
        return;
    }
    if (form.value.pileList.length > 0 && form.value.pileList.some(p => !p.pileGunCode)) {
        ElMessage.error("请填写充电桩编码");
        return;
    }
    if (form.value.chargingSpaceList.length > 0 && form.value.chargingSpaceList.some(p => !p.chargingSpaceCode)) {
        ElMessage.error("请填写充电车位编码");
        return;
    }
    if (form.value.parkingSpaceList.length > 0 && form.value.parkingSpaceList.some(p => !p.parkingSpaceCode)) {
        ElMessage.error("请填写停车位编码");
        return;
    }

    formRef.validate((valid) => {
        if (valid) {
            loading.value = true;
            pileApi.editPileStation(form.value).then(res => {
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
.editStation {}
</style>
