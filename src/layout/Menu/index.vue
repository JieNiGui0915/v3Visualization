<template>
  <div class="menu" :style="{ width: isCollapse ? '65px' : '220px' }">
    <Logo :isCollapse="isCollapse"></Logo>
    <el-scrollbar>
      <el-menu :default-active="activeMenu" :router="true" :collapse="isCollapse" :collapse-transition="true"
        :unique-opened="true" background-color="#20222a" text-color="#bdbdc0" active-text-color="#fff">
        <SubItem :menuList="menuStore.menuList"></SubItem>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { MenuStore } from "@/store/modules/menu";
import Logo from "./components/Logo.vue";
import SubItem from "./components/SubItem.vue";
import { HOME_URL } from "@/config/config";
import { routers } from "@/router/router";
import { getSelfRoleList } from "@/api/api.role.js";
import { ElMessageBox } from "element-plus";
import { toMap } from "@/utils/util";

const route = useRoute();
const menuStore = MenuStore();
let roleList = [];
let roleMap = {};
onMounted(async () => {
  roleList = await getSelfRoleList();
  if (roleList.length === 0) {
    // 如果没有角色，直接跳转到登录页
    ElMessageBox.alert('您没有任何角色，请联系管理员分配角色后再登录系统！', '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    }).then(() => {
      // 跳转到登录页
      window.location.href = `${window.location.origin}/#/login`;
    });
    return;
  }
  roleList.forEach(role => {
    roleMap[role.roleNickname] = role;
  });
  // 从router中筛选menus
  let menus = routerToMenu(filterRouter(routers))
  await menuStore.setMenuList(menus);
  await menuStore.loadMenuTodoCount();
});

function filterRouter(routers) {
  let rs = routers.map(r => {
    if (r && r.meta && r.meta.isMenu && isAuthRoleMenu(r.meta.roleList)) {
      if (r.redirect && r.children && r.children.filter(p => p.meta && p.meta.isMenu).length === 1 && r.children[0].meta.isTopMenu) {
        // 将只有一个子菜单的项提到上一层
        r = r.children[0];
      }
      return r;
    }
  })

  return rs.filter(r => {
    if (r && r.meta && r.meta.isMenu && isAuthRoleMenu(r.meta.roleList)) {
      if (r.children) {
        r.children = filterRouter(r.children)
      }
      return true
    } else {
      return false
    }
  })
}

function isAuthRoleMenu(roleList = []) {
  if (!roleList) {
    return false;
  }
  if (roleList.length === 0) return true;
  // roleList.forEach(role => {
  //   if (roleMap[role]) {
  //     return true;
  //   }
  // })
  for (let i = 0; i < roleList.length; i++) {
    if (roleMap[roleList[i]]) {
      return true;
    }
  }
  return false;
}

function routerToMenu(routers, parent = null) {
  return routers.map(p => {
    let menu = {
      title: p.meta.title,
      path: p.path,
      icon: p.meta.icon,
      count: 0,
      parent: parent,
      children: []
    }
    menu.children = routerToMenu(p.children || [], menu);
    return menu;
  })
}

const activeMenu = computed(() => {
  if (route.path.startsWith(HOME_URL)) {
    return HOME_URL;
  }
  return route.path;
});
const isCollapse = computed(() => menuStore.isCollapse);
// const menuList = computed(() => menuStore.menuList);

const screenWidth = ref(0);
const screenHeight = ref(0);
//监听窗口大小
const listeningWindow = () => {
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
      screenHeight.value = document.body.clientHeight;
      if (!isCollapse.value && screenWidth.value < 1200) menuStore.setCollapse();
      if (isCollapse.value && screenWidth.value > 1200) menuStore.setCollapse();
    })();
  };
};
listeningWindow();
</script>

<style lang="less">
@import "./index.less";
</style>
