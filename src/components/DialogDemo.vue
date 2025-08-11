<template>
  <el-dialog
    v-model="ispd"
    :title="!form.id ? '添加分类' : '修改分类'"
    width="30%"
  >
    <el-form ref="formref" :rules="rules" :model="form">
      <el-form-item
        prop="cate_name"
        label="分类名称"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.cate_name" autocomplete="off" />
      </el-form-item>
      <el-form-item
        prop="cate_alias"
        label="分类别名"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.cate_alias" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="ispd = false">取消</el-button>
        <el-button type="primary" @click="editmsg">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormRules } from 'element-plus'
import { addearticleclass, changearticleclass } from '@/api/article'
import { type rowtype } from '@/types'

const props = defineProps({
  fun: {
    type: Function,
    required: true
  }
})
const formLabelWidth = '100px'
const ispd = ref(false)

const form = ref<rowtype>({
  id: '',
  cate_name: '',
  cate_alias: ''
})

function open(obj: rowtype) {
  form.value = { ...obj }
  ispd.value = true
}

const formref = ref()
async function editmsg() {
  await formref.value.validate()
  if (form.value.id) {
    await changearticleclass(form.value)
    ispd.value = false
    ElMessage({
      message: '编辑成功',
      type: 'success'
    })
  } else {
    await addearticleclass({
      cate_name: form.value.cate_name,
      cate_alias: form.value.cate_alias
    })
    ElMessage({
      message: '添加成功',
      type: 'success'
    })
  }
  ispd.value = false
  props.fun()
}

//表单校验
const rules = reactive<FormRules<typeof form>>({
  cate_name: [{ required: true, trigger: 'blur', message: '内容不能为空' }],
  cate_alias: [
    { required: true, trigger: 'blur', message: '内容不能为空' },
    {
      min: 2,
      max: 10,
      trigger: 'change',
      message: '内容长度1到10'
    }
  ]
})

defineExpose({ open })
</script>
<style lang="less" scoped></style>
