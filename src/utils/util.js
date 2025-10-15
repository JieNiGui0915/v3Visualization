import * as XlsxJs from "xlsx";
import XLSX from "exceljs"
import { GlobalStore } from "@/store/index.js";
import { axiosOrigin } from "@/api/index.js";
import { ElMessage, ElNotification } from "element-plus";
import { isDate } from "@/utils/is.js";

/**
 * 日期格式化
 * @param {string} s
 * @returns {string}
 */
export const formatDateTimeString = (s = "") => {
  if (s) {
    const d = new Date(s);
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours();
    let minute = d.getMinutes();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
  return "";
}

export const formatDateTime = (s = new Date()) => {
  if (s) {
    if (typeof s === "string") {
      s = new Date(s)
    }
    const d = s;
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  return "";
}

// 时间戳转日期格式
export const stampToDate = (d = 0) => {
  let ds = d.toString();
  switch (ds.length) {
    case 10:
      return new Date(d * 1000);
    case 13:
      return new Date(d);
    default:
      return null;
  }
}
/**
 * 格式化日期为紧凑型, 20240102或20240102211221
 * @param {Date} date
 * @param {Boolean} hasTime
 * @return {String}
 */
export const formatDateTimeThinString = (date = new Date(), hasTime = true) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  if (hasTime) {
    return `${year}${month}${day}${hour}${minute}${second}`
  } else {
    return `${year}${month}${day}`
  }
}

export const formatDate = (date) => {
  if (!date) {
    return ""
  }
  if (typeof date == "string") {
    date = date.replace(/\-/g, "/");
    date = new Date(date)
  }
  if (date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    return `${year}-${month}-${day}`;
  }
  return "";
}

export const formatTime = (date) => {
  if (typeof date == "string") {
    date = date.replace(/\-/g, "/");
    date = new Date(date);
  }
  if (date) {
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    return `${hour}:${minute}:${second}`;
  }
  return "";
}

export function removeYearStr(date) {
  if (!date) {
    return "";
  }
  if (typeof date !== "string") {
    date = formatDate(date);
  }
  date = date.replace(/\//g, "-");
  let list = date.split("-");
  if (list.length === 3) {
    return list[1] + "-" + list[2];
  } else if (list.length === 2) {
    return list[1];
  } else {
    return date;
  }
}

// 获取当前日期的上一个月 ,形如: 2024-12-1
export function getLastMonthStartString() {
  let now = new Date();
  // 当前年月的日
  let nowDate = now.getDate();
  //当前月份完整日期 (Thu Jul 07 2022 12:03:37 GMT+0800 (中国标准时间))
  let lastMonth = new Date(now.getTime());
  // 设置上一个月（这里不需要减1） getMonth()返回表示月份的数字 setMonth()设置月份参数
  lastMonth.setMonth(lastMonth.getMonth());
  // 设置为0，默认为当前月的最后一天
  lastMonth.setDate(0);
  // 上一个月的天数
  let daysOfLastMonth = lastMonth.getDate();
  // 设置上一个月的日期，如果当前月的日期大于上个月的总天数，则为最后一天
  // 例如当前是3月31，而2月只有28或29天，则取2月的最后一天
  lastMonth.setDate(nowDate > daysOfLastMonth ? daysOfLastMonth : nowDate);
  //调用格式化日期函数
  lastMonth = formatDate(lastMonth);
  let a = lastMonth.split("-");
  return [a[0], a[1], "01"].join("-");
}

// 获取最近的25号日期
export function getLast25Date() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let date = now.getDate();
  if (date >= 25) {
    return new Date(year, month, 25);
  }
  if (month === 0) {
    year--;
    month = 11;
  }
  return new Date(year, month, 25);
}

/**
 * 减一个月的日期
 * @param {Date} day
 */
export function subtractOneMonth(day) {
  let year = day.getFullYear();
  let month = day.getMonth();
  let date = day.getDate();
  if (month === 0) {
    year--;
    month = 11;
  } else {
    month--;
  }
  return new Date(year, month, date);
}

export function isToday(input) {
  const date = new Date(input);
  if (isNaN(date.getTime())) return false; // 处理无效日期
  return date.toDateString() === new Date().toDateString();
}

export function isTomorrow(input) {
  const date = new Date(input);
  if (isNaN(date.getTime())) return false; // 处理无效日期
  let now = new Date();
  now.setDate(now.getDate() + 1)
  return date.toDateString() === now.toDateString();
}

/**
 * 深度拷贝
 * @param obj
 * @returns {any}
 */
export const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}

