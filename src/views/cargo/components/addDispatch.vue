<template>
  <el-dialog v-model="dialogVisible" title="批量添加派车单" width="50%" :style="{ height: dialogHeight + 'px' }" center
    top="10px" class="addDispatch" @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <div class="flex-align-start">
        <div class="flex-1">
          <el-form-item label="车队" prop="fleetName">
            {{ form.fleetName }}
          </el-form-item>
          <el-form-item label="计划装车时间" prop="planTime">
            <el-date-picker v-model="form.planTime" type="datetime" format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm" :editable="false" placeholder="" clearable
              :shortcuts="shortcuts" />
          </el-form-item>
          <el-form-item label="计划用车地点" prop="planSite">
            <el-input v-model="form.planSite" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="派车描述" prop="dispatchDesc">
            <el-input type="textarea" v-model="form.dispatchDesc" placeholder="" autosize clearable></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="Remark">
            <el-input type="textarea" v-model="form.remark" placeholder="" autosize clearable></el-input>
          </el-form-item>
        </div>
        <div class="flex-1">
          <el-form-item label-width="20px">
            <div class="flex">
              <el-select v-model="form.fleetId" placeholder="选择车队" filterable clearable @change="handleFleetChange"
                class="flex-1" disabled>
                <el-option :label="item.fleetName" :value="item.fleetId" v-for="item in fleetList"></el-option>
              </el-select>
              <el-input v-model.trim="searchName" placeholder="搜索当前车队的车牌号或司机名" :prefix-icon="Search" clearable
                @clear="handleSearch" class="flex-2" @input="handleSearch" />
            </div>
          </el-form-item>
          <el-form-item label-width="20px">
            <div class="width-100p add_dispatch_checkbox_wrap" :style="{ height: checkBoxHeight + 'px' }">
              <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                全选
              </el-checkbox>
              <div v-if="dataList.length === 0" class="el-upload__tip">
                暂无数据
                <span v-if="!form.fleetId">,请先选择车队</span>
              </div>
              <el-checkbox-group v-model="checkedTransportCompanyList" @change="handleCheckedChange">
                <el-checkbox v-for="item in handleSearch()" :key="item.vehicleId" :label="item.licensePlateNumber"
                  :value="item.vehicleId" class="flex" :disabled="item.disabled">
                  <div class="flex flex-center">
                    <div class="mr-10">{{ item.licensePlateNumber }}</div>
                    <div v-if="item.lastDriverName">
                      <span class="driver_label">司机:</span>{{ item.lastDriverName }}
                      <el-popconfirm :title="`确定更换 ${item.licensePlateNumber} 的司机?`" width="180px"
                        @confirm="handleChangeDriver(item)">
                        <template #reference>
                          <span class="ml-20 font-small color-gray" @click.prevent.stop>更换司机<el-icon>
                              <Edit />
                            </el-icon></span>
                        </template>
                      </el-popconfirm>
                    </div>
                    <div class="a" v-else>
                      <el-select v-model="item.lastDriverId" placeholder="请选择司机" filterable clearable
                        @change="val => handleDriverChange(val, item)" v-loading="loadingDriver"
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
                    </div>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </div>
      </div>

      <div class="flex_row flex-justify-center">
        <el-button type="primary" @click="submit(formRef)">提交</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script setup>
import { nextTick, ref, watch } from "vue";
import * as dispatchApi from "@/api/api.dispatch.js";
import * as consignmentApi from "@/api/api.consignment.js";
import { getAllDriverList } from "@/api/api.driver.js";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { deepCopy, toMap } from "@/utils/util.js";
import { getAllFleetSimpleList } from "@/api/api.fleet.js";
import { GlobalStore } from "@/store/index.js";


const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
  "consignmentId": "",
  "consignmentBatchId": "",
  "batchVolume": "",
  "areaNo": "",
  "shovelNum": "",
  "planTime": "",
  "remark": "",
  "planSite": "",
  "dispatchDesc": "",
  "fleetId": ""
});

