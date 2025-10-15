<template>
    <el-drawer v-model="showDrawer" :with-header="true" size="80%" destroy-on-close :show-close="false"
        @close="handleDrawerClose" class="pileView my-drawer">
        <template #header="{ close, titleId, titleClass }">
            <span style="flex: none"></span>
            <button aria-label="el.drawer.close" class="el-drawer__close-btn" type="button"
                @click="handleDrawerClose"><i class="el-icon el-drawer__close">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                        <path fill="currentColor"
                            d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z">
                        </path>
                    </svg>
                </i></button>
            <div class="drawTitle">
                充电桩
            </div>
            <!-- <el-button plain type="primary" size="small" @click="handleAddDispatchData"
                :disabled="order.orderStatus === 3">添加充电桩</el-button> -->
        </template>
        <template #default>
            <el-table :data="tableData" row-key="pileId" highlight-current-row border v-loading="loading"
                row-class-name="table-row-class" :height="tableHeight">
                <el-table-column fixed type="index" label="#" width="40" align="center" />
                <el-table-column label="充电桩编码" prop="pileCode" width="120" align="center" show-overflow-tooltip />
            </el-table>
        </template>
    </el-drawer>
</template>
<script setup>
import { GlobalStore } from "@/store/index.js";
import { ref, watch, nextTick } from "vue";
const emit = defineEmits(['close']);
const showDrawer = ref(false);
const loading = ref(false);
const tableData = ref([]);
const tableHeight = ref(100);
let shouldReload = false;

const form = ref({});

const open = (item) => {
    Object.assign(form.value, item);
    showDrawer.value = true;
    load();
}

defineExpose({
    open
})

function load() {

}

function handleDrawerClose() {
    showDrawer.value = false;
    emit("close", shouldReload)
}


const globalStore = GlobalStore();
watch(() => globalStore.screenSize, val => {
    nextTick(() => {
        if (val && val.length === 2) {
            tableHeight.value = val[1] - 80;
        }
    })
}, { immediate: true })
</script>
<style lang="less">
.pileView {}
</style>