<template>

  <el-space direction="vertical" :fill="true" style="width: 100%">
    <div></div>
    <el-form ref="queryRef" :model="queryParams" :inline="true" class="fix-form-inline">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="queryParams.username"
                  placeholder="请输入用户名"
                  clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="queryParams.nickname"
                  placeholder="请输入用户昵称"
                  clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="手机号" prop="phonenumber">
        <el-input v-model="queryParams.phonenumber"
                  placeholder="请输入手机号"
                  clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="queryParams.email"
                  placeholder="请输入邮箱"
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
        <el-button type="primary" @click="handleAdd">添加成员</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="danger" @click="handleDelete">移除成员</el-button>
      </el-col>
    </el-row>

    <el-table ref="tableRef" :data="tableData.list" :border="true">
      <el-table-column type="selection"></el-table-column>
      <el-table-column fixed prop="id" label="id"/>
      <el-table-column prop="deptId" label="部门">
        <template #default="scope">
          {{ deptListData.find(it => it.id === scope.row.deptId)?.deptName }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="nickname" label="昵称"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="phonenumber" label="手机号码"/>
      <el-table-column prop="sex" label="状态">
        <template #default="scope">
          <MiDictLabel :dictValue="scope.row.sex" dictType="system.user.sex"/>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <MiDictLabel :dictValue="scope.row.status" dictType="common.status"/>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button link type="danger" size="small" @click="handleDelete(scope.row.id)">移除成员</el-button>
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

  <el-dialog v-model="formDialog.open" width="800px" append-to-body
             :close-on-click-modal="false" @opened="resetForm">
    <template #header>
      <el-form ref="availableUserFormRef" :inline="true" :model="availableUserQueryParams" @submit.native.prevent>
        <el-form-item>
          <h3>{{ formDialog.title }}</h3>
        </el-form-item>
        <el-form-item>
          <el-input v-model="availableUserQueryParams.params.keyWord" style="width: 300px;"
                    placeholder="用户名、昵称、手机号、邮箱"
                    clearable
                    @keyup.enter.native="handleQueryAvailableUser"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="Search" @click="handleQueryAvailableUser"></el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table ref="availableUserTableRef" :data="availableUserData.list" :border="true">
      <el-table-column type="selection"></el-table-column>
      <el-table-column fixed prop="id" label="id"/>
      <el-table-column prop="deptId" label="部门">
        <template #default="scope">
          {{ deptListData.find(it => it.id === scope.row.deptId)?.deptName }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名"/>
      <el-table-column prop="nickname" label="昵称"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="phonenumber" label="手机号码"/>
    </el-table>

    <div style="display: flex; align-items: center; justify-content: flex-end; ">
      <span>总条数: {{ availableUserData.total }}</span>
      <el-pagination background layout="->, prev, pager, next, sizes"
                     :total="availableUserData.total"
                     v-model:page-size="availableUserQueryParams.pageSize"
                     v-model:current-page="availableUserQueryParams.pageIndex"
                     :page-sizes="[10, 20, 50, 100]"
                     @change="handleQuery"
                     style="padding-top: 5px"/>
    </div>
    <template #footer class="dialog-footer">
      <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
      <el-button @click="cancelForm">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, ref, unref} from "vue";
import {create, getPage, update} from "@/api/system/user.js"
import {ElMessage, ElMessageBox} from "element-plus";
import MiDictLabel from "@/components/dict/MiDictLabel.vue";
import {addMember, delMember, getTree} from "@/api/system/dept.js";
import {flat, flatQuery} from "@/api/utils.js";
import {useRoute} from "vue-router";

const queryRef = ref()
const formRef = ref()
const tableRef = ref()
const availableUserFormRef = ref()
const availableUserTableRef = ref()

const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10
})

const formData = ref({})
const formDialog = reactive({
  title: null,
  open: false
})

const tableData = ref({
  list: [],
  total: 0
})
const deptListData = ref([])

const route = useRoute()
queryParams.deptId = route.params.id

handleQuery()
getTree({parentId: -1}).then(res => {
  deptListData.value = flat(res.data)
})

const availableUserQueryParams = reactive({
  pageIndex: 1,
  pageSize: 10,
  params: {
    keyWord: null,
    disDeptId: route.params.id
  }
})
const availableUserData = ref({
  list: [],
  total: 0
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


function handleDelete(id) {
  if (id instanceof Event) {
    id = tableRef.value.getSelectionRows().map(it => it.id)
    if (id.length === 0) {
      ElMessage.warning('请选择至少一条记录')
      return
    }
  }

  ElMessageBox.confirm('确认执行移除成员操作吗?', '系统提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确认'
  })
      .then(() => {
        delMember(queryParams.deptId, id).then(res => {
          ElMessage.success('操作成功')
          handleQuery()
        })
      })
}


function handleAdd() {
  formDialog.open = true
  formDialog.title = "添加部门成员"
}

function handleQueryAvailableUser() {
  getPage(flatQuery(availableUserQueryParams)).then(res => {
    availableUserData.value = res.data
  })
}

function resetForm() {
  const form = unref(availableUserFormRef)
  form.resetFields()
  handleQueryAvailableUser()
}


function submitForm(formEl) {
  const id = availableUserTableRef.value.getSelectionRows().map(it => it.id)
  if (!id || id.length === 0) {
    ElMessage.warning('请选择至少一条记录')
    return
  }
  addMember(queryParams.deptId, id).then(() => {
    formDialog.open = false
    handleQuery()
  })
}

function cancelForm() {
  formDialog.open = false
}

</script>

<style scoped>
</style>