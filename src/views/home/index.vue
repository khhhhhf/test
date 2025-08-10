<template>
  <el-container>
    <el-aside>
      <el-menu
        router
        :default-active="$route.path"
        active-text-color="#ffd04b"
        class="el-menu-vertical-demo"
        background-color="#232323"
        text-color="#fff"
      >
        <div class="img"></div>
        <el-menu-item index="/home/article-class">
          <el-icon><Star /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/home/article-control">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/home/foundation-data"
            ><el-icon><Monitor /></el-icon>基本资料</el-menu-item
          >
          <el-menu-item index="/home/change-img"
            ><el-icon><Monitor /></el-icon>更换头像</el-menu-item
          >
          <el-menu-item index="/home/change-mm"
            ><el-icon><Monitor /></el-icon>重置密码</el-menu-item
          >
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-main>
      <el-container>
        <el-header>
          <div class="left">
            白马程序员:
            <span>{{
              userstore.user.nickname || userstore.user.username
            }}</span>
          </div>
          <div class="right">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <el-avatar
                  :src="userstore.user.user_pic || '../../assets/avatar.jpg'"
                />
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="foundation-data"
                    ><el-icon><Monitor /></el-icon>基本资料</el-dropdown-item
                  >
                  <el-dropdown-item command="change-img"
                    ><el-icon><Monitor /></el-icon>更换头像</el-dropdown-item
                  >
                  <el-dropdown-item command="change-mm"
                    ><el-icon><Monitor /></el-icon>重置密码</el-dropdown-item
                  >
                  <el-dropdown-item command="a"
                    ><el-icon><Monitor /></el-icon>退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main> <RouterView></RouterView></el-main>
        <el-footer>大事件 ©2025 khhh</el-footer>
      </el-container>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
import {
  Star,
  Promotion,
  ArrowDown,
  Location,
  Monitor
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
// import { ref } from 'vue'

const userstore = useUserStore()
const { getuser /* removetoken */ } = userstore
// getuser()
onMounted(() => {
  getuser()
})

const router = useRouter()
const handleCommand = (command: string) => {
  console.log(command)
  /*  if (command === 'a') {
    removetoken()
   ElMessageBox.confirm(
    'proxy will permanently delete the file. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}
  router.push({ name: 'login' })
    return
*/
  router.replace({ name: command })
}
</script>
<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.el-aside {
  width: 200px;
  .img {
    height: 120px;
    width: 200px;
    background: url(../../assets/logo.png) no-repeat center / 120px auto;
  }
}
.el-menu {
  height: 100vh;
}
.el-header {
  padding: 0px 20px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  align-items: center;
  .left {
    span {
      margin-left: 10px;
      font-weight: 600;
    }
  }
  .right {
    height: 40px;
    .el-icon {
      margin-left: 10px;
    }
  }
}
.el-dropdown-link {
  border: 0px !important;
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  &:focus {
    outline: none;
  }
}
</style>
