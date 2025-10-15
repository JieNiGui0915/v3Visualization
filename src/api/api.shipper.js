import http from "./index.js";

export const getShipperSimpleList = () => {
  return http.get("/go-api/shipper/simple/list", null, null)
}

export const searchShipperPageList = (params) => {
  return http.get("/go-api/shipper/search/page/list", null, params)
}

export const addShipper = (data) => {
  return http.post("/go-api/shipper/add", null, data)
}

export const editShipper = (data) => {
  return http.post("/go-api/shipper/edit", null, data)
}