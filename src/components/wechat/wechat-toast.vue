<template>
  <div class="wechat-toast" role="alert" v-if="showing">
    <div class="weui-mask_transparent"></div>
    <div class="weui-toast">
      <i class="weui-icon-success-no-circle weui-icon_toast wechat-toast-z-index" v-if="_type==='success'"></i>
      <i class="weui-icon-warn weui-icon_toast" v-else-if="_type==='error'"></i>
      <i class="weui-icon-warn weui-icon_toast" v-else-if="_type==='warning'"></i>
      <p class="weui-toast__content">{{ msg }}</p>
    </div>
  </div>
</template>
<script setup>
import {ref, watch} from "vue"

const msg = ref("")
const showing = ref(false)
const _type = ref("success")
defineExpose({
  show,
  open,
  close
});


/**
 * 显示toast
 * @param {String} message
 * @param {'success'|'error'|''|null} type
 * @param duration
 */
function open(message = "", type = "success", duration = 2000) {
  return show(message, type, duration);
}

/**
 * 显示toast
 * @param {String} message
 * @param {'success'|'error'|''|null} type
 * @param duration
 */
function show(message = "", type = "success", duration = 2000) {
  msg.value = message;
  _type.value = type;
  showing.value = true;
  setTimeout(() => {
    showing.value = false;
    msg.value = "";
  }, duration)
}

function close() {
  msg.value = "";
  showing.value = false;
}
</script>
<style lang="less">
.wechat-toast {
  .wechat-toast-z-index {
    z-index: 1902;
  }
}
</style>
