import {GlobalStore} from "@/store";

const globalStore = GlobalStore();
/**
 * 权限按钮
 * 用户角色权限。每个用户可具备多种角色。
 * @param {"project"|"section"|"bid"|"determineBid"|"account"|"roomManager"|null} code
 * @return {boolean}
 */
export const permissionButton = (code = null) => {
  return true;
}
