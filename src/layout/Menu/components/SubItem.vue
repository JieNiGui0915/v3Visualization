<template>
  <template v-for="subItem in menuList" :key="subItem.path">

    <el-sub-menu v-if="subItem.children && subItem.children.length > 0"
      :index="subItem.path === undefined ? '' : subItem.path" :title="subItem.title">
      <template #title>
        <el-icon>
          <component :is="subItem.icon"></component>
        </el-icon>
        <el-badge :value="subItem.count" class="item" :offset="[12, 20]" :show-zero="false">
          <span>{{ subItem.title }}</span>
        </el-badge>
      </template>
      <SubItem :menuList="subItem.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="subItem.path" :title="subItem.title">
      <el-icon>
        <component :is="subItem.icon"></component>
      </el-icon>
      <template v-if="!subItem.isLink" #title>
        <el-badge :value="subItem.count" :offset="[12, 20]" :show-zero="false">
          <span>{{ subItem.title }}</span>
        </el-badge>
      </template>
      <template v-else #title>
        <a class="href" :href="subItem.isLink" target="_blank">{{ subItem.title }}</a>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup>
defineProps({ menuList: { type: Array, default: () => [] } });
</script>

<style lang="less">
@import "../index.less";
</style>
