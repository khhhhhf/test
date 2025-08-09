<template>
  <el-container>
    <el-aside>
      <el-menu
        router
        :default-active="$route.path"
        active-text-color="#ffd04b"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
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
            白马程序员: <span>{{ username }}</span>
          </div>
          <div class="right">asdas</div>
        </el-header>
        <el-main> <RouterView></RouterView></el-main>
        <el-footer>3</el-footer>
      </el-container>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { Star, Promotion, Location, Monitor } from '@element-plus/icons-vue'
import { ref } from 'vue'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const username = ref('khhh')
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
  .left {
    span {
      margin-left: 10px;
      font-weight: 600;
    }
  }
}
</style>
