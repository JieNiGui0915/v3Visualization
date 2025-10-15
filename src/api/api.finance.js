import http, { axiosOrigin } from "./index";
import { GlobalStore } from "@/store";

export const searchFleetDriverMonthFinancePageList = (param) => {
    return http.get("/go-api/finance/searchFleetDriverMonthFinancePageList", param, null)
}

export const exportFleetDriverMonthFinance = (data) => {
    let globalStore = GlobalStore();
    return axiosOrigin.post("/go-api/finance/exportFleetDriverMonthFinance", data, { responseType: "blob", headers: { "Authorization": "Bearer " + globalStore.token } })
}

// 费用管理相关接口
export const searchExpensePageList = (params) => {
    return http.get("/expense/getPage", params)
}



export const exportExpenseList = (data) => {
    let globalStore = GlobalStore();
    return axiosOrigin.post("/expense/export", data, { responseType: "blob", headers: { "Authorization": "Bearer " + globalStore.token } })
}

// 发票管理相关接口
export const searchInvoicePageList = (params) => {
    return http.get("/invoice/getPage", params)
}

export const exportInvoiceList = (data) => {
    let globalStore = GlobalStore();
    return axiosOrigin.post("/invoice/export", data, { responseType: "blob", headers: { "Authorization": "Bearer " + globalStore.token } })
}