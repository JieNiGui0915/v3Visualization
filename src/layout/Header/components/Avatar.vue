<template>
  <el-dropdown trigger="click">
    <div class="avatar">
      <img :src="avatar" alt="avatar" v-if="avatar"/>
      <img src="@/assets/images/avatar.png" alt="avatar" v-else/>
      <el-icon class="avatar-caret">
        <CaretBottom/>
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <!--        <el-dropdown-item @click="open('infoRef')">个人信息</el-dropdown-item>-->
        <el-dropdown-item @click="open('passwordRef')">修改密码</el-dropdown-item>
        <el-dropdown-item @click="logout" divided>退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- passwordDialog -->
  <PasswordDialog ref="passwordRef"></PasswordDialog>
  <UserInfoDialog ref="infoRef"></UserInfoDialog>
</template>

<script setup>
import {ref} from "vue";
import PasswordDialog from "./passwordDialog.vue";
import UserInfoDialog from "./userInfo.vue";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {logout as logoutApi} from "@/api/api.account";
import {TabsStore} from "@/store/modules/tabs";
import {GlobalStore} from "@/store";
import {CaretBottom} from "@element-plus/icons-vue";

const globalStore = GlobalStore();
const tabStore = TabsStore();

const router = useRouter();
const avatar = ref(globalStore.userInfo ? globalStore.userInfo.avatar : '');
// logout
const logout = () => {
  setTimeout(() => {
    logoutApi(false);
  })

  tabStore.closeMultipleTab();
  router.push({name: "login"});
  sessionStorage.clear();
  localStorage.clear();
  ElMessage({
    type: "success",
    message: "退出登录成功！"
  });
};


const infoRef = ref(null);
const passwordRef = ref(null);
// open
const open = (refName) => {
  if (refName === "infoRef") return infoRef.value.open();
  passwordRef.value.open();
};
</script>

<style lang="less">
@import "../index.less";
</style>
