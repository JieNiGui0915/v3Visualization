<template>
  <el-dialog v-model="dialogVisible" title="新增司机" width="60%" top="10px" center class="addDriver"
             @close="handleClosedDialog(formRef)" destroy-on-close :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="140" ref="formRef" status-icon v-loading="loading">
      <el-tabs type="border-card" class="tabs" @tabChange="handleTabChange">
        <el-tab-pane>
          <template #label>
            <el-icon color="#f56c6c" v-if="tabNames.idCard.errorCount > 0">
              <WarningFilled/>
            </el-icon>
            身份证信息
          </template>
          <div class="flex-align-start">
            <div class="flex-1">
              <el-form-item label="姓名" prop="idCard.subjectName">
                <el-input v-model="form.idCard.subjectName" clearable @change="handleIdCardNameChange"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="idCard.sex">
                <el-radio-group v-model="form.idCard.sex">
                  <el-radio v-for="item in sexList" :label="item.label" :value="item.value"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="民族" prop="idCard.nation">
                <el-select v-model="form.idCard.nation" placeholder="" clearable>
                  <el-option v-for="item in nationList" :value="item.dictLabel" :label="item.dictLabel"
                             :key="item.dictId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="身份证号" prop="idCard.certificateNumber">
                <el-input v-model="form.idCard.certificateNumber" @change="handleIdCardNumberChange"></el-input>
              </el-form-item>
              <el-form-item label="头像面" prop="idCard.fileId">
                <my-upload type="certificate" :file-ids="form.idCard.fileId" :limit="1"
                           @success="res => uploadSuccessFn(res, 'idCard.fileId')"></my-upload>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="生效日期" prop="idCard.effectiveDate">
                <div class="flex width-100p">
                  <el-date-picker v-model="form.idCard.effectiveDate" type="date" format="YYYY-MM-DD"
                                  value-format="YYYY-MM-DD" :editable="false" placeholder="" clearable/>
                  <el-dropdown class="flex-shrink-0" type="primary" @command="handleIdCardInYearClick">
                    <template #default>
                      <el-button>有效年限
                        <el-icon class="el-icon--right">
                          <arrow-down/>
                        </el-icon>
                      </el-button>
                    </template>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item :command="10">10年</el-dropdown-item>
                        <el-dropdown-item :command="20">20年</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>

              </el-form-item>
              <el-form-item label="失效日期" prop="idCard.expiringDate">
                <el-date-picker v-model="form.idCard.expiringDate" type="date" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" :editable="false" placeholder="" clearable/>
              </el-form-item>
              <el-form-item label="住址" prop="driverLicense.issuerName">
                <el-input v-model="form.idCard.cardAddress"></el-input>
              </el-form-item>
              <el-form-item label="签发机关" prop="idCard.issuerName">
                <el-input v-model="form.idCard.issuerName"></el-input>
              </el-form-item>
              <el-form-item label="国徽面" prop="idCard.fileTwoId">
                <my-upload type="certificate" :file-ids="form.idCard.fileTwoId" :limit="1"
                           @success="res => uploadSuccessFn(res, 'idCard.fileTwoId')"></my-upload>
              </el-form-item>
            </div>
          </div>

          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model.trim="form.idCard.remark" placeholder="" clearable></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <el-icon color="#f56c6c" v-if="tabNames.driverLicense.errorCount > 0">
              <WarningFilled/>
            </el-icon>
            驾驶证信息
          </template>
          <el-form-item label="司机姓名">
            {{ form.driverLicense.subjectName }}
          </el-form-item>
          <div class="flex-align-start">
            <div class="flex-1">
              <el-form-item label="驾驶证号" prop="driverLicense.certificateNumber">
                <el-input v-model="form.driverLicense.certificateNumber" readonly></el-input>
              </el-form-item>
              <el-form-item label="准驾车型" prop="driverLicense.authorizedDrivingModel">
                <el-select v-model="form.driverLicense.authorizedDrivingModel" placeholder="" clearable>
                  <el-option v-for="item in authorizedDrivingModelList" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发证机构" prop="driverLicense.issuerName">
                <el-input v-model="form.driverLicense.issuerName"></el-input>
              </el-form-item>
              <el-form-item label="证件图片1" prop="driverLicense.fileId">
                <my-upload type="certificate" :file-ids="form.driverLicense.fileId" :limit="1"
                           @success="res => uploadSuccessFn(res, 'driverLicense.fileId')"></my-upload>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="有效起始日期" prop="driverLicense.effectiveDate">
                <el-date-picker v-model="form.driverLicense.effectiveDate" type="date" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" :editable="false" placeholder="" clearable/>
              </el-form-item>
              <el-form-item label="有效结束日期" prop="driverLicense.expiringDate">
                <el-date-picker v-model="form.driverLicense.expiringDate" type="date" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" :editable="false" placeholder="" clearable/>
              </el-form-item>
              <el-form-item label="初次领证日期" prop="driverLicense.initialDate">
                <el-date-picker v-model="form.driverLicense.initialDate" type="date" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" :editable="false" placeholder="" clearable/>
              </el-form-item>
              <el-form-item label="证件图片2" prop="driverLicense.fileTwoId">
                <my-upload type="certificate" :file-ids="form.driverLicense.fileTwoId" :limit="1"
                           @success="res => uploadSuccessFn(res, 'driverLicense.fileTwoId')"></my-upload>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model.trim="form.driverLicense.remark" placeholder="" clearable></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <el-icon color="#f56c6c" v-if="tabNames.roadTransportQualification.errorCount > 0">
              <WarningFilled/>
            </el-icon>
            道路运输从业资格证信息
          </template>
          <el-form-item label="司机姓名">
            {{ form.roadTransportQualification.subjectName }}
          </el-form-item>
          <div class="flex-align-start">
            <div class="flex-1">
              <el-form-item label="从业资格证号" prop="roadTransportQualification.certificateNumber">
                <el-input v-model="form.roadTransportQualification.certificateNumber" readonly></el-input>
              </el-form-item>
              <el-form-item label="从业资格类别" prop="roadTransportQualification.qualificationCategory">
                <el-input v-model="form.roadTransportQualification.qualificationCategory" clearable></el-input>
              </el-form-item>
              <el-form-item label="发证机构" prop="roadTransportQualification.issuerName">
                <el-input v-model="form.roadTransportQualification.issuerName"></el-input>
              </el-form-item>
              <el-form-item label="证件图片1" prop="roadTransportQualification.fileId">
                <my-upload type="certificate" :file-ids="form.roadTransportQualification.fileId" :limit="1"
                           @success="res => uploadSuccessFn(res, 'roadTransportQualification.fileId')"></my-upload>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="有效起始日期" prop="roadTransportQualification.effectiveDate">
                <el-date-picker v-model="form.roadTransportQualification.effectiveDate" type="date" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" :editable="false" placeholder="" clearable/>
              </el-form-item>
              <el-form-item label="有效结束日期" prop="roadTransportQualification.expiringDate">
                <el-date-picker v-model="form.roadTransportQualification.expiringDate" type="date" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" :editable="false" placeholder="" clearable/>
              </el-form-item>
              <el-form-item label="初次领证日期" prop="roadTransportQualification.initialDate">
                <el-date-picker v-model="form.roadTransportQualification.initialDate" type="date" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" :editable="false" placeholder="" clearable/>
              </el-form-item>
              <el-form-item label="证件图片2" prop="roadTransportQualification.fileTwoId">
                <my-upload type="certificate" :file-ids="form.roadTransportQualification.fileTwoId" :limit="1"
                           @success="res => uploadSuccessFn(res, 'roadTransportQualification.fileTwoId')"></my-upload>
              </el-form-item>
            </div>
          </div>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model.trim="form.roadTransportQualification.remark" placeholder=""
                      clearable></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <el-icon color="#f56c6c" v-if="tabNames.other.errorCount > 0">
              <WarningFilled/>
            </el-icon>
            其他信
          </template>
          <el-form-item label="司机姓名">
            {{ form.idCard.subjectName }}
          </el-form-item>
          <div class="flex-align-start">
            <div class="flex-1">
              <el-form-item label="司机性质" prop="driverInfo.driverNature">
                <el-radio-group v-model="form.driverInfo.driverNature">
                  <el-radio v-for="item in driverNatureList" :label="item.label" :value="item.value"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="手机号" prop="staffInfo.mobileNumber">
                <el-input v-model="form.staffInfo.mobileNumber" clearable></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="staffInfo.email">
                <el-input v-model="form.staffInfo.email" clearable></el-input>
              </el-form-item>

              <el-form-item label="当前住址" prop="driverInfo.currentAddress">
                <el-input v-model="form.driverInfo.currentAddress" clearable></el-input>
              </el-form-item>
            </div>
            <div class="flex-1">
              <el-form-item label="所属车队" prop="driverInfo.fleetId">
                <el-select v-model="form.driverInfo.fleetId" placeholder="" clearable>
                  <el-option :label="item.fleetName" :value="item.fleetId" v-for="item in fleetList"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="组号" prop="driverInfo.grouping">
                <el-input v-model="form.driverInfo.grouping" clearable></el-input>
              </el-form-item>
              <el-form-item label="职务" prop="driverInfo.post">
                <el-input v-model="form.driverInfo.post" clearable></el-input>
              </el-form-item>
              <el-form-item label="学历" prop="staffInfo.education">
                <el-select v-model="form.staffInfo.education" placeholder="" clearable>
                  <el-option :label="item.dictLabel" :value="item.dictLabel" v-for="item in educationList"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model.trim="form.driverInfo.remark" placeholder="" clearable></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div class="flex_row flex-justify-center mt-50">
      <el-button type="primary" @click="submit(formRef)">提交</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import {ref, useTemplateRef} from "vue";
