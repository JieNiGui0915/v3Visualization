<template>
  <el-select
      filterable
      :clearable="props.clearable"
      autocomplete="on"
      remote
      :multiple="props.multiple"
      allow-create
      reserve-keyword
      default-first-option
      :placeholder="props.placeholder"
      :remote-method="remoteMethod"
      @change="change">
    <el-option
        v-for="(item,i) in options"
        :key="item"
        :label="item"
        :value="item" class="localMemorySelectOption">
      <span style="float: left">{{ item }}</span>
      <span class="localMemorySelectRight" title="删除" @click.prevent.stop="handleDel(i)">
        <el-icon size="10" color="#e4e4e4">
          <Edit/>
        </el-icon>
      </span>
    </el-option>
  </el-select>
</template>

<script setup>
import {ref, toRefs} from 'vue';
import {Edit} from "@element-plus/icons-vue";

const list = ref([]);
const options = ref([]);
const props = defineProps({
  dataKey: String,
  placeholder: String,
  clearable: Boolean,
  multiple: Boolean,
});
// const {dataKey, placeholder, clearable, multiple} = toRefs(props);
const dataList = localStorage.getItem(props.dataKey);
list.value = dataList ? JSON.parse(dataList) : [];
options.value = list.value;
const remoteMethod = (query = "") => {
  if (query) {
    options.value = list.value.filter((item) => {
      return item.includes(query);
    })
  } else {
    options.value = list.value;
  }
}

const change = (val) => {
  if (val) {
    if (Array.isArray(val)) {
      val.forEach((item) => {
        add(item);
      })
    } else {
      add(val);
    }
    localStorage.setItem(props.dataKey, JSON.stringify(list.value));
  }
}
const add = (item = "") => {
  if (!list.value.includes(item)) {
    list.value.push(item);
  }
}

const handleDel = (index) => {
  if (list.value.length > index) {
   list.value.splice(index,1);
  }
}
</script>

<style lang="less">
.localMemorySelectOption {

  .localMemorySelectRight {
    float: right;
    color: var(--el-text-color-secondary);
    font-size: 13px;
    margin-right: 40px;
    display: none;

    &:hover {
      color: #1e59c7;
    }
  }

  &:hover {
    .localMemorySelectRight {
      display: inline-block;
    }
  }
}

</style>
