<template>
  <div role="alert" class="wechat-info-msg weui-information-bar" :class="typeClass" v-if="showing">
    <div class="weui-information-bar__hd">
      <i class="weui-icon-success" v-if="_type==='success'"></i>
      <i class="weui-icon-outlined-warn" v-else></i>
    </div>
    <div class="weui-information-bar__bd">
      {{ msg }}
    </div>
    <div class="weui-information-bar__ft">
      <button class="weui-btn_icon" @click.stop="handleClose">关闭<i class="weui-icon-close-thin"></i></button>
    </div>
  </div>
</template>
<script setup>
import {ref, watch} from "vue"

const msg = ref("")
const showing = ref(false)
const _type = ref("default")
const typeClass = ref("weui-information-bar_tips-strong");
defineExpose({
  show,
  open,
  close
});


/**
 * 显示toast
 * @param {String} message
 * @param {'success'|'warn'|'error'|'tip'|'default'|null} type
 * @param duration
 */
function open(message = "", type = "default", duration = 2000) {
  return show(message, type, duration);
}

/**
 * 显示toast
 * @param {String} message
 * @param {'success'|'warn'|'error'|'tip'|'default'|null} type
 * @param duration
 */
function show(message = "", type = "success", duration = 2000) {
  msg.value = message;
  _type.value = type;
  showing.value = true;
  switch (type) {
    case "success":
      typeClass.value = "weui-information-bar_success-strong";
      break;
    case "warn":
      typeClass.value = "weui-information-bar_tips-strong";
      break;
    case "error":
      typeClass.value = "weui-information-bar_warn-strong";
      break;
    case "tip":
      typeClass.value = "weui-information-bar_tips-strong";
      break;
    case "default":
      typeClass.value = "weui-information-bar_tips-weak";
      break;
    case null:
      typeClass.value = "weui-information-bar_tips-weak";
      break;
  }

  if (duration > 0) {
    setTimeout(() => {
      showing.value = false;
      msg.value = "";
    }, duration)
  }
}

function close() {
  msg.value = "";
  showing.value = false;
}

function handleClose() {
  close();
}
</script>
<style lang="less">
.wechat-info-msg {
  z-index: 1901;
}
</style>
