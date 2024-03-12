<template>
  <template v-for="(item) in menuData">
    <el-sub-menu v-if="item.children && item.children.length>0" :key="item.id" :index="item.id.toString()">
      <template #title>{{ item.menuTitle }}</template>
      <MiMenuItem :menuData="item.children"></MiMenuItem>
    </el-sub-menu>

    <RouterLink :to="item.path" v-else>
      <el-menu-item :key="item.id" :index="item.id.toString()">
        {{ item.menuTitle }}
      </el-menu-item>
    </RouterLink>
  </template>
</template>
<script>
export default {
  props: ['menuData'],
  name: 'MiMenuItem'
}
</script>