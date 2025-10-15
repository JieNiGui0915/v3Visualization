import http from "./index";

/**
 * 登录
 * @param body
 * @returns {Promise<{token:string,userInfo:AccountDto,customerInfo:any,expiration:string}>}
 * @constructor
 */
export const login = (body) => {
  return http.post(`/go-api/web/login`, {}, body);
}
/**
 * 获取验证码
 * @returns {Promise<{Data:string,DataPrefix:string,Id:string,expiry_seconds:number}>}
 */
export const verificationCode = () => {
  return http.get("/go-api/captcha", {}, {})
}

export const logout = (body) => {
  return http.post(`/go-api/logout`, {}, body);
}

export const searchAllUserPageList = (params) => {
  return http.get("/go-api/user/list/page", params, null)
}

export const allSimple = (params) => {
  return http.get("/go-api/user/all/simple", params, null)
}


/**
 * 新增用户
 * @param {AccountAddInput} body
 * @returns {Promise<boolean>}
 */
export const addUser = (body) => {
  return http.post("/go-api/user/add", {}, body)
}

/**
 * 编辑用户
 * @param body
 * @returns {Promise<boolean>}
 */
export const editUser = (body) => {
  return http.post("/go-api/user/edit", {}, body)
}

/**
 * 删除账户
 * @param {number} userId
 * @returns {Promise<boolean>}
 */
export const delUser = (userId) => {
  return http.post("/go-api/user/del", { userId }, {})
}

/**
 * 找回账号
 * @param {number} userId
 * @returns {Promise<boolean>}
 */
export const retrieve = (userId) => {
  return http.post("/go-api/user/retrieve", { userId }, {})
}

/**
 * 重置密码
 * @param {number} userId
 * @returns {Promise<boolean>}
 */
export const resetPassword = (body) => {
  return http.post("/go-api/user/resetPassword", null, body)
}

/**
 * 修改密码
 * @param {{OldPassword:string,NewPassword:string}} password
 * @returns {Promise<boolean>}
 */
export const changePassword = (password) => {
  return http.post("/go-api/user/changePassword", {}, password)
}
