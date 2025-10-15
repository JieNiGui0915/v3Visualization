<template>
  <el-dialog v-model="dialogVisible" title="修改报修" width="60%" top="10px" center class="editRepair"
             @close="handleClosedDialog(formOneRef)" destroy-on-close :close-on-click-modal="false">
    <div class="flex_column">
      <!-- <el-form :model="formOne" :rules="rules" label-width="auto" ref="formOneRef" status-icon v-loading="loading">
        <el-card class="card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>维修上报</span>
            </div>
          </template>
<el-form-item label="报修目标类型" prop="targetType">
  <el-radio-group v-model="formOne.targetType" @change="handleTargetTypeChange" disabled>
    <el-radio :value="item.value" v-for="item in repairTargetTypeList">{{ item.label }}</el-radio>
  </el-radio-group>
</el-form-item>
<el-form-item label="报修目标" prop="targetId">
  <el-select v-model="formOne.targetId" placeholder="" disabled>
    <el-option :value="item.value" :label="item.label" v-for="item in targetList">
      <span class="el-option-left">{{ item.label }}</span>
      <span class="el-option-right">{{ item.desc }}</span>
    </el-option>
  </el-select>
</el-form-item>
<el-form-item label="报修目标描述" prop="targetDesc">
  <el-input type="textarea" v-model="formOne.targetDesc" placeholder="" clearable v-if="editOne"></el-input>
  <span v-else>{{ formOne.targetDesc }}</span>
</el-form-item>
<el-form-item label="故障描述" prop="reportDesc">
  <el-input type="textarea" v-model="formOne.reportDesc" placeholder="" clearable></el-input>
</el-form-item>
<el-form-item label="报修照片集ID" prop="reportPhotosId">
  <my-upload type="repair" @success="res=>uploadSuccessFn(res,'reportPhotosId')"
    :file-ids="formOne.reportPhotosId"></my-upload>
</el-form-item>
<el-form-item label="报修人">
  {{ formOne.reportStaffName }} 上报时间: {{ formatDateTimeString(formOne.reportTime) }}
</el-form-item>
</el-card>
<el-card class="card" shadow="hover">
  <template #header>
            <div class="card-header">
              <span>确认问题及维修进度</span>
            </div>
          </template>
  <el-form-item label="问题分类" prop="faultType">
    <el-input type="text" v-model="formOne.faultType" placeholder="" clearable></el-input>
  </el-form-item>
  <el-form-item label="严重程度" prop="faultLevel">
    <el-radio-group v-model="formOne.faultLevel">
      <el-radio :value="item.value" v-for="item in faultLevelList">{{ item.label }}</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="资产" prop="assetId">
    <el-select v-model="formOne.assetId" filterable placeholder="">
      <el-option :value="item.assetId" :label="item.assetCode" v-for="item in assetList">
        <span class="el-option-left">{{ item.assetCode }}</span>
        <span class="el-option-right">{{ item.assetType }}</span>
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="是否质保" prop="ifWarranty">
    <el-radio-group v-model="formOne.ifWarranty">
      <el-radio :value="item.value" v-for="item in isOrNotList">{{ item.label }}</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="进展说明" prop="progressDesc">
    <el-input type="textarea" v-model="formOne.progressDesc" placeholder="" clearable></el-input>
  </el-form-item>
  <el-form-item label="承修方" prop="repairParty">
    <el-input type="text" v-model="formOne.repairParty" placeholder="" clearable></el-input>
  </el-form-item>
  <el-form-item label="承修方式" prop="repairMode">
    <el-radio-group v-model="formOne.repairMode">
      <el-radio :value="item.value" v-for="item in repairModeList">{{ item.label }}</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="解决时间" prop="solveTime">
    <el-date-picker v-model="formOne.solveTime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
      :editable="false" placeholder="请选择日期" clearable />
  </el-form-item>
  <el-form-item label="费用金额(元)" prop="costAmount">
    <el-input type="number" v-model="formOne.costAmount" placeholder="" clearable></el-input>
  </el-form-item>
  <el-form-item label="报修照片集ID" prop="repairPhotosId">
    <my-upload type="repair" @success="(res)=>uploadSuccessFn(res,'repairPhotosId')"
      :file-ids="formOne.repairPhotosId"></my-upload>
  </el-form-item>
  <el-form-item label="备注" prop="remark">
    <el-input type="textarea" v-model="formOne.remark" placeholder="" clearable></el-input>
  </el-form-item>
  <el-form-item label="状态" prop="repairStatus">
    {{ repairStatusMap[formOne.repairStatus] }}
  </el-form-item>
  <el-form-item label="处理人" v-if="formOne.handleStaffName">
    {{ formOne.handleStaffName }} 处理时间: {{ formatDateTimeString(formOne.handleTime) }}
  </el-form-item>
