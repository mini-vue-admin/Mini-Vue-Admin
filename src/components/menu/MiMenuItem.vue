<template>
  <template v-for="(item) in menuData">
    <el-sub-menu v-if="item.children&&item.children.length>0" :key="item.id" :index="item.id + ''">
      <template #title>{{ item.menuName }}</template>
      <MiMenuItem :menuData="item.children"></MiMenuItem>
    </el-sub-menu>

    <RouterLink :to="item.path" v-else>
      <el-menu-item :key="item.id" :index="item.id+''">
        {{ item.menuName }}
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