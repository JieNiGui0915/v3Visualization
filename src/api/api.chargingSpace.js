import http from "./index.js"

export const searchChargingSpacePageList = (params) => {
    return http.get("/go-api/chargingSpace/search", params, null)
}

export const getAllChargingSpaceList = () => {
    return http.get("/go-api/chargingSpace/all", null, null)
}

export const addChargingSpace = (data) => {
    return http.post("/go-api/chargingSpace/add", null, data)
}

export const editChargingSpace = (data) => {
    return http.post(`/go-api/chargingSpace/edit`, null, data)
}


export const delChargingSpace = (id) => {
    return http.post(`/go-api/chargingSpace/del`, null, { id })
}