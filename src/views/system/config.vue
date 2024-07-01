<template>

  <el-space direction="vertical" :fill="true" style="width: 100%">
    <div></div>
    <el-form ref="queryRef" :model="queryParams" :inline="true" class="fix-form-inline">
      <el-form-item label="参数名称" prop="configName">
        <el-input v-model="queryParams.configName"
                  placeholder="请输入参数名称"
                  clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="参数类型" prop="configType">
        <el-select v-model="queryParams.configType"
                   placeholder="请选择参数类型"
                   clearable
                   @keyup.enter.native="handleQuery">
          <MiDictOption dict-type="system.config.type"/>
        </el-select>
      </el-form-item>
      <el-form-item label="参数键名" prop="configKey">
        <el-input v-model="queryParams.configKey"
                  placeholder="请输入参数键名"
                  clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="参数键值" prop="configValue">
        <el-input v-model="queryParams.configValue"
                  placeholder="请输入参数键值"
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
      <el-table-column prop="configName" label="参数名称"/>
      <el-table-column prop="configType" label="参数类型">
        <template #default="scope">
          <MiDictLabel dict-type="system.config.type" :dict-value="scope.row.configType"/>
        </template>
      </el-table-column>
      <el-table-column prop="configKey" label="参数键名"/>
      <el-table-column prop="configValue" label="参数键值"/>
      <el-table-column prop="remark" label="备注"/>
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
      <el-form-item label="参数名称" prop="configName">
        <el-input v-model="formData.configName" placeholder="请输入参数名称"/>
      </el-form-item>
      <el-form-item label="参数类型" prop="configType">
        <el-select v-model="formData.configType">
          <MiDictOption dict-type="system.config.type"/>
        </el-select>
      </el-form-item>
      <el-form-item label="参数键名" prop="configKey">
        <el-input v-model="formData.configKey" placeholder="请输入参数键名"/>
      </el-form-item>
      <el-form-item label="参数键值" prop="configValue">
        <el-input v-model="formData.configValue" placeholder="参数键值"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注"/>
      </el-form-item>

    </el-form>
    <template #footer class="dialog-footer">
      <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, ref} from "vue";
import {create, del, getById, getPage, update} from "@/api/system/config.js"
import {ElMessage, ElMessageBox} from "element-plus";
import MiDictLabel from "@/components/dict/MiDictLabel.vue";
import MiDictOption from "@/components/dict/MiDictOption.vue";

const queryRef = ref()
const formRef = ref()
const tableRef = ref()

const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10
})

const rules = {
  configName: [
    {required: true, message: "参数名称不能为空", trigger: "blur"},
  ],
  configType: [{required: true, message: "参数类型不能为空", trigger: "blur"},],
  configKey: [
    {required: true, message: "参数键名不能为空", trigger: "blur"},
    {pattern: /^[a-zA-Z][a-zA-Z0-9._-]*$/, message: "只能包含字母、数字、下划线、中划线、点，且字母开头", trigger: "blur"},
    {min: 2, max: 30, message: "长度 2 - 30 个字符", trigger: "blur"},
  ]
}

const formData = ref({})
const formDialog = reactive({
  title: null,
  open: false
})

const tableData = ref({
  list: [],
  total: 0
})
handleQuery()

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
      ElMessage.warning('请选择一条记录')
      return
    }
    id = id[0]
  }

  resetForm()
  getById(id).then(res => {
    formData.value = res.data
  }).then(() => {
    formDialog.open = true
    formDialog.title = "修改参数配置"
  })
}

function handleDelete(id) {
  if (id instanceof Event) {
    id = tableRef.value.getSelectionRows().map(it => it.id)
    if (id.length === 0) {
      ElMessage.warning('请选择至少一条记录')
      return
    }
  }

  ElMessageBox.confirm('确认执行删除操作吗?', '系统提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确认'
  })
      .then(() => {
        del(id).then(res => {
          ElMessage.success('操作成功')
          handleQuery()
        })
      })

}

function handleAdd() {
  resetForm()
  formDialog.open = true
  formDialog.title = "新增参数配置"
}

function resetForm() {
  formData.value = {
    username: null,
    password: null,
  }
}

function submitForm(formEl) {
  formEl.validate(valid => {
    if (valid) {
      if (formData.value.id != null) {
        update(formData.value).then(res => {
          ElMessage.success('操作成功')
          formDialog.open = false
          handleQuery()
        })
      } else {
        create(formData.value).then(res => {
          ElMessage.success('操作成功')
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