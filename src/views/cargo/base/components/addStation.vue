<template>
    <el-dialog v-model="dialogVisible" title="新增场站" width="60%" center top="10px" class="addStation"
        @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
        <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
            <div class="flex_row">
                <div class="flex-1">
                    <el-form-item label="货场编码" prop="goodsYardCode">
                        <el-input v-model="form.goodsYardCode" placeholder="请输入货场编码" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="货场简称" prop="goodsYardShortName" required>
                        <el-input v-model="form.goodsYardShortName" placeholder="请输入货场简称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="货场别名" prop="goodsYardAlias">
                        <el-input v-model="form.goodsYardAlias" placeholder="请输入货场别名" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="货场全称" prop="goodsYardName">
                        <el-input v-model="form.goodsYardName" placeholder="请输入货场全称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="货场类型" prop="goodsYardType">
                        <el-select v-model="form.goodsYardType" placeholder="请选择货场类型" clearable>
                            <el-option v-for="item in stationTypeList" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="行政归属" prop="goodsYardAdmin">
                        <el-input v-model="form.goodsYardAdmin" placeholder="请输入行政归属" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="地理位置" prop="address">
                        <el-input v-model="form.address" placeholder="请输入地理位置" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="地理坐标" prop="lngLat">
                        <!-- <span v-if="form.longitude && form.latitude">{{ form.longitude }}, {{ form.latitude }}</span>
                        <span v-else>暂未选择</span> -->
                        <el-input v-model="form.longitude" placeholder="经度" clearable
                            style="display: inline-block;"></el-input>
                        <el-input v-model="form.latitude" placeholder="纬度" clearable
                            style="display: inline-block;"></el-input>
                        <el-button class="ml-10" type="primary"
                            @click="$refs.pickPointMapRef.open([form.longitude, form.latitude])">
                            拾取坐标
                        </el-button>
                    </el-form-item>
                    <el-form-item label="地理围栏" prop="locationRange">
                        <el-input type="textarea" v-model="form.locationRange" :autosize="{ maxRows: 1 }"
                            placeholder="请输入地理围栏" clearable></el-input>
                        <el-button class="ml-10" type="primary"
                            @click="$refs.pickFenceMapRef.open(form.locationRange, [form.longitude, form.latitude])">拾取围栏</el-button>
                    </el-form-item>
                </div>
                <div class="flex-1">
                    <el-form-item label="占地面积" prop="goodsYardArea">
                        <el-input v-model="form.goodsYardArea" placeholder="请输入占地面积" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="年运量" prop="goodsYardAnnualCapacity">
                        <el-input v-model="form.goodsYardAnnualCapacity" placeholder="请输入年运量" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="装车限重" prop="goodsYardLoadingLimit">
                        <el-input v-model="form.goodsYardLoadingLimit" placeholder="请输入装车限重" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="煤炭品种" prop="goodsYardCoalType">
                        <el-input v-model="form.goodsYardCoalType" placeholder="请输入煤炭品种" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="煤炭形态" prop="goodsYardCoalForm">
                        <el-input v-model="form.goodsYardCoalForm" placeholder="请输入煤炭形态" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="堆放形式" prop="goodsYardStorageForm">
                        <el-input v-model="form.goodsYardStorageForm" placeholder="请输入堆放形式" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="装车方式" prop="goodsYardLoadingMethod">
                        <el-input v-model="form.goodsYardLoadingMethod" placeholder="请输入装车方式" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="装卸机械" prop="goodsYardUnloadingMechanism">
                        <el-input v-model="form.goodsYardUnloadingMechanism" placeholder="请输入装卸机械" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="地磅配置" prop="goodsYardWeighbridge">
                        <el-input v-model="form.goodsYardWeighbridge" placeholder="请输入地磅配置" clearable></el-input>
                    </el-form-item>
                </div>
            </div>

            <el-form-item label="说明" prop="remark">
                <el-input type="textarea" v-model="form.remark" placeholder="" autosize clearable></el-input>
            </el-form-item>
            <div class="flex_row flex-align-center mt-50">
                <el-button type="primary" @click="submit(formRef)">提交</el-button>
            </div>
        </el-form>
        <pickPointMap ref="pickPointMapRef" @close="handlePickPointMapClose"></pickPointMap>
        <pickFenceMap ref="pickFenceMapRef" @close="handlePickFenceMapClose"></pickFenceMap>
    </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import * as stationApi from "@/api/api.station.js";
