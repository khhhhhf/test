<template>
  <el-card style="max-width: 100%">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <slot name="extra"></slot>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>
<script setup lang="ts">
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>
<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
}
.el-card {
  margin: 10px 20px;
}
</style>
