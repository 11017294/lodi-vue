<template>
  <div class="login-container">
    <div class="loginPart">
      <el-form label-position="left" ref="formRef" :model="loginForm" :rules="rules">
        <h2>登 录</h2>
        <el-form-item prop="username" class="inputNew">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名/邮箱 "
            name="username"
            type="text"
          >
            <template #prefix>
              <svg-icon icon-class="user" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password" class="inputNew">
          <el-input
            ref="password"
            v-model="loginForm.password"
            show-password
            placeholder="请输入密码"
            name="password"
            @keyup.enter.native="handleLogin"
          >
            <template #prefix>
              <svg-icon icon-class="password" />
            </template>
          </el-input>
        </el-form-item>

        <!--        <div style="margin-bottom: 10px; margin-left: 2px">
          <el-tooltip class="item" effect="dark" content="7天有效" placement="right">
            <el-checkbox v-model="loginForm.rememberMe">
              <span style="color: #000000">记住我</span>
            </el-checkbox>
          </el-tooltip>
        </div>-->
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form>
      <div style="text-align: right; color: white">
        <router-link to="/register">
          <el-link type="warning">没有账号？去注册</el-link>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '@/store'

const store = useStore()

const loginForm = ref({
  username: '',
  password: '',
  loginType: 'password',
  rememberMe: false
})

const router = useRouter()

const loading = ref(false)
const redirect = ref(router.currentRoute.value.query)
const show = ref()
const formRef = ref()

// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入您的用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入您的密码', trigger: 'blur' }]
}

// 登录函数
const handleLogin = async () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    loading.value = true
    store
      .login(loginForm.value)
      .then(() => {
        if (show.value) {
          window.open(show.value, '_self')
        } else {
          router.push({ path: redirect.value.show || '/' })
        }
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
    loading.value = false
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  background-size: cover;
  min-height: 100%;
  max-height: 100%;
  width: 100%;
  overflow: hidden;
}

.loginPart {
  position: absolute;
  /*定位方式绝对定位absolute*/
  top: 50%;
  left: 50%;
  /*顶和高同时设置50%实现的是同时水平垂直居中效果*/
  transform: translate(-50%, 30%);
  /*实现块元素百分比下居中*/
  width: 500px;
  padding: 30px;
  background: #ffffff;
  /*背景颜色为黑色，透明度为0.8*/
  box-sizing: border-box;
  /*box-sizing设置盒子模型的解析模式为怪异盒模型，
  将border和padding划归到width范围内*/
  box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.3);
  /*边框阴影  水平阴影0 垂直阴影15px 模糊25px 颜色黑色透明度0.5*/
  border-radius: 15px;
  /*边框圆角，四个角均为15px*/
}

.loginPart h2 {
  margin: 0 0 40px;
  padding: 0;
  color: #000000;
  text-align: center;
  /*文字居中*/
}

::v-deep .inputNew .el-input__inner {
  width: 100%;
  font-size: 16px;
  color: #000000 !important;
  letter-spacing: 1px;
  /*字符间的间距1px*/
  margin: 3px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  /*outline用于绘制元素周围的线
  outline：none在这里用途是将输入框的边框的线条使其消失*/
  background: transparent !important;
  /*背景颜色为透明*/
}
</style>
