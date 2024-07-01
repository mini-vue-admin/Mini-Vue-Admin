<template>
  <el-option v-for="item in dicts" :key="item.id" :label="item.dictLabel" :value="item.dictValue"></el-option>
</template>

<script>
export default {
  name: 'MiDictOption'
};
</script>

<script setup>
import {ref} from 'vue'
import {useDictStore} from "@/stores/dict.js";

const props = defineProps({
  dictType: {
    type: String,
    required: true
  }
})

const dictStore = useDictStore()
const dicts = ref([])
dictStore.getDictsByType(props.dictType).then(data =>
    dicts.value = data
)
</script>