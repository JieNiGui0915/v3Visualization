<template>
  <div class="driverBook page-wrap" ref="pageRef">
    <div class="header">
      <el-input v-model.trim="search.fullName" class="width-150 mr-10" placeholder="姓名" @keyup.enter="handleSearch"
                clearable @clear="handleSearch"/>
      <el-input v-model.trim="search.idCardNumber" class="width-150 mr-10" placeholder="身份证号"
                @keyup.enter="handleSearch" clearable @clear="handleSearch"/>
      <el-input v-model.trim="search.mobileNumber" class="width-150 mr-10" placeholder="手机号"
                @keyup.enter="handleSearch" clearable @clear="handleSearch"/>
      <el-select v-model.trim="search.fleetId" class="width-100 mr-10" placeholder="所属车队" @focus="loadAllFleet"
                 @change="handleSearch" clearable>
        <el-option :label="item.fleetName" :value="item.fleetId" v-for="item in fleetList"></el-option>
      </el-select>
      <el-select v-model.trim="search.driverNature" class="width-100 mr-10" placeholder="司机性质" @change="handleSearch"
                 clearable>
        <el-option :label="item.label" :value="item.value" v-for="item in driverNatureList"></el-option>
      </el-select>
      <el-select v-model.trim="search.workStatus" class="width-100 mr-10" placeholder="在职状态" @change="handleSearch"
                 clearable>
        <el-option :label="item.label" :value="item.value" v-for="item in workStatusList"></el-option>
      </el-select>
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <div class="flex-1"></div>
      <el-button type="primary" plain size="default" @click="handleClickAddAccount">新增司机</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
              row-key="vehicleId" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class"
              v-loading="loading">
      <el-table-column fixed type="index" label="#" width="40" align="center"/>
      <el-table-column fixed label="姓名" prop="fullName" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="分组" prop="grouping" width="60" align="center" show-overflow-tooltip/>
      <el-table-column label="民族" prop="nation" width="60" align="center" show-overflow-tooltip/>
      <el-table-column label="手机号" prop="mobileNumber" width="100" align="center" show-overflow-tooltip/>
      <el-table-column label="身份证号" prop="idCardNumber" width="160" align="center" show-overflow-tooltip/>
      <el-table-column label="司机性质" prop="driverNature" width="80" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ driverNatureMap[scope.row.driverNature] }}
        </template>
      </el-table-column>
      <el-table-column label="从业资格证类别" prop="qualificationCategory" width="120" align="center" show-overflow-tooltip/>
      <el-table-column label="入职日期" prop="hireDate" width="90" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ formatDate(scope.row.hireDate) }}
        </template>
      </el-table-column>
      <el-table-column label="离职日期" prop="lastDate" width="90" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ formatDate(maxDateToEmpty(scope.row.lastDate)) }}
        </template>
      </el-table-column>
      <el-table-column label="所属车队" prop="fleetName" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="准驾车型" prop="authorizedDrivingModel" width="80" align="center" show-overflow-tooltip/>
      <el-table-column label="当前住址" prop="currentAddress" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="家庭住址" prop="homeAddress" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="状态" prop="workStatus" width="70" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.workStatus != null">
            <el-tag :type="driverStatusTagTypeMap[scope.row.workStatus]" disable-transitions>
              {{ driverStatusMap[scope.row.workStatus] }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
        <template #default="scope">
          <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)">编辑</el-button>
          <!--          <el-popconfirm :title="`确定停用该整车[${scope.row.licensePlateNumber}]吗?`"-->
          <!--                         @confirm="handleClickDisable(scope.row.vehicleId)" v-if="scope.row.vehicleStatus !== 2">-->
          <!--            <template #reference>-->
          <!--              <el-button link type="danger" @click.prevent.stop>停用</el-button>-->
          <!--            </template>-->
          <!--          </el-popconfirm>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
                   @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
                   :total="totalSize" class="pagination"/>
  </div>
  <edit-repair ref="editRepairRef" @close="closeDialog"></edit-repair>
  <add-repair ref="addRepairRef" @close="closeDialog"></add-repair>
  <image-dialog ref="imageDialogRef"></image-dialog>
</template>
<script setup>
import {nextTick, onMounted, ref, useTemplateRef, watch} from "vue";
import * as driverApi from "@/api/api.driver.js";
import {getAllFleetSimpleList} from "@/api/api.fleet.js";
import editRepair from "../components/editDriver.vue";
import addRepair from "../components/addDriver.vue";
import imageDialog from "@/components/form/image-dialog.vue";
import {GlobalStore} from "@/store/index.js";
import {
  driverNatureList, driverNatureMap,
  driverStatusMap,
  driverStatusTagTypeMap, workStatusList
} from "@/config/const.js";
import {formatDate, maxDateToEmpty} from "@/utils/util.js";

const loading = ref(false);
const editRepairRef = useTemplateRef("editRepairRef");
const addRepairRef = useTemplateRef("addRepairRef");
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  fullName: "",// 姓名
  idCardNumber: "",// 身份证号
  mobileNumber: "",// 手机号
  fleetId: "",// 所属车队ID
  driverNature: "",// 司机性质，0-专职，1-外协
  workStatus: "",// 在职状态（0：在职，1：离职）
})

const handleClickAddAccount = () => {
  addRepairRef.value.open(null);
}

const tableRef = ref()

function handleSearch() {
  pageCurrent.value = 1;
  load();
}

let tableHeight = ref(250);
const pageRef = ref(null);
const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
  nextTick(() => {
    if (pageRef.value) {
      tableHeight.value = pageRef.value.clientHeight - 120;
    }
  })
}, {immediate: true})
onMounted(() => {
  nextTick(() => {
    load();
  });
});

async function load() {
  loading.value = true;
  let param = {};
  let keys = Object.keys(search.value);
  keys.forEach(k => {
    if (search.value[k] !== "") {
      param[k] = search.value[k];
    }
  })
  let res = await driverApi.searchDriverPageList({current: pageCurrent.value, size: pageSize.value, ...param}, false)
  tableData.value = res.records;
  totalSize.value = res.total;
  loading.value = false;
}

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


/**
 * 点击编辑账户
 * @param {*} item
 */
const handleClickEdit = (item) => {
  editRepairRef.value.open(item);
}

const handleClickDisable = (item) => {
  driverApi.disableVehicle(item).then(res => {
    load();
  });
}

function handleRowClick(row, column, event) {
  handleClickEdit(row)
}

function closeDialog(reload) {
  if (reload) load();
}

const imageDialogRef = useTemplateRef("imageDialogRef");

function handleViewFiles(fileIdStr) {
  imageDialogRef.value.open(fileIdStr)
}
</script>
<style lang="less">
.driverBook {
  .width-100 {
    width: 100px;
  }
}
</style>
