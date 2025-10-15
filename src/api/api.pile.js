import http from "./index.js"

export const getAllPileList = () => {
  return http.get("/go-api/pile/get/all", null, null)
}

export const searchAllStationList = (param) => {
  return http.get("/go-api/pile/station/list/page", param, null)
}

export const getAllStationSimpleList = () => {
  return http.get("/go-api/pile/station/simple/list", null, null)
}

export const searchAllCompactSubstationList = (param) => {
  return http.get("/go-api/pile/compactSubstation/list/page", param, null)
}

export const searchAllPileGunList = (param) => {
  return http.get("/go-api/pile/gun/list/page", param, null)
}

export const getPileGunListByStationId = (stationId) => {
  return http.get(`/go-api/pile/gun/list/byStation`, { stationId }, null)
}

export const addPileStation = (data) => {
  return http.post("/go-api/pile/station/add", null, data);
}

export const editPileStation = (data) => {
  return http.post("/go-api/pile/station/edit", null, data);
}

export const deletePileStation = (stationId) => {
  return http.post("/go-api/pile/station/del", null, { stationId: stationId });
}

export const getPileCount = () => {
  return http.get("/go-api/pile/gun/count", null, null)
}