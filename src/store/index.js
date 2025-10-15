import {defineStore, createPinia} from "pinia";
import piniaPersistConfig from "@/config/piniaPersist";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import http from "../api/index.js";

export const GlobalStore = defineStore("GlobalState", {
  state: () => ({
    // Token
    token: "",
    /**@type {AccountDto} */
    userInfo: {},
    /**@type {Role[]} */
    roleInfoList: [],
    // 客户信息
    customerInfo: {},
    /**
     * 屏幕尺寸
     * @type {number[]}
     */
    screenSize: [],
    loginToType: 0
  }),
  getters: {},
  actions: {
    // set token
    setToken(token) {
      this.token = token;
      http.updateConfig();
    },
    // set userInfo
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    setCustomerInfo(customerInfo) {
      this.customerInfo = customerInfo;
    },
    setRoleInfoList(roleInfoList) {
      this.roleInfoList = roleInfoList;
    },
    // set AssemblySize
    setAssemblySizeSize(assemblySize) {
      this.assemblySize = assemblySize;
    },
    // updateLanguage
    updateLanguage(language) {
      this.language = language;
    },
    setScreenSize(value) {
      this.screenSize = value || [];
    },
    setLoginToType(value) {
      this.loginToType = value;
    }
  },
  persist: piniaPersistConfig("GlobalState")
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
