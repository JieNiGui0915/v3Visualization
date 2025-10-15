<template>
  <div class="vehicleBook page-wrap" ref="pageRef">
    <div class="header">
      <el-input v-model.trim="search.grouping" class="width-100 mr-10" placeholder="分组" @keyup.enter="handleSearch"
                clearable/>
      <el-input v-model.trim="search.dispatchNumber" class="width-100 mr-10" placeholder="调度号"
                @keyup.enter="handleSearch" clearable/>
      <el-input v-model.trim="search.licensePlateNumber" class="width-200 mr-10" placeholder="车牌号"
                @keyup.enter="handleSearch" clearable/>
      <el-input v-model.trim="search.vehicleVin" class="width-200 mr-10" placeholder="车辆识别代号"
                @keyup.enter="handleSearch" clearable/>
      <el-select v-model="search.operationMode" class="width-100 mr-10" placeholder="运营方式" @change="handleSearch"
                 clearable>
        <el-option v-for="item in operationModeList" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model.trim="search.fleetId" class="width-100 mr-10" placeholder="所属车队" @focus="loadAllFleet"
                 @change="handleSearch" clearable>
        <el-option :label="item.fleetName" :value="item.fleetId" v-for="item in fleetList"></el-option>
      </el-select>
      <el-select v-model.trim="search.vehicleStatus" class="width-100 mr-10" placeholder="车辆状态" @change="handleSearch"
                 clearable>
        <el-option :label="item.label" :value="item.value" v-for="item in vehicleStatusList"></el-option>
      </el-select>
      <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
      <div class="flex-1"></div>
      <el-button type="primary" plain size="default" @click="handleClickAddAccount">新增整车</el-button>
    </div>
    <el-table ref="tableRef" :data="tableData" :height="tableHeight" class="table" border highlight-current-row
              row-key="vehicleId" scrollbar-always-on @row-click="handleRowClick" row-class-name="table-row-class"
              v-loading="loading">
      <el-table-column fixed type="index" label="编号" width="40" align="center"/>
      <el-table-column label="分组" prop="grouping" width="60" align="center" show-overflow-tooltip/>
      <el-table-column label="调度号" prop="dispatchNumber" width="60" align="center" show-overflow-tooltip/>
      <el-table-column label="车牌号" prop="licensePlateNumber" width="100" align="center" show-overflow-tooltip/>
      <el-table-column label="用能类型" prop="licensePlateType" width="80" align="center" show-overflow-tooltip>
        <template #default="scope">
          {{ energyTypeMap[scope.row.energyType] }}
        </template>
      </el-table-column>
      <el-table-column label="车辆识别代号" prop="vehicleVin" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="运营方式" prop="operationMode" width="auto" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.operationMode != null">
            {{ operationModeMap[scope.row.operationMode] }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="所属车队" prop="fleetName" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="图片" prop="targetDesc" width="100" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.vehicleFileIds === ''">-</span>
          <span v-else class="link" @click.self.stop="handleViewFiles(scope.row.vehicleFileIds)">查看图片({{ scope.row.vehicleFileIds.split(",").length }}个)</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" width="auto" align="center" show-overflow-tooltip/>
      <el-table-column label="车辆状态" prop="vehicleStatus" width="70" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.vehicleStatus != null">
            <el-tag :type="vehicleStatusTagTypeMap[scope.row.vehicleStatus]" disable-transitions>
              {{ vehicleStatusMap[scope.row.vehicleStatus] }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center" @click.stop.prevent.self>
        <template #default="scope">
          <el-button link type="warning" @click.prevent.stop="handleClickEdit(scope.row)">编辑</el-button>
          <el-popconfirm :title="`确定停用该整车[${scope.row.licensePlateNumber}]吗?`"
                         @confirm="handleClickDisable(scope.row.vehicleId)" v-if="scope.row.vehicleStatus !== 2">
            <template #reference>
              <el-button link type="danger" @click.prevent.stop>停用</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageCurrent" v-model:page-size="pageSize" @update:page-size="load"
                   @current-change="load" :page-sizes="[10, 20, 50, 100]" background layout="total, prev, pager,sizes, next"
                   :total="totalSize" class="pagination"/>
  </div>
  <edit-vehicle ref="editRepairRef" @close="closeDialog"></edit-vehicle>
  <add-vehicle ref="addRepairRef" @close="closeDialog"></add-vehicle>
  <image-dialog ref="imageDialogRef"></image-dialog>
</template>
<script setup>
import {nextTick, onMounted, ref, useTemplateRef, watch} from "vue";
import * as vehicleApi from "@/api/api.vehicle.js";
import {getAllFleetSimpleList} from "@/api/api.fleet.js";
import editVehicle from "../components/editVehicle.vue";
import addVehicle from "../components/addVehicle.vue";
import imageDialog from "@/components/form/image-dialog.vue";
import {GlobalStore} from "@/store/index.js";
import {energyTypeMap, operationModeList, operationModeMap, vehicleStatusList, vehicleStatusMap, vehicleStatusTagTypeMap} from "@/config/const.js";

const loading = ref(false);
const editRepairRef = useTemplateRef("editRepairRef");
const addRepairRef = useTemplateRef("addRepairRef");
const tableData = ref([]);
const pageCurrent = ref(1);
const pageSize = ref(20);
const totalSize = ref(0);
const search = ref({
  grouping: "", // 分组
  dispatchNumber: "", // 调度号
  licensePlateNumber: "", // 车牌号
  vehicleVin: "", // 车辆识别代号
  operationMode: "", // 运营方式，1-自有，2-外协，3-代管
  vehicleStatus: "", // 车辆状态
  fleetId: "", // 所属车队ID
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
  let res = await vehicleApi.searchVehiclePageList({current: pageCurrent.value, size: pageSize.value, ...param}, false)
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
  vehicleApi.disableVehicle(item).then(res => {
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
.vehicleBook {
  .width-100 {
    width: 100px;
  }
}
</style>
