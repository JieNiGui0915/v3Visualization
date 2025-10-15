<template>
  <div class="TopMenu">
    <el-button link class="a" @click="handleGoTo('largeScreen')">大屏展示</el-button>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function handleGoTo(name) {
  router.push({ name });
}
</script>
<style lang="less">
.TopMenu {
  height: 55px;
  line-height: 55px;
}
</style>
