import http from "./index.js";

export const searchStaff = (searchStr) => {
  return http.post("/go-api/staff/search", { searchStr: searchStr }, null);
}

export const getStaff = (staffId) => {
  return http.get(`/go-api/staff/info`, { staffId }, null);
}