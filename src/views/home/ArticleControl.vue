<template>
  <PageContent title="文章管理">
    <template #extra> <el-button type="primary">发布文章</el-button></template>
    <el-form
      :inline="true"
      ref="ruleFormRef"
      style="max-width: 1000px"
      :model="ruleForm"
      status-icon
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item label="文章分类：">
        <ChannelSelect
          :options="options"
          v-model="ruleForm.cate_id"
        ></ChannelSelect>
      </el-form-item>

      <el-form-item label="发布状态：">
        <el-select v-model="ruleForm.state" style="width: 240px">
          <el-option label="已发布" value="已发布" />
          <el-option label="草稿" value="草稿" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()"> Search </el-button>
        <el-button @click="resetForm()">Reset</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column label="文章标题" width="400">
        <template #default="scope">
          <div>
            <a href="#" style="text-decoration: none; color: skyblue">{{
              scope.row.title
            }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类" width="200" />
      <el-table-column prop="pub_date" label="发表时间" />

      //时间处理可以直接在这里写插槽
      <!-- <template #default="{ row }">
            {{ formatdate(row.pub_date) }}
      </template> -->
      <el-table-column prop="state" label="状态" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button
            plain
            circle
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >
            <el-icon> <i-ep-Edit /> </el-icon>
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
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="ruleForm.pagenum"
        v-model:page-size="ruleForm.pagesize"
        :page-sizes="[2, 4, 8, 10]"
        background
        layout="jumper,total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </div>
  </PageContent>
</template>
<script setup lang="ts">
import { getarticlelist, getarticleclass } from '@/api/article'
import { ref } from 'vue'
import type { msglist, rowtype } from '@/types'
import { formatdate } from '@/utils/formatdate'

const loading = ref(false)
const options = ref<Array<rowtype>>([])
const ruleForm = ref({
  pagenum: 1,
  pagesize: 4,
  cate_id: '',
  state: ''
})
//获取文章分类
async function getaticle() {
  const res = await getarticleclass()
  options.value = res.data
}
getaticle()

//获取列表
const tableData = ref()
async function getlist() {
  loading.value = true
  const res: any = await getarticlelist(ruleForm.value) // eslint-disable-line @typescript-eslint/no-explicit-any
  res.data.forEach((item: msglist) => {
    item.pub_date = formatdate(item.pub_date)
  })
  tableData.value = res.data

  total.value = res.total
  loading.value = false
}
getlist()

//搜索
function submitForm() {
  getlist()
}
//重置
function resetForm() {
  ruleForm.value.state = ''
  ruleForm.value.cate_id = ''
  ruleForm.value.pagenum = 1
  getlist()
}

//编辑
function handleEdit($index: number, row: msglist) {
  console.log($index, row)
}
//删除
function handleDelete($index: number, row: msglist) {
  console.log($index, row)
}

//分页逻辑
const total = ref<number>(0)
const handleSizeChange = () => {
  ruleForm.value.pagenum = 1
  getlist()
}
const handleCurrentChange = () => {
  getlist()
}

//发布文章
</script>
<style lang="less" scoped></style>
