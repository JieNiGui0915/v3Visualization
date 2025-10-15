import http from "./index.js";

export const getTruckLineSimpleList = () => {
  return http.get("/go-api/truckline/simple/list", null, null)
}
