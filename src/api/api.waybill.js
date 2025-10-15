import http from "./index.js";

export const searchWaybillPageList = (params) => {
    return http.get("/go-api/waybill/search/page/list", params, null);
}

export const getWaybillCount = (param) => {
    return http.get("/go-api/waybill/count", param, null);
}

export const getWaybillTotalSuttle = (param) => {
    return http.get("/go-api/waybill/total/suttle", param, null);
}
export const getWayBillTotalCount = (param) => {
    return http.get("/go-api/waybill/total/count", param, null);
}

export const getWayBillTotalSettleWeight = (param) => {
    return http.get("/go-api/waybill/total/settle/weight", param, null);
}