<template>
  <div class="developing flex-justify-center">
    <div>
      <span class="route-title" v-if="routeTitle">《{{ routeTitle }}》</span> 正在积极开发中, 请耐心等待...
    </div>
    <h1></h1>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {ref} from "vue";

let route = useRoute();

let routeTitle = ref((route.meta && route.meta.title) ? route.meta.title : route.name);
</script>

<style lang="less">
.developing {
  width: 100%;
  height: 100%;
  font-size: 1.5rem;
  line-height: 150px;

  .route-title {
    font-size: 1.5rem;
    color: #080606;
    font-weight: bold;
    margin-right: 10px;
  }
}
</style>
