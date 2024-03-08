<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
    ><a href="/public">系统管理</a></el-breadcrumb-item
    >
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
  <div style="height: 10px"></div>

  <el-scrollbar style="height: 40px" :vertical="true" @wheel.native.prevent="handleWheel" ref="scrollbarRef">
    <div class="scrollbar-flex-content">
      <p class=" scrollbar-demo-item" v-for="item in 50" :key="item" >
        <el-dropdown trigger="contextmenu" style="max-width:80px;">
          <router-link to="" class="el-button el-button--small">
            asdf
            <el-icon class="el-icon--right" @click="console.log('adsf')">
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

const scrollbarRef = ref()
const scrollWrapper = computed(() => scrollbarRef.value.$el)

function handleWheel(e) {
  const wheelDelta = e.wheelDelta || -e.deltaY * 40
  // scrollbar.wrap$获取到包裹容器的element对象
  scrollbarRef.value.$refs.wrapRef.scrollLeft = scrollbarRef.value.$refs.wrapRef.scrollLeft - wheelDelta / 4
}

function handleRightClick() {
  console.log('adfsasdf')
}
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