import http from "./index";

export const getAllDriverList = (param) => {
  return http.get("/go-api/driver/list", param, null)
}

export const getDriverFullInfoByDriverId = (driverId) => {
  return http.get("/go-api/driver/fullInfo/driverId", { driverId }, null)
}

export const searchDriverPageList = (param) => {
  return http.get("/go-api/driver/list/page", param, null)
}

export const addDriver = (body) => {
  return http.post("/go-api/driver/add", null, { data: body })
}

export const editDriver = (body) => {
  return http.post("/go-api/driver/edit", null, { data: body })
}

export const getDriverCount = () => {
  return http.get("/go-api/driver/count", null, null)
}