// * 请求枚举配置
/**
 * @description：请求配置
 */
export const ResultEnum = {
  SUCCESS: 200,
  SYSERROR: 500,
  ERROR: 400,
  NOAUTH: 401,
  OVERDUE: 599,
  TIMEOUT: 60000,
  TYPE: "success"
}

/**
 * @description：请求方法
 */
export const RequestEnum = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  PUT: "PUT",
  DELETE: "DELETE"
}

/**
 * @description：常用的contentTyp类型
 */
export const ContentTypeEnum = {
  // json
  JSON: "application/json;charset=UTF-8",
  // json
  TEXT: "text/plain;charset=UTF-8",
  // form-data 一般配合qs
  FORM_URLENCODED: "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data 上传
  FORM_DATA: "multipart/form-data;charset=UTF-8"
}
