<template>
  <PageContent title="更换头像">
    <!-- element-plus组件 -->
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      :on-change="handleFileChange"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><i-ep-Plus /></el-icon>
    </el-upload>
    <br />
    <el-button type="primary" @click="selectUpload">
      <el-icon class="el-icon--upload"><i-ep-Upload /></el-icon
      >选择照片</el-button
    >
    <el-button type="success" @click="submitUpload">
      <el-icon class="el-icon--upload"><i-ep-Upload /></el-icon
      >上传照片</el-button
    >
  </PageContent>
</template>
<script setup lang="ts">
import { updateimg } from '@/api/user'
import { useUserStore } from '@/stores'
import type { UploadProps } from 'element-plus'
import { ref } from 'vue'

const selectedFile = ref<File | null>(null)
const imageUrl = ref('')
const handleFileChange: UploadProps['onChange'] = (file) => {
  if (file.status === 'ready') {
    selectedFile.value = file.raw!
    imageUrl.value = URL.createObjectURL(file.raw!)
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

const userstore = useUserStore()
imageUrl.value = userstore.user?.user_pic || ''
const uploadRef = ref()
function submitUpload() {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择要上传的图片')
    return
  }
  const reader = new FileReader()
  reader.readAsDataURL(selectedFile.value)
  reader.onload = async function () {
    const base64Data = reader.result
    try {
      await updateimg(base64Data as string)
      ElMessage.success('头像上传成功')
      userstore.updateUserAvatar(imageUrl.value)
    } catch (error) {
      ElMessage.error('头像上传失败')
      console.error(error)
    }
  }
}

function selectUpload() {
  // 更安全的方式触发文件选择
  if (uploadRef.value) {
    // 尝试获取上传组件的输入元素
    const input = uploadRef.value.$el.querySelector('input[type="file"]')
    if (input) {
      input.click()
    } else {
      ElMessage.warning('无法打开文件选择器，请检查上传组件是否正常加载')
    }
  } else {
    ElMessage.warning('上传组件尚未准备就绪')
  }
}
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 210px;
  height: 210px;
  display: block;
}
</style>

<style>
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
</style>