import {dictDataAll} from "@/api/api.dict.js";
import {ElMessage} from "element-plus";
import {sexList, authorizedDrivingModelList, driverNatureList} from "@/config/const.js";
import {addDriver} from "@/api/api.driver";
import {getAllFleetSimpleList} from "@/api/api.fleet";
import MyUpload from "@/components/form/my-upload.vue";
import {validateIDCard} from "@/utils/util.js";
import {ArrowDown, WarningFilled} from "@element-plus/icons-vue";
import {isPhone} from "@/utils/is.js";

const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({
  "driverInfo": {
    "driverId": "",// 司机ID
    "staffId": "",// 人员ID
    "driverLicenseId": "",// 驾驶证ID
    "roadTransportQualificationId": "",// 道路运输从业资格证ID
    "authorizedDrivingModel": "",// 准驾车型
    "driverNature": null,// 司机性质
    "currentAddress": "",// 当前住址
    "currentVehicle": "",// 当前车辆
    "remark": "",// 备注
    "qualificationCategory": "",// 从业资格证类别
    "grouping": "",// 组号
    "vehicleNumber": "",// 车号
    "post": "",// 职务
    "homeAddress": "",// 家庭住址
    "fleetId": "",// 所属车队ID
    "driverCode": ""// 司机编号
  },
  "staffInfo": {
    "mobileNumber": "", // 手机号
    "email": "", // 电子邮箱
    "education": "",// 学历
  },
  "idCard": {
    "certificateId": "",// 证件ID
    "certificateType": null,// 证件类型
    "certificateNumber": "",// 证件号
    "subjectName": "",// 主体名称
    "fileId": "",// 图片文件ID
    "fileTwoId": "",// 图片文件2ID
    "effectiveDate": "",// 生效日期
    "expiringDate": "",// 失效日期
    "issuerName": "",// 颁发机构
    "remark": "",// 备注
    "initialDate": "",// 初次领证日期
    "certificateInfo": "",// 扩展信息
    "sex": null,// 性别；0：男，1女；字典名称：sex
    "nation": "",// 民族；字典名称：nation
    "birthDate": "",//出生日期
    "cardAddress": ""//身份证地址
  },
  "driverLicense": {
    "certificateId": "", // 证件ID
    "certificateType": null, // 证件类型
    "certificateNumber": "", // 证件号
    "subjectName": "", // 主体名称
    "fileId": "", // 图片文件ID
    "fileTwoId": "", // 图片文件2ID
    "effectiveDate": "", // 生效日期
    "expiringDate": "", // 失效日期
    "issuerName": "", // 颁发机构
    "remark": "", // 备注
    "initialDate": "", // 初次领证日期
    "certificateInfo": "", // 扩展信息
    "authorizedDrivingModel": "" // 准驾车型
  },
  "roadTransportQualification": {
    "certificateId": "", // 证件ID
    "certificateType": null, // 证件类型
    "certificateNumber": "", // 证件号
    "subjectName": "", // 主体名称
    "fileId": "", // 图片文件ID
    "fileTwoId": "", // 图片文件2ID
    "effectiveDate": "", // 生效日期
    "expiringDate": "", // 失效日期
    "issuerName": "", // 颁发机构
    "remark": "", // 备注
    "initialDate": "", // 初次领证日期
    "certificateInfo": "", // 扩展信息
    "qualificationCategory": "" //从业资格类别
  }
});
const tabNames = ref({
  idCard: {
    name: "身份证信息",
    errorCount: 0
  },
  driverLicense: {
    name: "驾驶证信息",
    errorCount: 0
  },
  roadTransportQualification: {
    name: "道路运输从业资格证信息",
    errorCount: 0,
  },
  other: {
    name: "其他信息",
    errorCount: 0
  },
  resetErrorCount() {
    this.idCard.errorCount = 0;
    this.driverLicense.errorCount = 0;
    this.roadTransportQualification.errorCount = 0;
    this.other.errorCount = 0;
  }
})

