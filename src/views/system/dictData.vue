<template>

  <el-space direction="vertical" :fill="true" style="width: 100%">
    <div></div>
    <el-form ref="queryRef" :model="queryParams" :inline="true" style="">

      <el-form-item label="字典标签" prop="dictLabel">
        <el-input v-model="queryParams.dictLabel"
                  placeholder="请输入字典标签"
                  clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="字典键值" prop="dictValue">
        <el-input v-model="queryParams.dictValue"
                  placeholder="请输入字典键值"
                  clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery(queryRef)">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <RouterLink to="/system/dictType">
          <el-button icon="Back">
            返回
          </el-button>
        </RouterLink>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="success" @click="handleUpdate">修改</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </el-col>


    </el-row>

    <el-table ref="tableRef" :data="tableData.list" style="width: 100%;" :border="true">
      <el-table-column type="selection"></el-table-column>
      <el-table-column fixed prop="id" label="id"/>
      <el-table-column prop="dictType" label="字典类型"/>
      <el-table-column prop="dictLabel" label="字典标签"/>
      <el-table-column prop="dictValue" label="字典键值"/>
      <el-table-column prop="orderNum" label="字典排序"/>
      <el-table-column prop="cssClass" label="样式属性">
        <template #default="scope">
          <el-button size="small" :type="scope.row.cssClass">{{scope.row.cssClass}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="listClass" label="表格回显样式"/>
      <el-table-column prop="asDefault" label="是否默认"/>

      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <MiDictLabel :dictValue="scope.row.status" dictType="common.status"/>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; align-items: center; justify-content: flex-end; ">
      <span>总条数: {{ tableData.total }}</span>
      <el-pagination background layout="->, prev, pager, next, sizes"
                     :total="tableData.total"
                     v-model:page-size="queryParams.pageSize"
                     v-model:current-page="queryParams.pageIndex"
                     :page-sizes="[10, 20, 50, 100]"
                     @change="handleQuery"
                     style="padding-top: 5px"/>
    </div>
  </el-space>

  <el-dialog :title="formDialog.title" v-model="formDialog.open" width="500px" append-to-body
             :close-on-click-modal="false">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="formData.dictType" placeholder="请输入字典类型"/>
      </el-form-item>

      <el-form-item label="字典标签" prop="dictLabel">
        <el-input v-model="formData.dictLabel" placeholder="请输入字典标签"/>
      </el-form-item>
      <el-form-item label="字典键值" prop="dictValue">
        <el-input v-model="formData.dictValue" placeholder="请输入字典键值"/>
      </el-form-item>
      <el-form-item label="字典排序" prop="orderNum">
        <el-input v-model="formData.orderNum" type="number" placeholder="请输入字典排序"/>
      </el-form-item>
      <el-form-item label="样式属性" prop="cssClass">
        <el-select v-model="formData.cssClass" placeholder="请选择样式属性" clearable>
          <el-option label="primary" value="primary"/>
          <el-option label="success" value="success"/>
          <el-option label="info" value="info"/>
          <el-option label="warning" value="warning"/>
          <el-option label="danger" value="danger"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="formData.status" placeholder="请选择状态"
                   active-text="启用"
                   inactive-text="停用" inline-prompt active-value="0" inactive-value="1" />
      </el-form-item>
    </el-form>
    <template #footer class="dialog-footer">
      <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {onActivated, reactive, ref} from "vue";
import {create, del, getPage, getById, update} from "@/api/system/dictData.js"
import {getById as getDictTypeById}  from "@/api/system/dictType.js"
import {ElMessage, ElMessageBox} from "element-plus";
import MiDictLabel from "@/components/dict/MiDictLabel.vue";
import { useRoute } from 'vue-router';

const queryRef = ref(null)
const formRef = ref()
const tableRef = ref()



const queryParams = reactive({
  dictLabel: null,
  dictValue: null,
  dictType: null,
  pageIndex: 1,
  pageSize: 10
})

const rules = {
  dictLabel: [
    {required: true, message:"字典标签不能为空", trigger: "blur"},
  ],
  dictValue: [
    {required: true, message: "字典键值不能为空", trigger: "blur"},
  ]
}

const formData = ref({})
const formDialog = reactive({
  title: "新增字典项",
  open: false
})

const tableData = ref({
  list: [],
  total: 0
})

const route = useRoute()
getDictTypeById(route.params.id).then(res => {
  queryParams.dictType = res.data.dictType
  handleQuery()
})

// ---------------------- Functions ---------------------------

function handleQuery() {
  getPage(queryParams).then(res => {
    tableData.value = res.data
  })
}

function resetQuery(formEl) {
  if (!formEl) return
  formEl.resetFields();
  handleQuery();
}

function handleUpdate(id) {
  if (id instanceof Event) {
    id = tableRef.value.getSelectionRows().map(it => it.id)
    if (id.length === 0 || id.length > 1) {
      ElMessage({
        message: "请选择一条记录",
        type: "warning"
      })
      return
    }
    id = id[0]
  }

  resetForm()
  getById(id).then(res => {
    formData.value = res.data
  }).then(() => {
    formDialog.open = true
    formDialog.title = "修改字典项"
  })
}

function handleDelete(id) {
  if (id instanceof Event) {
    id = tableRef.value.getSelectionRows().map(it => it.id)
    if (id.length === 0) {
      ElMessage({
        message: "请选择至少一条记录",
        type: "warning"
      })
      return
    }
  }

  ElMessageBox.confirm('确认执行删除操作吗?', '系统提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确认'
  })
      .then(() => {
        del(id).then(res => {
          ElMessage({
            message: '操作成功',
            type: 'success',
          })
          handleQuery()
        })
      })

}

function handleAdd() {
  resetForm()
  formDialog.open = true
  formDialog.title = "新增字典项"
}

function resetForm() {
  formData.value = {
    dictType: queryParams.dictType,
    status: '0'
  }
}

function submitForm(formEl) {
  formEl.validate(valid => {
    if (valid) {
      if (formData.value.id != null) {
        update(formData.value).then(res => {
          ElMessage({
            message: '操作成功',
            type: 'success',
          })
          formDialog.open = false
          handleQuery()
        })
      } else {
        create(formData.value).then(res => {
          ElMessage({
            message: '操作成功',
            type: 'success',
          })
          formDialog.open = false
          handleQuery()
        })
      }
    }
  })
}

function cancelForm() {
  formDialog.open = false
}
</script>

<style scoped>
</style>