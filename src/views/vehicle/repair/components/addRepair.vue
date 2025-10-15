<template>
  <el-dialog v-model="dialogVisible" title="添加字典类型" width="60%" center top="10px" class="addRepair" @close="handleClosedDialog(formRef)" destroy-on-close
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <el-form-item label="报修目标类型" prop="targetType">
        <el-radio-group v-model="form.targetType" @change="handleTargetTypeChange">
          <el-radio :value="item.value" v-for="item in repairTargetTypeList">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="报修目标" prop="targetId">
        <el-select v-model="form.targetId" filterable :filter-method="filterMethod" placeholder="" clearable>
          <el-option :value="item.value" :label="item.label" v-for="item in targetList">
            <span class="el-option-left">{{ item.label }}</span>
            <span class="el-option-right">{{ item.desc }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报修目标描述" prop="targetDesc">
        <el-input type="textarea" v-model="form.targetDesc" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="故障描述" prop="reportDesc">
        <el-input type="textarea" v-model="form.reportDesc" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="报修照片集ID" prop="reportPhotosId">
        <template #default="scope">
          <my-upload ref="myUploadRef" type="repair" @success="uploadSuccessFn" @uploading="uploadingFn"></my-upload>
        </template>
      </el-form-item>
      <div class="flex_row flex-justify-center mt-50">
        <el-button type="primary" @click="submit(formRef)">提交</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script setup>
import {ref, useTemplateRef} from "vue";
import {addRepair} from "@/api/api.repair.js";
import {getAllVehicleList} from "@/api/api.vehicle.js";
import {getAllPileList} from "@/api/api.pile.js";
import {ElMessage} from "element-plus";
import {isString} from "@/utils/is.js";
import {repairTargetTypeList, repairTargetTypeMap} from "@/config/const.js";
import {deepCopy} from "@/utils/util.js";
import myUpload from "@/components/form/my-upload.vue";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
  "targetType": "",
  "targetId": "",
  "targetDesc": "",
  "reportDesc": "",
  "reportPhotosId": ""
});
const open = (item) => {
  dialogVisible.value = true;
};

defineExpose({
  open
});
/** @type {FormRef} */
const formRef = useTemplateRef("formRef");
const emit = defineEmits(['close']);
const rules = ref({
  targetType: [
    {required: true, message: "请选择报修目标类型", trigger: "blur"}
  ],
  targetId: [
    {required: true, message: "请选择报修目标", trigger: "blur"},
  ],
})
const targetList = ref([]);
let targetListCache = [];
let allVehicleList = [];
let allPileList = [];

function handleTargetTypeChange() {
  form.value.targetId = "";
  switch (form.value.targetType) {
    case repairTargetTypeList[0].value:
      loadAllVehicleList();
      break;
    case  repairTargetTypeList[1].value:
      loadAllPileList();
      break;
    case repairTargetTypeList[2].value:
      loadOtherList();
      break;
    default:
      break;
  }
}


function loadAllVehicleList() {
  if (allVehicleList.length > 0) {
    targetList.value = deepCopy(allVehicleList.map(getTargetMap));
    targetListCache = targetList.value;
    return;
  }
  loading.value = true;
  getAllVehicleList().then(res => {
    allVehicleList = res;
    targetList.value = res.map(getTargetMap);
    targetListCache = targetList.value;
  }).finally(() => {
    loading.value = false;
  })

  function getTargetMap(p) {
    return {
      label: p.licensePlateNumber,
      value: p.vehicleId,
      desc: p.transportCompanyName
    }
  }
}

async function loadAllPileList() {
  if (allPileList.length > 0) {
    targetList.value = allPileList.map(getTargetMap);
    targetListCache = targetList.value;
    return;
  }
  loading.value = true;
  let res = await getAllPileList();
  allPileList = res;
  targetList.value = res.map(getTargetMap);
  targetListCache = targetList.value;
  loading.value = false;

  function getTargetMap(p) {
    return {
      label: p.pileName,
      value: p.pileId,
      desc: p.stationName
    }
  }
}

function loadOtherList() {
  targetList.value = [];
  targetListCache = [];
}


function filterMethod(item) {
  if (item === "") {
    targetList.value = targetListCache;
    return;
  }
  targetList.value = targetListCache.filter(p => p.label.includes(item) || p.desc.includes(item));
}

function uploadSuccessFn(res) {
  form.value.reportPhotosId = res.map(p => p.data.fileId).join(",");
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

      addRepair(param).then(res => {
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

const uploadingFn = (val) => {
  loading.value = val;
}
</script>
<style lang="less">
.addRepair {

}
</style>
