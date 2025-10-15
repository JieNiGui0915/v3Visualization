<template>
  <!--BEGIN dialog1-->
  <div class="js_dialog wechat-dialog" role="dialog" aria-hidden="true" aria-modal="true" aria-labelledby="js_title1" v-if="showing">
    <div class="weui-mask"></div>
    <div class="weui-dialog wechat-dialog-z-index">
      <div class="weui-dialog__hd"><strong class="weui-dialog__title">{{ titleText }}</strong></div>
      <div class="weui-dialog__bd" v-html="msg"></div>
      <div class="weui-dialog__ft">
        <a role="button" class="weui-dialog__btn weui-dialog__btn_default" @click="handleCancel" v-if="configData.showCancel">{{ configData.cancelText }}</a>
        <a role="button" class="weui-dialog__btn weui-dialog__btn_primary" @click="handleConfirm">{{ configData.confirmText }}</a>
      </div>
    </div>
  </div>
  <!--END dialog1-->
</template>
<script setup>
import {ref} from "vue";

let configData = ref({
  confirmText: "确定",
  cancelText: "取消",
  showCancel: false,
  confirmFn: () => null,
  cancelFn: () => null
})

// let props = defineProps({
//   confirmText: {type: String, default: "确定"},
//   cancelText: {type: String, default: "取消"},
//   showCancel: {type: Boolean, default: false}
// })

let emit = defineEmits(["cancel", "confirm", "close"])

const titleText = ref("")
const msg = ref("")
defineExpose({
  open,
  close
})
const showing = ref(false);

function handleConfirm() {
  closeDialog();
  emit("confirm")
  emit("close")
  configData.value.confirmFn();
}

function handleCancel() {
  closeDialog();
  emit("cancel")
  emit("close")
  configData.value.cancelFn();
}

/**
 * 打开对话框
 * @param message
 * @param title
 * @param {{confirmText: String, cancelText: String, showCancel: Boolean,confirmFn:Function,cancelFn:Function}} config
 */
function open(message = "", title = "提示", config = {
  confirmText: "确定",
  cancelText: "取消",
  showCancel: false,
  confirmFn: () => null,
  cancelFn: () => null
}) {
  close()
  msg.value = message
  titleText.value = title ? title : "提示";
  if (!config) {
    config = {
      confirmText: "确定",
      cancelText: "取消",
      showCancel: false,
      confirmFn: () => null,
      cancelFn: () => null
    }
  }
  if (config.confirmText == null) config.confirmText = "确定";
  if (config.cancelText == null) config.cancelText = "取消";
  if (config.showCancel == null) config.showCancel = false;
  if (config.confirmFn == null) config.confirmFn = () => close();
  if (config.cancelFn == null) config.cancelFn = () => close();
  Object.assign(configData.value, config)
  showing.value = true;
}


function closeDialog() {
  showing.value = false;
  msg.value = "";
}

function close() {
  closeDialog();
}
</script>
<style lang="less">
.wechat-dialog {
  .wechat-dialog-z-index {
    z-index: 1900;
  }
}
</style>
