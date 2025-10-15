<template>
  <el-dialog v-model="dialogVisible" title="编辑字典类型" width="40%" center top="10px" class="editDict" @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="form.dictName" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="form.dictType" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="" autosize clearable></el-input>
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
  "dictName": "",
  "dictType": "",
  "remark": "",
});
/**
 * 打开弹窗
 * @param {form} item
 */
const open = (item) => {
  dialogVisible.value = true;
  Object.keys(item).forEach(k => {
    if (isString(item[k])) {
      item[k] = item[k].trim();
    }
  })
  Object.assign(form.value, item);
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

      dictApi.typeEdit(param).then(res => {
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
.editDict {
}
</style>
