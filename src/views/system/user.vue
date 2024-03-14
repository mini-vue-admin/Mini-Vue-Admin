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

        <el-form-item label="部门" prop="deptId">
          <el-tree-select v-model="queryParams.deptId" :data="deptTreeData" :props="{value:'id', label:'deptName'}"
                          placeholder="请选择部门"
                          check-strictly
                          clearable
                          @change="handleQuery"/>
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

      <el-table ref="tableRef" :data="tableData.list" :border="true">
        <el-table-column type="selection"></el-table-column>
        <el-table-column fixed prop="id" label="id"/>
        <el-table-column prop="username" label="用户名"/>
        <el-table-column prop="nickname" label="昵称"/>
        <el-table-column prop="deptId" label="部门">
          <template #default="scope">
            {{ deptListData.find(it => it.id === scope.row.deptId)?.deptName }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱"/>
        <el-table-column prop="phonenumber" label="手机号码"/>
        <el-table-column prop="sex" label="性别">
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
            <el-button link type="primary" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
            <el-button link type="primary" size="small" @click="handleResetPwd(scope.row.id)">重置密码</el-button>
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
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" placeholder="请输入昵称"/>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-tree-select v-model="formData.deptId" :data="deptTreeData" :props="{value:'id', label:'deptName'}"
                        placeholder="请选择部门"
                        check-strictly
                        clearable/>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="formData.sex" placeholder="请选择性别">
          <MiDictSelect dict-type="system.user.sex"/>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="密码" prop="password" v-if="formData.id == null">-->
<!--        <el-input v-model="formData.password" placeholder="请输入密码"/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="确认密码" prop="confirmPassword" v-if="formData.id == null">-->
<!--        <el-input v-model="formData.confirmPassword" placeholder="请输入确认密码"/>-->
<!--      </el-form-item>-->

      <el-form-item label="手机号" prop="phonenumber">
        <el-input v-model="formData.phonenumber" placeholder="请输入手机号"/>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱"/>
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
import {create, del, getPage, getById, update, resetPwd} from "@/api/system/user.js"
import {ElMessage, ElMessageBox} from "element-plus";
import MiDictLabel from "@/components/dict/MiDictLabel.vue";
import {getTree} from "@/api/system/dept.js";
import MiDictSelect from "@/components/dict/MiDictOption.vue";
import {flat} from "@/api/utils.js";

const queryRef = ref(null)
const formRef = ref()
const tableRef = ref()

const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10
})

const rules = {
  username: [
    {required: true, message: "用户名不能为空", trigger: "blur"},
    {pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/, message: "名称只能包含字母、数字、下划线、中划线，且字母开头", trigger: "blur"},
    {min: 2, max: 30, message: "长度 2 - 30 个字符", trigger: "blur"},
  ],
  nickname: [
    {required: true, message: "昵称不能为空", trigger: "blur"},
  ],
  password: [
    {required: true, message: "密码不能为空", trigger: "blur"},
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
const deptTreeData = ref([])
const deptListData = ref([])

handleQuery()
getTree({parentId: -1}).then(res => {
  deptTreeData.value = res.data
  deptListData.value = flat(res.data)
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
    formDialog.title = "修改用户"
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

function handleResetPwd(id) {
  ElMessageBox.confirm('确认执行重置密码操作吗?', '系统提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确认'
  })
      .then(() => {
        resetPwd(id).then(res => {
          ElMessage.success('操作成功')
        })
      })
}

function handleAdd() {
  resetForm()
  formDialog.open = true
  formDialog.title = "新增用户"
}

function resetForm() {
  formData.value = {
    status: '0',
    sex: 'U'
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
