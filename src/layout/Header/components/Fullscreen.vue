<template>
	<el-tooltip effect="dark" :content="isFullscreen ?'全屏':'退出全屏'" placement="bottom">
		<i :class="['iconfont', isFullscreen ? 'icon-suoxiao' : 'icon-fangda']" class="icon-style" @click="toggle"></i>
	</el-tooltip>
</template>

<script setup >
import { useFullscreen } from "@vueuse/core";
const { toggle, isFullscreen } = useFullscreen();
</script>

<style lang="less">
@import "../index.less";
</style>
