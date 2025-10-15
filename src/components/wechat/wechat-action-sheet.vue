<template>
  <div class="js_dialog_wrap wechat-action-sheet" v-if="showing">
    <div class="weui-mask" @click="handleClickModal"></div>
    <div role="dialog" aria-modal="true" tabindex="0" :aria-hidden="!showing" class="weui-actionsheet" :class="showDialog?'weui-actionsheet_toggle':''">
      <div class="weui-actionsheet__title" v-if="props.title!==''">
        <p class="weui-actionsheet__title-text">
          {{ props.title }}
        </p>
      </div>
      <div class="weui-actionsheet__menu">
        <div :tabindex="index" role="button" class="weui-actionsheet__cell" v-for="(item,index) in props.actionList" :key="item" @click="handleClickAction(item,index)">
          {{ item }}
        </div>
      </div>
      <div class="weui-actionsheet__action" v-if="props.showCancel">
        <div role="button" tabindex="0" class="weui-actionsheet__cell" @click="handleClickCancel">取消</div>
      </div>
    </div>
  </div>

</template>
<script setup>
import {ref} from "vue";

let props = defineProps({
  title: {
    type: String,
    default: ""
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  actionList: {
    type: Array,
    default: []
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  }
})
let emit = defineEmits(["cancel", "close", "selected"])

defineExpose({
  open, close
})
const showing = ref(false);
const showDialog = ref(false);

function handleClickAction(item, index) {
  closeDialog();
  emit("selected", item, index)
  emit("close")
}

function handleClickCancel() {
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
.wechat-action-sheet {

}
</style>
