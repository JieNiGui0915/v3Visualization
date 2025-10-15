<template>
  <el-dialog v-model="dialogVisible" title="重置密码" width="600px" draggable class="resetPassword"
    @close="handleClosedDialog(formRef)" center top="10px">
    <el-form :model="form" :rules="rules" label-width="auto" ref="formRef" status-icon v-loading="loading">
      <el-form-item label="账户名" prop="userName">
        {{ form.userName }}
      </el-form-item>
      <el-form-item label="真实姓名" prop="fullName">
        {{ form.fullName }}
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <template #label>
          <el-tooltip effect="light" content="密码需要满足: 至少一位小写字母,至少一位大小字母,至少一位数字,至少一位特殊字符(!@#$%^&*),且密码长度至少8位"
            placement="top-start">
            <span>新密码<el-icon>
                <Warning />
              </el-icon></span>
          </el-tooltip>
        </template>
        <el-input v-model="form.newPassword" placeholder="需要有小写字母/大小字母/数字/特殊字符,长度为8位" clearable></el-input>
        <el-button type="primary" plain @click="generateRandomPassword">随机生成</el-button>
      </el-form-item>
      <div class="flex_row flex-center mt-50">
        <el-button type="primary" @click="submit(formRef)">提交</el-button>
      </div>
    </el-form>
  </el-dialog>
  <el-dialog v-model="confirmDialog" title="提示" width="30%" top="10px" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false">
    <div>
      <div>账号密码重置成功。</div>
      <div class="mt-20">账号：<span style="font-weight: bold">{{ formConfirmValue.userName }}</span></div>
      <div>新密码：<span style="font-weight: bold">{{ formConfirmValue.newPassword }}</span></div>
      <div class="mt-20">此密码仅展示一次，请及时保存或告知用户。</div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" plain @click="handleConfirm">
          已知晓
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { nextTick, ref } from "vue";
import { ElMessage } from "element-plus";
import { randomRange } from "@/utils/util.js";
import * as accountApi from "@/api/api.account.js";

const dialogVisible = ref(false);
const confirmDialog = ref(false);
const loading = ref(false);
// open
const open = (item) => {
  Object.assign(form.value, item);
  dialogVisible.value = true;
};
defineExpose({
  open
});

const validateNewPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else if (value.length < 6 || value.length > 16) {
    callback(new Error('密码长度在 6 到 16 个字符'));
  } else if (!(/[0-9]/.test(value) && /[a-zA-Z]/.test(value))) {
    callback(new Error("密码需要包含数字和字母"));
  } else callback();
}

/** @type {FormRef} */
const formRef = ref(null);
const emit = defineEmits(['close']);
const rules = ref({
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
    { validator: validateNewPassword, trigger: "blur" }
  ]
})

const form = ref({
  userId: null,
  userName: "",
  fullName: "",
  newPassword: "",
});
const formConfirmValue = ref({
  userId: null,
  userName: "",
  fullName: "",
  newPassword: "",
})

/**
 * 提交表单
 * @param {FormRef} formRef
 */
const submit = (formRef) => {

  if (!formRef) return;
  formRef.validate((valid) => {
    if (valid) {
      let param = {
        userId: form.value.userId,
        newPassword: form.value.newPassword
      };
      loading.value = true;
      accountApi.resetPassword(param).then(res => {
        ElMessage.success('重置成功');

        formConfirmValue.value.userId = form.value.userId;
        formConfirmValue.value.userName = form.value.userName;
        formConfirmValue.value.fullName = form.value.fullName;
        formConfirmValue.value.newPassword = form.value.newPassword;
        dialogVisible.value = false;
        confirmDialog.value = true;
      }).finally(() => {
        loading.value = false;
      })
    }
  });
}

const handleClosedDialog = (formRef) => {
  if (formRef) formRef.resetFields();
  loading.value = false;
}


function generateRandomPassword() {
  form.value.newPassword = randomRange(8);
  formRef.value.clearValidate(["newPassword"]);
}

function handleConfirm() {
  confirmDialog.value = false;
  formConfirmValue.value.userId = "";
  formConfirmValue.value.userName = "";
  formConfirmValue.value.fullName = "";
  formConfirmValue.value.newPassword = "";
}
</script>
<style lang="less">
.resetPassword {}
</style>
