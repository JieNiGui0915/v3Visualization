import { defineStore } from "pinia";
import piniaPersistConfig from "@/config/piniaPersist";
import { HOME_URL, TABS_BLACK_LIST } from "@/config/config";
import router from "@/router/index";

export const TabsStore = defineStore("TabsState", {
  state: () => ({
    tabsMenuValue: HOME_URL,
    tabsMenuList: [{ title: "首页", path: HOME_URL, icon: "home-filled", close: false }]
  }),
  getters: {},
  actions: {
    // Add Tabs
    addTabs(tabItem) {
      // not add tabs black list
      if (TABS_BLACK_LIST.includes(tabItem.path)) {
        // return;
      }
      const tabInfo = {
        title: tabItem.title,
        path: tabItem.path,
        close: tabItem.close
      };
      if (this.tabsMenuList.every(item => item.path !== tabItem.path)) {
        this.tabsMenuList.push(tabInfo);
      }
      this.setTabsMenuValue(tabItem.path);
      // 没必要在这里再次将路由加载一次, 已在router/index.ts中加载过
      // router.push(tabItem.path);
    },
    // Remove Tabs
    removeTabs(tabPath) {
      let tabsMenuValue = this.tabsMenuValue;
      const tabsMenuList = this.tabsMenuList;
      if (tabsMenuValue === tabPath) {
        tabsMenuList.forEach((item, index) => {
          if (item.path !== tabPath) return;
          const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1];
          if (!nextTab) return;
          tabsMenuValue = nextTab.path;
          router.push(nextTab.path);
        });
      }
      this.tabsMenuValue = tabsMenuValue;
      this.tabsMenuList = tabsMenuList.filter(item => item.path !== tabPath);
    },
    // Change Tabs
    changeTabs(tabItem) {
      this.tabsMenuList.forEach(item => {
        if (item.title === tabItem.label) router.push(item.path);
      });
    },
    // Set TabsMenuValue
    setTabsMenuValue(tabsMenuValue) {
      this.tabsMenuValue = tabsMenuValue;
    },
    // Set TabsMenuList
    setTabsMenuList(tabsMenuList) {
      this.tabsMenuList = tabsMenuList;
    },
    // Close MultipleTab
    closeMultipleTab(tabsMenuValue) {
      this.tabsMenuList = this.tabsMenuList.filter(item => {
        return item.path === tabsMenuValue || item.path === HOME_URL;
      });
    }
    ,
    // Go Home
    async goHome() {
      await router.push(HOME_URL);
      this.tabsMenuValue = HOME_URL;
    }
  },
  persist: piniaPersistConfig("TabsState")
})
  ;
