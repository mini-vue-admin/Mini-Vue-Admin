<template>
  <template v-for="(item) in menuData">
    <el-sub-menu v-if="item.children && item.children.length>0" :key="item.id" :index="item.path">
      <template #title>{{ item.menuTitle }}</template>
      <MiMenuItem :menuData="item.children"></MiMenuItem>
    </el-sub-menu>

      <el-menu-item :key="item.id" :index="item.path" v-else>
        {{ item.menuTitle }}
      </el-menu-item>
  </template>
</template>
<script>
export default {
  props: ['menuData'],
  name: 'MiMenuItem'
}
</script>