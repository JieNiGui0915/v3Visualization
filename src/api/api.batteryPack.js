import http from "./index.js";

export const getAllBatteryPackList = () => {
    return http.get("/go-api/batteryPack/getAllBatteryPackSimpleList", null, null)
}