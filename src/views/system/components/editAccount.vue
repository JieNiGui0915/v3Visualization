<template>
  <el-dialog v-model="dialogVisible" title="编辑账户" width="50%" center top="10px" class="editAccount"
    @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <div class="flex_row">
        <div class="flex-1">
          <el-form-item label="账户名称" prop="userName">
            <el-input v-model="form.userName" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="fullName">
            <el-input v-model="form.fullName" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCardNumber">
            <el-input v-model="form.idCardNumber" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobileNumber">
            <el-input v-model="form.mobileNumber" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="电邮" prop="email">
            <el-input v-model="form.email" placeholder="" clearable></el-input>
          </el-form-item>

        </div>
        <div class="flex-1">
          <el-form-item label="用户类型" prop="userType">
            <el-select v-model="form.userType" placeholder="" clearable>
              <el-option label="系统管理员" :value="1"></el-option>
              <el-option label="普通用户" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="roleIds">
            <el-select v-model="form.roleIds" placeholder="" clearable multiple>
              <el-option v-for="item in allRoles" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                <span class="option_left">{{ item.roleName }}</span>
                <span class="option_right">{{ item.roleNickname }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="民族" prop="nation">
            <el-select v-model="form.nation" placeholder="" clearable>
              <el-option v-for="item in allNation" :key="item.dictId" :label="item.dictLabel" :value="item.dictLabel">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学历" prop="education">
            <el-select v-model="form.education" placeholder="" clearable>
              <el-option label="小学" value="primary"></el-option>
              <el-option label="初中" value="junior"></el-option>
              <el-option label="高中" value="senior"></el-option>
              <el-option label="大专" value="college"></el-option>
              <el-option label="本科" value="bachelor"></el-option>
              <el-option label="硕士" value="master"></el-option>
              <el-option label="博士" value="doctor"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证地址" prop="cardAddress">
            <el-input type="textarea" v-model="form.cardAddress" placeholder="" clearable></el-input>
          </el-form-item>
        </div>
      </div>


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
import { editUser } from '@/api/api.account.js';
import * as dictApi from "@/api/api.dict.js";
import { getAllRoles } from "@/api/api.role.js";
import { ElMessage } from "element-plus";
import { isString } from "@/utils/is";
import { randomRange } from "@/utils/util";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
  userId: '',// 用户ID
  staffId: '',// 人员信息
  userName: '',// 用户名
  password: '',// 密码
  userType: '',// 用户类型
  idCardId: '',// 身份证ID
  fullName: '',// 姓名
  idCardNumber: '',// 身份证号
  mobileNumber: '',// 手机号
  email: '',// 电邮
  sex: '',// 性别
  nation: '',// 民族
  education: '',// 学历
  cardAddress: '',// 身份证地址
  remark: '',// 备注
  roleIds: [] // 角色ID列表
});
/**
 * 打开弹窗
 * @param {form} item
 */
const open = (item) => {
  dialogVisible.value = true;
  Object.assign(form.value, item);
  loadAllNation();
  loadAllRoles();
};
defineExpose({
  open
});

/** @type {FormRef} */
const formRef = ref(null);
const emit = defineEmits(['close']);
const rules = ref({
  userName: [
    { required: true, message: "请输入用户名", trigger: ["blur", "change"] },
  ],
  userType: [
    { required: true, message: "请选择用户类型", trigger: ["blur", "change"] },
  ],
  fullName: [
    { required: true, message: "请输入真实姓名", trigger: ["blur", "change"] },
  ],
  idCardNumber: [
    { required: false, message: "请输入身份证号", trigger: ["blur", "change"] },
    // {
    //   validator: (rule, value, callback) => {
    //     if (!value) {
    //       callback(new Error("请输入身份证号"));
    //     } else if (!/^\d{15}|\d{18}$/.test(value)) {
    //       callback(new Error("身份证号格式不正确"));
    //     } else {
    //       callback();
    //     }
    //   },
    //   trigger: ["blur", "change"]
    // }
  ],
  mobileNumber: [
    { required: true, message: "请输入手机号", trigger: ["blur", "change"] },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入手机号"));
        } else if (!/^1[3-9]\d{9}$/.test(value)) {
          callback(new Error("手机号格式不正确"));
        } else {
          callback();
        }
      },
      trigger: ["blur", "change"]
    }
  ],
  roleIds: [
    { required: true, message: "请选择角色", trigger: ["blur", "change"] },
  ]
})


function generateRandomPassword() {
  form.value.password = randomRange(8);
  // formRef.value.clearValidate(["password"]);
  // nextTick(() => {
  //   formRef.value.clearValidate(["password"]);
  // })
}


const allNation = ref([]);
function loadAllNation() {
  dictApi.dictDataAll("nation").then(res => {
    allNation.value = res;
  });
}

const allRoles = ref([]);
function loadAllRoles() {
  getAllRoles().then(res => {
    allRoles.value = res;
  });
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
      editUser(form.value).then(res => {
        ElMessage.success("编辑成功");
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
.editAccount {}
</style>
