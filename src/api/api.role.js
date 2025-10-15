import http from "./index";


export const getAllRolePage = (params) => {
  return http.get("/go-api/role/list/page", params, {})
}

export const getAllRoles = (params) => {
  return http.get("/go-api/role/list", params, {})
}

export const addRole = (body) => {
  return http.post("/go-api/role/add", null, body)
}

export const editRole = (body) => {
  return http.post("/go-api/role/edit", null, body)
}


export const getSelfRoleList = () => {
  return http.get("/go-api/role/list/token", null, null)
}