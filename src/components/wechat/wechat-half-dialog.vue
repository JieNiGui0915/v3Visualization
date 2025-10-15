<template>
  <div class="js_dialog_wrap wechat-half-dialog" :class="{'wechat-half-dialog-fadeIn':showing,'wechat-half-dialog-fadeOut':!showing}"
       :style="{display:showing?'':'none',opacity:showing?1:0}"
       style="transition-property: opacity;transition-duration: 0.2s;transition-delay: 0s;transition-timing-function: linear" ref="showDialog2"
       aria-labelledby="js_title2" role="dialog"
       :aria-modal="!showing" :aria-hidden="showing"
       v-if="showing">
    <div class="js_close weui-mask" @click.prevent.stop="handleClickModal"></div>
    <div class="js_dialog weui-half-screen-dialog weui-bottom-fixed-opr-page wechat-half-dialog-z-index"
         :class="{'weui-half-screen-dialog_show':showDialog,'weui-half-screen-dialog_large':isLarge}"
         :style="{zIndex:zIndex}">
      <div class="weui-half-screen-dialog__hd">
        <div class="weui-half-screen-dialog__hd__side">
          <button class="js_close weui-btn_icon weui-wa-hotarea" @click="closeDialog">关闭<i class="weui-icon-slide-down"></i></button>
          <button style="display: none;" class="weui-btn_icon weui-wa-hotarea">返回<i class="weui-icon-back-arrow-thin"></i></button>
          <button style="display: none;" class="js_close weui-btn_icon weui-wa-hotarea">关闭<i class="weui-icon-close-thin"></i></button>
        </div>
        <div class="weui-half-screen-dialog__hd__main">
          <strong class="weui-half-screen-dialog__title">
            <slot name="title"></slot>
          </strong>
        </div>
        <div class="weui-half-screen-dialog__hd__side">
          <slot name="title-right"></slot>
          <!--          <button class="weui-btn_icon weui-wa-hotarea">更多<i class="weui-icon-more"></i></button>-->
        </div>
      </div>
      <div class="weui-half-screen-dialog__bd weui-bottom-fixed-opr-page__content" style="padding-left: 2px;padding-right: 2px">
        <slot name="content"></slot>
      </div>
      <div class="weui-half-screen-dialog__ft weui-bottom-fixed-opr-page__tool" style="padding:16px 32px 24px" v-if="props.showFoot">
        <div class="weui-half-screen-dialog__btn-area">
          <!--          <a href="javascript:" class="js_close weui-btn weui-btn_primary">同意下一步</a>-->
          <slot name="foot"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref} from "vue";

let props = defineProps({
  showFoot: {
    type: Boolean,
    default: false
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: Number,
    default: 1000
  },
  isLarge: {
    type: Boolean,
    default: false
  }
})
let emit = defineEmits(["cancel", "confirm", "close"])

const msg = ref("")
defineExpose({
  open, close
})
const showing = ref(false);
const showDialog = ref(false);

function handleConfirm() {
  closeDialog();
  emit("confirm")
  emit("close")
}

function handleCancel() {
  closeDialog();
  emit("cancel")
  emit("close")
}

/**
 * 打开对话框
 */
function open() {
  showing.value = true;
  setTimeout(() => {
    showDialog.value = true;
  })
}

function close() {
  closeDialog();
}


function closeDialog() {
  showDialog.value = false;
  setTimeout(() => {
    showing.value = false;
  }, 200)
}

function handleClickModal() {
  if (props.closeOnClickModal) {
    close();
  }
}
</script>
<style lang="less">
.wechat-half-dialog {
  .wechat-half-dialog-z-index {
    z-index: 1000;
  }
}

.wechat-half-dialog-fadeIn {
  //opacity: 1;
  transition-property: opacity;
  transition-duration: 0.2s;
  transition-delay: 0s;
  transition-timing-function: linear;
}

.wechat-half-dialog-fadeOut {
  //opacity: 0;
  transition-property: opacity;
  transition-duration: 0.3s;
  transition-delay: 0s;
  transition-timing-function: linear;
}
</style>
