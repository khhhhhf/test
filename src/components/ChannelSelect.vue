<template>
  <!--  <el-select
    :modelValue="value"
    @update:modelValue="emit('update:modelValue', $event)"
    style="width: 240px"
  > -->
  <el-select style="width: 240px" v-model="value">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    />
  </el-select>
</template>
<script setup lang="ts">
// import { ref, reactive } from 'vue'
defineProps({
  options: Object
})
//新写法
const value = defineModel<string | number>('modelValue')
// const emit = defineEmits(['update:modelValue'])
</script>
<style lang="less" scoped></style>
