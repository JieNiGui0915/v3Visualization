<template>
  <div class="weui-form__ft wechat-footer">
    <div class="weui-form__extra-area">
      <div class="weui-footer">
        <p class="weui-footer__links">
          <a href="javascript:" class="weui-footer__link">国润宝</a>
        </p>
        <p class="weui-footer__text">Copyright © 2023-{{ year }} langzhao.cn</p>
      </div>
    </div>
  </div>
</template>
<script setup>
const year = new Date().getFullYear();
</script>
<style lang="less">
.wechat-footer {
  .weui-form__extra-area {
    margin-top: 4px;
    margin-bottom: 4px;
  }
}
</style>
