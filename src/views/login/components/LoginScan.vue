<template>
  <div class="loginScan">
    <el-popover :width="300" popper-class="qr-mp-code-wrap" placement="top-end">
      <template #reference>
        <!--          -->
        <a>使用微信扫码登录</a>
      </template>
      <template #default>
        <img class="qr-mp-code-img" :src="mpImg" alt="国润宝-微信公众号">
        <div class="qr-mp-code">请关注：国润宝-微信公众号</div>
      </template>
    </el-popover>
    <div class="qr-code-wrap">
      <img class="qr-code-img" :src="qrUrl" ref="qrcodeRef" alt="" @load="handleImgLoaded"/>
      <div class="scan_info" v-if="scanned">
        <div class="scan_mask">
          <svg class="scan_mask_svg" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M18 9.111C18 13.971 13.97 18 8.889 18 4.029 18 0 13.97 0 9.111 0 4.03 4.03 0 8.889 0 13.97 0 18 4.03 18 9.111zM4.788 9.79l2.876 2.976c.041.043.109.047.15.007l6.327-6.227a.196.196 0 00-.006-.275l-.236-.233a.221.221 0 00-.291-.017l-5.792 4.825c-.037.032-.114.034-.161-.002L5.329 9.06c-.09-.068-.207-.043-.274.048l-.28.38a.234.234 0 00.013.3z"
                fill="#09BB07" fill-rule="evenodd"></path>
          </svg>
          <h2 class="scan_info_title">扫码成功</h2>
        </div>
        <template v-if="!loginScanInfo">
          <p class="scan_info_desc">请在微信中点击确认登录</p>
          <a @click="refreshCode">重新扫码</a>
        </template>
      </div>
      <div class="scan_info" v-show="qrStatus==7">
        <div class="scan_mask a" @click="refreshCode">
          <el-icon style="vertical-align: middle;height: 50px;width: 50px">
            <RefreshRight style="width: 10em;height:10em;"></RefreshRight>
          </el-icon>
          <div class="mt-20">{{ loginScanInfo }}</div>
          <div class="mt-10 refresh_a">二维码已失效</div>
        </div>
      </div>
    </div>

    <div v-if="!scanned">
      请使用微信扫一扫登录
    </div>
  </div>
</template>

<script setup>
import {getLoginQrCodeStatus} from "@/api/api.auth.js";
import {ref, onMounted, onUnmounted} from "vue";
import {RefreshRight, Refresh} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {GlobalStore} from "@/store";
import {useRouter} from "vue-router";
import {BASE_URL} from "@/config/config.js";
import mpImg from "@/assets/images/langzhao-mp.jpg";

const _qrUrl = BASE_URL + "/login-qrcode";
const router = useRouter();
const globalStore = GlobalStore();
const QrLoginState = {
  0: "未扫码",
  1: "已扫码",
  2: "已授权登录",
  3: "已登录",
  4: "已失效",
  5: "登录失败"
};
const loading = ref(false);
const loginScanInfo = ref("");
const scanned = ref(false);
const qrcodeRef = ref(null);
const qrUrl = ref(BASE_URL + "/login-qrcode");
const qrKey = ref(_qrUrl);
const qrStatus = ref(0);
let controller = null;
const qrLogin = () => {

};
let loopLoginState = false;
const loopLogin = () => {
  loading.value = true;
  getLoginQrCodeStatus({qrKey: qrKey.value, status: qrStatus.value}, false, controller).then(res => {
    /*
    const (
	    QrcodeStatusCreate QrcodeStatusType = 0
	    QrcodeStatusScanned = 1
	    QrcodeStatusConfirm = 2
	    QrcodeStatusCancel = 3
	    QrcodeStatusSuccess = 4
	    QrcodeStatusFail = 5
	    QrcodeStatusError = 6
	    QrcodeStatusTimeout = 7
    )
    */
    qrStatus.value = res.status;
    loopLoginState = false;
    switch (res.status) {
      case 0:
        loopLoginState = true;
        break;
      case 1:
        scanned.value = true;
        loopLoginState = true;
        break;
      case 2:
        let data = res.data || {};
        globalStore.setToken(data.token ?? "");
        globalStore.setUserInfo(data.userInfo);
        globalStore.setCustomerInfo(data.customerInfo);
        globalStore.setRoleInfoList(data.roleInfoList);
        ElMessage.success("登录成功！");
        if (globalStore.loginToType === 1) {
          router.push({name: "largeScreen"})
        } else {
          router.push({name: "home"});
        }
        return;
      case 3:
        break;
      case 4:
      case 5:
      case 6:
        return;
      case 7:
        scanned.value = false;
        return;
      default:
        break;
    }
    setTimeout(() => {
      if (loopLoginState) loopLogin();
    }, 200);
  }).catch(err => {
    loginScanInfo.value = err.msg ? err.msg : "获取二维码状态失败";
    qrStatus.value = 7;
    scanned.value = false;
    loopLoginState = false;
  }).finally(() => {
    loading.value = false;
  })
}

function refreshCode() {
  qrStatus.value = 0;
  scanned.value = false;
  qrUrl.value = _qrUrl + "?i=" + Math.random();
}

function handleImgLoaded() {
  cookieStore.get("c_langzhaozhihui_qrlogin_key").then(res => {
    if (res) {
      qrKey.value = res.value;
      loopLoginState = true;
      setTimeout(() => {
        loopLogin();
      }, 2000);
    }
  }).catch(e => {
    console.error(e)
  })
}

onMounted(() => {
  controller = new AbortController();
  refreshCode();
})
onUnmounted(() => {
  loopLoginState = false;
  controller.abort();
})
</script>

<style lang="less">
.loginScan {
  text-align: center;


  .scan_info {
    position: absolute;
    top: 0;
    left: 35px;
    //right: 0;
    //bottom: 0;
    text-align: center;
    width: 250px;
    height: 250px;
  }

  .scan_info_title {
    font-size: 16px;
    margin-top: 5px;
    font-weight: 400;
  }

  .scan_info_desc {
    color: #7e8081;
    padding-bottom: 10px;
  }

  .scan_mask {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: hsla(0, 0%, 100%, 0.85);
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .scan_mask_svg {
    //display: table-cell;
    vertical-align: middle;
    width: 100px;
    height: 100px;
    margin-top: 50px;
  }
}
</style>
