<template>

  <el-space direction="vertical" :fill="true" style="width: 100%">
    <div></div>
    <el-form ref="queryRef" :model="queryParams" :inline="true" class="fix-form-inline">

      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="queryParams.deptName"
                  placeholder="请输入部门名称"
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
      <el-table-column prop="deptName" label="部门名称"/>
      <el-table-column prop="leader" label="负责人"/>
      <el-table-column prop="phone" label="联系电话"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="orderNum" label="显示排序"/>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <MiDictLabel :dictValue="scope.row.status" dictType="common.status"/>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleAdd(scope.row.id)">新增</el-button>
          <el-button link type="primary" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
          <el-button link type="primary" size="small" @click="handleMember(scope.row.id)">成员</el-button>
          <el-button link type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-space>

  <el-dialog :title="formDialog.title" v-model="formDialog.open" width="500px" append-to-body
             :close-on-click-modal="false">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="父级部门" prop="parentId">
        <el-tree-select v-model="formData.parentId" :data="deptTreeData" :props="{value:'id', label:'deptName'}"
                        check-strictly/>
      </el-form-item>

      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="formData.deptName" placeholder="请输入部门名称"/>
      </el-form-item>
      <el-form-item label="负责人" prop="leader">
        <el-input v-model="formData.leader" placeholder="请输入负责人"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入联系电话"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱"/>
      </el-form-item>

      <el-form-item label="显示排序" prop="orderNum">
        <el-input v-model="formData.orderNum" type="number" placeholder="请输入显示排序"/>
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
import {reactive, ref} from "vue";
import {create, del, getTree, getById, update} from "@/api/system/dept.js"
import {ElMessage, ElMessageBox} from "element-plus";
import MiDictLabel from '@/components/dict/MiDictLabel.vue'
import MiDictOption from "@/components/dict/MiDictOption.vue";
import {useRouter} from "vue-router";
import router from "@/router/index.js";

const queryRef = ref()
const formRef = ref()
const tableRef = ref()

const queryParams = reactive({})

const rules = {
  parentId: [{required: true, message: "父级部门不能为空", trigger: "blur"},],
  deptName: [
    {required: true, message: "部门名称不能为空", trigger: "blur"},
    {min: 2, max: 30, message: "长度 2 - 30 个字符", trigger: "blur"},
  ],
}

const formData = ref({})
const formDialog = reactive({
  title: null,
  open: false
})
// 创建或修改部门的父级部门下拉数据
const deptTreeData = ref([])

const tableData = ref([])
handleQuery()

// ---------------------- Functions ---------------------------

function handleQuery() {
  if (!queryParams.deptName) {
    queryParams.parentId = -1
  } else {
    queryParams.parentId = null
  }

  getTree(queryParams).then(res => {
    tableData.value = res.data
  });
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
    formDialog.title = "修改部门"
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

function handleAdd(id) {
  resetForm(id)
  formDialog.open = true
  formDialog.title = "新增部门"
}

function handleMember(id) {
  router.push('/system/dept/member/' + id)
}

function resetForm(id) {
  formData.value = {
    parentId: (id instanceof Event) ? null : id,
    orderNum: 0,
    status: '0'
  }
  getTree({parentId: -1}).then(res => {
    deptTreeData.value = [{
      id: -1,
      deptName: '根节点',
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

<style scoped>
</style>