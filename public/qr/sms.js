window.onload = load;
let now = new Date();
// const BASE_URL = "http://localhost:3199";
const BASE_URL = "https://qrcode.langzhao.cn/api";
let form = {
  phone: "",
  captchaUUID: "",
  captcha: "",
  smsCode: "",
  smsId: "",
  qrKey: "",
}
let wechatInfo = null;
let smsTip = "获取短信验证码";
let count = 0;


function load() {
  getWechatInfo();
  setCurrentYear();
  requestNewCaptchaImage();
  setSmsTipDom();
  getQrKey();
}

function getWechatInfo() {
  let data = sessionStorage.getItem("z237FgEdHsUxkvhi");
  if (data) {
    wechatInfo = JSON.parse(data)
  }
}

function handleInputChange(e, fieldName) {
  form[fieldName] = e.target.value;
}

function handleGetSms() {
  if (smsTip !== "获取短信验证码") {
    return;
  }

  if (!form.phone) {
    showToast("请先输入手机号")
    return;
  }
  //验证手机号
  if (!/^1[3456789]\d{9}$/.test(form.phone)) {
    showToast("请先输入正确的手机号")
    return;
  }
  if (form.captcha == null || form.captcha === "") {
    showToast("请先输入图形验证码")
    return;
  }
  let data = {
    captcha: form.captcha,
    captchaId: form.captchaUUID,
    phone: form.phone,
    typeCode: "web",
    qrKey: form.qrKey
  }
  fetch(BASE_URL + "/login-qrcode/sms/send", {
    method: "post",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(res => res.json()).then(res => {
    if (res && res.result && res.result.SmsData) {
      form.smsId = res.result.SmsData.MsgId
      showToast("短信验证码已发送")
      count = 60;
      smsTip = count + "s";
      setSmsTipDom();
      let timer = setInterval(() => {
        count--;
        smsTip = count + "s";
        setSmsTipDom();
        if (count <= 0) {
          clearInterval(timer);
          smsTip = "获取短信验证码";
          setSmsTipDom();
        }
      }, 1000);
    } else {
      showToast("短信验证码发送失败")
    }
  }).catch(e => {
    if (e == null) {
      e = "发送短信失败"
    }
    if (typeof e !== "string") {
      e = JSON.stringify(e);
    }
    alert("发送短信失败,详情：" + e);
  });
}

function handleSubmit() {
  // /wechat/mp/login
  if (!form.phone) {
    showToast("请输入手机号")
    return;
  }
  //验证手机号
  if (!/^1[3456789]\d{9}$/.test(form.phone)) {
    showToast("请输入正确的手机号")
    return;
  }
  if (form.captcha == null || form.captcha === "") {
    showToast("请输入图形验证码")
    return;
  }
  if (form.smsCode == null || form.smsCode === "") {
    showToast("请输入短信验证码")
    return;
  }

  let param = {
    smsCode: form.smsCode,
    smsId: form.smsId,
    phoneNum: form.phone,
    qrKey: form.qrKey,
    openId: wechatInfo ? wechatInfo.openId : '',
    typeCode: "web",
    wechatInfo: wechatInfo
  }
  fetch(BASE_URL + "/wechat/mp/login", {
    method: "post",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(param)
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
    requestNewCaptchaImage();
  })
}

function setCurrentYear() {
  let dom = document.getElementById("currentYearId");
  if (dom) {
    dom.innerText = now.getFullYear().toString();
  }
}

function requestNewCaptchaImage() {
  //先清空图形验证码
  form.captcha = "";
  form.smsCode = "";
  fetch(BASE_URL + "/captcha").then(res => res.json()).then(res => {
    form.captchaUUID = res.result.captchaId;
    let imgDom = document.getElementById("captchaImageId")
    if (imgDom) {
      imgDom.src = res.result.captcha;
    }
  })
}

function setSmsTipDom() {
  let smsTipDom = document.getElementById("smsTipId");
  if (smsTipDom) {
    smsTipDom.innerText = smsTip;
  }
}

function showToast(text) {
  let dom = document.getElementById("toastId");
  if (dom) {
    dom.style.display = "";
    let innerDom = document.getElementById("toastTextId");
    if (innerDom) {
      innerDom.innerText = text;
    }
    setTimeout(() => {
      dom.style.display = "none";
      if (innerDom) {
        innerDom.innerText = "";
      }
    }, 2000)
  } else {
    alert(text);
  }
}

function getQrKey() {
  const search = window.location.search;
  let params = search.slice(search.indexOf("?") + 1).split("&").filter(p => p);
  if (params.length > 0) {
    let uParam = params.find(p => p.startsWith("u="));
    if (uParam) {
      form.qrKey = uParam.split("=")[1];
    }
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
