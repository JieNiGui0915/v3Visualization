import http from "./index";

export const getLoginQrCodeStatus = (param, controller = null) => {
  return http.get("/login-qrcode/status", param, null, controller)
}
