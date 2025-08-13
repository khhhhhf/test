<template>
  <el-drawer size="50%" v-model="drawer2" direction="rtl">
    <template #header>
      <h4 class="header">{{ article.cate_id ? '修改文章' : '添加文章' }}</h4>
    </template>
    <template #default>
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px; padding-left: 25px"
        :model="article"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="article.title" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <ChannelSelect
            :options="options"
            v-model="article.cate_id"
          ></ChannelSelect>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <el-upload
            :auto-upload="false"
            class="avatar-uploader"
            :show-file-list="false"
            :on-change="handleFileChange"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="article.cover_img"
              :src="article.cover_img"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><i-ep-Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <div id="app">
            <quill-editor
              ref="quillRef"
              style="width: 100%"
              contentType="html"
              theme="snow"
              v-model:content="article.content"
              @update:content="handleContentUpdate"
              @blur="handleContentBlur"
            ></quill-editor>
          </div>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div>
        <el-button type="primary" @click="publish('已发布')">发布</el-button>
        <el-button type="info" @click="publish('草稿')">草稿</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { msglist, rowtype } from '@/types'
import {
  changearticle,
  getarticleclass,
  getarticledetail,
  publisharticle
} from '@/api/article'
import type { UploadProps } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { baseURL } from '@/utils/request'
import { urlToFile } from '@/utils/formatimg'

const ruleFormRef = ref<FormInstance>()

const drawer2 = ref(false)
const rules = reactive<FormRules<typeof article>>({
  title: [{ required: true, trigger: 'blur', message: '标题不能为空' }],
  cate_id: [{ required: true, trigger: 'blur', message: '分类为必选项' }],
  content: [
    {
      required: true,
      trigger: ['blur', 'change'],
      // 使用callback风格的校验函数
      validator: (_, value: string, callback) => {
        // 1. 先判断是否有值
        if (!value) {
          return callback(new Error('请输入文章内容'))
        }

        // 2. 移除所有HTML标签，判断实际文本是否为空
        const textContent = value.replace(/<[^>]+>/g, '').trim()
        if (textContent === '') {
          return callback(new Error('请输入有效内容（不能仅为空格或空行）'))
        }
        // 3. 校验通过，调用空回调
        callback()
      }
    }
  ],
  cover_img: [{ required: true, message: '请上传文章封面' }]
})

// 手动触发 content 字段的校验
// 处理编辑器内容更新
const handleContentUpdate = (content: string) => {
  // 确保内容已同步到响应式数据
  article.value.content = content
  // 触发校验
  validateContentField()
}
// 处理失去焦点时的校验
const handleContentBlur = () => {
  validateContentField()
}

const validateContentField = () => {
  if (ruleFormRef.value) {
    ruleFormRef.value.validateField('content', (errorMessage) => {
      if (!errorMessage) {
      } else {
      }
    })
  }
}

const defaultacticle = {
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
}
// 定义文章类型接口（推荐）
interface Article {
  id?: string
  title: string
  cate_id: string
  content: string
  cover_img: string
  state: string
}

const article = ref<Article>({
  ...defaultacticle
})

const options = ref<Array<rowtype>>([])
//获取文章分类
async function getaticle() {
  const res = await getarticleclass()
  options.value = res.data
}
getaticle()

//更新照片
const handleFileChange: UploadProps['onChange'] = (file) => {
  if (file.status === 'ready') {
    // 临时预览（未上传到服务器）
    article.value.cover_img = URL.createObjectURL(file.raw!)
  }
  if (ruleFormRef.value) {
    ruleFormRef.value.validateField('cover_img')
  }
}

//上传照片限制
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

//发布和草稿
async function publish(state: string) {
  article.value.state = state
  await ruleFormRef.value?.validate()
  const fd = new FormData()
  const articleData = article.value

  try {
    // 遍历处理其他字段
    ;(Object.keys(articleData) as (keyof Article)[]).forEach((key) => {
      const value = articleData[key]
      if (value && key !== 'cover_img') {
        // 跳过封面，单独处理
        fd.append(key, String(value))
      }
    })

    // 单独处理封面图片（转换为File）
    if (articleData.cover_img) {
      // 生成文件名（可根据需要自定义）
      const filename = `cover-${Date.now()}.jpg`
      // 调用转换函数
      const coverFile = await urlToFile(articleData.cover_img, filename)
      if (coverFile) {
        fd.append('cover_img', coverFile)
      } else {
        throw new Error('封面图片转换失败')
      }
    }
  } catch (error) {
    // 统一捕获所有错误，避免事件处理函数报错
    console.error('发布/草稿处理失败:', error)
    // 友好提示（处理error可能是字符串或Error对象的情况）
    const errorMsg = error instanceof Error ? error.message : '操作失败，请重试'
    ElMessage.error(errorMsg)
  }
  console.log(article.value.id)
  if (!article.value.id) {
    //添加
    await publisharticle(fd)
    emit('success', 'add')
  } else {
    //编辑
    await changearticle(fd)
    emit('success', 'edit')
  }
  drawer2.value = false
}

const quillRef = ref()
async function open(obj: msglist) {
  drawer2.value = true
  if (obj) {
    //编辑
    const res = await getarticledetail(obj.id)
    article.value = res.data
    article.value.cover_img = baseURL + res.data.cover_img
    console.log(article.value)
    await nextTick()
  } else {
    //发布
    article.value = { ...defaultacticle }
    quillRef.value?.setHTML('')
    if (ruleFormRef.value) {
      ruleFormRef.value.resetFields()
    }
    await nextTick()
  }
}

const emit = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="less" scoped>
#app {
  width: 100%;
}
.header {
  margin: 0px;
  color: gray;
  font-weight: 400;
}
</style>

<style lang="less">
.el-drawer__footer {
  display: flex;
  justify-content: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.ql-editor {
  min-height: 150px;
}
</style>
