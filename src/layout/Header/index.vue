<template>
  <div class="header pl-10">
    <div class="header-lf flex-center">
      <CollapseIcon></CollapseIcon>
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="header-ri flex-center">
      <!--  顶部菜单  -->
      <top-menu></top-menu>
      <!-- Full screen -->
      <Fullscreen></Fullscreen>
      <!-- User name -->
      <div class="user-description">
        <div class="userName">{{ userName }}</div>
        <div class="userRole">{{ userRole }}</div>
      </div>
      <!-- Avatar -->
      <Avatar></Avatar>
    </div>
  </div>
</template>

<script setup>
import CollapseIcon from "./components/CollapseIcon.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Avatar from "./components/Avatar.vue";
import TopMenu from "./components/TopMenu.vue";
import {GlobalStore} from "@/store";
import {ref} from "vue";
import {Top} from "@element-plus/icons-vue";

const globalStore = GlobalStore();

const userName = ref(globalStore.userInfo ? globalStore.userInfo.userName : "");
const userRole = ref(globalStore.roleInfoList ? globalStore.roleInfoList.map(p => p.roleName).join("/") : "");
</script>

<style lang="less">
@import "./index.less";
</style>
