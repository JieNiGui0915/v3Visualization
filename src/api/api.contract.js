import http from "./index.js";

export const searchContractPageList = (params) => {
    return http.get("/go-api/contract/pageList", params, null);
}

export const addContract = (data) => {
    return http.post("/go-api/contract/add", null, data);
}

export const editContract = (data) => {
    return http.post("/go-api/contract/edit", null, data);
}

export const deleteContract = (data) => {
    return http.post("/go-api/contract/delete", null, data);
}

export const getContractItemByContractId = (params) => {
    return http.get("/go-api/contract/itemList", params, null);
}