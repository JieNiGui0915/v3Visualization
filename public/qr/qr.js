window.onload = load;
const mpLoginCode = {
  web: "web",
}
let now = new Date();
// const BASE_URL = "http://localhost:3199";
const BASE_URL = "https://qrcode.langzhao.cn/api";

let loading = false;
let qrKey = "";
let userInfo = null;
let weChatConfig = null;

function load() {
  setCurrentYear();
  checkAuth();
}

function checkAuth() {
  //从微信授权回调地址中获取code //?code=061Fmo0w3Aps223Hvz2w3dw8sY3Fmo08&state=1
  const search = window.location.search;
  let params = search.slice(search.indexOf("?") + 1).split("&").filter(p => p);
  if (params.length > 0) {
    let codeParam = params.find(p => p.startsWith("code="));
    let stateParam = params.find(p => p.startsWith("state="));
    let uParam = params.find(p => p.startsWith("u="));
    if (uParam) {
      qrKey = uParam.split("=")[1];
    }

    if (codeParam) {
      let code = codeParam.split("=")[1];
      let state = stateParam.split("=")[1];
      if (state == 0) {
        //授权登录
        //开始登录
        getWeChatConfigAsync().then(res => {
          auth();
        })
      } else if (state == 1) {
        //静默登录
        //开始登录
        silentLogin(code);
        return;
      }
    }
  }
  auth();
}


function auth() {
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9004a70d03f6f2f8&redirect_uri=https%3A%2F%2Fqrcode.langzhao.cn%2Fqr%2Fqr.html?u=${qrKey}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`
}

function silentLogin(code) {
  let data = {code, typeCode: mpLoginCode.web, qrKey: qrKey};
  fetch(BASE_URL + "/wechat/mp/auth", {
    method: "post",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(res => res.json()).then(res => {
    userInfo = res.result;
    if (res.code === 0 && userInfo && userInfo.userId) {
      let dom = document.getElementById("contentId");
      if (dom) {
        dom.style.display = "block";
      }
    } else {
      // 无权限，跳转到登录
      // 临时存储微信信息
      sessionStorage.setItem("z237FgEdHsUxkvhi", JSON.stringify({
        openId: res.result.openId,
        nickName: res.result.nickName,
        avatar: res.result.avatar,
        sex: res.result.sex
      }));
      window.location.href = "/qr/sms.html?u=" + qrKey;
    }
  }).catch(e => {
    console.error("silentLogin:error")
    console.error(e)
  })
}


function getWeChatConfigAsync() {
  return new Promise((resolve, reject) => {
    loading = true;
    fetch(BASE_URL + "/wechat/js-config?url=" + window.location.href, {
      method: "get",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(res => {
      if (res.code === 0) {
        weChatConfig = res.result;
        resolve(res)
      } else {
        reject(res.msg)
      }
    }).catch(e => {
      reject(e)
    }).finally(() => {
      loading = false;
    })
  })
}

function handleConfirm() {
  let loading = true;
  let data = {
    qrKey: qrKey,
    status: 2
  };
  fetch(BASE_URL + "/login-qrcode/status", {
    method: "post",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(res => res.json()).then(res => {
    if (res.code === 0) {
      let dialogDom = document.getElementById("dialogId");
      if (dialogDom) {
        dialogDom.style.display = "block";
      } else {
        alert("登录成功");
      }
    } else {
      alert(res.msg);
    }
  }).catch(e => {
    console.error(e)
  }).finally(() => {
    loading = false;
  })
}

function handleCancel() {
  close();
}

function setCurrentYear() {
  let dom = document.getElementById("currentYearId");
  if (dom) {
    dom.innerText = now.getFullYear().toString();
  }
}

function handleBtnConfirm() {
  close();
}

function close() {
  WeixinJSBridge.call('closeWindow');
  document.addEventListener('WeixinJSBridgeReady', function () {
    WeixinJSBridge.call('closeWindow');
  }, false);

  let dialogDom = document.getElementById("dialogId");
  if (dialogDom) {
    dialogDom.style.display = "none";
  }
}
