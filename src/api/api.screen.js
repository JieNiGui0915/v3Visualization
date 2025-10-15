import http from "./index.js";

export const getCargoTransportSituationReq = (param) => {
  return http.get("/go-api/screen/cargoTransportSituation", param, null)
}

export const getCargoTransportSituationRatio = (param) => {
  return http.get("/go-api/screen/cargoTransportSituation/ratio", param, null)
}

export const getCargoTransportSituationDriverRanking = (param) => {
  return http.get("/go-api/screen/cargoTransportSituation/driverRanking", param, null)
}

export const getStationTypeAll = (param) => {
  return http.get("/go-api/screen/stationType/all", param, null)
}

export const getStationTypeList = (param) => {
  return http.get("/go-api/screen/stationType/list", param, null)
}

export const getCaiJiStationDataInfo = (param) => {
  return http.get("/go-api/screen/caiJiStationData/info", param, null)
}

export const getOrderDetailInfoByOrderId = (orderId) => {
  return http.get("/go-api/order/detail/info", { orderId }, null)
}

export const getTotalMileage = (param) => {
  return http.get("/go-api/screen/total/mileage", param, null)
}

export const getTotalElectricityCos = (param) => {
  return http.get("/go-api/screen/electricity/cost", param, null)
}

export const getTotalChargingStatus = (param) => {
  return http.get("/go-api/screen/charging/status", param, null)
}

export const getElectricityAnalysis = (param) => {
  return http.get("/go-api/screen/electricity/analysis", param, null)
}

export const getElectricVehicleProportion = (param) => {
  return http.get("/go-api/screen/electricVehicleProportion", param, null)
}
