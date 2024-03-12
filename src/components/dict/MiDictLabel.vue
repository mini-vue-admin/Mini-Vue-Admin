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
const dict = computed(() => {
  if(props.dictType === null) {
    return {
      cssClass: 'primary',
      dictLabel: null
    }
  }
  return dictStore.getDictLabel(props.dictType, props.dictValue)
})

</script>