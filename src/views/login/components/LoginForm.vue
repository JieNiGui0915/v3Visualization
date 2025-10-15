<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large" class="login-form-class" status-icon>
    <el-form-item prop="UserName">
      <el-input v-model="loginForm.UserName" autocomplete="off" clearable placeholder="账户名">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="Password">
      <el-input type="password" show-password v-model="loginForm.Password" autocomplete="off" clearable
        placeholder="密码">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="CaptchaCode">
      <el-col :span="13">
        <el-input link ref="captchaCodeRef" v-model="loginForm.CaptchaCode" clearable placeholder="验证码">
          <template #prefix>
            <el-icon class="el-input__icon">
              <lock />
            </el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="11">
        <img v-show="verificationCode" title="点击刷新,失效时间为一分钟" @click="refreshCode" class="captcha-code-img"
          :src="verificationCode" alt="验证码">
        <a class="captcha-code-no-data" title="点击重新加载" @click="refreshCode" v-show="!verificationCode">{{ loadState
          }}</a>
      </el-col>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-row>
      <el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" style="width:100%"
        :loading="loading">
        登录
      </el-button>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { Lock, UserFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import * as accountApi from "@/api/api.account";
import { GlobalStore } from "@/store";
import { BASE_URL } from "@/config/config.js";

const globalStore = GlobalStore();
// 登录表单数据
const loginForm = reactive({
  UserName: "",
  Password: "",
  CaptchaCode: "",
  CaptchaId: ""
})
const loading = ref(false);

const router = useRouter();
// 定义 formRef（校验规则）

const loginFormRef = ref();
const loginRules = reactive({
  UserName: [{ required: true, message: "请输入用户名", trigger: ["blur", "change"] }],
  Password: [{ required: true, message: "请输入密码", trigger: ["blur", "change"] }],
  CaptchaCode: [{ required: true, message: "请输入验证码", trigger: ["blur", "change"] }]
});
let isDev = import.meta.env.DEV;
onMounted(() => {
  // 获取验证码
  getVerificationCode();
  if (isDev && BASE_URL.includes("localhost")) {
    loginForm.CaptchaCode = "1111";
  }
})
let verificationCode = ref();
//#region 验证码
let autoRefreshCodeTime = 60 * 1000;
let autoRefreshCodeTimeId = 0;
const loadState = ref("");
const captchaCodeRef = ref(null);

function getVerificationCode() {
  if (autoRefreshCodeTimeId) {
    clearTimeout(autoRefreshCodeTimeId);
  }
  loadState.value = "验证码加载中 ... ";
  accountApi.verificationCode().then(res => {
    loadState.value = "";
    verificationCode.value = res.captcha;
    loginForm.CaptchaId = res.captchaId;
  }).catch(e => {
    verificationCode.value = "";
    loginForm.CaptchaId = "";
    loadState.value = "加载失败,请点击刷新";
    autoRefreshCodeTimeId = setTimeout(() => {
      getVerificationCode();
    }, autoRefreshCodeTime)
  })
}

function refreshCode() {
  getVerificationCode();
}

//#endregion

// login
const login = (formEl) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (valid) {
      loading.value = true;
      try {
        let requestLoginForm = {
          userName: loginForm.UserName,
          password: loginForm.Password,
          captcha: loginForm.CaptchaCode,
          captchaId: loginForm.CaptchaId || "123456789"
        };
        const res = await accountApi.login(requestLoginForm);

        loading.value = false;
        globalStore.setToken(res.token ?? "");
        globalStore.setUserInfo(res.userInfo);
        ElMessage.success("登录成功！");
        if (globalStore.loginToType === 1) {
          await router.push({ name: "largeScreen" })
        } else {
          await router.push({ name: "home" });
        }
      } catch (e) {
        selectCheckCodeText();
        refreshCode();
        loading.value = false;
      }
    }
  });
};

// resetForm
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

function keyboardEventListener(e) {
  if (e.key === "Enter" || e.key === "MAC_ENTER") {
    login(loginFormRef.value);
  }
}

function selectCheckCodeText() {
  let inputDom = captchaCodeRef.value;
  if (inputDom) {
    inputDom.focus();
    inputDom.select();
  }
}

onMounted(() => {
  window.addEventListener("keyup", keyboardEventListener, false);
})
onUnmounted(() => {
  window.removeEventListener("keyup", keyboardEventListener, false);
  if (autoRefreshCodeTimeId) {
    clearTimeout(autoRefreshCodeTimeId);
  }
})
</script>

<style lang="less">
.login-form-class {
  .el-form-item {
    margin-bottom: 35px;
  }

  .login-btn {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    white-space: nowrap;

    .el-button {
      width: 185px;
    }
  }

  .captcha-code-img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .captcha-code-no-data {
    cursor: pointer;
    margin-left: 10px;
  }
}
</style>
