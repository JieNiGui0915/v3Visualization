import http from "./index.js";

export const getAllFleetSimpleList = () => {
  return http.get("/go-api/fleet/list/simple/all", null, null)
}

export const getFleetInfo = (fleetId) => {
  return http.get("/go-api/fleet/info", { fleetId: fleetId }, null)
}

export const searchFleetPageList = (params) => {
  return http.get("/go-api/fleet/list/page", params, null)
}

export const addFleet = (data) => {
  return http.post("/go-api/fleet/add", null, data)
}

export const editFleet = (data) => {
  return http.post("/go-api/fleet/edit", null, data)
}

export const deleteFleet = (data) => {
  return http.post("/go-api/fleet/delete", null, data)
}