// 委托状态
export const delegateStatus = {
  0: "暂存", 1: "待审核", 2: "待执行", 3: "执行中", 4: "已超期", 5: "已完成", 6: "已关闭",
}
export const repairTargetTypeList = [{ label: "车辆", value: 1 }, { label: "充电桩", value: 2 }, { label: "其他", value: 9 }]


export const repairTargetTypeMap = {
  1: "车辆", 2: "充电桩", 9: "其他",
}

export const faultLevelList = [// 0-无需处理，1-轻微（不影响使用），2-一般（特定条件下可用），3-严重（不能使用）
  { label: "无需处理", value: 0 }, { label: "轻微（不影响使用）", value: 1 }, { label: "一般（特定条件下可用）", value: 2 }, { label: "严重（不能使用）", value: 3 },]

export const faultLevelMap = {
  0: "无需处理", 1: "轻微（不影响使用）", 2: "一般（特定条件下可用）", 3: "严重（不能使用）"
}

export const isOrNotList = [{ label: "否", value: 0 }, { label: "是", value: 1 },]

export const isOrNotMap = {
  0: "否", 1: "是"
}

export const repairModeList = [{ label: "上门", value: 1 }, { label: "送修", value: 2 }, { label: "远程支持", value: 3 }, { label: "其他", value: 9 },]

export const repairModeMap = {
  1: "上门", 2: "送修", 3: "远程支持", 9: "其他",
}


export const repairStatusList = [{ label: "待处理", value: 0 }, { label: "已响应", value: 1 }, { label: "维修中", value: 2 }, { label: "已解决", value: 3 }]

export const repairStatusMap = {
  0: "待处理", 1: "已响应", 2: "维修中", 3: "已解决",
}

export const repairStatusTagTypeMap = {
  0: "danger", 1: "warning", 2: "primary", 3: "success",
}

export const operationModeList = [{ label: "自有", value: 1 }, { label: "外协", value: 2 }, { label: "代管", value: 3 },]

export const operationModeMap = {
  1: "自有", 2: "外协", 3: "代管",
}

export const vehicleStatusList = [{ label: "正常", value: 0 }, { label: "已停用", value: 2 }, { label: "检修中", value: 3 },]

export const vehicleStatusMap = {
  0: "正常", 2: "已停用", 3: "检修中",
}
export const vehicleStatusTagTypeMap = {
  0: "success", 1: "info", 2: "danger", 3: "warning",
}

export const licensePlateTypeList = [{ label: "蓝牌", value: 1 }, { label: "黄牌", value: 2 }, { label: "绿牌", value: 3 }, { label: "其他", value: 9 },]

export const driverStatusMap = {
  0: "在职", 1: "离职"
}
export const driverStatusList = [{ label: "在职", value: 0 }, { label: "离职", value: 1 },]

export const driverStatusTagTypeMap = {
  0: "success", 1: "info", 2: "danger", 3: "warning",
}

export const orderStatusList = [{ label: "已下单", value: 0 }, { label: "已接单", value: 1 }, { label: "执行中", value: 2 }, { label: "已关闭", value: 3 },]

export const orderStatusMap = {
  0: "已下单", 1: "已接单", 2: "执行中", 3: "已关闭"
}

export const orderStatusTagTypeMap = {
  0: "info", 1: "primary", 2: "danger", 3: "success",
}

export const dispatchPlanStatusList = [{ label: "待处理", value: 0 }, { label: "已派车", value: 1 }, { label: "已关闭", value: 2 },]

export const dispatchPlanStatusMap = {
  0: "待处理", 1: "已派车", 2: "已关闭"
}

export const dispatchPlanStatusTagTypeMap = {
  0: "info", 1: "primary", 2: "success",
}
// 派车单状态 派车状态，0-待接收、1-已接收、2-已拒绝、3-用车中、4-已还车、5-已完成、6-已关闭
export const dispatchStatusList = [
  { label: "待接收", value: 0 }, { label: "已接收", value: 1 }, { label: "已拒绝", value: 2 }, { label: "用车中", value: 3 }, { label: "已还车", value: 4 }, { label: "已完成", value: 5 }, { label: "已关闭", value: 6 },
];

