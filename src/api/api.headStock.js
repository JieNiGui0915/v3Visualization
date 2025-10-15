import http from "./index.js";

export const getAllHeadStockList = ()=>{
    return http.get("/go-api/headStock/getAllHeadStockSimpleList", null, null)
}