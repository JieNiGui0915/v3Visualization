<template>
  <el-dialog v-model="dialogVisible" title="添加委托计划" width="50%" center top="10px" top="30px" class="addConsignmentPlan"
             @close="handleCloseDialog(formRef)" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <el-form-item label="起始日期" prop="beginDate">
        <el-date-picker v-model="form.beginDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :editable="false" placeholder="请选择日期" clearable/>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker v-model="form.endDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :editable="false" placeholder="请选择结束日期" clearable/>
      </el-form-item>
      <el-form-item label="货物" prop="goodsItemId">
        <el-select v-model="form.goodsItemId" placeholder="请选择货物" clearable>
          <el-option :label="item.goodsItemName" :value="item.goodsItemId" v-for="item in goodsList">
            <template #default>
              <span class="option_left">{{ item.goodsItemName }}</span>
              <span class="option_right">{{ item.goodsItemCode }}</span>
            </template>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="路线" prop="trucklineId">
        <el-select v-model="form.trucklineId" placeholder="请选择路线" clearable>
          <el-option :label="item.trucklineName" :value="item.trucklineId" v-for="item in truckLineList">
            <template #default>
              <span class="option_left">{{ item.trucklineName }}</span>
              <span class="option_right">{{ item.sendGoodsYardName }} 至 {{ item.receiveGoodsYardName }}</span>
            </template>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="托运人" prop="shipperId">
        <el-select v-model="form.shipperId" placeholder="请选择托运人" clearable>
          <el-option :label="item.shipperName" :value="item.shipperId" v-for="item in shipperList">
            <template #default>
              <span class="option_left">{{ item.shipperName }}</span>
              <span class="option_right">{{ item.shipperCode }}</span>
            </template>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="委托量(吨)" prop="consignmentVolume">
        <el-input v-model="form.consignmentVolume" placeholder="请输入委托量(吨)" clearable></el-input>
      </el-form-item>
      <el-form-item label="批次量(吨)" prop="batchVolume">
        <el-input v-model="form.batchVolume" placeholder="请输入批次量(吨)" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <div class="flex_row flex-justify-center mt-50">
        <el-button type="primary" @click="submit(formRef)">提交</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script setup>
import {ref, useTemplateRef} from 'vue';
import {addConsignment} from "@/api/api.consignment.js";
import {getGoodsSimpleList} from "@/api/api.goods.js";
import {getTruckLineSimpleList} from "@/api/api.truckline.js";
import {getShipperSimpleList} from "@/api/api.shipper.js";
import {ElMessage} from "element-plus";

const dialogVisible = ref(false);
const formRef = useTemplateRef("formRef");
const loading = ref(false);
const emit = defineEmits(['close']);

defineExpose({
  open
})

async function open() {
  dialogVisible.value = true;
  await loadAllGoods();
  await loadAllTruckLine();
  await loadAllShipper();
}

const form = ref({
  "goodsItemId": "",
  "trucklineId": "",
  "shipperId": "",
  "beginDate": "",
  "endDate": "",
  "consignmentVolume": null,
  "batchVolume": null,
  "remark": ""
})
const rules = {
  beginDate: [
    {required: true, message: "请选择", trigger: "blur"}
  ],
  endDate: [
    {required: true, message: "请选择", trigger: "blur"}
  ],
  goodsItemId: [
    {required: true, message: "请选择", trigger: "blur"}
  ],
  trucklineId: [
    {required: true, message: "请选择", trigger: "blur"}
  ],
  shipperId: [
    {required: true, message: "请选择", trigger: "blur"}
  ],
  consignmentVolume: [
    {required: true, message: "请输入", trigger: "blur"}
  ]
}

function handleCloseDialog(formRef) {

}

const loadingGoods = ref(false);
const goodsList = ref([]);

async function loadAllGoods() {
  if (goodsList.value.length > 0) {
    return;
  }
  loadingGoods.value = true;
  goodsList.value = await getGoodsSimpleList();
  loadingGoods.value = false;
}

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


function submit(formRef) {
  if (!formRef) return;
  formRef.validate((valid) => {
    if (valid) {
      loading.value = true;
      addConsignment(form.value).then(res => {
        ElMessage.success("添加成功");
        emit("close", true);
        dialogVisible.value = false;
      }).finally(() => {
        loading.value = false;
      })
    }
  })
}
</script>
<style lang="less">
.addConsignmentPlan {
}
</style>
