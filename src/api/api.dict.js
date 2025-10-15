import http from "./index";

export const typeAll = (params) => {
  return http.get("/go-api/dict/type/list/page", params, {})
}

export const typeAdd = (body) => {
  return http.post("/go-api/dict/type/add", null, body);
}


export const typeEdit = (body) => {
  return http.post("/go-api/dict/type/edit", null, body);
}

export const typeDel = (param) => {
  return http.post("/go-api/dict/type/delete", param, null)
}


export const dictDataAll = (dictType) => {
  return http.get("/go-api/dict/" + dictType, null, {})
}

export const dataAdd = (body) => {
  return http.post("/go-api/dict/data/add", null, body);
}


export const dataEdit = (body) => {
  return http.post("/go-api/dict/data/edit", null, body);
}

export const dataDel = (param) => {
  return http.post("/go-api/dict/data/delete", param, null)
}

export const dictDataAllZRC = (dictType) => {
  return http.get("/dict-data/" + dictType, null, {})
}