export const dispatchStatusMap = {
  0: "待接收", 1: "已接收", 2: "已拒绝", 3: "用车中", 4: "已还车", 5: "已完成", 6: "已关闭"
}

export const dispatchStatusTagTypeMap = {
  0: "info", 1: "primary", 2: "danger", 3: "warning", 4: "success", 5: "success", 6: "success",
}

export const energyTypeList = [{ label: "电", value: 0 }, { label: "油", value: 1 }, { label: "气", value: 2 },]

export const energyTypeMap = {
  0: "电", 1: "油", 2: "气",
}

export const workStatusList = [{ label: "在职", value: 0 }, { label: "离职", value: 1 },]

export const workStatusMap = {
  0: "在职", 1: "离职",
}

export const driverNatureList = [{ label: "专职", value: 0 }, { label: "外协", value: 1 },]

export const driverNatureMap = {
  0: "专职", 1: "外协",
}

// 准驾车型
export const authorizedDrivingModelList = [{ label: "A1", value: "A1" }, { label: "A2", value: "A2" }, { label: "A3", value: "A3" }, { label: "B1", value: "B1" }, {
  label: "B2",
  value: "B2"
}, { label: "C1", value: "C1" }, { label: "C2", value: "C2" },]

export const sexList = [{ label: "男", value: 0 }, { label: "女", value: 1 },]

export const sexMap = {
  0: "男", 1: "女"
}

export const acDcTypeList = [{ label: "交流", value: 1 }, { label: "直流", value: 2 },];

export const acDcTypeMap = {
  1: "交流", 2: "直流",
}

// 充电桩枪状态
export const gunStateMap = {
  "1": "待机",
  "2": "等待连接",
  "3": "启动中",
  "4": "充电中",
  "5": "停止中",
  "6": "预约中",
  "7": "占用中",
  "8": "测试中",
  "9": "故障中",
  "10": "定时充电中",
  "11": "充电完成",
  "12": "升级中",
  "99": "离线",
  "-1": "下线"
}
// 枪口连接车状态
export const connectStateMap = {
  0: "未连接", 1: "连接"
}

export const connectStateTagTypeMap = {
  0: "info", 1: "success"
}

export const educationList = [
  { label: "初中", value: 0 }, { label: "高中", value: 1 }, { label: "技校", value: 2 }, { label: "专科", value: 3 }, { label: "本科", value: 4 }, { label: "其他", value: 5 },
]

export const educationMap = {
  0: "初中", 1: "高中", 2: "技校", 3: "专科", 4: "本科", 5: "其他",
}

// 货场类型 1.站台 2.煤矿 3.电厂 4.煤场 5.工厂 9.其他
export const stationTypeList = [
  { label: "站台", value: 1 }, { label: "煤矿", value: 2 }, { label: "电厂", value: 3 }, { label: "煤场", value: 4 }, { label: "工厂", value: 5 }, { label: "其他", value: 9 },
]

export const stationTypeMap = {
  1: "站台", 2: "煤矿", 3: "电厂", 4: "煤场", 5: "工厂", 9: "其他"
}

// 休息日模式, holidayMode
export const holidayModeList = [
  { label: "周末休息", value: 1 },
  { label: "节假日休息", value: 2 },
  { label: "其他", value: 3 },
]

export const holidayModeMap = {
  1: "周末休息", 2: "节假日休息", 3: "其他",
}

export const subjectTypeList = [
  { label: "自然人", value: 1 },
  { label: "公司", value: 2 },
]

export const subjectTypeMap = {
  1: "自然人",
  2: "公司",
}

export const shipperStatusList = [
  { label: "正常", value: "0" },
  { label: "已停用", value: "1" },
]

