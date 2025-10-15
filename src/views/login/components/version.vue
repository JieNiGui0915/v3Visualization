<template>
  <div class="version" v-if="version">
    <span class="version_str">v{{ version }}</span>
  </div>
</template>
<script setup>
let version = import.meta.env.VITE_GIT_COMMIT_VERSION;

</script>
<style lang="less">
.version {
  position: absolute;
  left: 10px;
  bottom: 10px;

  .version_str {
    color: #cccccc;
  }
}
</style>
