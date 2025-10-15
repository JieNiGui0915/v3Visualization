<template>
  <div class="wechat-page page" :class="props.class">
    <div class="page-nav-title">
      <a role="button" class="back-btn" @click="back"><i role="img" aria-label="返回" class="weui-icon-back-arrow-thin"></i></a>
      <div class="title-text">{{ props.title }}</div>
      <div class="title-right-text" v-if="props.operateText" @click="handleOperate">{{ props.operateText }}</div>
    </div>
    <div class="page__bd wechat-page-fixed-head-right-btn">
      <slot name="head-right"></slot>
    </div>
    <div class="page-body page__bd">
      <slot name="body"></slot>
      <el-backtop target=".page-body" :right="12" :bottom="68"/>
    </div>
    <div class="foot">
      <slot name="foot"></slot>
    </div>
    <wechat-footer></wechat-footer>
    <wechat-info-bar ref="infoRef"></wechat-info-bar>
  </div>
</template>
<script setup>

import wechatFooter from "@/components/wechat/wechat-footer.vue";
import WechatInfoBar from "@/components/wechat/wechat-info-bar.vue";
import {useRouter} from "vue-router";

const emit = defineEmits(["operate-event"]);

const props = defineProps({
  class: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  },
  subTitle: {
    type: String,
    default: ""
  },
  operateText: {
    type: String,
    default: ""
  }
})
const router = useRouter();

function back() {
  router.back();
}

function handleOperate() {
  emit("operate-event");
}
</script>
<style lang="less">
.wechat-page {
  .wechat-page-fixed-head-right-btn{
    z-index: 2;
    position: absolute;
    top: 16px;
    right: 10px;
  }
}
</style>
