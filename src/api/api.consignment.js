import http from "./index";

export const getConsignmentPageAll = (param) => {
  return http.get("/go-api/consignment/page/all", param, null)
}

export const getConsignmentPageAllHistory = (param) => {
  return http.get("/go-api/consignment/page/all/history", param, null)
}
export const getConsignmentTodayAndTomorrow = (param) => {
  return http.get("/go-api/consignment/batch/list/todayAndTomorrow", param, null)
}

export const getConsignmentBatchByConsignmentId = (param) => {
  return http.get("/go-api/consignment/batch/page/all/byConsignmentId", param, null)
}
export const addConsignmentBatchByShipper = (body) => {
  return http.post("/go-api/consignment/batch/add/byShipper", null, body)
}

export const getAllVehicleListWithLastUsageDriver = (param) => {
  return http.get("/go-api/vehicle/list/withLastUsageDriver", param, null)
}

export const addConsignment = (body) => {
  return http.post("/go-api/consignment/add", null, body);
}
