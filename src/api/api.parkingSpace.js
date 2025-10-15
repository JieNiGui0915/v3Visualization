import http from "./index.js"

export const searchParkingSpacePageList = (params) => {
    return http.get("/go-api/parkingSpace/search", params, null)
}

export const getAllParkingSpaceList = () => {
    return http.get("/go-api/parkingSpace/all", null, null)
}

export const addParkingSpace = (data) => {
    return http.post("/go-api/parkingSpace/add", null, data)
}

export const editParkingSpace = (data) => {
    return http.post(`/go-api/parkingSpace/edit`, null, data)
}


export const delParkingSpace = (id) => {
    return http.post(`/go-api/parkingSpace/del`, null, { id })
}