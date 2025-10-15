import http from "./index.js";

export const getStationList = (params) => {
    return http.get("/go-api/station/list", params, null);
}

export const getAllStationPageList = (params) => {
    return http.get("/go-api/station/list/page", params, null);
}

export const addStation = (data) => {
    return http.post("/go-api/station/add", null, data);
}

export const editStation = (data) => {
    return http.post("/go-api/station/edit", null, data);
}

export const deleteStation = (stationId) => {
    return http.post("/go-api/station/del", null, { stationId: stationId });
}

export const getAllStationSimple = (param) => {
    return http.get("/go-api/station/all/simple", param)
}