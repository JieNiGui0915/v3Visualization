import http from "./index.js";

export const getGoodsSimpleList = () => {
  return http.get("/go-api/goods/simple/list", null, null)
}

export const searchGoodsItemPageList = (params) => {
  return http.get("/go-api/goods/item/page/list", params, null)
}

export const addGoodsItem = (data) => {
  return http.post("/go-api/goods/item/add", null, data)
}

export const editGoodsItem = (data) => {
  return http.post("/go-api/goods/item/edit", null, data)
}