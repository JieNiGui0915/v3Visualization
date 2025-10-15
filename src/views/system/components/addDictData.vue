<template>
  <el-dialog v-model="dialogVisible" title="添加字典数据" width="40%" center top="10px" class="addDict" @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <el-form-item label="字典类型编码" prop="dictType">
        <el-input v-model="form.dictType" placeholder="" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="数据标签" prop="dictLabel" required>
        <el-input v-model="form.dictLabel" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="数据键值" prop="dictValue" required>
        <el-input v-model="form.dictValue" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="显示排序" prop="dictSort">
        <el-input-number v-model="form.dictSort" :min="0"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="" :autosize="{ minRows: 2, maxRows: 4 }" clearable></el-input>
      </el-form-item>

      <div class="flex_row flex-align-center mt-50">
        <el-button type="primary" @click="submit(formRef)">提交</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script setup>
import {ref} from "vue";
import * as dictApi from "@/api/api.dict.js";
import {ElMessage} from "element-plus";
import {isString} from "@/utils/is";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
  "dictId": 0,
  "dictType": "",
  "dictLabel": "",
  "dictValue": "",
  "dictSort": 0,
  "remark": "",
});

/**
 * 打开弹窗
 * @param {form} item
 */
const open = (item) => {
  dialogVisible.value = true;
  form.value.dictType = item.dictType;
};
defineExpose({
  open
});

/** @type {FormRef} */
const formRef = ref(null);
const emit = defineEmits(['close']);
const rules = ref({
  dictName: [
    {required: true, message: "请输入字典名称", trigger: "blur"},
  ],
  dictType: [
    {required: true, message: "请输入字典类型", trigger: "blur"},
  ]
})

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

      dictApi.dataAdd(param).then(res => {
        ElMessage.success("添加成功");
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
.addDictData {
}
</style>
