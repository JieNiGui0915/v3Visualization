import http from "./index.js";

export const getAllTrailerList = () => {
    return http.get("/go-api/trailer/getAllTrailerSimpleList", null, null)
}