const rules = ref({
  planTime: [
    { required: true, message: "请选择计划装车时间", trigger: "blur" }
  ],
  planSite: [
    { required: true, message: "请输入计划用车地点", trigger: "blur" },
  ],
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
const searchName = ref("");

const open = (dispatchPlan) => {
  form.value.orderId = dispatchPlan.orderId;
  form.value.dispatchPlanId = dispatchPlan.dispatchPlanId;
  form.value.planTime = dispatchPlan.planTime;
  form.value.planSite = dispatchPlan.planSite;
  form.value.dispatchDesc = dispatchPlan.dispatchDesc;
  form.value.fleetId = dispatchPlan.fleetId;
  form.value.fleetName = dispatchPlan.fleetName;
  dialogVisible.value = true;
  loadAllTransportCompany().then(_ => {
    loadAllVehicleListWithLastUsageDriver().then(_ => {
      loadAllDriverList();
    });
  });
  setHeight();
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

function handleFleetChange() {
  loadAllVehicleListWithLastUsageDriver();
  handleCheckAllChange(false);
}

function handleSearch() {
  if (searchName.value === "") {
    dataList.value = dataListCache;
  } else {
    dataList.value = dataListCache.filter(p => p.licensePlateNumber.includes(searchName.value) || p.lastDriverName.includes(searchName.value));
  }
  return dataList.value;
}

const checkAll = ref(false);
const isIndeterminate = ref(false);
const checkedTransportCompanyList = ref([]);

const handleCheckAllChange = (checked) => {
  checkAll.value = checked;
  checkedTransportCompanyList.value = checked ? dataList.value.filter(p => !p.disabled).map(p => p.vehicleId) : [];
  isIndeterminate.value = false;
}
const handleCheckedChange = (value) => {
  const checkedCount = value.length;
  const dataEnabledCount = dataList.value.filter(p => !p.disabled).length;
  checkAll.value = checkedCount === dataEnabledCount;
  isIndeterminate.value = checkedCount > 0 && checkedCount < dataEnabledCount;
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


function handleDriverChange(val, item) {
  if (!val) {
    item.lastDriverId = "";
    item.lastDriverName = "";
  } else {
    let driver = driverList.value.find(p => p.driverId === val);
    if (driver) {
      item.lastDriverName = driver.fullName;
    }
    checkedTransportCompanyList.value.push(item.vehicleId);
  }
  nextTick(() => {
    checkDriverListDisabled();
    checkDataListDisabled();
    handleCheckedChange(checkedTransportCompanyList.value);
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

function handleChangeDriver(item) {
  let index = checkedTransportCompanyList.value.findIndex(p => p.vehicleId === item.vehicleId);
  if (index > -1) {
    checkedTransportCompanyList.value.splice(index, 1);
  }
  item.lastDriverId = "";
  item.lastDriverName = "";
  checkDriverListDisabled();
  checkDataListDisabled();
}

/**
 * 提交表单
 * @param {FormRef} formRef
 */
const submit = (formRef) => {
  if (!formRef) return;
  formRef.validate((valid) => {
    if (valid) {
      let checkedTransportCompanyMap = toMap(checkedTransportCompanyList.value, item => item);
      let body = [];
      dataList.value.forEach(p => {
        if (checkedTransportCompanyMap.has(p.vehicleId)) {
          let data = {
            "orderId": form.value.orderId,
            "dispatchPlanId": form.value.dispatchPlanId,
            "vehicleId": p.vehicleId,
            "driverId": p.lastDriverId,
            "fleetId": form.value.fleetId,
            "dispatchDesc": form.value.dispatchDesc,
            "remark": form.value.remark,
            "planTime": form.value.planTime,
            "planSite": form.value.planSite,
          };
          body.push(data);
        }
      })
      loading.value = true;
      dispatchApi.addDispatchBatch({ list: body }).then(res => {
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
const checkBoxHeight = ref(100);
const dialogHeight = ref(500);
const globalStore = GlobalStore();

function setHeight() {
  let val = globalStore.screenSize;
  if (val && val.length === 2) {
    checkBoxHeight.value = val[1] - 240;
    dialogHeight.value = val[1] - 60;
  }
}

watch(() => globalStore.screenSize, val => {
  setHeight();
}, { immediate: true })
</script>
<style lang="less">
.addDispatch {
  .driver_label {
    font-weight: normal;
  }

  .add_dispatch_checkbox_wrap {
    border: 1px solid #cccccc;
    padding-left: 8px;
    border-radius: 4px;
    overflow: auto;
  }
}
</style>