export const clearObject = obj => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = '';
    }
  }
}


/**
 * 获取两个日期之间的天数, 用后一个日期减去前一个日期
 * @param {Date|string} preDate 前一个日期
 * @param {Date|string} postDate 后一个日期
 * @returns {number|null}
 */
export const getChangeDays = (preDate, postDate) => {
  if (!preDate || !postDate) return null;
  if (typeof preDate === 'string') {
    preDate = new Date(preDate);
  }
  if (typeof postDate === 'string') {
    postDate = new Date(postDate);
  }

  const dateSpan = postDate - preDate;
  return Math.floor(dateSpan / (24 * 3600 * 1000));
}


/**
 * 毫秒转换友好的显示格式
 * 输出格式：21小时前
 * stringTime为:年-月-日 时:分:秒
 * @return {string}      [description]
 * @param stringTime
 */
export function friendlyFormatTime(stringTime) {
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let week = day * 7;
  let month = day * 30;
  let time1 = new Date().getTime(); //当前的时间戳
  let time2 = new Date(stringTime); //指定时间的时间戳
  let time = time1 - time2;

  let result = "";
  if (time < 0) {
    result = "--";
  } else if (time / month >= 1) {
    result = (time / month).toFixed(0) + "月前";
  } else if (time / week >= 1) {
    result = (time / week).toFixed(0) + "周前";
  } else if (time / day >= 1) {
    result = (time / day).toFixed(0) + "天前";
  } else if (time / hour >= 1) {
    result = (time / hour).toFixed(0) + "小时前";
  } else if (time / minute >= 1) {
    result = (time / minute).toFixed(0) + "分钟前";
  } else {
    result = "刚刚";
  }
  return result;
}

/**
 * 数字转中文汉字
 * @param {Number} num
 * @returns {string}
 */
export function toChineseNumber(num) {
  if (num == null || num === "") {
    return "";
  }
  let ns = num.toString().split(".");
  num = Number(ns[0]);
  //  四位四位的进行分割
  const parts = num
    .toString()
    .replace(/(?=(\d{4})+$)/g, ',')
    .split(',')
    .filter(Boolean)

  const map = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const units = ['', '十', '百', '千']

  // 把连续的零给去掉 合并为1个零  当零在末尾的时候去掉
  function _handleZero(str) {
    return str.replace(/零+/g, '零').replace(/零$/, '')
  }

  function _transform(n) {
    let result = ''
    for (let i = 0; i < n.length; i++) {
      const c = map[n[i]]
      let u = units[n.length - i - 1]
      if (c === '零') {
        u = ''
      }
      result += c + u
    }
    result = _handleZero(result)
    return result
  }

  const bigUnits = ['', '万', '亿']
  let result = ''
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]
    const c = _transform(p)
    const u = bigUnits[parts.length - i - 1]
    if (c === '') {
      result += '零'
      continue
    }
    result += c + u
  }
  result = _handleZero(result)

  // 补充小数位
  if (ns.length > 1) {
    result = result + "点";
    let n = ns[1];
    let nn = n.split("");
    for (let i = 0; i < nn.length; i++) {
      result += map[Number(nn[i])];
    }
  }
  return result
}

//下载文件流
export function downloadStreamFile(data, fileName, blobOption = null,) {
  const blob = new Blob([data], blobOption);//处理文档流
  const alink = document.createElement('a');
  alink.download = fileName;
  alink.style.display = 'none';
  alink.href = URL.createObjectURL(blob);
  document.body.appendChild(alink);
  alink.click();
  URL.revokeObjectURL(alink.href); // 释放URL 对象
  document.body.removeChild(alink);
}

//下载图片
export function downloadImage(data = "base64 or link", fileName) {
  const a = document.createElement("a");
  a.setAttribute("download", fileName || "下载");
  a.setAttribute("href", data);
  const evt = document.createEvent("MouseEvents");
  evt.initEvent("click", true, true);
  a.dispatchEvent(evt);
}