const validateIdCardRule = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入身份证号'))
  } else {
    if (!validateIDCard(value)) {
      callback(new Error("身份证信息中身份证号验证失败,请检查是否输入正确"))
    } else {
      callback()
    }
  }
}

const validatePhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error("请输入手机号"))
  } else {
    if (!isPhone(value)) {
      callback(new Error("手机号验证失败,请检查是否输入正确"))
    } else {
      callback()
    }
  }
}

const rules = ref({
  "idCard.subjectName": [
    {required: true, message: "请输入身份证信息中的姓名", trigger: ["blur", "change"]},
  ],
  "idCard.certificateNumber": [
    {required: true, message: "请输入身份证信息中的身份号", trigger: ["blur", "change"]},
    {validator: validateIdCardRule, trigger: ["blur", "change"]},
  ],
  "idCard.fileId": [
    {required: true, message: "身份证信息中的头像面照片不能为空", trigger: ["blur", "change"]}
  ],
  "idCard.sex": [
    {required: true, message: "身份证信息中性别不能为空", trigger: ["blur", "change"]}
  ],
  "idCard.nation": [
    {required: true, message: "身份证信息中民族不能为空", trigger: ["blur", "change"]}
  ],
  "idCard.birthDate": [
    {required: true, message: "身份证信息中出生日期不能为空", trigger: ["blur", "change"]}
  ],
  "driverLicense.certificateNumber": [
    {required: true, message: "驾驶证信息中的证号不能为空", trigger: ["blur", "change"]},
  ],
  "driverLicense.authorizedDrivingModel": [
    {required: true, message: "驾驶证信息中的准驾车型不能为空", trigger: ["blur", "change"]},
  ],
  "driverLicense.fileId": [
    {required: true, message: "驾驶证信息中的图片1不能为空", trigger: ["blur", "change"]}
  ],
  "driverLicense.effectiveDate": [
    {required: true, message: "驾驶证信息中的有效起始日期不能为空", trigger: ["blur", "change"]}
  ],
  "driverLicense.expiringDate": [
    {required: true, message: "驾驶证信息中的有效结束日期不能为空", trigger: ["blur", "change"]}
  ],
  "roadTransportQualification.certificateNumber": [
    {required: true, message: "道路运输从业资格证信息中的证号不能为空", trigger: ["blur", "change"]},
  ],
  "roadTransportQualification.fileId": [
    {required: true, message: "道路运输从业资格证信息中的图片1不能为空", trigger: ["blur", "change"]}
  ],
  "roadTransportQualification.effectiveDate": [
    {required: true, message: "道路运输从业资格证信息中的有效起始日期不能为空", trigger: ["blur", "change"]}
  ],
  "roadTransportQualification.expiringDate": [
    {required: true, message: "道路运输从业资格证信息中的有效结束日期不能为空", trigger: ["blur", "change"]}
  ],
  "staffInfo.mobileNumber": [
    {required: true, message: "其他信息中的手机号不能为空", trigger: ["blur", "change"]},
    {validator: validatePhone, trigger: ["blur", "change"]},
  ],
  "driverInfo.fleetId": [
    {required: true, message: "其他信息中的所属车队不能为空", trigger: ["blur", "change"]},
  ],
})


