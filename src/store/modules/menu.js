import {defineStore} from "pinia";
import {getRepairTodoCount} from "@/api/api.repair.js";


// MenuStore
export const MenuStore = defineStore("MenuState", {
  state: () => ({
    // menu collapse
    isCollapse: false, // menu List
    menuList: []
  }), getters: {}, actions: {
    async setCollapse() {
      this.isCollapse = !this.isCollapse;
    }, async setMenuList(menuList) {
      this.menuList = menuList;
    }, async loadMenuTodoCount() {
      {
        // 维修个数
        let path = "/vehicle/repair/repair";
        let menu = findMenuByPath(this.menuList, path);
        if (menu) {
          let menuTodoCount = await getRepairTodoCount();
          setParentMenuCount(menu.parent, -menu.count);
          menu.count = menuTodoCount.count;
          setParentMenuCount(menu.parent, menu.count);
        }
      }
    }
  }, // persist: piniaPersistConfig("MenuState")
});


function findMenuByPath(menuList = [], path = "") {
  for (let i = 0; i < menuList.length; i++) {
    let menu = menuList[i];
    if (menu.path === path) {
      return menu;
    }
    if (menu.children && menu.children.length > 0) {
      let data = findMenuByPath(menu.children, path);
      if (data) {
        return data;
      }
    }
  }
  return null;
}

function setParentMenuCount(parent, count) {
  if (parent) {
    parent.count = parent.count + count;
    setParentMenuCount(parent.parent, count);
  }
}
