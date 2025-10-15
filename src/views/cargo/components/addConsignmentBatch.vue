<template>
  <el-dialog v-model="dialogVisible" title="添加委托批次" width="40%" center top="10px" class="addConsignmentBatch" @close="handleClosedDialog(formRef)"
             :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <el-form-item label="计划装车时间" prop="planTime">
        <el-date-picker v-model="form.planTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm" :editable="false" placeholder=""
                        clearable :shortcuts="shortcuts"/>
      </el-form-item>
      <el-form-item label="批次量" prop="batchVolume">
        <el-input v-model="form.batchVolume" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="装车道号" prop="areaNo">
        <el-input v-model="form.areaNo" type="number" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="铲车数量" prop="shovelNum">
        <el-input v-model="form.shovelNum" type="number" placeholder="" clearable></el-input>
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
import {ref} from "vue";
import * as consignmentApi from "@/api/api.consignment.js";
import {ElMessage} from "element-plus";
import {isString} from "@/utils/is";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
  "consignmentId": "",
  "batchVolume": "",
  "areaNo": "",
  "shovelNum": "",
  "planTime": "",
  "remark": "",
});
/**
 * 打开弹窗
 * @param {form} item
 */
const open = (item) => {
  form.value.consignmentId = item.consignmentId;
  dialogVisible.value = true;
};
defineExpose({
  open
});

/** @type {FormRef} */
const formRef = ref(null);
const emit = defineEmits(['close']);
const rules = ref({
  planTime: [
    {required: true, message: "请选择计划装车时间", trigger: "blur"}
  ],
  batchVolume: [
    {required: true, message: "请输入批次量", trigger: "blur"},
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
]
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
      let keys = Object.keys(param);
      for (let i = 0; i < keys.length; i++) {
        if (isString(param[keys[i]])) {
          param[keys[i]] = param[keys[i]].trim();
          if (param[keys[i]] === "") {
            param[keys[i]] = null;
          }
        }
      }

      consignmentApi.addConsignmentBatchByShipper(param).then(res => {
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
.addConsignmentBatch {

}
</style>
