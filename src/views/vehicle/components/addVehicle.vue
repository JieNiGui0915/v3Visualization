<template>
  <el-dialog v-model="dialogVisible" title="新增整车" width="60%" top="10px" center class="addVehicle"
             @close="handleClosedDialog(formRef)" destroy-on-close :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <div class="flex-align-start">
        <div class="flex-1">
          <el-form-item label="运营方式" prop="operationMode">
            <el-radio-group v-model="form.operationMode">
              <el-radio :value="item.value" v-for="item in operationModeList" :key="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用能类型" prop="licensePlateType">
            <el-radio-group v-model="form.energyType">
              <el-radio :value="item.value" v-for="item in energyTypeList" :key="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="车头" prop="headstockId">
            <el-select v-model="form.headstockId" filterable clearable @focus="loadHeadStock" placeholder=""
                       @change="handleChangeHeadStock">
              <el-option :value="item.headstockId" :label="item.headstockNumberPlate" v-for="item in allHeadStockList">
                <span class="el-option-left">{{ item.headstockNumberPlate }}</span>
                <span class="el-option-right">{{ item.headstockVin }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="挂车" prop="trailerId">
            <el-select v-model="form.trailerId" filterable clearable @focus="loadTrailer" placeholder="">
              <el-option :value="item.trailerId" :label="item.trailerNumberPlate" v-for="item in allTrailerList">
                <span class="el-option-left">{{ item.trailerNumberPlate }}</span>
                <span class="el-option-right">vin:{{ item.trailerVin }} code:{{ item.trailerCode }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="电池包" prop="batteryPackId">
            <el-select v-model="form.batteryPackId" filterable clearable @focus="loadBatteryPack" placeholder="">
              <el-option :value="item.batteryPackId" :label="item.batteryCode" v-for="item in allBatteryPackList">
                <span class="el-option-left">{{ item.batteryCode }}</span>
                <span class="el-option-right">出厂日期:{{ item.batteryManufactureDate }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属车队" prop="fleetId">
            <el-select v-model="form.fleetId" filterable clearable placeholder="">
              <el-option :value="item.fleetId" :label="item.fleetName" v-for="item in allFleetList">
                <span class="el-option-left">{{ item.fleetName }}</span>
                <span class="el-option-right">{{ item.fleetCode }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车主" prop="vehicleOwnerId">
            <el-select v-model="form.vehicleOwnerId" filterable clearable @focus="loadDriver" placeholder="">
              <el-option :value="item.driverId" :label="item.fullName" v-for="item in allDriverList">
                <span class="el-option-left">{{ item.fullName }}</span>
                <span class="el-option-right">{{ item.mobileNumber }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日常责任人" prop="dailyResponsibilityPerson">
            <el-select v-model="form.dailyResponsibilityPerson" filterable clearable @focus="loadDriver" placeholder="">
              <el-option :value="item.driverId" :label="item.fullName" v-for="item in allDriverList">
                <span class="el-option-left">{{ item.fullName }}</span>
                <span class="el-option-right">{{ item.mobileNumber }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="flex-1">
          <el-form-item label="车牌号" prop="licensePlateNumber" required>
            <el-input v-model.trim="form.licensePlateNumber" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="分组" prop="grouping">
            <el-input v-model.trim="form.grouping" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="调度号" prop="dispatchNumber">
            <el-input v-model.trim="form.dispatchNumber" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="车辆识别代号" prop="vehicleVin">
            <el-input v-model.trim="form.vehicleVin" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="整备质量(t)" prop="curbWeight">
            <el-input v-model.trim="form.curbWeight" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="额定载重(t)" prop="ratedLoad">
            <el-input v-model.trim="form.ratedLoad" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="电池容量(kWh)" prop="batteryCapacity">
            <el-input v-model.trim="form.batteryCapacity" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="北斗终端标识" prop="beidouTerminal">
            <el-input v-model.trim="form.beidouTerminal" placeholder="" clearable></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="图片" prop="">
        <my-upload type="certificate" :file-ids="form.vehicleFileIds" @success="uploadSuccessFn"></my-upload>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model.trim="form.remark" placeholder="" clearable></el-input>
      </el-form-item>
      <div class="flex_row flex-justify-center mt-50">
        <el-button type="primary" @click="submit(formRef)">提交</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script setup>
import {ref, useTemplateRef} from "vue";
import {getAllTrailerList} from "@/api/api.trailer.js";
import {getAllHeadStockList} from "@/api/api.headStock.js";
import {ElMessage} from "element-plus";
import {operationModeList, licensePlateTypeList, energyTypeList} from "@/config/const.js";
import {getAllBatteryPackList} from "@/api/api.batteryPack";
import {getAllDriverList} from "@/api/api.driver";
import {getAllFleetSimpleList} from "@/api/api.fleet";
import {addVehicle} from "@/api/api.vehicle";
import MyUpload from "@/components/form/my-upload.vue";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
  vehicleId: '',                  // 整车ID
  headstockId: '',                // 车头ID
  trailerId: '',                  // 挂车ID
  batteryPackId: '',              // 电池包ID
  grouping: '',                   // 分组
  dispatchNumber: '',             // 调度号
  licensePlateNumber: '',         // 车牌号
  licensePlateType: '',           // 车牌类
  vehicleVin: '',                 // 车辆识别代号
  curbWeight: '',                 // 整备质量(t)
  ratedLoad: '',                  // 额定载重(t)
  batteryCapacity: '',            // 电池容量(kWh)
  operationMode: '',              // 运营方式，1-自有，2-外协，3-代管
  vehicleOwnerId: '',             // 车主ID
  currenDriver: '',               // 当前使用人
  dailyResponsibilityPerson: '',  // 日常责任人
  vehicleStatus: '',              // 车辆状态
  remark: '',                     // 备注
  vehicleReviewStatus: '',        // 车辆检查状态
  beidouTerminal: '',             // 北斗终端标识
  fleetId: '',                    // 所属车队ID
  energyType: '',                 // 用能类型
  vehicleFileIds: '',             // 图片id
});
const open = async (item) => {
  dialogVisible.value = true;

  await loadHeadStock();
  await loadTrailer();
  await loadBatteryPack();
  await loadDriver();
  await loadFleet();
};

defineExpose({
  open
});

const formRef = useTemplateRef("formRef");
const emit = defineEmits(['close']);
const rules = ref({
  operationMode: [
    {required: true, message: "请选择运营方式", trigger: "change"},
  ],
  licensePlateNumber: [
    {required: true, message: "请输入车牌号", trigger: "blur,change"},
  ],
  fleetId: [
    {required: true, message: "请选择车队", trigger: "blur"}
  ]
})


const allHeadStockList = ref([]);

async function loadHeadStock() {
  if (allHeadStockList.value.length > 0) {
    return;
  }
  loading.value = true;
  let res = await getAllHeadStockList();
  allHeadStockList.value = res;
  loading.value = false;
}

const allTrailerList = ref([]);

async function loadTrailer() {
  if (allTrailerList.value.length > 0) {
    return;
  }
  loading.value = true;
  let res = await getAllTrailerList();
  allTrailerList.value = res;
  loading.value = false;
}

const allBatteryPackList = ref([]);

async function loadBatteryPack() {
  if (allBatteryPackList.value.length > 0) {
    return;
  }
  loading.value = true;
  let res = await getAllBatteryPackList();
  allBatteryPackList.value = res;
  loading.value = false;
}

const allDriverList = ref([]);

async function loadDriver() {
  if (allDriverList.value.length > 0) {
    return;
  }
  loading.value = true;
  let res = await getAllDriverList();
  allDriverList.value = res;
  loading.value = false;
}

const allFleetList = ref([]);

async function loadFleet() {
  if (allFleetList.value.length > 0) {
    return;
  }
  loading.value = true;
  let res = await getAllFleetSimpleList();
  allFleetList.value = res;
  loading.value = false;
}


function handleChangeHeadStock(headStockId) {
  let data = allHeadStockList.value.find(item => item.headstockId === headStockId);
  if (!data) {
    return;
  }
  form.value.licensePlateNumber = "";
  setTimeout(() => {
    form.value.licensePlateNumber = data.headstockNumberPlate;
    ElMessage({
      message: "车牌号已自动带入",
      type: "success",
    });
  }, 500);
}

function uploadSuccessFn(res) {
  form.value.vehicleFileIds = res.map(p => p.data.fileId).join(",");
}

/**
 * 提交表单
 * @param {FormRef} formRef
 */
const submit = (formRef) => {
  if (!formRef) return;
  formRef.validate((valid) => {
    if (valid) {
      loading.value = true;
      let param = {};
      Object.assign(param, form.value);

      addVehicle(param).then(res => {
        ElMessage.success("添加成功");
        emit("close", true);
        dialogVisible.value = false;
      }).finally(() => {
        loading.value = false;
      })
    }
  }).finally(() => {
    // loading.value = false;
  });
}
const handleClosedDialog = (formRef) => {
  if (formRef) formRef.resetFields();
}
</script>
<style lang="less">
.addVehicle {
  min-width: 600px;
}
</style>
