<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="menu">
        <el-menu default-active="2" class="el-menu-vertical-demo" router>
          <el-menu-item index="/admin/index">
            <span>首页</span>
          </el-menu-item>
          <el-sub-menu index="">
            <template #title>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/users/list">用户列表</el-menu-item>
            <el-menu-item index="/admin/users/adduser">添加用户</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/admin/private">
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="/admin/gallery">
            <span>图库管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.menu {
  width: 200px;
  height: 100vh;
  box-shadow: var(--el-box-shadow-lighter);
}
</style>