const open = async (item) => {
  dialogVisible.value = true;

  await loadNation();
  await loadAllFleet();
  await loadEducation();
};

defineExpose({
  open
});


const formRef = useTemplateRef("formRef");
const emit = defineEmits(['close']);


function uploadSuccessFn(res, fieldName = "") {
  let ks = fieldName.split(".");
  form.value[ks[0]][ks[1]] = res.map(p => p.data.fileId).join(",");
}

function handleIdCardNumberChange() {
  form.value.driverLicense.certificateNumber = form.value.idCard.certificateNumber;
  form.value.roadTransportQualification.certificateNumber = form.value.idCard.certificateNumber;
}

function handleIdCardNameChange() {
  form.value.driverLicense.subjectName = form.value.idCard.subjectName;
  form.value.roadTransportQualification.subjectName = form.value.idCard.subjectName;
}

function handleIdCardInYearClick(yearNum) {
  if (form.value.idCard.effectiveDate) {
    form.value.idCard.expiringDate = addYears(form.value.idCard.effectiveDate, yearNum);
  }
}

function addYears(d, years) {
  if (!d) {
    return "";
  }
  let date = new Date(d);
  if (typeof date === "string") {
    date = new Date(date.replace(/-/g, "/"));
  }
  if (typeof date === "number") {
    date = new Date(date);
  }
  if (date) {
    date.setFullYear(date.getFullYear() + years);
    return date;
  } else {
    return "";
  }
}

