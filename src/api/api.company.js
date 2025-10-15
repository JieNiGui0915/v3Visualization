import http, { axiosOrigin } from "./index";

export const getAllCompanyList = (param) => {
  return http.get("/go-api/company/list", param, null)
}

export const searchCompanyPageList = (param) => {
  return http.get("/go-api/company/search/page/list", param, null)
}

export const addCompany = (data) => {
  return http.post("/go-api/company/add", null, data)
}

export const editCompany = (data) => {
  return http.post("/go-api/company/edit", null, data)
}