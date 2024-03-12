<template>

  <el-space direction="vertical" :fill="true" style="width: 100%">
    <div></div>
    <el-form ref="queryRef" :model="queryParams" :inline="true" class="fix-form-inline">
      <el-form-item label="菜单类型" prop="menuType">
        <el-select v-model="queryParams.menuType" placeholder="选择菜单类型" clearable>
          <MiDictOption dict-type="system.menu.type"/>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单标题" prop="menuTitle">
        <el-input v-model="queryParams.menuTitle"
                  placeholder="请输入菜单标题"
                  clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="queryParams.menuName"
                  placeholder="请输入菜单名称"
                  clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="组件路径" prop="component">
        <el-input v-model="queryParams.component"
                  placeholder="请输入组件路径"
                  clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="路由路径" prop="path">
        <el-input v-model="queryParams.path"
                  placeholder="请输入路由路径"
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

    <el-table ref="tableRef" :data="tableData" style="width: 100%;" :border="true" row-key="id">
      <el-table-column type="selection"></el-table-column>
      <el-table-column fixed prop="id" label="id"/>
      <el-table-column prop="menuTitle" label="菜单标题"/>
      <el-table-column prop="menuName" label="菜单名称"/>
      <el-table-column prop="menuType" label="菜单类型">
        <template #default="scope">
          <MiDictLabel dict-type="system.menu.type" :dict-value="scope.row.menuType"/>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="显示排序"/>
      <el-table-column prop="component" label="组件路径"/>
      <el-table-column prop="path" label="路由地址"/>
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

  </el-space>

  <el-dialog :title="formDialog.title" v-model="formDialog.open" width="500px" append-to-body
             :close-on-click-modal="false">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="父级菜单" prop="parentId">
        <el-tree-select v-model="formData.parentId" :data="menuTreeData" :props="{value:'id', label:'menuTitle'}"
                        check-strictly/>
      </el-form-item>
      <el-form-item label="菜单标题" prop="menuTitle">
        <el-input v-model="formData.menuTitle" placeholder="请输入菜单标题"/>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="formData.menuName" placeholder="请输入菜单名称"/>
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-select v-model="formData.menuType" placeholder="选择菜单类型" clearable>
          <MiDictOption dict-type="system.menu.type"/>
        </el-select>
      </el-form-item>
      <el-form-item label="组件路径" prop="component" v-if="formData.menuType === 'C'">
        <el-input v-model="formData.component" placeholder="请输入组件路径"/>
      </el-form-item>
      <el-form-item label="路由路径" prop="path" v-if="formData.menuType === 'C' || formData.menuType === 'M'">
        <el-input v-model="formData.path" placeholder="请输入路由路径"/>
      </el-form-item>

      <el-form-item label="显示排序" prop="orderNum">
        <el-input v-model="formData.orderNum" type="number" placeholder="请输入显示排序"/>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-switch v-model="formData.status" placeholder="请选择状态"
                   active-text="启用"
                   inactive-text="停用" inline-prompt active-value="0" inactive-value="1"/>
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
import {create, del, getTree, getById, update} from "@/api/system/menu.js"
import {ElMessage, ElMessageBox} from "element-plus";
import MiDictLabel from '@/components/dict/MiDictLabel.vue'
import MiDictOption from "@/components/dict/MiDictOption.vue";

const queryRef = ref()
const formRef = ref()
const tableRef = ref()

const queryParams = reactive({})

const rules = {
  parentId: [
    {required: true, message: "父级菜单不能为空", trigger: "blur"},
  ],
  menuTitle: [
    {required: true, message: "菜单标题不能为空", trigger: "blur"},
  ],
  menuName: [
    {required: true, message: "菜单名称不能为空", trigger: "blur"},
    {pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/, message: "名称只能包含字母、数字、下划线、中划线，且字母开头", trigger: "blur"},
    {min: 2, max: 30, message: "长度 2 - 30 个字符", trigger: "blur"},
  ],
  menuType: [
    {required: true, message: "菜单类型不能为空", trigger: "blur"},
  ],
}

const formData = ref({})
const formDialog = reactive({
  title: null,
  open: false
})
// 创建或修改菜单的父级菜单下拉数据
const menuTreeData = ref([])

const tableData = ref([])
handleQuery()

// ---------------------- Functions ---------------------------

function handleQuery() {
  getTree(queryParams).then(res => {
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
    formDialog.title = "修改菜单"
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
  formDialog.title = "新增菜单"
}

function resetForm() {
  formData.value = {
    orderNum: 0,
    status: '0'
  }
  getTree().then(res => {
    menuTreeData.value = [{
      id: -1,
      menuTitle: '根节点',
      children: res.data
    }]
  })
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