export const shipperStatusMap = {
  0: "正常",
  1: "已停用",
  "0": "正常",
  "1": "已停用",
}

export const goodsTypeList = [
  { label: "煤炭", value: 1 },
  { label: "矿石", value: 2 },
  { label: "化工", value: 3 },
  { label: "水泥", value: 4 },
  { label: "其他", value: 9 },
]

export const goodsTypeMap = {
  1: "煤炭",
  2: "矿石",
  3: "化工",
  4: "水泥",
  9: "其他",
}

export const goodsStatusList = [
  { label: "正常", value: 1 },
  { label: "已停用", value: 0 },
]

export const goodsStatusMap = {
  1: "正常",
  0: "已停用",
}

// 首选车型
export const primaryVehicleTypeList = [
  { label: "自有车辆", value: 1 }, { label: "外协车辆", value: 2 }, { label: "代管车辆", value: 3 }, { label: "其他", value: 9 },
]

export const primaryVehicleTypeMap = {
  1: "自有车辆", 2: "外协车辆", 3: "代管车辆", 9: "其他",
}

export const fleetSubjectTypeList = [
  { label: "自然人", value: "1" }, { label: "公司", value: "2" }
]

export const fleetSubjectTypeMap = {
  "1": "自然人", "2": "公司"
}

// 计价方式（1.计吨 2.计趟 3.一口价）
export const pricingMethodList = [
  { label: "计吨", value: 1 }, { label: "计趟", value: 2 }, { label: "一口价", value: 3 },
]

export const pricingMethodMap = {
  1: "计吨", 2: "计趟", 3: "一口价",
}

// 结算方式（1.月结 2.现结 3.第三方平台）
export const settlementMethodList = [
  { label: "月结", value: 1 }, { label: "现结", value: 2 }, { label: "第三方平台", value: 3 },
]

export const settlementMethodMap = {
  1: "月结", 2: "现结", 3: "第三方平台",
}

// 合同状态,0.暂未执行 1. 执行中 2. 已关闭
export const contractStatusList = [
  { label: "暂未执行", value: 0 }, { label: "执行中", value: 1 }, { label: "已关闭", value: 2 }
]
export const contractStatusMap = {
  0: "暂未执行", 1: "执行中", 2: "已关闭"
}

export const contractStatusTagTypeMap = {
  0: "info", 1: "primary", 2: "success"
}

// 运单状态  0. 待执行 1. 执行中 2. 已完成 3. 已关闭
export const waybillStatusList = [
  { label: "待执行", value: 0 }, { label: "执行中", value: 1 }, { label: "已完成", value: 2 }, { label: "已关闭", value: 3 }
];

export const waybillStatusMap = {
  0: "待执行", 1: "执行中", 2: "已完成", 3: "已关闭"
}

export const waybillStatusTagTypeList = [
  { label: "待执行", value: 0, type: "info" }, { label: "执行中", value: 1, type: "primary" }, { label: "已完成", value: 2, type: "success" }, { label: "已关闭", value: 3, type: "danger" }
]

export const waybillStatusTagTypeMap = {
  0: "info", 1: "primary", 2: "success", 3: "danger"
}

//  合同委托/临时委托
export const proxyWayList = [
  { label: "合同委托", value: 1 },
  { label: "临时委托", value: 2 }
]

export const proxyWayMap = {
  1: "合同委托",
  2: "临时委托"
}

// 司机性质，0-专职，1-外协，2-邀约
export const driverNatureTypeList = [
  { label: "专职", value: 0 },
  { label: "外协", value: 1 },
  { label: "邀约", value: 2 }
]

export const driverNatureTypeMap = {
  0: "专职",
  1: "外协",
  2: "邀约"
}

// 转账状态 0.无需转账 1.待转账 2.已转账
export const transferStatusList =[
  { label: "无需转账", value: 0 }, { label: "待转账", value: 1 }, { label: "已转账", value: 2 }
]

export const transferStatusMap = {
  0: "无需转账", 1: "待转账", 2: "已转账"
}