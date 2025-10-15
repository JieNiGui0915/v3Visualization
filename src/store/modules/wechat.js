import { defineStore } from "pinia";
import piniaPersistConfig from "@/config/piniaPersist.js";

// WechatStore
export const WechatStore = defineStore("WechatStore", {
  state: () => ({
    customerAccount: {},
    customerInfo: {},
    customerInfoList: [],
  }),
  getters: {},
  actions: {
    setCustomerInfoList(customerInfoList = []) {
      this.customerInfoList = customerInfoList;
    },
    setCustomerInfo(customerInfo = null) {
      this.customerInfo = customerInfo || {};
    }
  },
  persist: piniaPersistConfig("WechatStore")
})
