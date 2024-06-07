<template>
  <div id="login-container">
    <div class="login-background"></div>
    <el-card class="login-card" shadow="always">
      <div class="login-title">
        <img style="height: 48px;" src="@/assets/logo.svg" alt="Kitty Chat">
        Login Mini Vue
      </div>
      <el-form :model="loginForm" status-icon @submit.native.prevent="onSubmit" @keyup.enter="onSubmit">
        <el-form-item label="Username">
          <el-input v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>

          <el-button type="primary" style="margin:0 auto;" @click="onSubmit">登录</el-button>

        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<script setup>
import {login} from "@/api/login.js";
import {setToken, setUser} from "@/api/token.js";
import router from "@/router/index.js";
import {getSelf} from "@/api/system/user.js";
import {reactive} from "vue";

const loginForm = reactive({
  username: '',
  password: ''
});

const onSubmit = () => {

  login(loginForm).then(res => {
    const token = res.data.access_token;
    setToken(token)
    getSelf().then(res => {
      setUser(res.data)
    }).then(() => {
      router.push({path: '/'})
    })
  })
}
</script>


<style scoped>
#login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.18); /* 背景半透明，以便看到背景图片 */
}

.login-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.login-card {
  width: 30%;
  max-width: 350px;
  margin: auto;
  padding: 20px;
}

.login-title {
  margin-bottom: 20px;
  color: #409eff;
  font-size: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-card {
    width: 90%;
  }
}
</style>
