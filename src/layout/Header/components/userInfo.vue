<template>
  <el-dialog v-model="dialogVisible" title="修改密码" width="500px" :loading="loading">
    <el-form :model="form" label-width="100" :rules="rules" ref="formRef" status-icon>
      <el-form-item label="旧密码" prop="oldPassword">

      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">

      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">

      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from "vue";
import {changePassword} from "@/api/api.account.js";
import { ElNotification } from "element-plus";

const dialogVisible = ref(false);
let loading = ref(false);
// open
const open = () => {
  dialogVisible.value = true;
};

defineExpose({
  open
});

/** @type {FormRef} */
const formRef = ref();

const validateNewPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (value.length < 6 || value.length > 16) {
    callback(new Error('密码长度在 6 到 16 个字符'));
  } else if (!(/[0-9]/.test(value) && /[a-zA-Z]/.test(value))) {
    callback(new Error("密码需要包含数字和字母"));
  } else callback();
}
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (value !== form.value.newPassword) {
    callback(new Error('两次输入密码不一致!'));
  } else callback();
}
const rules = reactive({
  oldPassword: [
    {required: true, message: "请输入旧密码", trigger: "blur"},
    {min: 6, max: 16, message: "密码长度在 6 到 16 个字符", trigger: "blur"}
  ],
  newPassword: [
    {required: true, message: "请输入新密码", trigger: "blur"},
    {min: 6, max: 16, message: "密码长度在 6 到 16 个字符", trigger: "blur"},
    {validator: validateNewPassword, trigger: "blur"}
  ],
  confirmPassword: [
    {required: true, message: "请再次输入新密码", trigger: "blur"},
    {min: 6, max: 16, message: "密码长度在 6 到 16 个字符", trigger: "blur"},
    {validator: validateConfirmPassword, trigger: "blur"}
  ]
});

let form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

/**
 * 提交表单
 * @param {FormRef|undefined} formRef
 */
const submit = (formRef) => {
  if (!formRef) return;
  formRef.validate(async (valid) => {
    if (valid) {
      changePassword({OldPassword: form.value.oldPassword, NewPassword: form.value.newPassword}).then(res => {
        ElNotification.success("修改成功");
        dialogVisible.value = false;
      });
    }
  });
};
</script>

<style scoped lang="less">

</style>
