<template>
  <aside>
    <el-menu style="width: 200px; height: 100%">

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
import {onMounted, ref} from "vue";
import MiMenuItem from "@/components/menu/MiMenuItem.vue";

const menuStore = useMenuStore()
const menuData = ref([])

onMounted(async () => {
  menuData.value = menuStore.menus.filter(it => it.menuType != 'B')
  console.log(menuData.value)
})


</script>