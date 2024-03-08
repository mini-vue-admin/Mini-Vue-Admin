<template>
  <aside>
    <el-menu style="width: 200px; height: 100%">

      <RouterLink to="/Home">
        <el-menu-item>主页</el-menu-item>
      </RouterLink>
      <el-sub-menu index="0">
        <template #title>系统管理</template>
        <RouterLink to="/system/user">
          <el-menu-item>
            用户管理
          </el-menu-item>
        </RouterLink>

        <RouterLink to="/system/menu">
          <el-menu-item>
            菜单管理
          </el-menu-item>
        </RouterLink>
      </el-sub-menu>
    </el-menu>
  </aside>
</template>
<script>
export default {
  name: 'MiMenu'
}
</script>