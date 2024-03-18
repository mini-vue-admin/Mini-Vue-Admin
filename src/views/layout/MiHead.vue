<template>
  <header>
    <el-menu mode="horizontal" :ellipsis="false">
      <el-menu-item index="0">
        <RouterLink to="/" style="display: flex; align-items: center;">
          <img src="@/assets/logo.svg" alt="logo" width="48px"/>
          <h1>Mini Vue Admin</h1>
        </RouterLink>
      </el-menu-item>

      <div class="flex-grow"/>
      <el-sub-menu index="2">
        <template #title>
          通知
        </template>
        <el-menu-item>信息</el-menu-item>
        <el-menu-item>退出</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="3">
        <template #title>用户</template>
        <el-menu-item>信息</el-menu-item>
        <el-menu-item>退出</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </header>
</template>
<script>
export default {
  name: 'MiHead'
}
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>