//下载文件
export function downloadFile(href, fileName) {
  let a = document.createElement("a");
  a.href = href;
  a.download = fileName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// 通过blob的方式进行下载
export function downloadFromBlob(_blob, filename) {
  const blob = new Blob([_blob])
  const downloadElement = document.createElement('a')
  downloadElement.style.display = 'none'
  const href = window.URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.href = href
  downloadElement.download = filename // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}

// 读取本地文件
export function readWorkbookFromLocalFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function (e) {
      // resolve(e.target.result);
      let data = e.target.result;
      let workbook = XlsxJs.read(data, { type: 'binary' });
      resolve(readWorkBook(workbook));
    };
    reader.onerror = function (e) {
      reject(e);
    };
  })
}

export function readWorkBook(workbook) {
  let sheetNames = workbook.SheetNames; // 工作表名称集合
  let worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
  let json = XlsxJs.utils.sheet_to_json(worksheet);
  return json;
}

//将形如: code={code}&name={name} , 使用对象实例参数{name:"abc",code:"wwmin"}进行填充,最终为: code=abc&name=wwmin
export function parseStringWithParam(url, params) {
  let r = /({\s*\w+\s*})/g;
  let matchList = url.match(r);
  let n = matchList.length;
  for (let i = 0; i < n; i++) {
    let m = matchList[i];
    let p = m.replace(/[{}\s]/g, "");
    url = url.replace(m, params[p]);
  }
  return url;
}

// 将excel的日期转换为js的日期
export function excelDateToJSDate(date) {
  return new Date(Math.round((date - 25569) * 86400 * 1000));
}

// base64转blob
function base64ToBlob(base64) {
  if (!base64.startsWith("data:")) {
    // 安卓手机缺少base64头信息
    base64 = "data:image/jpg;base64," + base64;
  }
  var arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
}

// blob转file
function blobToFile(theBlob, fileName) {
  return new File([theBlob], fileName);
}

/**
 * base64 图片转 File
 * @param {String} base64
 * @param {String} fileName
 * @return {File}
 */
export function base64ToFile(base64 = "", fileName) {
  return blobToFile(base64ToBlob(base64), fileName);
}


// 动态加载外部链接
export function loadJS(url) {
  return new Promise((resolve) => {
    // 检查文档中是否已存在该js文件
    if (IsDocumentInclude(url)) {
      resolve();
      return;
    }
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    // IE
    if (script.readyState) {
      script.onreadystatechange = () => {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;
          resolve();
        }
      };
    } else {
      // 其他浏览器
      script.onload = function () {
        resolve();
      };
    }
    document.getElementsByTagName('head')[0].appendChild(script);
  })
}

function IsDocumentInclude(url = "") {
  let js = url.endsWith(".js");
  let es = document.getElementsByTagName(js ? 'script' : 'link');
  for (let i = 0; i < es.length; i++) {
    if (es[i][js ? 'src' : 'href'].indexOf(url) !== -1) {
      return true;
    }
  }
  return false;
}

// 是否是pc客户端
export function isWindowsWechatPlat() {
  //Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat(0x63090a13) XWEB/9115 Flue
  if (import.meta.env.DEV) {
    return true;
  }
  return navigator.userAgent.indexOf("MicroMessenger") > -1 && navigator.userAgent.indexOf("WindowsWechat") > -1;
}


/**
 * excelOneSheetExport 导出
 * @Cell.style style:excel表的样式配置
 * @Array tableData:表的数据内容
 * @Array headerKeys:表头key
 * @Array headerKeyMap:表头配置
 * @String showIndex: bool ,默认true
 * @String sheetName：工作表名
 */
export function excelOneSheetExport(options) {
  let { fileName, sheetName, headerKeys, headerKeyMap, tableData } = options;
  let showIndex = options.showIndex === undefined ? true : options.showIndex;

  // 创建工作簿
  const workbook = new XLSX.Workbook()
  workbook.creator = '';
  workbook.created = new Date();

  addSheet(workbook, sheetName, headerKeys, headerKeyMap, tableData, showIndex)

  if (!fileName) {
    fileName = sheetName;
  }
  if (!fileName.endsWith(".xlsx")) {
    fileName = fileName + ".xlsx";
  }
  workbook.xlsx.writeBuffer().then(buffer => {
    downloadFromBlob(buffer, fileName);
  });
}


