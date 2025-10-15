import http from "./index";

export const getAssetList = (param) => {
  return http.get("/go-api/asset/list/all", param, null)
}
