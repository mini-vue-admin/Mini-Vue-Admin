<template>
  <el-button size="small" :type="dict.cssClass" >{{ dict.dictLabel }}</el-button>
</template>
<script>
export default {
  name: 'MiDictLabel',
}
</script>

<script setup>
import {useDictStore} from "@/stores/dict.js";
import {ref, onMounted, defineProps} from 'vue'

const props = defineProps({
  dictValue: {
    type: String,
    required: true
  },
  dictType: {
    type: String,
    required: true
  }
})

const dict = ref({
  cssClass: 'primary',
  dictLabel: null
})

const dictStore = useDictStore()

// 在组件挂载时获取用户信息
onMounted(async () => {
  dictStore.initStore().then(() => {
    dict.value = dictStore.getDictLabel(props.dictType, props.dictValue)
  })
})

</script>