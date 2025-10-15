<template>
    <el-select v-model="searchSelectValue" :placeholder="props.placeholder" filterable remote remote-show-suffix
        :remote-method="remoteFilterContactMethod" clearable v-loading="loadingStaff" @change="handleSelectChange"
        style="padding: 0">
        <el-option v-for="item in staffList" :key="item.staffId" :value="item.staffId">
            <span class="el-option-left">{{ item.fullName }}</span>
            <span class="el-option-right">{{ item.mobileNumber }} / {{ item.idCardNumber }}</span>
        </el-option>
    </el-select>
</template>
<script setup>
import { ref, watch } from "vue";
import { searchStaff, getStaff } from "@/api/api.staff.js";

const props = defineProps({
    modelValue: {
        type: String,
        default: null
    },
    placeholder: {
        type: String,
        default: "搜索姓名/手机号/身份证号"
    },
});

watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        loadStaffInfo();
    }
}, { immediate: true });

const emits = defineEmits(["change"]);
// region 查询人员
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
        emits("change", data);
        searchSelectValue.value = data.fullName;
        // form.value.contactUserName = "";
        // form.value.contactPhone = "";
        // setTimeout(() => {
        //     form.value.contactUserName = data.fullName;
        //     form.value.contactPhone = data.mobileNumber;
        //     ElMessage.success("联系人联系方式已根据选择的人员自动调整");
        // }, 200)
    } else {
    }
}

function loadStaffInfo() {
    getStaff(props.modelValue).then(res => {
        searchSelectValue.value = res.fullName;
    });
}

// endregion
</script>
<style></style>