<template>
  <el-dialog v-model="dialogVisible" title="编辑派车单" width="50%" center top="30px" class="editDispatch"
    @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <el-form-item label="计划装车时间" prop="planTime">
        <el-date-picker v-model="form.planTime" type="datetime" format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm" :editable="false" placeholder="" clearable
          :shortcuts="shortcuts" />
      </el-form-item>
      <el-form-item label="计划用车地点" prop="planSite">
        <el-input v-model="form.planSite" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="车辆" prop="">
        {{ form.vehicleNumber }}
      </el-form-item>
      <el-form-item label="更改前司机" prop="">
        {{ form.driverFullName }} 【{{ form.fleetName }}】
      </el-form-item>
      <el-form-item label="车队" prop="fleetId" required>
        <el-select v-model="form.fleetId" placeholder="请选择车队" filterable clearable
          @change="handleTransportCompanyChange" class="flex-1">
          <el-option :label="item.fleetName" :value="item.fleetId" v-for="item in fleetList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="更换司机" prop="driverId" required>
        <el-select v-model="form.driverId" placeholder="请选择司机" filterable clearable v-loading="loadingDriver"
          @focus="loadAllDriverList" :filter-method="filterDriverFn">
          <el-option :label="driver.fullName" :value="driver.driverId" v-for="driver in driverList"
            :disabled="driver.disabled">
            <span class="el-option-left">{{ driver.fullName }}</span>
            <span class="el-option-right">
              <span v-if="driver.disabled">(已被选择)</span>
              {{ driver.mobileNumber }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="派车描述" prop="dispatchDesc">
        <el-input type="textarea" v-model="form.dispatchDesc" placeholder="" autosize clearable></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="Remark">
        <el-input type="textarea" v-model="form.remark" placeholder="" autosize clearable></el-input>
      </el-form-item>

      <div class="flex_row flex-justify-center mt-50">
        <el-button type="primary" @click="submit(formRef)">提交</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import * as consignmentApi from "@/api/api.consignment.js";
import { getAllDriverList } from "@/api/api.driver.js";
import { ElMessage } from "element-plus";
import { deepCopy, toMap } from "@/utils/util.js";
import { editDispatchBatch } from "@/api/api.dispatch.js";
import { getAllFleetSimpleList } from "@/api/api.fleet.js";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
  "dispatchId": "",
  "orderId": "",
  "batchVolume": "",
  "areaNo": "",
  "planTime": "",
  "remark": "",
  "planSite": "",
  "dispatchDesc": "",
  "fleetId": "",
  "driverId": "",
});

const rules = ref({
  planTime: [
    { required: true, message: "请选择计划装车时间", trigger: "blur" }
  ],
  planSite: [
    { required: true, message: "请输入计划用车地点", trigger: "blur" },
  ],
  driverId: [
    { required: true, message: "请选择司机", trigger: "change" }
  ],
  fleetId: [
    { required: true, message: "请选择车队", trigger: "change" }
  ]
})
const shortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '明天',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date
    },
  }
];

const open = (item) => {
  Object.assign(form.value, item);
  dialogVisible.value = true;
  loadAllTransportCompany().then(_ => {
    loadAllVehicleListWithLastUsageDriver().then(_ => {
      loadAllDriverList();
    });
  });
};
defineExpose({
  open
});
const formRef = ref(null);
const emit = defineEmits(['close']);

const dataList = ref([]);
let dataListCache = [];
const fleetList = ref([]);
const driverList = ref([]);
let driverListCache = [];
const loadingDriver = ref(false);

async function loadAllVehicleListWithLastUsageDriver() {
  if (!form.value.fleetId) {
    return;
  }
  loading.value = true;
  dataList.value = await consignmentApi.getAllVehicleListWithLastUsageDriver({ date: form.value.planTime, fleetId: form.value.fleetId });
  checkDataListDisabled();
  dataListCache = deepCopy(dataList.value);
  loading.value = false;
}

const loadingTransportCompany = ref(false);

async function loadAllTransportCompany() {
  if (fleetList.value.length > 0) {
    return
  }
  loadingTransportCompany.value = true;
  fleetList.value = await getAllFleetSimpleList();
  loadingTransportCompany.value = false;
}

async function loadAllDriverList() {
  if (driverListCache.length > 0) {
    return;
  }
  loadingDriver.value = true;
  driverList.value = await getAllDriverList();
  driverListCache = deepCopy(driverList.value);
  checkDriverListDisabled();
  loadingDriver.value = false;
}

function handleTransportCompanyChange() {
  form.value.driverId = "";
  loadAllVehicleListWithLastUsageDriver();
}

function checkDataListDisabled() {
  dataList.value.forEach(p => {
    p.disabled = !p.lastDriverName;
  })
}

function checkDriverListDisabled() {
  let driverMap = {};
  dataList.value.forEach(p => {
    if (p.lastDriverId) {
      driverMap[p.lastDriverId] = true
    }
  })
  driverList.value.forEach(p => {
    p.disabled = !!driverMap[p.driverId];
  })
}


function filterDriverFn(item) {
  if (item === "") {
    driverList.value = driverListCache;
  } else {
    driverList.value = driverListCache.filter(p => {
      return (p.fullName && p.fullName.includes(item)) || (p.mobileNumber && p.mobileNumber.includes(item));
    })
  }
  checkDriverListDisabled();
}

/**
 * 提交表单
 * @param {FormRef} formRef
 */
const submit = (formRef) => {
  if (!formRef) return;
  formRef.validate((valid) => {
    if (valid) {
      let data = {
        "dispatchId": form.value.dispatchId,
        "orderId": form.value.orderId,
        "dispatchPlanId": form.value.dispatchPlanId,
        "vehicleId": form.value.vehicleId,
        "driverId": form.value.driverId,
        "fleetId": form.value.fleetId,
        "dispatchDesc": form.value.dispatchDesc,
        "planTime": form.value.planTime,
        "planSite": form.value.planSite,
        "remark": form.value.remark
      };
      loading.value = true;
      editDispatchBatch(data).then(res => {
        ElMessage.success("修改成功");
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
.editDispatch {
  .driver_label {
    font-weight: normal;
  }
}
</style>
