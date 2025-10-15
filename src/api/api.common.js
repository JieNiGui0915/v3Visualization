import http, {axiosOrigin} from "./index";
import {GlobalStore} from "@/store";


export const sendSms = (body, loading) => {
  return http.post("/common/sms/send", null, body, loading)
}

export const uploadFile = (param, writeWaterMarker = false) => {
  let token;
  let globalStore = GlobalStore();
  token = globalStore.token;
  // return http.file("/common/file/upload", null, body, loading)
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      "Authorization": "Bearer " + token
    }
  }
  if (writeWaterMarker) {
    return axiosOrigin.post("/common/file/upload/withWaterMarker", param, config)
  } else {
    return axiosOrigin.post("/common/file/upload", param, config)
  }
}
