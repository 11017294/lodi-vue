<template>
  <el-card class="box-card footer-wrap" shadow="hover">
    <div class="menus-item">
      <router-link class="menu-btn" to="/"> 首页</router-link>
    </div>
    <el-divider direction="vertical" />
    <div class="menus-item">
      <router-link class="menu-btn" to="/category"> 分类</router-link>
    </div>
    <el-divider direction="vertical" />
    <div class="menus-item">
      <router-link class="menu-btn" to="/tags"> 标签</router-link>
    </div>
    <el-divider direction="vertical" />
    <div class="menus-item">
      <router-link class="menu-btn" to="/back"> 归档</router-link>
    </div>
    <el-divider direction="vertical" />
    <div class="menus-item">
      <router-link class="menu-btn" to="/message"> 留言</router-link>
    </div>
    <el-divider direction="vertical" />
    <div class="menus-item">
      <router-link class="menu-btn" to="/about"> 关于</router-link>
    </div>
    <el-divider direction="vertical" />
    <div class="menus-item">
      <router-link class="menu-btn" to="/navigate"> 导航</router-link>
    </div>
    <div>©{{ 2023 }} - {{ new Date().getFullYear() }} By Lodi</div>
    <a href="https://beian.miit.gov.cn/" target="_blank">
      <!--        {{blogInfo.webSite.recordNum}}-->
    </a>
  </el-card>
</template>

<script>
export default {
  computed: {
    isMessage() {
      return this.$route.path === '/message'
    },
    blogInfo() {
      return this.$store.state.blogInfo
    }
  }
}
</script>

<style scoped>
/*阴影展示*/
/*.box-card:hover {*/
/*  filter: drop-shadow(0 0 2em #646cffaa);*/
/*}*/

.footer-wrap {
  border-radius: 0;
  border: 1px solid transparent;
  margin-top: auto;
  /* 模糊大小就是靠的blur这个函数中的数值大小 */
  backdrop-filter: blur(5px);
  line-height: 2;
  position: relative;
  padding: 40px 20px;
  /*color: #eee;*/
  font-size: 14px;
  text-align: center;
  /*background: linear-gradient(-45deg, #ee7752, #ce3e75, #23a6d5, #23d5ab);*/
  background-size: 400% 400%;
  animation: Gradient 10s ease infinite;
}

@keyframes Gradient {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
.menus-item {
  position: relative;
  display: inline-block;
}
.menus-item a {
  display: block;
  color: var(--color);
  text-align: center;
  text-decoration: none;
}
</style>
