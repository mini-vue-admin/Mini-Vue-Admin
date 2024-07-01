<template>
  <el-tag size="small" :type="dict.cssClass">{{ dict.dictLabel }}</el-tag>
</template>
<script>
export default {
  name: 'MiDictLabel',
}
</script>

<script setup>
import {useDictStore} from "@/stores/dict.js";
import {ref, onMounted, defineProps, computed} from 'vue'

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
const dictStore = useDictStore()
const dict = ref({
  cssClass: 'danger',
  dictLabel: null
})
dictStore.getDictLabel(props.dictType, props.dictValue).then(data => {
  dict.value = data
})

</script>