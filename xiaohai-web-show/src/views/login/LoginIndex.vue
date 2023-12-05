<template>
  <div class="login-container">
    <div class="loginPart">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        auto-complete="on"
        label-position="left"
      >
        <h2>登 录</h2>
        <el-form-item prop="username" class="inputNew">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名/邮箱 "
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

        <el-form-item prop="password" class="inputNew">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          >
            <template #prefix>
              <svg-icon icon-class="password" />
            </template>
            <template #suffix>
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                @click="showPwd"
              />
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
        <el-link type="warning" @click="registerClick()">没有账号？去注册</el-link>
      </div>
    </div>
  </div>
</template>

<script>
import useStore from '@/store/index.ts'

const store = useStore()

export default {
  name: 'LoginIndex',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
        loginType: 'password',
        rememberMe: false
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入您的用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      show: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
    this.getCookie()
  },
  methods: {
    // 跳转注册
    registerClick() {
      this.$router.push('/register')
    },
    getCode() {
      // getCodeImg().then(res => {
      //   this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
      //   if (this.captchaEnabled) {
      //     this.codeUrl = "data:image/gif;base64," + res.img;
      //     this.loginForm.uuid = res.uuid;
      //   }
      // });
    },
    getCookie() {
      // const username = Cookies.get("username");
      // const password = Cookies.get("password");
      // const rememberMe = Cookies.get('rememberMe')
      // this.loginForm = {
      //   username: username === undefined ? this.loginForm.username : username,
      //   password: password === undefined ? this.loginForm.password : decrypt(password),
      //   rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      // };
    },
    // 是否显示输入内容
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        store
          .login(this.loginForm)
          .then((res) => {
            this.show = this.$route.query.show
            if (this.show) {
              window.open(this.show, '_self')
            } else {
              this.$router.push({ path: this.redirect || '/' })
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      })
    }
  }
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
