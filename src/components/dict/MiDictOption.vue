<template>
  <el-option v-for="item in dicts" :key="item.id" :label="item.dictLabel" :value="item.dictValue"></el-option>
</template>

<script>
import {ElSelect} from 'element-plus';

export default {
  extends: ElSelect,//继承
  name: 'MiDictSelect',
  methods: {},
};
</script>

<script setup>
import {ref, onMounted, defineProps} from 'vue'
import {useDictStore} from "@/stores/dict.js";

const props = defineProps({
  dictType: {
    type: String,
    required: true
  }
})
const dicts = ref([])

const dictStore = useDictStore()

// 在组件挂载时获取用户信息
onMounted(async () => {
  dictStore.initStore().then(() => {
    dicts.value = dictStore.getDictsByType(props.dictType)
  })
})
</script>