import http from "./index.js";


export const getDispatchPlanListByOrderId = (param) => {
  return http.get("/go-api/dispatch/plan/all/orderId", param, null)
}


export const addDispatchPlan = (body) => {
  return http.post("/go-api/dispatch/plan/add", null, { data: body });
}

export const addDispatchPlanBatch = (body) => {
  return http.post("/go-api/dispatch/plan/add/batch", null, { data: body });
}

export const editDispatchPlan = (body) => {
  return http.post("/go-api/dispatch/plan/edit", null, { data: body });
}

export const delDispatchPlan = (data) => {
  return http.post(`/go-api/dispatch/plan/del`, null, data);
}

export const getDispatchListByOrderId = (param) => {
  return http.get("/go-api/dispatch/all/orderId", param, null)
}

export const getDispatchListByDispatchPlanId = (param) => {
  return http.get("/go-api/dispatch/all/dispatchPlanId", param, null)
}

export const addDispatchBatch = (body) => {
  return http.post("/go-api/dispatch/add/batch", null, body);
}

export const editDispatchBatch = (body) => {
  return http.post("/go-api/dispatch/edit", null, body);
}

export const delDispatchBatch = (data) => {
  return http.post(`/go-api/dispatch/del`, null, data);
}

export const searchDispatchPlanPageList = (param) => {
  return http.get("/go-api/dispatch/plan/list/page", param, null)
}


export const getDispatchCount = () => {
  return http.get("/go-api/dispatch/count", null, null)
}