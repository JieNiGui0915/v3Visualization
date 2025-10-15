import configGrb from "./config-grb";
import configMdm from "./config-mdm";

export const HOME_URL = "/home/home";
// * Tabs（黑名单地址，不需要添加到 tabs 的路由地址）
export const TABS_BLACK_LIST = ["/home/home", "/403", "/404", "/500", "/layout", "/login", "/dataScreen"];


let url = "";
let fileUrlPre = "";
let config = null;
if (import.meta.env.DEV) {
  // url = "http://localhost:3299";
  // url = "https://tst.meidunmei.cn:14080/test-api";
  url = "https://app.greenball.top/test-api";
  // url = "https://web.greenball.top/v1.0.7";
  // config = configGrb;
  config = configMdm;
  fileUrlPre = "/test-images";
} else if (import.meta.env.MODE === "dev") {
  url = "http://47.93.15.82:8000/dev-api";
  fileUrlPre = "/test-images";
  config = configGrb;
} else if (import.meta.env.MODE === "test") {
  url = "https://web.greenball.top/test-api";
  fileUrlPre = "/test-images";
  config = configGrb;
} else if (import.meta.env.MODE === "prod-grb") {
  url = "https://web.greenball.top/v1.0.7"
  fileUrlPre = "/images";
  config = configGrb;
} else if (import.meta.env.MODE === "prod-mdm") {
  url = "https://mdm.greenball.top:10443/api/"
  fileUrlPre = "/images";
  config = configMdm;
} else {
  let err = "未配置该模式的url,mode:" + import.meta.MODE;   
  console.error(err);
  alert(err);
}
export const CONFIG = config;
export const BASE_URL = url;
export const BASE_URL_IMG = new URL(url).origin + fileUrlPre;
// 高德地图 Web 端 Key
export const AMAP_KEY = "91f9d0369e08d7a8e14fa4964665f877"; // 请更新为有正确权限的Key
