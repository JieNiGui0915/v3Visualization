<template>
  <el-container>
    <el-aside>
      <Menu></Menu>
    </el-aside>
    <el-container>
      <el-header>
        <Header></Header>
        <!--        <Tabs></Tabs>-->
      </el-header>
      <el-main>
        <section class="main-box">
          <router-view v-slot="{ Component, route }">
            <component :is="Component" :key="route.path"></component>
            <!--            <keep-alive>-->
            <!--            </keep-alive>-->
          </router-view>
        </section>
      </el-main>
      <!--      <el-footer>-->
      <!--        <Footer></Footer>-->
      <!--      </el-footer>-->
    </el-container>
  </el-container>
</template>

<script setup>
import Menu from "./Menu/index.vue";
import Header from "./Header/index.vue";
// import Tabs from "./Tabs/index.vue";
// import cacheRouter from "@/router/cacheRouter";
import {onMounted} from "vue";
import {GlobalStore} from "@/store";
import {throttle} from "@/utils/util.js";

function getScreenSize() {
  return [(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth), (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)];
}

let globalStore = GlobalStore();
onMounted(async () => {
  globalStore.setScreenSize(getScreenSize());
  window.onresize = throttle(() => {
    globalStore.setScreenSize(getScreenSize());
  }, 100);
});
</script>

<style lang="less">
@import "./index.less";
</style>