// region 民族数据

const nationList = ref([]);

async function loadNation() {
  if (nationList.value.length > 0) {
    return;
  }
  nationList.value = await dictDataAll("nation");
}

// endregion

// region 学历
const educationList = ref([]);

async function loadEducation() {
  if (educationList.value.length > 0) {
    return;
  }
  educationList.value = await dictDataAll("education");
}

// endregion

// region 车队

const loadingFleet = ref(false);
const fleetList = ref([]);

async function loadAllFleet() {
  if (fleetList.value.length > 0) {
    return;
  }
  loadingFleet.value = true;
  fleetList.value = await getAllFleetSimpleList();
  loadingFleet.value = false;
}

// endregion

function handleTabChange() {
  if (submitNum === 0) {
    return;
  }
  formRef.value.validate((valid, errorFields) => {
    tabNames.value.resetErrorCount();
    let keys = Object.keys(errorFields);
    keys.forEach(key => {
      if (key.startsWith("idCard")) {
        tabNames.value.idCard.errorCount++
      } else if (key.startsWith("driverLicense")) {
        tabNames.value.driverLicense.errorCount++
      } else if (key.startsWith("roadTransportQualification")) {
        tabNames.value.roadTransportQualification.errorCount++
      } else if (key.startsWith("driverInfo") || key.startsWith("staffInfo")) {
        tabNames.value.other.errorCount++
      }
    })
  })
}

let submitNum = 0;

/**
 * 提交表单
 * @param {FormRef} formRef
 */
const submit = (formRef) => {
  if (!formRef) return;
  submitNum++;
  formRef.validate((valid, errorFields) => {
    tabNames.value.resetErrorCount();
    if (valid) {
      loading.value = true;
      addDriver(form.value).then(res => {
        ElMessage.success("添加成功");
        emit("close", true);
        dialogVisible.value = false;
      }).finally(() => {
        loading.value = false;
      })
    } else {
      let keys = Object.keys(errorFields);
      let k1 = keys[0];
      let message = errorFields[k1][0].message;
      if (keys.length > 1) {
        message += " ,还有其他" + (keys.length - 1) + "个警告信息";
      }
      ElMessage.warning(message);
      keys.forEach(key => {
        if (key.startsWith("idCard")) {
          tabNames.value.idCard.errorCount++
        } else if (key.startsWith("driverLicense")) {
          tabNames.value.driverLicense.errorCount++
        } else if (key.startsWith("roadTransportQualification")) {
          tabNames.value.roadTransportQualification.errorCount++
        } else if (key.startsWith("driverInfo") || key.startsWith("staffInfo")) {
          tabNames.value.other.errorCount++
        }
      })
    }
  }).finally(() => {
    // loading.value = false;
  });
}
const handleClosedDialog = (formRef) => {
  if (formRef) formRef.resetFields();
  tabNames.value.resetErrorCount();
}
</script>
<style lang="less">
.addDriver {
  min-width: 600px;
}
</style>
