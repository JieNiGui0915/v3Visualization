import http, {axiosOrigin} from "./index";

export const getFileListByIdStr = (fileIdStr) => {
  return http.get("/go-api/file/get", {fileIdStr: fileIdStr}, null)
}
