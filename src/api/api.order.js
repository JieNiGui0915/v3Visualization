import http from "./index.js";

export const searchOrderPageList = (param) => {
  return http.get("/go-api/order/list/page", param, null)
}

export const addOrder = body => {
  return http.post("/go-api/order/add", null, { data: body })
}

export const editOrder = body => {
  return http.post("/go-api/order/edit", null, { data: body })
}

export const deleteOrder = (orderIds) => {
  return http.post("/go-api/order/del", null, orderIds)
}

export const closeOrder = (orderId) => {
  return http.post("/go-api/order/close", null, { orderId: orderId })
}

export const getBeforeCloseOrderInfo = (orderId) => {
  return http.get("/go-api/order/before/close/info", { orderId: orderId }, null)
}

export const getOrderCount = () => {
  return http.get("/go-api/order/count", null, null)
}

export const getOrderListByDate = (param) => {
  return http.get("/go-api/order/list/byDate", param, null)
}