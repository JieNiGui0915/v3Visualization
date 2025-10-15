<template>
  <el-dialog v-model="dialogVisible" title="编辑派车计划" center top="30px" class="editDispatchPlan" width="50%"
    destroy-on-close style="min-width: 850px" @close="handleClosedDialog(formRef)" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <div class="flex_row">
        <div class="flex-1">
          <el-form-item label="车队(可多选)" prop="fleetIds">
            <el-select v-model="form.fleetIds" multiple placeholder="选择车队(可多选)" clearable class="flex-1" disabled>
              <el-option :label="item.fleetName" :value="item.fleetId" v-for="item in fleetList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划运量(吨)" prop="planVolume">
            <el-input v-model="form.planVolume" type="number" clearable></el-input>
          </el-form-item>
          <el-form-item label="计划用车数" prop="vehicleNum">
            <el-input v-model="form.vehicleNum" type="number" clearable></el-input>
          </el-form-item>
          <el-form-item label="计划用车时间" prop="planTime">
            <el-date-picker v-model="form.planTime" type="datetime" format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm" :editable="false" placeholder="请选择日期时间"
              :shortcuts="shortcuts" clearable @change="handlePlanTimeChange" />
          </el-form-item>
          <el-form-item label="计划结束时间" prop="planEndTime">
            <el-date-picker v-model="form.planEndTime" type="datetime" format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss" time-format="HH:mm" :editable="false" placeholder="请选择日期时间"
              :shortcuts="shortcuts" clearable />
          </el-form-item>
          <el-form-item label="计划用车地点" prop="planSite">
            <el-input v-model="form.planSite" clearable></el-input>
          </el-form-item>
          <el-form-item label="派车描述" prop="dispatchDesc">
            <el-input v-model="form.dispatchDesc" clearable></el-input>
          </el-form-item>

        </div>
        <div class="flex-1">
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
import { ref, useTemplateRef } from "vue";
import * as dispatchApi from "@/api/api.dispatch.js";
import { ElMessage } from "element-plus";
import { getAllFleetSimpleList } from "@/api/api.fleet.js";
import { pricingMethodList, settlementMethodList } from "@/config/const.js";

const dialogVisible = ref(false);

const loading = ref(false);
const form = ref({
  dispatchPlanId: "",// 派车计划ID
  planVolume: null,// 计划运量
  vehicleNum: null,// 计划用车数
  dispatchDesc: "",// 派车描述
  remark: "",// 备注
  planTime: "",// 计划用车时间
  planEndTime: "",// 计划结束时间
  planSite: "",// 计划用车地点
  fleetId: "",// 所属车队ID
  fleetIds: [],// 所属车队ID列表
  orderId: "",// 订单ID
  "pricingMethod": "",// 计价方式(1.计吨 2.计趟 3.一口价)
  "unitPrice": "",// 单价(元)
  "estimatedTonnage": "",// 预计吨数
  "estimatedTrips": "",// 预计趟数
  "estimatedAmount": "",// 预计金额(元)
  "settlementMethod": "",// 结算方式(1.月结 2.现结 3.第三方平台)
  "settlementPlatform": "",// 结算平台
})

const rules = {
  planVolume: [
    { required: true, message: "请输入", trigger: ["blur", "change"] },
  ],
  vehicleNum: [
    { required: true, message: "请选择", trigger: ["blur", "change"] }
  ],
  planTime: [
    { required: true, message: "请选择", trigger: ["blur", "change"] }
  ],
  planEndTime: [
    { required: true, message: "请选择", trigger: ["blur", "change"] }
  ],
  planSite: [
    { required: true, message: "请输入", trigger: ["blur", "change"] }
  ],
  fleetIds: [
    { required: true, message: "请选择车队", trigger: ["blur", "change"] }
  ],
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
  form.value.fleetIds = item.fleetId ? [item.fleetId] : [];
  dialogVisible.value = true;
  await loadAllFleet();
}

defineExpose({
  open
});
const formRef = useTemplateRef("formRef");
const emit = defineEmits(['close']);

// region 车队

const loadingFleet = ref(false);
const fleetList = ref([]);

async function loadAllFleet() {
  if (loadingFleet.value.length > 0) {
    return;
  }
  loadingFleet.value = true;
  fleetList.value = await getAllFleetSimpleList();
  loadingFleet.value = false;
}

// endregion


function handlePlanTimeChange() {
  if (form.value.planTime && !form.value.planEndTime) {
    form.value.planEndTime = form.value.planTime;
    ElMessage.warning("计划结束时间已自动设置为计划用车时间");
  }
}

// region 事件

const handleClosedDialog = (formRef) => {
  if (formRef) formRef.resetFields();
}


// endregion
// region 提交
/**
 * 提交表单
 * @param {FormRef} formRef
 */
const submit = (formRef) => {
  if (!formRef) return;
  formRef.validate((valid) => {
    if (valid) {
      loading.value = true;
      dispatchApi.editDispatchPlan(form.value).then(res => {
        ElMessage.success("添加成功");
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
// endregion


</script>
<style lang="less">
.editDispatchPlan {
  .el-input-group__append {
    flex-shrink: 0;
    padding: 0;
  }
}
</style>