import { getAllCompanyList } from "@/api/api.company";
import { ElMessage } from "element-plus";
import { stationTypeList, holidayModeList } from "@/config/const.js";
import { searchStaff } from "@/api/api.staff.js";
import pickPointMap from "@/components/map/pickPointMap.vue";
import pickFenceMap from "@/components/map/pickFenceMap.vue";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
    goodsYardId: "",// 货场ID
    goodsYardCode: "",// 货场编码
    goodsYardName: "",// 货场名称
    goodsYardType: "",// 货场类型
    contactStaffId: "",// 联系人ID
    contactStaffName: "",// 联系人姓名
    locationId: "",// 所在地点
    primaryGoodsType: "",// 主要货物种类
    openingTime: "",// 开始运营时间
    closingTime: "",// 结束运营时间
    holidayMode: "",// 休息日模式
    goodsYardStatus: "",// 货场状态
    remark: "",// 备注
    companyId: "",// 公司ID
    locationId: "",// 地点ID
    locationName: "",// 地点名称
    address: "",// 详细地址
    longitude: "",// 经度
    latitude: "",// 纬度
    remark: "",// 备注
    locationRange: "",// 地理范围
    goodsYardShortName: '',// 简称
    goodsYardAlias: '',// 别名
    goodsYardAdmin: '',// 行政归属
    goodsYardArea: '',// 占地面积
    goodsYardAnnualCapacity: '',// 年运量
    goodsYardLoadingLimit: '',// 装车限重
    goodsYardCoalType: '',// 煤炭品种
    goodsYardCoalForm: '',// 煤炭形态
    goodsYardStorageForm: '',// 堆放形式
    goodsYardLoadingMethod: '',// 装车方式
    goodsYardUnloadingMechanism: '',// 装卸机械
    goodsYardWeighbridge: '',// 地磅配置
});
/**
 * 打开弹窗
 * @param {form} item
 */
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
    goodsYardCode: [
        { required: false, message: '请输入货场编码', trigger: 'blur' },
    ],
    goodsYardName: [
        { required: true, message: '请输入货场名称', trigger: 'blur' },
    ],
    goodsYardShortName: [
        { required: true, message: '请输入货场简称', trigger: 'blur' },
    ],
    goodsYardType: [
        { required: false, message: '请选择货场类型', trigger: 'change' }
    ],
})
const allCompanyList = ref([]);
function loadCompanyList() {
    getAllCompanyList().then(res => {
        allCompanyList.value = res;
    })
}

// region 查询人员
const searchStaffStr = ref("");
const loadingStaff = ref(false);
const staffList = ref([]);
let remoteTimer = null;

function remoteFilterContactMethod(query) {
    searchStaffStr.value = query;
    clearTimeout(remoteTimer);
    if (query) {
        remoteTimer = setTimeout(() => {
            searchStaffList()
        }, 400)
    }
}

function searchStaffList() {
    loadingStaff.value = true;
    searchStaff(searchStaffStr.value).then(res => {
        staffList.value = res;
    }).finally(() => {
        loadingStaff.value = false;
    })
}

function handleSelectChange(val) {
    if (val === undefined) {
        staffList.value = [];
        return;
    }
    let data = staffList.value.find(p => p.staffId === val);
    if (data) {
        form.value.contactStaffId = data.staffId;
        form.value.contactStaffName = data.fullName;
    }
}
// endregion


function handlePickPointMapClose(val) {
    if (!val || val.length !== 2) {
        form.value.longitude = "";
        form.value.latitude = "";
    } else {
        form.value.longitude = val[0];
        form.value.latitude = val[1];
    }
}

function handlePickFenceMapClose(val) {
    form.value.locationRange = val;
}
const submit = (formRef) => {
    if (!formRef) return;
    formRef.validate((valid) => {
        if (valid) {
            loading.value = true;

            stationApi.addStation(form.value).then(res => {
                ElMessage.success("修改成功");
                emit("close", true);
                dialogVisible.value = false;
            }).finally(() => {
                loading.value = false;
            })
        }
    }).finally(() => {
        loading.value = false;
    });
}

const handleClosedDialog = (formRef) => {
    if (formRef) formRef.resetFields();
}
</script>
<style lang="less">
.addStation {}
</style>
