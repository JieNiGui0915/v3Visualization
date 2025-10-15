<template>
  <div class="logo flex-center">
    <img :src="CONFIG.webLogoSmall" alt="logo" />
    <span v-show="!isCollapse">{{ CONFIG.webName }}</span>
  </div>
</template>

<script setup>
import { CONFIG } from "@/config/config.js";
defineProps({ isCollapse: { type: Boolean, default: false } });
</script>

<style lang="less">
@import "../index.less";
</style>
