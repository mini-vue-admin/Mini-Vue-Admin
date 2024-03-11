<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item  v-for="item in menuStore.breadcrumb">{{item}}</el-breadcrumb-item>
  </el-breadcrumb>
  <div style="height: 10px"></div>

  <el-scrollbar style="height: 40px" :vertical="true" @wheel.native.prevent="handleWheel" ref="scrollbarRef">
    <div class="scrollbar-flex-content">
      <p class=" scrollbar-demo-item" v-for="item in menuStore.tags" :key="item" >
        <el-dropdown trigger="contextmenu" style="max-width:80px;">
          <router-link :to="item.path" class="el-button el-button--small" :class="item.meta.active ? 'el-button--primary': '' " >
            {{item.name}}

            <el-icon class="el-icon--right" @click.prevent="menuStore.removeTag(item)">
              <Close/>
            </el-icon>
          </router-link>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>关闭</el-dropdown-item>
              <el-dropdown-item>关闭右侧</el-dropdown-item>
              <el-dropdown-item>关闭其他</el-dropdown-item>
              <el-dropdown-item>关闭所有</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </p>
    </div>
  </el-scrollbar>
</template>
<script>
export default {
  name: 'MiTag'
}
</script>

<script setup>
import {computed, ref} from "vue";
import {useRoute} from "vue-router";
import {useMenuStore} from "@/stores/menu.js";

const scrollbarRef = ref()
function handleWheel(e) {
  const wheelDelta = e.wheelDelta || -e.deltaY * 40
  // scrollbar.wrap$获取到包裹容器的element对象
  scrollbarRef.value.$refs.wrapRef.scrollLeft = scrollbarRef.value.$refs.wrapRef.scrollLeft - wheelDelta / 4
}

const menuStore = useMenuStore()


</script>


<style scoped>
.scrollbar-flex-content {
  display: flex;
  width: 1px
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>