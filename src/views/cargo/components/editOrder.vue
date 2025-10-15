<template>
  <el-dialog v-model="dialogVisible" title="修改任务" center top="30px" class="editOrder" width="80%"
    style="min-width: 850px" @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <div class="flex-align-start">
        <div class="flex-1">
          <el-form-item label="订单号">
            {{ form.orderNumber }}
          </el-form-item>
          <el-form-item label="委托方式" prop="proxyWay">
            <el-select v-model="form.proxyWay" placeholder="" clearable>
              <el-option v-for="item in proxyWayList" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同号" prop="contractNo" v-if="form.proxyWay === 1">
            <el-select v-model="form.contractNo" filterable remote remote-show-suffix
              :remote-method="remoteFilterContractMethod" clearable placeholder="输入合同号搜索" :loading="loadingContract"
              @focus="searchContractList" @change="handleContractChange">
              <el-option :value="item.contractNo" :label="item.contractNo" v-for="item in contractList">
                <span class="el-option-left">{{ item.contractNo }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同子项" prop="contractItemId" v-if="form.proxyWay === 1">
            <el-select v-model="form.contractItemId" placeholder="" v-loading="loadingContractItem" clearable
              @change="handleContractItemIdChange">
              <el-option :value="item.contractItemId" :label="item.contractItemName" v-for="item in contractItemList">
                <span class="el-option-left">{{ item.contractItemName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计价方式" prop="pricingMethod">
            <el-select v-model="form.pricingMethod" placeholder="" clearable>
              <el-option v-for="item in pricingMethodList" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单价(元)" prop="unitPrice">
            <el-input v-model="form.unitPrice" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="预计吨数" prop="estimatedTonnage">
            <el-input v-model="form.estimatedTonnage" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="预计趟数" prop="estimatedTrips">
            <el-input v-model="form.estimatedTrips" type="number" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="预计金额(元)" prop="estimatedAmount">
            <el-input v-model="form.estimatedAmount" type="number" placeholder="" clearable></el-input>
          </el-form-item>
        </div>
        <div class="flex-1">
          <el-form-item label="货主" prop="shipperId">
            <el-select v-model="form.shipperId" filterable placeholder="" v-loading="loadingShipper" clearable>
              <el-option :value="item.shipperId" :label="item.shipperName" v-for="item in shipperList">
                <span class="el-option-left">{{ item.shipperName }}</span>
                <span class="el-option-right">{{ item.shipperCode }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货物" prop="goodsItemId">
            <el-select v-model="form.goodsItemId" filterable placeholder="" v-loading="loadingGoodsItem" clearable>
              <el-option :value="item.goodsItemId" :label="item.goodsItemName" v-for="item in goodsItemList">
                <span class="el-option-left">{{ item.goodsItemName }}</span>
                <span class="el-option-right">{{ item.goodsItemCode }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路线" prop="trucklineId">
            <el-select v-model="form.trucklineId" filterable placeholder="" v-loading="loadingGoodsItem" clearable
              @change="handleTruckLineChange">
              <el-option :value="item.trucklineId" :label="item.trucklineName" v-for="item in truckLineList">
                <span class="el-option-left">{{ item.trucklineName }}</span>
                <span class="el-option-right">{{ item.sendGoodsYardName }} 至 {{ item.receiveGoodsYardName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="装货点" prop="loadAddressId">
            <el-select v-model="form.loadAddressId" placeholder="" filterable clearable
              @change="handleLoadSelectChange('loadAddressId')">
              <el-option v-for="item in allStationList" :key="item.goodsYardId" :label="item.goodsYardShortName"
                :value="item.goodsYardId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="卸货点" prop="unloadAddressId">
            <el-select v-model="form.unloadAddressId" placeholder="" filterable clearable
              @change="handleLoadSelectChange('unloadAddressId')">
              <el-option v-for="item in allStationList" :key="item.goodsYardId" :label="item.goodsYardShortName"
                :value="item.goodsYardId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运量(吨)" prop="freightVolume">
            <el-input v-model="form.freightVolume" type="number" clearable></el-input>
          </el-form-item>
          <el-form-item label="运输要求" prop="transportRequire">
            <el-input v-model="form.transportRequire" type="textarea" autosize clearable></el-input>
          </el-form-item>
        </div>
        <div class="flex-1">
          <el-form-item label="开始时间" prop="beginTime">
            <el-date-picker v-model="form.beginTime" type="datetime" format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm" :editable="false" placeholder="请选择日期时间"
              :shortcuts="shortcuts" clearable />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker v-model="form.endTime" type="datetime" format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm" :editable="false" placeholder="请选择日期时间"
              :shortcuts="shortcuts" clearable />
          </el-form-item>
          <el-form-item label="联系人" prop="contactUserName">
            <el-input v-model="form.contactUserName" clearable>
              <template #append>
                <el-select v-model="searchSelectValue" placeholder="搜索姓名/手机号/身份证号" filterable remote remote-show-suffix
                  :remote-method="remoteFilterContactMethod" clearable v-loading="loadingStaff"
                  @change="handleSelectChange" style="padding: 0">
                  <el-option v-for="item in staffList" :key="item.staffId" :value="item.staffId">
                    <span class="el-option-left">{{ item.fullName }}</span>
                    <span class="el-option-right">{{ item.mobileNumber }} / {{ item.idCardNumber }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="contactPhone">
            <el-input v-model="form.contactPhone" clearable></el-input>
          </el-form-item>
          <el-form-item label="结算方式" prop="settlementMethod">
            <el-select v-model="form.settlementMethod" placeholder="" clearable>
              <el-option v-for="item in settlementMethodList" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算平台" prop="settlementPlatform">
            <el-input v-model="form.settlementPlatform" placeholder="" clearable></el-input>
          </el-form-item>

        </div>
      </div>
      <el-form-item label="订单文件" prop="">
        <my-upload ref="myUploadRef" :file-ids="form.orderFileIds" type="order" @success="uploadSuccessFn"
          @uploading="uploadingFn"></my-upload>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" clearable></el-input>
      </el-form-item>
      <div class="flex_row flex-justify-center mt-50">
        <el-button type="primary" @click="submit(formRef)">提交</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script setup>
import { nextTick, ref, useTemplateRef } from "vue";
import * as orderApi from "@/api/api.order.js";
import { getAllStationSimple } from "@/api/api.station.js";
import { ElMessage } from "element-plus";
import { getShipperSimpleList } from "@/api/api.shipper.js";
import { getGoodsSimpleList } from "@/api/api.goods.js";
import { getTruckLineSimpleList } from "@/api/api.truckline.js";
import MyUpload from "@/components/form/my-upload.vue";
import { searchStaff } from "@/api/api.staff.js";
import { searchContractPageList, getContractItemByContractId } from '@/api/api.contract';
import { pricingMethodList, settlementMethodList, proxyWayList } from "@/config/const.js";

const dialogVisible = ref(false);

const loading = ref(false);
const form = ref({
  "orderId": "", // 合同id
  "orderNumber": "",// 订单号
  "contractId": "", // 合同id
  "contractItemId": "", // 合同子项id
  "contractNo": "", // 合同编号
  "shipperId": "", // 货主ID
  "goodsItemId": "", // 货物ID
  "trucklineId": "", // 路线ID
  "freightVolume": null, // 运量(吨)
  "loadAddress": "", // 装货点
  "loadAddressId": "", // 装货点ID
  "unloadAddress": "", // 卸货点
  "unloadAddressId": "", // 卸货点ID
  "beginTime": "", // 起始时间
  "endTime": "", // 结束时间
  "contactUserName": "", // 联系人姓名
  "contactPhone": "", // 联系电话
  "transportRequire": "", // 运输要求
  "orderFileIds": "", // 订单文件集
  "remark": "", // 备注
  "proxyWay": "",// 委托方式
  "pricingMethod": "",// 计价方式(1.计吨 2.计趟 3.一口价)
  "unitPrice": "",// 单价(元)
  "estimatedTonnage": "",// 预计吨数
  "estimatedTrips": "",// 预计趟数
  "estimatedAmount": "",// 预计金额(元)
  "settlementMethod": "",// 结算方式(1.月结 2.现结 3.第三方平台)
  "settlementPlatform": "",// 结算平台
})

const rules = {
  shipperId: [
    { required: true, message: "请选择", trigger: ["blur", "change"] }
  ],
  goodsItemId: [
    { required: true, message: "请选择", trigger: ["blur", "change"] }
  ],
  loadAddressId: [
    { required: true, message: "请选择", trigger: ["blur", "change"] }
  ],
  unloadAddressId: [
    { required: true, message: "请选择", trigger: ["blur", "change"] }
  ],
  freightVolume: [
    { required: true, message: "请输入", trigger: ["blur", "change"] },
  ],
  beginTime: [
    { required: true, message: "请选择", trigger: ["blur", "change"] }
  ]
}

const shortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '明天',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date
    },
  }
];


const open = async (item) => {

  Object.assign(form.value, item)
  dialogVisible.value = true;

  await loadAllShipper();
  await loadAllGoodsItem();
  await loadAllTruckLine();
  await loadAllStationSimple();
  loadContractItemList();
}

defineExpose({
  open
});
const formRef = useTemplateRef("formRef");
const emit = defineEmits(['close']);

// #region 货主
const loadingShipper = ref(false);
const shipperList = ref([]);

async function loadAllShipper() {
  if (shipperList.value.length > 0) {
    return;
  }
  loadingShipper.value = true;
  shipperList.value = await getShipperSimpleList();
  loadingShipper.value = false;
}

// #endregion
// #region 货物
const loadingGoodsItem = ref(false);
const goodsItemList = ref([]);

async function loadAllGoodsItem() {
  if (goodsItemList.value.length > 0) {
    return;
  }
  loadingGoodsItem.value = true;
  goodsItemList.value = await getGoodsSimpleList();
  loadingGoodsItem.value = false;
}

// #endregion
// #region 路线
const loadingTruckLine = ref(false);
const truckLineList = ref([]);

async function loadAllTruckLine() {
  if (truckLineList.value.length > 0) {
    return;
  }
  loadingTruckLine.value = true;
  truckLineList.value = await getTruckLineSimpleList();
  loadingTruckLine.value = false;
}

// #endregion

// #region 货场
const allStationList = ref([]);
async function loadAllStationSimple() {
  allStationList.value = await getAllStationSimple();
}
// #endregion

// #region 合同
const contractList = ref([]);
const loadingContract = ref(false);
const searchContractStr = ref("");
async function remoteFilterContractMethod(query) {
  searchContractStr.value = query;
  clearTimeout(remoteTimer);
  if (query) {
    remoteTimer = setTimeout(() => {
      searchContractList()
    }, 400)
  }
}


function searchContractList() {
  loadingContract.value = true;
  searchContractPageList({ contractNo: searchContractStr.value }).then(res => {
    contractList.value = res.records;
  }).finally(() => {
    loadingContract.value = false;
  });
}

function handleContractChange() {
  let data = contractList.value.find(p => p.contractNo === form.value.contractNo);
  if (data) {
    form.value.contractId = data.contractId;
  } else {
    form.value.contractId = "";
  }
  nextTick(() => {
    loadContractItemList();
  })
}
// #endregion

// #region 合同子项
const contractItemList = ref([]);
const loadingContractItem = ref(false);
function loadContractItemList() {
  if (!form.value.contractId) {
    contractItemList.value = [];
    return;
  }
  if (contractItemList.value.length > 0) {
    return;
  }
  loadingContractItem.value = true;
  getContractItemByContractId({ contractId: form.value.contractId }).then(res => {
    contractItemList.value = res;
  }).finally(() => {
    loadingContractItem.value = false;
  });
}


function handleContractItemIdChange() {
  let data = contractItemList.value.find(p => p.contractItemId === form.value.contractItemId);
  if (data) {
    // 将pricingMethod,unitPrice,estimatedTonnage,estimatedTrips,estimatedAmount,settlementMethod,settlementPlatform 字段带入
    form.value.pricingMethod = data.pricingMethod ? data.pricingMethod : '';
    form.value.unitPrice = data.unitPrice ? data.unitPrice : '';
    form.value.estimatedTonnage = data.estimatedTonnage ? data.estimatedTonnage : '';
    form.value.estimatedTrips = data.estimatedTrips ? data.estimatedTrips : '';
    form.value.estimatedAmount = data.estimatedAmount ? data.estimatedAmount : '';
    form.value.settlementMethod = data.settlementMethod ? data.settlementMethod : '';
    form.value.settlementPlatform = data.settlementPlatform ? data.settlementPlatform : '';
  } else {
    form.value.pricingMethod = "";
    form.value.unitPrice = "";
    form.value.estimatedTonnage = "";
    form.value.estimatedTrips = "";
    form.value.estimatedAmount = "";
    form.value.settlementMethod = "";
    form.value.settlementPlatform = "";
  }
  ElMessage.success("计价方式/单价/预计吨数/预计趟数/预计金额/结算方式/结算平台已根据合同自动调整");
}
// #endregion

// #region 事件
function handleTruckLineChange() {
  // // 修改装货卸货地点
  // let data = truckLineList.value.find(p => p.trucklineId === form.value.trucklineId);
  // if (data) {
  //   form.value.loadAddress = "";
  //   form.value.unloadAddress = "";
  //   setTimeout(() => {
  //     form.value.loadAddress = data.sendGoodsYardName;
  //     form.value.unloadAddress = data.receiveGoodsYardName;
  //     ElMessage.success("装货地点与卸货地点已根据线路自动调整");
  //   }, 200)
  // }
}

const handleClosedDialog = (formRef) => {
  if (formRef) formRef.resetFields();
}


// #endregion
// #region 查询人员
const searchSelectValue = ref(null);
const searchStaffStr = ref("");
const loadingStaff = ref(false);
const staffList = ref([]);
let remoteTimer = null;

function remoteFilterContactMethod(query) {
  searchStaffStr.value = query;
  clearTimeout(remoteTimer);
  if (query) {
    remoteTimer = setTimeout(() => {
      searchStaffList()
    }, 400)
  }
}

function searchStaffList() {
  loadingStaff.value = true;
  searchStaff(searchStaffStr.value).then(res => {
    staffList.value = res;
  }).finally(() => {
    loadingStaff.value = false;
  })
}

function handleSelectChange(val) {
  if (val === undefined) {
    staffList.value = [];
    return;
  }
  let data = staffList.value.find(p => p.staffId === val);
  if (data) {
    searchSelectValue.value = data.fullName;
    form.value.contactUserName = "";
    form.value.contactPhone = "";
    setTimeout(() => {
      form.value.contactUserName = data.fullName;
      form.value.contactPhone = data.mobileNumber;
      ElMessage.success("联系人联系方式已根据选择的人员自动调整");
    }, 200)
  } else {
  }
}

function handleLoadSelectChange(type = '') {
  if (type === 'loadAddressId') {
    let data = allStationList.value.find(p => p.goodsYardId === form.value.loadAddressId);
    if (data) {
      form.value.loadAddress = data.goodsYardShortName;
    }
  } else if (type === 'unloadAddressId') {
    let data = allStationList.value.find(p => p.goodsYardId === form.value.unloadAddressId);
    if (data) {
      form.value.unloadAddress = data.goodsYardShortName;
    }
  }
}

// #endregion
// #region 上传
function uploadSuccessFn(res) {
  form.value.orderFileIds = res.map(p => p.data.fileId).join(",");
}

function uploadingFn(val) {
  loading.value = val;
}

// #endregion
// #region 提交
/**
 * 提交表单
 * @param {FormRef} formRef
 */
const submit = (formRef) => {
  if (!formRef) return;
  formRef.validate((valid) => {
    if (valid) {
      loading.value = true;
      orderApi.editOrder(form.value).then(res => {
        ElMessage.success("修改成功");
        emit("close", true);
        dialogVisible.value = false;
      }).finally(() => {
        loading.value = false;
      })
    }
  }).finally(() => {
    // loading.value = false;
  });
}
// #endregion


</script>
<style lang="less">
.editOrder {
  .el-input-group__append {
    flex-shrink: 0;
    padding: 0;
  }
}
</style>
