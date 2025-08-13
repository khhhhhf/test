<template>
  <PageContent title="文章分类">
    <template #extra>
      <el-button type="primary" @click="dig.open()"
        >添加分类</el-button
      ></template
    >

    <el-table v-loading="loading" :data="data" style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button
            plain
            circle
            :icon="Edit"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >
          </el-button>
          <el-button
            circle
            plain
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            <el-icon> <i-ep-Delete /> </el-icon>
            <!-- 这种无需引入 -->
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :image-size="200" />
      </template>
    </el-table>
    <DialogDemo ref="dig" :fun="getarticle"></DialogDemo>
  </PageContent>
</template>
<script setup lang="ts">
import { deleteearticleclass, getarticleclass } from '@/api/article'
import { Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { type rowtype } from '@/types'

const loading = ref(false)
const data = ref()
const getarticle = async () => {
  loading.value = true
  const res = await getarticleclass()
  loading.value = false
  data.value = res.data
}
getarticle()

const dig = ref()
function handleEdit($index: object, row: object) {
  dig.value.open(row)
}
function handleDelete($index: object, row: rowtype) {
  ElMessageBox.confirm(`确定删除${row.cate_name}的分类吗`, '温馨提示', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    await deleteearticleclass(row.id)
    getarticle()
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  })
}
</script>
<style lang="less" scoped>
/* :deep(.el-table .cell) {
  line-height: 55px;
} */
</style>
