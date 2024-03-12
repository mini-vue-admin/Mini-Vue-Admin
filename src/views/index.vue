<template>
  <div style="display: flex;flex-direction: column; height: 100%">
    <MiHead/>
    <div style="display: flex;   flex: 1;">
      <MiMenu/>
      <main style="width: 100%; height: 100%">
        <div style="padding:20px ">
          <MiTag/>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="$route.path" />
            </keep-alive>
          </router-view>
        </div>
      </main>
    </div>
    <MiFoot/>
  </div>
</template>

<script setup>
import MiHead from "@/views/layout/MiHead.vue";
import MiMenu from "@/views/layout/MiMenu.vue";
import MiFoot from "@/views/layout/MiFoot.vue";
import MiTag from "@/views/layout/MiTag.vue";
</script>