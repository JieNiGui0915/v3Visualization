<template>
  <el-dialog v-model="dialogVisible" title="编辑角色" width="40%" center top="10px" class="editRole"
    @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色编码" prop="roleNickname">
        <el-input v-model="form.roleNickname" placeholder="" clearable></el-input>
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
import { ref } from "vue";
import * as roleApi from "@/api/api.role.js";
import { ElMessage } from "element-plus";
import { isString } from "@/utils/is";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
  "roleId": "",// 主键id
  "roleName": "",// 角色名称
  "roleNickname": "",// 角色编码
  "remark": "",// 备注
});
/**
 * 打开弹窗
 * @param {form} item
 */
const open = (item) => {
  dialogVisible.value = true;
  Object.assign(form.value, item);
};
defineExpose({
  open
});

/** @type {FormRef} */
const formRef = ref(null);
const emit = defineEmits(['close']);
const rules = ref({
  roleName: [
    { required: true, message: "请输入角色名称", trigger: ["blur", "change"] },
  ],
  roleNickname: [
    { required: true, message: "请输入角色编码", trigger: ["blur", "change"] },
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

      roleApi.editRole(form.value).then(res => {
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
.editRole {}
</style>
