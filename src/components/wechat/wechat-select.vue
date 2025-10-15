<template>
  <div class="wechat-select">
    <div class="wechat-select-placeholder" v-if="selectValue == null || selectValue===''">{{ props.placeholder }}</div>
    <select v-model="selectValue" @change="handleChange" class="weui-select" ref="wechatSelectRef">
      <slot></slot>
    </select>
    <div class="flex-1"></div>
    <i class="weui-icon-back-arrow-thin wechat-select-down-arrow"></i>
    <template v-if="props.clearable && selectValue!=null">
      <i class="weui-icon-close-thin wechat-select-clear" @click.prevent.stop.self="handleClear"></i>
    </template>
  </div>
</template>
<script setup>
import {ref, toRaw, useTemplateRef, watch} from "vue";

const emits = defineEmits(['update:modelValue', 'change', 'selection-change']);
const selectValue = ref();
const wechatSelectRef = useTemplateRef("wechatSelectRef");
let props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    required: true,
    default: ""
  },
  placeholder: {
    type: String,
    default: ""
  },
  clearable: {
    type: Boolean,
    required: false,
    default: false
  },
})
watch(() => props.modelValue, val => {
  selectValue.value = toRaw(val);
}, {
  immediate: true
})


function handleChange() {
  emits("change", selectValue.value);
  emits("update:modelValue", selectValue.value);
}

function handleClear() {
  wechatSelectRef.value.value = null;
  selectValue.value = null;
}
</script>
<style lang="less">
.wechat-select {
  width: 100%;
  position: relative;
  display: flex;

  .wechat-select-placeholder {
    position: absolute;
    //left: 0;
    //top: 0;
    color: var(--weui-FG-2);
  }

  .weui-select {
    width: 100%;
    font-weight: bold;
  }

  .wechat-select-down-arrow {
    height: 50px;
    width: 12px;
    transform: rotate(-90deg);
    color: var(--weui-FG-2);
    margin-right: 5px
  }

  .wechat-select-clear {
    height: 50px;
    //width: 12px;
    color: var(--weui-FG-2);

  }
}
</style>