export function excelMultiSheetExport(options) {
  // let {fileName, sheetList} = options;
  let fileName = options.fileName || "下载";
  let sheetList = options.sheetList || [];
  let showIndex = options.showIndex === undefined ? true : options.showIndex;

  // let {fileName, sheetName, headerKeys, tableData} = options;

  // 创建工作簿
  const workbook = new XLSX.Workbook()
  workbook.creator = '';
  workbook.created = new Date();

  for (let i = 0; i < sheetList.length; i++) {
    addSheet(workbook, sheetList[i].sheetName, sheetList[i].headerKeys, sheetList[i].headerKeyMap, sheetList[i].tableData, showIndex);
  }

  if (!fileName.endsWith(".xlsx")) {
    fileName = fileName + ".xlsx";
  }
  workbook.xlsx.writeBuffer().then(buffer => {
    downloadFromBlob(buffer, fileName);
  });
}

function addSheet(workbook, sheetName, headerKeys, headerKeyMap, tableData, showIndex = true) {
  // 添加工作表
  const worksheet = workbook.addWorksheet(sheetName);
  //冻结首行
  worksheet.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];
  // 首行加粗
  const row1 = worksheet.getRow(1);
  // row1.height = 30;
  row1.font = {
    // name: "黑体",
    bold: true, // size: 14,
    color: {
      argb: "000000"
    }
  }

  if (headerKeys.length > 0) {
    if (showIndex) {
      headerKeys.unshift("index");
    }
    // 设置列头
    worksheet.columns = headerKeys.map((column, index) => {
      let headObj = (headerKeyMap ? headerKeyMap[column] : { label: column }) || {};
      if (index === 0 && showIndex) {
        headObj.label = "编号";
        headObj.width = 10;
      }
      let width = +headObj.width;
      width = isNaN(width) ? 20 : width
      return {
        header: headObj ? headObj.label : column, key: column, width: width
      }
    })
    // 设置表头样式
    // const headerRow = worksheet.getRow(1)
    // headerRow.eachCell((cell) => {
    //   cell.style = style
    // })
  }
  // 设置行数据
  if (tableData.length > 0) {
    // 将传入的数据格式化为exceljs可使用的数据格式
    const rowList = [];
    tableData.forEach((table, index) => {
      let row = []
      headerKeys.forEach((key) => {
        if (key === "index") {
          row.push(index + 1)
        } else {
          row.push(table[key])
        }
      })
      rowList.push(row)
    })

    // 添加行
    if (rowList) worksheet.addRows(rowList)
    // 获取每列数据，依次对齐
    worksheet.columns.forEach((column) => {
      column.alignment = { vertical: "middle", horizontal: "center" };
    })
    // 设置每行的边框
    const dataLength = rowList.length
    const tableRows = worksheet.getRows(2, dataLength + 1)
    tableRows.forEach((row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        // cell.border = style.border
      })
    })
  }
}

// 导出文件
export function exportFileAsync(url, body, fileName) {
  let globalStore = GlobalStore();
  return axiosOrigin.post(url, body, { responseType: "blob", headers: { "Authorization": "Bearer " + globalStore.token } }).then(res => {
    ElMessage.success("导出成功");
    let dateString = formatDateTimeThinString(new Date(), false);
    let contentDisposition = res.headers["content-disposition"];
    if (contentDisposition) {
      let fileNameString = contentDisposition.split(";").map(p => p.trim()).find(p => p.startsWith("filename="));
      if (fileNameString) {
        fileNameString = fileNameString.replace(/\"/ig, "");
        fileName = decodeURIComponent(fileNameString.split("=")[1]);
      }
    }

    downloadStreamFile(res.data, fileName);
  }).catch(e => {
    console.error(e);
    if (e.response.data && e.response.data.type && (e.response.data.type.indexOf("text") > -1 || e.response.data.type.indexOf("json") > -1)) {
      const reader = new FileReader();
      reader.readAsText(e.response.data, "utf-8");
      reader.onload = function () {
        let data = JSON.parse(reader.result);
        let message = data.message || JSON.stringify(data);
        if (message.startsWith("无数据")) {
          ElMessage.warning(message);
          return;
        }
        let msg = "详细信息:" + message;
        ElNotification.error({ title: "错误", message: "导出台账失败!" + msg });
      }
      return;
    }
    let msg = "详细信息:" + e.message || JSON.stringify(e);
    ElNotification.error({ title: "错误", message: "导出失败!" + msg });
  })
}

// 根据全路径获取文件名称
export function getFileName(fileFullPath = "") {
  let fs = fileFullPath.split("/");
  if (fs.length === 0) {
    return "";
  }
  return fs[fs.length - 1];
}

// 节流
export function throttle(fn, wait) {
  let timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, wait);
    }
  }
}

