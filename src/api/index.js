import axios from "axios";
import { AxiosCanceler } from "./helper/axiosCancel";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { GlobalStore } from "@/store";
import * as httpInfo from "@/config/httpInfo";
import qs from "qs";
import { BASE_URL } from "@/config/config";

import router from "@/router/router";

let globalStore;

const axiosCanceler = new AxiosCanceler();

let paramsSerializer = {
  serialize: (params) => {
    return qs.stringify(params, { arrayFormat: "repeat", indices: false });
  }
}
const config = {
  // 默认地址
  baseURL: BASE_URL,
  // 设置超时时间
  timeout: 100_000_000,
  // 跨域时候允许携带凭证
  withCredentials: false
};

class RequestHttp {
  service;

  constructor(config) {
    // 实例化axios
    this.service = axios.create(config);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/本地储存当中
     */
    this.service.interceptors.request.use(this.updateConfig(),
      (error) => {
        Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response) => {
        const { data, config } = response;
        // * 在请求结束后，移除本次请求
        axiosCanceler.removePending(config);
        // * 登陆失效
        if (response.status >= httpInfo.ResultEnum.ERROR) {
          ElMessage.error(handleErrorMessages(data));
          if (!globalStore) {
            globalStore = GlobalStore();
          }
          globalStore.setToken("");
          router.replace({
            path: "/login"
          });
          return Promise.reject(data);
        }
        // * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        // if (data.StatusCode && data.StatusCode !== httpInfo.ResultEnum.SUCCESS) {
        //   let msg = handleErrorMessages(data.Errors);
        //   console.error(msg);
        //   ElMessage.error(msg);
        //   return Promise.reject(data);
        // }
        // * 成功请求
        return new Promise((resolve, reject) => {
          parseResponse(response, resolve, reject)
        })
        // return data?.result;
      },
      function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        // 取消的请求不弹窗
        if (error && error.code === "ERR_CANCELED") {
          return Promise.reject(error)
        } else {
          let err = handleErrorMessages(error.response);
          showError(err);
          return Promise.reject(error);
        }
      }
    );
  }

  updateConfig() {
    return (config) => {
      // * 将当前请求添加到 pending 中
      axiosCanceler.addPending(config);//相同请求会自动取消一个

      if (!globalStore) {
        globalStore = GlobalStore();
      }
      const token = globalStore.token;
      if (token) {
        return { ...config, headers: { "Authorization": "Bearer " + token } };
      } else {
        return config;
      }
    }
  }

  /**
   * 常用请求方法封装
   * @param {string} url
   * @param {any} params
   * @param {any} _object
   * @param {AbortController} abortController
   * @returns {Promise<any>}
   */
  get(url, params, _object = {}, abortController = null) {
    return this.service.get(url, { params, ..._object, paramsSerializer: paramsSerializer, signal: abortController ? abortController.signal : null });
  }

  /**
   * 常用请求方法封装
   * @param {string} url
   * @param {any} queryParams
   * @param {any} bodyData
   * @returns {Promise<any>}
   */
  post(url, queryParams = {}, bodyData) {
    return this.service.post(url, bodyData, { params: queryParams, paramsSerializer: paramsSerializer });
  }

  /**
   * 常用请求方法封装
   * @param {string} url
   * @param {any} queryParams
   * @param {any} params
   * @returns {Promise<any>}
   */
  put(url, queryParams = {}, params) {
    return this.service.put(url, params, { params: queryParams, paramsSerializer: paramsSerializer });
  }

  /**
   * 常用请求方法封装
   * @param {string} url
   * @param {any} params
   * @param {any} _object
   * @returns {Promise<any>}
   */
  delete(url, params, _object = {}) {
    return this.service.delete(url, { params: params, ..._object, paramsSerializer: paramsSerializer });
  }

  /**
   * 常用请求方法封装
   * @param {string} url
   * @param {any} params
   * @param {any} _object
   * @param {boolean} isBeancon
   * @returns {Promise<any>}
   */
  head(url, params, _object = {}, isBeancon) {
    if (isBeancon) {
      this.sendBeacon(url, params);
      return;
    }
    return this.service.head(url, { params: params, paramsSerializer: paramsSerializer });
  }

  sendBeacon(url, params) {
    const blob = new Blob([JSON.stringify(params)], { type: "application/json; charset=UTF-8" });
    navigator.sendBeacon(config.baseURL + url, blob);
  }

  file(url, queryParams = {}, bodyData) {
    return this.service.post(url, bodyData, { params: queryParams, paramsSerializer: paramsSerializer });
  }

  downloadBlob(url, method = "post", query, body) {
    return this.service({
      url: url,
      method: method,
      params: query,
      data: body,
      responseType: "blob"
    })
  }
}

function parseResponse(res, resolve, reject) {
  let data = res.data;
  if (!data) showError("服务器发生错误。详情:" + res.errMsg);
  if (res.status < 300) {
    if (data.code === 0) { //错误码((0:成功, 1:失败, >1:错误码))
      resolve(data.data);
    } else if (data.code === 1) {
      showError(data.message);
      reject(data.message);
    } else if (data.code === 50) {
      showError(data.message, "提示");
      reject(data.message);
    } else if (data.code === 401) {
      showError(data.message, "提示");
      ElMessageBox.confirm('登录已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!globalStore) {
          globalStore = GlobalStore();
        }
        globalStore.setToken("");
        router.replace({
          path: "/login"
        });
      }).catch(() => {
        reject(data.message);
      })
    } else {
      showError(data.message);
      reject(data.message);
    }
  } else if (res.status < 400) {
    showError(res.data.data);
    resolve(res.data.data);
  } else if (res.status < 500) {
    let err = handleErrorMessages(res);
    showError(err);
    reject(err);
  } else if (res.status >= 500) {
    let err = handleErrorMessages(res);
    showError("服务器发生错误。详情:" + err);
    reject(res)
  } else {
    showError(JSON.stringify(res));
    reject(res);
  }
}

function handleErrorMessages(res) {
  let msg = "";
  if (res === undefined) {
    msg = "发生错误";
  } else if (typeof (res.data) === "string") {
    msg = res.data;
  } else if (res.data.message) {
    msg = res.data.message;
  } else if (typeof (res.data) === 'object' && res.data.errors && typeof res.data.errors === "object") {
    let values = Object.values(res.data.errors);
    msg = values.join();
  } else {
    msg = "发生错误";
  }
  return msg;
}
let errMsgSetTimeInstance = null;
function showError(msg, title = "发生错误") {
  console.error(msg);
  if (errMsgSetTimeInstance) {
    return;
  }
  ElNotification({
    title: title,
    message: msg,
    type: "error",
    duration: 5000
  });
  errMsgSetTimeInstance = setTimeout(() => {
    clearTimeout(errMsgSetTimeInstance);
    errMsgSetTimeInstance = null;
  }, 1000);
}

export default new RequestHttp(config);
export const axiosOrigin = axios.create(config);
