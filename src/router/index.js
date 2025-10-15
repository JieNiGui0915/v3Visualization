import router from "@/router/router";
import NProgress from "@/config/nprogress";
import {GlobalStore} from "@/store";
import {AxiosCanceler} from "@/api/helper/axiosCancel";

const axiosCanceler = new AxiosCanceler();

// * 路由拦截
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.name.startsWith("wechat")) return next();
  // * 在跳转路由之前，清除所有的请求
  // axiosCanceler.removeAllPending();
  // * 判断当前路由是否需要访问权限
  // if (router.hasRoute(to.name) && !to.matched.some(record => record.meta.requiresAuth)) return next();

  // * 判断是否有Token
  const globalStore = GlobalStore();
  if (!globalStore.token) {
    if (to.name === "login") {
      if (import.meta.env.DEV) {
        return next();
      }
      if (from && from.name && from.name.startsWith("wechat")) {
        return next({
          path: "/auth",
          replace: true
        });
      } else {
        return next();
      }
    }
    next({
      path: "/login",
      replace: true
    });
    NProgress.done();
    return;
  }
  if (router.hasRoute(to.name)) {
    next();
  } else {
    // let menuStore = MenuStore();
    // addDynamicRouter(menuStore.menuList);
    // next({...to, replace: true});
    next("/404");
  }
});

router.afterEach(() => {
  NProgress.done();
});
export default router;