</el-card>
<div class="flex_row flex-justify-center mt-50">
  <el-button type="primary" @click="submit(formOneRef)">提交</el-button>
</div>
</el-form> -->
      <!--      <el-steps :active="activeStep" finish-status="success" simple>-->
      <!--        <el-step title="上报维修" description="" @click="stepChange(0)">-->
      <!--        </el-step>-->
      <!--        <el-step title="确认问题" description="" @click="stepChange(1)"></el-step>-->
      <!--        <el-step title="维修进度" description="" @click="stepChange(2)"></el-step>-->
      <!--      </el-steps>-->
      <el-tabs type="card" class="tabs">
        <el-tab-pane>
          <template #label>
            <el-icon color="green">
              <CircleCheck/>
            </el-icon>
            上报维修
          </template>
          <el-form :model="formOne" :rules="formOneRules" label-width="auto" ref="formOneRef" status-icon v-loading="loading" :disabled="!formOne.isEdit">
            <el-form-item label="报修目标类型" prop="targetType">
              <el-radio-group v-model="formOne.targetType" @change="handleTargetTypeChange" disabled>
                <el-radio :value="item.value" v-for="item in repairTargetTypeList">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="报修目标" prop="targetId">
              <el-select v-model="formOne.targetId" placeholder="" disabled>
                <el-option :value="item.value" :label="item.label" v-for="item in targetList">
                  <span class="el-option-left">{{ item.label }}</span>
                  <span class="el-option-right">{{ item.desc }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报修目标描述" prop="targetDesc">
              <el-input type="textarea" v-model="formOne.targetDesc" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item label="故障描述" prop="reportDesc">
              <el-input type="textarea" v-model="formOne.reportDesc" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item label="报修照片集" prop="reportPhotosId">
              <my-upload type="repair" @success="res => uploadSuccessFn(res, 'reportPhotosId')"
                         :file-ids="formOne.reportPhotosId" :just-show="!formOne.isEdit" @uploading="uploadingFn"></my-upload>
            </el-form-item>
            <el-form-item label="报修人">
              {{ formOne.reportStaffName }} 上报时间: {{ formatDateTimeString(formOne.reportTime) }}
            </el-form-item>
          </el-form>
          <div class="flex_row flex-justify-center mt-50">
            <el-button link type="warning" @click="editForm(1)" v-if="!formOne.isEdit">修改</el-button>
            <el-button type="primary" @click="submitOne" v-else>提交上报维修</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <el-icon color="green" v-if="formTwo.done">
              <CircleCheck/>
            </el-icon>
            问题确认
          </template>
          <el-form :model="formTwo" :rules="formTwoRules" label-width="auto" ref="formTwoRef" status-icon v-loading="loading" :disabled="!formTwo.isEdit">
            <el-form-item label="问题分类" prop="faultType">
              <el-input link v-model="formTwo.faultType" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item label="严重程度" prop="faultLevel">
              <el-radio-group v-model="formTwo.faultLevel">
                <el-radio :value="item.value" v-for="item in faultLevelList">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="资产" prop="assetId">
              <el-select v-model="formTwo.assetId" filterable placeholder="">
                <el-option :value="item.assetId" :label="item.assetCode" v-for="item in assetList">
                  <span class="el-option-left">{{ item.assetCode }}</span>
                  <span class="el-option-right">{{ item.assetType }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否质保" prop="ifWarranty">
              <el-radio-group v-model="formTwo.ifWarranty">
                <el-radio :value="item.value" v-for="item in isOrNotList">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div class="flex_row flex-justify-center mt-50">
            <el-button link type="warning" @click="editForm(2)" v-if="!formTwo.isEdit">修改</el-button>
            <el-button type="primary" @click="submitTwo" v-else>提交问题确认</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <el-icon color="green" v-if="formThree.done">
              <CircleCheck/>
            </el-icon>
            维修进度
          </template>
          <el-form :model="formThree" :rules="formThreeRules" label-width="auto" ref="formThreeRef" status-icon v-loading="loading" :disabled="!formThree.isEdit">
            <el-form-item label="进展说明" prop="progressDesc">
              <el-input type="textarea" v-model="formThree.progressDesc" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item label="承修方" prop="repairParty">
              <el-input link v-model="formThree.repairParty" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item label="承修方式" prop="repairMode">
              <el-radio-group v-model="formThree.repairMode">
                <el-radio :value="item.value" v-for="item in repairModeList">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="解决时间" prop="solveTime">
              <el-date-picker v-model="formThree.solveTime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                              :editable="false" placeholder="请选择日期" clearable/>
            </el-form-item>
            <el-form-item label="费用金额(元)" prop="costAmount">
              <el-input type="number" v-model="formThree.costAmount" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item label="维修照片集" prop="repairPhotosId">
              <my-upload type="repair" @success="(res)=>uploadSuccessFn(res,'repairPhotosId')"
                         :file-ids="formThree.repairPhotosId" :just-show="!formThree.isEdit"></my-upload>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="formThree.remark" placeholder="" clearable></el-input>
            </el-form-item>
            <!--            <el-form-item label="状态" prop="repairStatus">-->
            <!--              {{ repairStatusMap[formThree.repairStatus] }}-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="处理人" v-if="formThree.handleStaffName">-->
            <!--              {{ formThree.handleStaffName }} 处理时间: {{ formatDateTimeString(formThree.handleTime) }}-->
            <!--            </el-form-item>-->
          </el-form>
          <div class="flex_row flex-justify-center mt-50">
            <el-button link type="warning" @click="editForm(3)" v-if="!formThree.isEdit">修改</el-button>
            <el-button type="primary" @click="submitThree" v-else>提交维修进度</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
<script setup>
import {ref, useTemplateRef} from "vue";
import {editRepair, confirmRepair, updateRepairProgress} from "@/api/api.repair.js";
import {getAllVehicleList} from "@/api/api.vehicle.js";
import {getAllPileList} from "@/api/api.pile.js";
import {getAssetList} from "@/api/api.asset.js";
import {ElMessage} from "element-plus";
import {faultLevelList, isOrNotList, repairModeList, repairStatusMap, repairTargetTypeList} from "@/config/const.js";
import {deepCopy, formatDateTimeString} from "@/utils/util.js";
import myUpload from "@/components/form/my-upload.vue";
import {CircleCheck} from "@element-plus/icons-vue";

// region 所有
const dialogVisible = ref(false);
const open = (item) => {
  dialogVisible.value = true;
  Object.assign(formOne.value, item);
  Object.assign(formTwo.value, item);
  Object.assign(formThree.value, item);
  formOneCache = deepCopy(formOne.value);
  formTwoCache = deepCopy(formTwo.value);
  formThreeCache = deepCopy(formThree.value);
  formOne.value.isEdit = false;
  formTwo.value.isEdit = true;
  formThree.value.isEdit = true;
  handleTargetTypeChange();

  if (formTwo.value.faultType || formTwo.value.faultLevel || formTwo.value.assetId || formTwo.value.ifWarranty) {
    formTwo.value.isEdit = false;
    formTwo.value.done = true;
  }

  if (formThree.value.solveTime) {
    formThree.value.isEdit = false;
    formThree.value.done = true;
  }

  loadAssetList();
};

const emit = defineEmits(['close']);
defineExpose({
  open
});

function editForm(formNum) {
  switch (formNum) {
    case 1:
      formOne.value.isEdit = true;
      break;
    case 2:
      formTwo.value.isEdit = true;
      break;
    case 3:
      formThree.value.isEdit = true;
      break;
  }
}


const handleClosedDialog = () => {
  if (formOneRef) formOneRef.value.resetFields();
  if (formTwoRef) formTwoRef.value.resetFields();
  if (formThreeRef) formThreeRef.value.resetFields();
  formOne.value = formOneCache;
  formTwo.value = formTwoCache;
  formThree.value = formThreeCache;
}


// endregion

// region 表单One

const loading = ref(false);
const formOne = ref({
  repairId: "", // 维修记录ID
  targetType: "", // 报修目标类型，1-车辆，2-充电桩，9-其他
  targetId: "", // 报修目标ID
  targetDesc: "", // 报修目标描述
  reportStaffId: "", // 报修人，对应人员表
  reportStaffName: "", // 报修人，对应人员表
  reportTime: "", // 报修时间
  reportDesc: "", // 故障描述
  reportPhotosId: "", // 报修照片集ID
  handleStaffId: "", //	处理人，对应人员表
  handleStaffName: "", // 处理人，对应人员表
  handleTime: "", // 处理时间
  faultType: "", // 问题分类，字典类型fault_type
  faultLevel: "", // 严重程度，0-无需处理，1-轻微（不影响使用），
  assetId: "", // 资产ID
  ifWarranty: "", // 是否质保，0-否，1-是
  progressDesc: "", // 进展说明
  repairParty: "", // 承修方
  repairMode: "", // 承修方式，1-上门，2-送修，3-远程支持，9-其他
  solveTime: "", // 解决时间
  costAmount: "", // 费用金额，单位为元
  repairStatus: "", // 维修状态，0-待处理，1-已响应，2-维修中，3-已
  remark: "", // 备注
  repairPhotosId: "",// 维修照片集ID
  isEdit: false
});
let formOneCache = null;

const formOneRef = useTemplateRef("formOneRef");

const formOneRules = ref({
  targetType: [
    {required: true, message: "请选择报修目标类型", trigger: "blur"}
  ],
  targetId: [
    {required: true, message: "请选择报修目标", trigger: "blur"},
  ],
})

async function load() {
  // loading.value = true;
  // let data = await getRepairInfo(formOne.value.repairId);
  // loading.value = false;
}

function handleTargetTypeChange() {
  // formOne.value.targetId = "";
  switch (formOne.value.targetType) {
    case repairTargetTypeList[0].value:
      loadAllVehicleList();
      break;
    case repairTargetTypeList[1].value:
      loadAllPileList();
      break;
    case repairTargetTypeList[2].value:
      loadOtherList();
      break;
    default:
      break;
  }
}

const targetList = ref([]);
let allVehicleList = [];
let allPileList = [];

function loadAllVehicleList() {
  if (allVehicleList.length > 0) {
    return;
  }
  loading.value = true;
  getAllVehicleList().then(res => {
    allVehicleList = res;
    targetList.value = res.map(p => {
      return {
        label: p.licensePlateNumber,
        value: p.vehicleId,
        desc: p.transportCompanyName
      }
    })
  }).finally(() => {
    loading.value = false;
  })
}

function loadAllPileList() {
  if (allPileList.length > 0) {
    return;
  }
  loading.value = true;
  getAllPileList().then(res => {
    allPileList = res;
    targetList.value = res.map(p => {
      return {
        label: p.pileName,
        value: p.pileId,
        desc: p.stationName
      }
    })
  }).finally(() => {
    loading.value = false;
  })
}

function loadOtherList() {
  targetList.value = [];
}

const assetList = ref([]);

async function loadAssetList() {
  loading.value = true;
  assetList.value = await getAssetList();
  loading.value = false;
}

function uploadSuccessFn(res, fieldName = "") {
  formOne.value[fieldName] = res.map(p => p.data.fileId).join(",");
}

/**
 * 提交表单
 */
const submitOne = () => {
  if (!formOneRef.value) return;
  formOneRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      let param = {};
      Object.assign(param, formOne.value);

      editRepair(param).then(res => {
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
// endregion

// region 表单Two
const formTwoRef = useTemplateRef("formTwoRef");
const formTwoRules = ref({
  targetType: [
    {required: true, message: "请选择报修目标类型", trigger: "blur"}
  ],
  targetId: [
    {required: true, message: "请选择报修目标", trigger: "blur"},
  ],
})
let formTwoCache = null;
const formTwo = ref({
  repairId: "", // 维修记录ID
  targetType: "", // 报修目标类型，1-车辆，2-充电桩，9-其他
  targetId: "", // 报修目标ID
  targetDesc: "", // 报修目标描述
  reportStaffId: "", // 报修人，对应人员表
  reportStaffName: "", // 报修人，对应人员表
  reportTime: "", // 报修时间
  reportDesc: "", // 故障描述
  reportPhotosId: "", // 报修照片集ID
  handleStaffId: "", //	处理人，对应人员表
  handleStaffName: "", // 处理人，对应人员表
  handleTime: "", // 处理时间
  faultType: "", // 问题分类，字典类型fault_type
  faultLevel: "", // 严重程度，0-无需处理，1-轻微（不影响使用），
  assetId: "", // 资产ID
  ifWarranty: "", // 是否质保，0-否，1-是
  progressDesc: "", // 进展说明
  repairParty: "", // 承修方
  repairMode: "", // 承修方式，1-上门，2-送修，3-远程支持，9-其他
  solveTime: "", // 解决时间
  costAmount: "", // 费用金额，单位为元
  repairStatus: "", // 维修状态，0-待处理，1-已响应，2-维修中，3-已
  remark: "", // 备注
  repairPhotosId: "",// 维修照片集ID
  isEdit: false,
  done: false,
})


/**
 * 提交表单
 */
const submitTwo = () => {
  if (!formTwoRef.value) return;
  formTwoRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      let param = {};
      Object.assign(param, formTwo.value);

      confirmRepair(param).then(res => {
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
// endregion

// region 表单Three
const formThreeRef = useTemplateRef("formThreeRef");
const formThreeRules = ref({
  targetType: [
    {required: true, message: "请选择报修目标类型", trigger: "blur"}
  ],
  targetId: [
    {required: true, message: "请选择报修目标", trigger: "blur"},
  ],
})

const formThree = ref({
  repairId: "", // 维修记录ID
  targetType: "", // 报修目标类型，1-车辆，2-充电桩，9-其他
  targetId: "", // 报修目标ID
  targetDesc: "", // 报修目标描述
  reportStaffId: "", // 报修人，对应人员表
  reportStaffName: "", // 报修人，对应人员表
  reportTime: "", // 报修时间
  reportDesc: "", // 故障描述
  reportPhotosId: "", // 报修照片集ID
  handleStaffId: "", //	处理人，对应人员表
  handleStaffName: "", // 处理人，对应人员表
  handleTime: "", // 处理时间
  faultType: "", // 问题分类，字典类型fault_type
  faultLevel: "", // 严重程度，0-无需处理，1-轻微（不影响使用），
  assetId: "", // 资产ID
  ifWarranty: "", // 是否质保，0-否，1-是
  progressDesc: "", // 进展说明
  repairParty: "", // 承修方
  repairMode: "", // 承修方式，1-上门，2-送修，3-远程支持，9-其他
  solveTime: "", // 解决时间
  costAmount: "", // 费用金额，单位为元
  repairStatus: "", // 维修状态，0-待处理，1-已响应，2-维修中，3-已
  remark: "", // 备注
  repairPhotosId: "",// 维修照片集ID
  isEdit: false,
  done: false
})
let formThreeCache = null;

/**
 * 提交表单
 */
const submitThree = () => {
  if (!formThreeRef.value) return;
  formThreeRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      let param = {};
      Object.assign(param, formThree.value);

      updateRepairProgress(param).then(res => {
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
// endregion

const uploadingFn = (val) => {
  loading.value = val;
}
</script>
<style lang="less">
.editRepair {
  .card {
    margin-bottom: 20px;
    flex: 1;

    .el-card__header {
      background-color: #f7f7f7;
    }
  }
}
</style>