// 防抖
export function debounce(fn, wait) {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, wait);
  }
}

/**
 * list转map对象
 * @param {Array} list
 * @param keyFn
 * @returns {Map<any, any>}
 */
export function toMap(list = [], keyFn = item => item.id) {
  if (!keyFn) {
    throw new Error("toMap fn 不能为空")
  }
  let res = new Map();
  if (list.length === 0) {
    return res;
  }
  list.forEach(p => {
    let key = keyFn(p);
    if (key != null) {
      res.set(key, p);
    }
  })
  return res;
}

export function toMapList(list = [], keyFn = item => item.id) {
  if (!keyFn) {
    throw new Error("toMap fn 不能为空")
  }
  let res = new Map();
  if (list.length === 0) {
    return res;
  }
  list.forEach(p => {
    let key = keyFn(p);
    if (key != null) {
      if (res.has(key)) {
        let arr = res.get(key);
        arr.push(p);
      } else {
        res.set(key, [p]);
      }
    }
  })
  return res;
}

export function maxDateToEmpty(maxDate = "2099-12-31") {
  if (typeof maxDate === "string") {
    if (maxDate.startsWith("2099")) {
      return ""
    }
  } else if (isDate(maxDate)) {
    if (maxDate.getFullYear() === "2099") {
      return ""
    }
  }
  return maxDate
}

// 验证身份证号
export function validateIDCard(id) {
  // 基础正则校验
  const reg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i;
  if (!reg.test(id)) return false;

  // 日期有效性验证
  const year = parseInt(id.substr(6, 4));
  const month = parseInt(id.substr(10, 2)) - 1; // JS月份从0开始
  const day = parseInt(id.substr(12, 2));
  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return false;
  }

  // 校验码验证
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const sum = id
    .substring(0, 17)
    .split('')
    .reduce((acc, cur, idx) => acc + parseInt(cur) * weights[idx], 0);
  const checkCodeIndex = sum % 11;
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  return id[17].toUpperCase() === checkCodes[checkCodeIndex];
}


/**
 * 生成随机字符
 * @num {number} num
 * @returns {string}
 */
export function randomRange(num = 8) {
  if (num < 4) {
    throw new Error("随机字符至少4位数")
  }
  // 定义字符集
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*+-_";

  // 生成必须字符（每类至少一个）
  const mandatory = [
    getRandomChar(lowercase),
    getRandomChar(uppercase),
    getRandomChar(numbers),
    getRandomChar(symbols)
  ];

  // 生成剩余随机字符（从所有字符组合中选取）
  const allChars = lowercase + uppercase + numbers + symbols;
  const remaining = Array.from({ length: num - 4 }, () => getRandomChar(allChars));

  // 合并并打乱顺序
  const passwordArray = [...mandatory, ...remaining];
  return shuffleArray(passwordArray).join('');

  // 辅助函数：获取随机字符
  function getRandomChar(str) {
    return str[Math.floor(Math.random() * str.length)];
  }

  // 辅助函数：Fisher-Yates 洗牌算法
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}


// 密码轻度不够时的提醒
export function pwdCheckRulesString() {
  return "密码需要满足: 至少一位小写字符,至少一位大小字符,至少一位数字,至少一位特殊字符(!@#$%^&*),且长度最少8位";
}