import http from "./index.js"

export const getAllVehicleList = () => {
  return http.get("/go-api/vehicle/list/all", null, null)
}

export const getAllSelfVehicleBaseList = () => {
  return http.get("/go-api/vehicle/list/all/self", null, null)
}

export const searchVehiclePageList = (param) => {
  return http.get("/go-api/vehicle/list/page", param, null)
}

export const addVehicle = body => {
  return http.post("/go-api/vehicle/add", { data: body }, null)
}

export const editVehicle = body => {
  return http.post("/go-api/vehicle/edit", { data: body }, null)
}

export const disableVehicle = (vehicleId) => {
  return http.post("/go-api/vehicle/disable", { vehicleId }, null)
}



export const getVehicleCount = () => {
  return http.get("/go-api/vehicle/count", null, null)
}