<template>
  <div class="login-container flex-center">
    <div class="login-box">
      <!-- <div class="login-title">大宗货物整车区域物流平台{{ mode }}</div> -->
      <div class="login-content">
        <div class="login-left">
          <img src="@/assets/images/login_left.svg" alt="login" />
          <version />
        </div>
        <div class="login-form">
          <a v-if="isUserNameLogin" @click="switchLoginSchema" class="qr-login-logo"></a>
          <a v-else @click="switchLoginSchema" class="pc-login-logo"></a>
          <div class="login-logo" @click="startRecognition">
            <img class="login-icon" :src="CONFIG.webLogoLarge" alt="" />
          </div>
          <LoginForm ref="loginRef" v-if="isUserNameLogin"></LoginForm>
          <LoginScan ref="loginScanRef" v-else></LoginScan>
          <div class="login-to">
            <span class="mr-10">选择进入:</span>
            <el-radio-group v-model="loginToType" @change="handleChangeLoginToType">
              <el-radio :value="0">管理端</el-radio>
              <el-radio :value="1">大屏展示</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from "./components/LoginForm.vue";
import LoginScan from "./components/LoginScan.vue";
import Version from "./components/version.vue";
import { onMounted, ref } from "vue";
import { GlobalStore } from "@/store";
import { CONFIG } from "@/config/config";
import WebSpeech from "@/utils/webSpeech.js";

let globalStore = GlobalStore();
let mode = import.meta.env.MODE;
if (mode === "production" || mode === "prod") {
  mode = "";
}
if (mode) {
  mode = "【" + mode + "】"
}

// 使用子组件数据
const loginRef = ref(null);
const isUserNameLogin = ref(true);

const switchLoginSchema = () => {
  isUserNameLogin.value = !isUserNameLogin.value;
};

const loginToType = ref(0);

function handleChangeLoginToType() {
  globalStore.setLoginToType(loginToType);
}

let ws = null;
function initWebSpeech() {
  ws = new WebSpeech({
    lang: 'zh-CN',
    onResult: (text) => console.log('识别结果:', text),
    onError: (e) => console.error('语音错误:', e),
    onEnd: () => console.log('识别/朗读结束'),
  });
}

function speechHello() {
  if (ws) {
    ws.speak('欢迎使用语音识别功能');
  }
}

function startRecognition() {
  if (ws) {
    ws.startRecognition(null);
  }
}

onMounted(() => {
  loginToType.value = 0;
  handleChangeLoginToType();

  // initWebSpeech();
})
</script>

<style lang="less">
@import "./index.less";
</style>
