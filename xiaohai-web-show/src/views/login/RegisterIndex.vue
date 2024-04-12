<template>
  <div class="register-container">
    <el-card class="registerPart">
      <el-form
        ref="formRef"
        :model="registerForm"
        :rules="registerRules"
        auto-complete="on"
        label-position="left"
      >
        <h2>注册</h2>
        <el-form-item prop="username" class="inputNew">
          <el-input
            ref="username"
            v-model="registerForm.username"
            placeholder="请输入用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          >
            <template #prefix>
              <svg-icon icon-class="user" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email" class="inputNew">
          <el-input
            ref="email"
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            name="email"
            type="text"
            tabindex="2"
            auto-complete="on"
          >
            <template #prefix>
              <svg-icon icon-class="email" />
            </template>
            <template #suffix>
              <el-link v-if="captchaEnabled" :underline="false" type="warning" @click="getCode"
                >发送验证码</el-link
              >
              <span v-else slot="suffix">{{ count }}s后重新获取</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code" class="inputNew">
          <el-input
            ref="code"
            v-model="registerForm.code"
            placeholder="请输入邮箱验证码"
            name="code"
            type="text"
            tabindex="3"
            auto-complete="on"
          >
            <template #prefix>
              <svg-icon icon-class="validCode" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" class="inputNew">
          <el-input
            ref="password"
            v-model="registerForm.password"
            name="password"
            show-password
            placeholder="密码"
            auto-complete="on"
            tabindex="4"
          >
            <template #prefix>
              <svg-icon icon-class="password" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword" class="inputNew">
          <el-input
            ref="confirmPassword"
            v-model="registerForm.confirmPassword"
            show-password
            placeholder="确认密码"
            auto-complete="on"
            tabindex="5"
            @keyup.enter.native="handleRegister"
          >
            <template #prefix>
              <svg-icon icon-class="password" />
            </template>
          </el-input>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleRegister"
        >
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
      </el-form>
      <div style="text-align: right; color: white">
        <router-link to="/login">
          <el-link type="warning">注册完成？去登录</el-link>
        </router-link>
      </div>
    </el-card>
    <!--引入粒子特效-->
    <vue-particles
      color="#fff"
      :particle-opacity="0.7"
      :particles-number="60"
      shape-type="circle"
      :particle-size="4"
      lines-color="#fff"
      :lines-width="1"
      :line-linked="true"
      :line-opacity="0.4"
      :lines-distance="150"
      :move-speed="2"
      :hover-effect="true"
      hover-mode="grab"
      :click-effect="true"
      click-mode="push"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register, sendEmailCode } from '@/api/auth'

const count = ref('')
const timer = ref<NodeJS.Timeout | null>(null)
const loading = ref(false)
const captchaEnabled = ref(true)

const formRef = ref()
const router = useRouter()

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  code: '',
  email: ''
})

// 验证是否相同
const equalToPassword = (rule: any, value: string, callback: any) => {
  if (registerForm.value.password !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 邮箱验证
const validateEmail = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请正确填写邮箱'))
  } else {
    if (value !== '') {
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!reg.test(value)) {
        callback(new Error('请输入有效的邮箱'))
      }
    }
    callback()
  }
}

// 获取邮箱验证码
const getCode = () => {
  formRef.value.validateField('email', (val: boolean) => {
    if (!val) {
      return
    }
    const formData = new FormData()
    formData.append('email', registerForm.value.email)
    sendEmailCode(formData).then(() => {})
    const TIME_COUNT = 60
    if (!timer.value) {
      count.value = TIME_COUNT.toString()
      captchaEnabled.value = false
      timer.value = setInterval(() => {
        if (Number(count.value) > 0 && Number(count.value) <= TIME_COUNT) {
          count.value = (Number(count.value) - 1).toString()
        } else {
          captchaEnabled.value = true
          clearInterval(timer.value!)
          timer.value = null
        }
      }, 1000)
    }
  })
}

// 表单验证规则
const registerRules = ref({
  username: [
    { required: true, trigger: 'blur', message: '请输入您的账号' },
    { min: 2, max: 20, message: '用户账号长度必须介于 2 和 20 之间', trigger: 'blur' }
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入您的密码' },
    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: '请再次输入您的密码' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ],
  code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
  email: [{ validator: validateEmail, trigger: 'blur' }]
})

// 注册
const handleRegister = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    loading.value = true
    register(registerForm.value)
      .then(() => {
        router.push('/login')
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  })
}
</script>

<style lang="scss" scoped>
.register-container {
  background-size: cover;
  min-height: 100%;
  max-height: 100%;
  width: 100%;
  overflow: hidden;
}

.registerPart {
  position: absolute; /*定位方式绝对定位absolute*/
  top: 50%;
  left: 50%; /*顶和高同时设置50%实现的是同时水平垂直居中效果*/
  transform: translate(-50%, 10%); /*实现块元素百分比下居中*/
  width: 500px;
  padding: 0 50px;
  box-sizing: border-box; /*box-sizing设置盒子模型的解析模式为怪异盒模型，将border和padding划归到width范围内*/
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3); /*边框阴影  水平阴影0 垂直阴影15px 模糊25px 颜色黑色透明度0.5*/
  border-radius: 6px; /*边框圆角，四个角均为6px*/
}

.registerPart h2 {
  margin: 0 0 30px;
  padding: 0;
  text-align: center; /*文字居中*/
}

::v-deep .inputNew .el-input__inner {
  width: 100%;
  font-size: 16px;
  letter-spacing: 1px; /*字符间的间距1px*/

  margin: 3px;
  border: none;
  outline: none; /*outline用于绘制元素周围的线 outline：none在这里用途是将输入框的边框的线条使其消失*/
  background: transparent !important;
}
</style>
