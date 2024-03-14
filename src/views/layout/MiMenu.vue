<template>
  <aside>
    <el-menu style="width: 200px; height: 100%" :router="true" :default-active="$route.meta.activePath || $route.path">
      <MiMenuItem :menu-data="menuData"></MiMenuItem>
    </el-menu>
  </aside>
</template>
<script>
export default {
  name: 'MiMenu'
}
</script>

<script setup>
import {useMenuStore} from "@/stores/menu.js";
import {computed, onMounted, ref} from "vue";
import MiMenuItem from "@/components/menu/MiMenuItem.vue";

const menuStore = useMenuStore()
const menuData = ref([])

onMounted(async () => {
  menuData.value = menuStore.menus.filter(it => it.menuType !== 'B')
})

</script>