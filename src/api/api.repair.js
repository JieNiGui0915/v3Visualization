import http from "./index";

export const getRepairInfo = (param) => {
  return http.get("/go-api/repair/info", param, null)
}

export const getRepairTodoCount = () => {
  return http.get("/go-api/repair/todoCount", null, null)
}

export const getAllRepairList = (param) => {
  return http.get("/go-api/repair/list/page", param, null)
}

export const addRepair = (body) => {
  return http.post("/go-api/repair/add", null, body)
}


export const editRepair = (body) => {
  return http.post("/go-api/repair/edit", null, body)
}

export const confirmRepair = (body) => {
  return http.post("/go-api/repair/confirm", null, body)
}

export const updateRepairProgress = (body) => {
  return http.post("/go-api/repair/updateProgress", null, body)
}
