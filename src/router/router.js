import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { Layout } from "./constant";

export const routers = [
  {
    path: '/largeScreen/largeScreen',
    name: "largeScreen",
    component: () => import('../views/largeScreen/largeScreen.vue'),
    meta: {
      isMenu: false,
      icon: "HomeFilled",
      title: "大屏展示",
      roleList: []
    },
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/home',
    meta: {
      isMenu: true,
      roleList: []
    },
    children: [
      {
        path: "/home/home",
        name: 'home',
        component: () => import('../views/home/home.vue'),
        meta: {
          isMenu: true,
          isTopMenu: true,
          icon: "HomeFilled",
          title: "首页"
        }
      }
    ]
  },
  {
    path: '/cargo',
    component: Layout,
    redirect: '/cargo/order',
    meta: {
      isMenu: true,
      icon: "MessageBox",
      title: "货运管理",
      roleList: ["web_cargo"]
    },
    children: [
      // 合同管理
      {
        path: "/cargo/contract",
        name: 'cargo_contract',
        component: () => import("../views/cargo/contract.vue"),
        meta: {
          isMenu: true,
          icon: "Document",
          title: "合同管理"
        }
      },
      {
        path: "/cargo/order",
        name: 'cargo_order',
        component: () => import("../views/cargo/order.vue"),
        meta: {
          isMenu: true,
          icon: "Memo",
          title: "任务管理"
        }
      },
      // 运单查看
      {
        path: "/cargo/waybill",
        name: 'cargo_waybill',
        component: () => import("../views/cargo/waybill.vue"),
        meta: {
          isMenu: true,
          icon: "Document",
          title: "运单查看"
        }
      },
      {
        path: "/cargo/cargoBase",
        name: 'cargo_cargoBase',
        meta: {
          isMenu: true,
          icon: "Menu",
          title: "基础信息"
        },
        children: [
          {
            path: "/cargo/base/shipper",
            name: "cargo_base_shipper",
            component: () => import("../views/cargo/base/shipper.vue"),
            meta: {
              isMenu: true,
              icon: "Menu",
              title: "货主信息"
            }
          },
          {
            path: "/cargo/base/goods",
            name: "cargo_base_goods",
            component: () => import("../views/cargo/base/goods.vue"),
            meta: {
              isMenu: true,
              icon: "Menu",
              title: "货物信息"
            }
          },
          {
            path: "/cargo/base/station",
            name: "cargo_base_station",
            component: () => import("../views/cargo/base/station.vue"),
            meta: {
              isMenu: true,
              icon: "Menu",
              title: "货场信息"
            }
          }
        ]
      },
    ]
  },
  {
    path: '/vehicle',
    component: Layout,
    redirect: '/vehicle/selfVehicle',
    meta: {
      isMenu: true,
      icon: "Van",
      title: "车辆管理",
      roleList: ["web_car"]
    },
    children: [
      {
        path: "/vehicle/vehicleMap",
        name: 'vehicle_vehicleMap',
        component: () => import('../views/vehicle/vehicleMap.vue'),
        meta: {
          isMenu: true,
          icon: "Help",
          title: "实时监测"
        }
      },
      {
        path: "/vehicle/repair/",
        redirect: "/vehicle/repair/repair",
        meta: {
          isMenu: true,
          icon: "SuitcaseLine",
          title: "维保管理"
        },
        children: [
          {
            path: "/vehicle/repair/repair",
            name: 'vehicle_repair_repair',
            component: () => import('../views/vehicle/repair/repair.vue'),
            meta: {
              isMenu: true,
              icon: "Suitcase",
              title: "维修"
            }
          },
          {
            path: "/vehicle/repair/maintenance",
            name: 'vehicle_repair_maintenance',
            component: () => import('../views/vehicle/repair/maintenance.vue'),
            meta: {
              isMenu: true,
              icon: "Suitcase",
              title: "保养"
            }
          },
          {
            path: "/vehicle/repair/trafficViolations",
            name: 'vehicle_repair_trafficViolations',
            component: () => import('../views/vehicle/repair/trafficViolations.vue'),
            meta: {
              isMenu: true,
              icon: "Suitcase",
              title: "违章"
            }
          },
          {
            path: "/vehicle/repair/trafficAccidents",
            name: 'vehicle_repair_trafficAccidents',
            component: () => import('../views/vehicle/repair/trafficAccidents.vue'),
            meta: {
              isMenu: true,
              icon: "Suitcase",
              title: "事故"
            }
          },
        ]
      },
      {
        path: "/vehicle/base",
        redirect: "",
        meta: {
          isMenu: true,
          icon: "SuitcaseLine",
          title: "基础信息"
        },
        children: [
          {
            path: "/vehicle/base/vehicleBook",
            name: 'vehicle_repair_vehicleBook',
            component: () => import('../views/vehicle/base/vehicleBook.vue'),
            meta: {
              isMenu: true,
              icon: "Van",
              title: "车辆信息"
            }
          },
          {
            path: "/vehicle/base/fleet",
            name: 'vehicle_repair_fleet',
            component: () => import('../views/vehicle/base/fleet.vue'),
            meta: {
              isMenu: true,
              icon: "WindPower",
              title: "车队信息"
            }
          },
        ]
      }
    ]
  },
  {
    path: "/driver",
    component: Layout,
    redirect: "/driver/driverManager",
    meta: {
      isMenu: true,
      icon: "UserFilled",
      title: "司机管理",
      roleList: ["web_driver"]
    },
    children: [
      {
        path: "/driver/work",
        meta: {
          isMenu: true,
          icon: "Checked",
          title: "工作管理",
        },
        children: [
          {
            path: "/driver/work/attendance",
            name: "driver_work_attendance",
            component: () => import("../views/driver/work/attendance.vue"),
            meta: {
              isMenu: true,
              icon: "Checked",
              title: "考勤管理",
            }
          },
          {
            path: "/driver/work/report",
            name: "driver_work_report",
            component: () => import("../views/driver/work/report.vue"),
            meta: {
              isMenu: true,
              icon: "Checked",
              title: "报告管理",
            }
          },

          {
            path: "/driver/work/violation",
            name: "driver_work_violation",
            component: () => import("../views/driver/work/violation.vue"),
            meta: {
              isMenu: true,
              icon: "Checked",
              title: "违规管理",
            }
          },
        ]
      },
      {
        path: "/driver/inner",
        meta: {
          isMenu: true,
          icon: "Checked",
          title: "综合保障"
        },
        children: [
          {
            path: "/driver/inner/laborProducts",
            name: "driver_inner_laborProducts",
            component: () => import("../views/driver/inner/laborProducts.vue"),
            meta: {
              isMenu: true,
              icon: "Help",
              title: "劳保用品"
            }
          },
          {
            path: "/driver/work/institution",
            name: "driver_work_institution",
            component: () => import("../views/driver/work/institution.vue"),
            meta: {
              isMenu: true,
              icon: "Checked",
              title: "制度管理",
            }
          },
          {
            path: "/driver/inner/notification",
            name: "driver_inner_notification",
            component: () => import("../views/driver/inner/notification.vue"),
            meta: {
              isMenu: true,
              icon: "Help",
              title: "通知公告"
            }
          },
          {
            path: "/driver/inner/driverBook",
            name: "driver_inner_driverBook",
            component: () => import("../views/driver/inner/training.vue"),
            meta: {
              isMenu: true,
              icon: "Help",
              title: "培训管理"
            }
          },

          {
            path: "/driver/inner/healthCheck",
            name: "driver_inner_healthCheck",
            component: () => import("../views/driver/inner/healthCheck.vue"),
            meta: {
              isMenu: true,
              icon: "Help",
              title: "健康监测"
            }
          },
        ]
      },
      {
        path: "/driver/payroll",
        meta: {
          isMenu: true,
          icon: "Checked",
          title: "工资结算"
        },
        children: [
          {
            path: "/driver/payroll/payStandard",
            name: "driver_payroll_payStandard",
            component: () => import("../views/driver/payroll/payStandard.vue"),
            meta: {
              isMenu: true,
              icon: "Help",
              title: "工资标准"
            }
          },
          {
            path: "/driver/payroll/payrollMonthly",
            name: "driver_payroll_payrollMonthly",
            component: () => import("../views/driver/payroll/payrollMonthly.vue"),
            meta: {
              isMenu: true,
              icon: "Help",
              title: "工资月结"
            }
          },
          {
            path: "/driver/payroll/payrollDaily",
            name: "driver_payroll_payrollDaily",
            component: () => import("../views/driver/payroll/payrollDaily.vue"),
            meta: {
              isMenu: true,
              icon: "Help",
              title: "工资日结"
            }
          },
        ]
      },
      {
        path: "/driver/base",
        meta: {
          isMenu: true,
          icon: "Checked",
          title: "基础信息"
        },
        children: [
          {
            path: "/driver/base/driverManager",
            name: 'driver_base_driverBook',
            component: () => import("../views/driver/base/driverBook.vue"),
            meta: {
              isMenu: true,
              icon: "Avatar",
              title: "司机台账"
            }
          }
        ]
      }
    ]
  },
  {
    path: "/electric",
    component: Layout,
    redirect: "/electric/station",
    meta: {
      isMenu: true,
      icon: "List",
      title: "充电管理",
      roleList: ["web_charger"]
    },
    children: [
      // 实时监测
      {
        path: "/electric/pileRealTimeMonitoring",
        name: "electric_pileRealTimeMonitoring",
        component: () => import("../views/electric/pileRealTimeMonitoring.vue"),
        meta: {
          isMenu: true,
          icon: "Help",
          title: "实时监测"
        }
      },
      // 充电调度
      {
        path: "/electric/pileChargingDispatch",
        name: "electric_pileChargingDispatch",
        component: () => import("../views/electric/pileChargingDispatch.vue"),
        meta: {
          isMenu: true,
          icon: "Help",
          title: "充电调度"
        }
      },
      {
        path: "/electric/base",
        meta: {
          isMenu: true,
          icon: "Checked",
          title: "基础信息",
        },
        children: [
          {
            path: "/electric/base/station",
            name: "electric_base_station",
            component: () => import("../views/electric/base/station.vue"),
            meta: {
              isMenu: true,
              icon: "Shop",
              title: "充电站信息"
            }
          },
          // {
          //   path: "/electric/base/pileBook",
          //   name: "electric_base_pileBook",
          //   component: () => import("../views/electric/base/pileBook.vue"),
          //   meta: {
          //     isMenu: true,
          //     icon: "Help",
          //     title: "充电桩信息-去掉"
          //   }
          // },
          // {
          //   path: "/electric/base/compactSubstation",
          //   name: "electric_base_compactSubstation",
          //   component: () => import("../views/electric/base/compactSubstation.vue"),
          //   meta: {
          //     isMenu: true,
          //     icon: "Discount",
          //     title: "箱变信息-去掉"
          //   }
          // },
          // // 充电车位
          // {
          //   path: "/electric/base/chargingSpace",
          //   name: "electric_base_chargingSpace",
          //   component: () => import("../views/electric/base/chargingSpace.vue"),
          //   meta: {
          //     isMenu: true,
          //     icon: "ScaleToOriginal",
          //     title: "充电车位-去掉"
          //   }
          // },
          // // 停车位
          // {
          //   path: "/electric/base/parkingSpace",
          //   name: "electric_base_parkingSpace",
          //   component: () => import("../views/electric/base/parkingSpace.vue"),
          //   meta: {
          //     isMenu: true,
          //     icon: "Grid",
          //     title: "停车位-去掉"
          //   }
          // }
        ]
      },
    ]
  },
  {
    path: "/finance",
    name: "finance",
    component: Layout,
    redirect: "/finance/upstreamShippingSettlement",
    meta: {
      isMenu: true,
      icon: "Money",
      title: "财务管理",
      roleList: ["web_finance"]
    },
    children: [
      {
        path: "/finance/orderSettlement",
        name: "finance_orderSettlement",
        component: () => import("../views/finance/orderSettlement.vue"),
        meta: {
          isMenu: true,
          icon: "CreditCard",
          title: "订单结算"
        }
      },
      {
        path: "/finance/outsourcingCost",
        name: "finance_outsourcingCost",
        component: () => import("../views/finance/outsourcingCost.vue"),
        meta: {
          isMenu: true,
          icon: "CreditCard",
          title: "外协结算"
        }
      },
      {
        path: "/finance/driverSalary",
        name: "finance_driverSalary",
        component: () => import("../views/finance/driverSalary.vue"),
        meta: {
          isMenu: true,
          icon: "CreditCard",
          title: "司机工资"
        }
      },
      {
        path: "/finance/DriverReimbursement",
        name: "finance_DriverReimbursement",
        component: () => import("../views/finance/DriverReimbursement.vue"),
        meta: {
          isMenu: true,
          icon: "CreditCard",
          title: "司机报销"
        }
      },
      {
        path: "/finance/AssetCost",
        name: "finance_AssetCost",
        component: () => import("../views/finance/AssetCost.vue"),
        meta: {
          isMenu: true,
          icon: "CreditCard",
          title: "资产管理"
        }
      },
      {
        path: "/finance/electricBill",
        name: "finance_electricBill",
        component: () => import("../views/finance/electricBill.vue"),
        meta: {
          isMenu: true,
          icon: "CreditCard",
          title: "电费管理"
        }
      },
      {
        path: "/finance/maintenanceCost",
        name: "finance_maintenanceCost",
        component: () => import("../views/finance/maintenanceCost.vue"),
        meta: {
          isMenu: true,
          icon: "CreditCard",
          title: "维保费用管理"
        }
      },
      {
        path: "/finance/invoice",
        name: "finance_invoice",
        component: () => import("../views/finance/invoice.vue"),
        meta: {
          isMenu: true,
          icon: "CreditCard",
          title: "发票管理"
        }
      },
      {
        path: "/finance/expenses",
        name: "finance_expenses",
        component: () => import("../views/finance/Expenses.vue"),
        meta: {
          isMenu: true,
          icon: "CreditCard",
          title: "费用管理"
        }
      },
    ]
  },
  {
    path: "/system",
    component: Layout,
    redirect: "/system/dict",
    meta: {
      isMenu: true,
      title: "系统管理",
      icon: "Setting",
      roleList: ["web_system"]
    },
    children: [
      {
        path: "/system/company",
        name: "system_company",
        component: () => import('../views/system/company.vue'),
        meta: {
          isMenu: true,
          icon: "Notebook",
          title: "公司管理"
        }
      },
      {
        path: "/system/account",
        name: "system_account",
        component: () => import('../views/system/account.vue'),
        meta: {
          isMenu: true,
          icon: "Notebook",
          title: "用户管理"
        }
      },
      {
        path: "/system/role",
        name: "system_role",
        component: () => import('../views/system/role.vue'),
        meta: {
          isMenu: true,
          icon: "Notebook",
          title: "角色管理"
        }
      },
      {
        path: "/system/dict",
        name: "system_dict",
        component: () => import('../views/system/dict.vue'),
        meta: {
          isMenu: true,
          icon: "Notebook",
          title: "数据字典"
        }
      },
      // {
      //   path: "/system/setting",
      //   name: "system_setting",
      //   component: () => import('../views/system/setting.vue'),
      //   meta: {
      //     isMenu: true,
      //     icon: "Notebook",
      //     title: "系统配置"
      //   }
      // },
      // {
      //   path: "/system/log",
      //   name: "system_log",
      //   component: () => import('../views/system/log.vue'),
      //   meta: {
      //     isMenu: true,
      //     icon: "Notebook",
      //     title: "系统日志"
      //   }
      // }
    ]
  },
];


const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  strict: false,
  // scrollBehavior: () => ({left: 0, top: 0}),
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  },
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login/login.vue"),
      meta: {
        title: "登录"
      }
    },
    {
      path: "/", redirect: "/home"
    },
    {
      path: "/404",
      name: "404",
      component: () => import('../components/errorMessage/404.vue'),
      meta: {
        title: "404"
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ].concat(routers)
})

export default router
