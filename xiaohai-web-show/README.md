# Vue 3 + TypeScript + Vite + ElementPlus

```
  ├── publish/
  └── src/
  ├── assets/                    // 静态资源目录
  ├── common/                    // 通用类库目录
  ├── components/                // 公共组件目录
  ├── router/                    // 路由配置目录
  ├── store/                     // 状态管理目录
  ├── style/                     // 通用 CSS 目录
  ├── utils/                     // 工具函数目录
  ├── views/                     // 页面组件目录
  ├── App.vue
  ├── main.ts
  ├── shims-vue.d.ts
  ├── tests/                         // 单元测试目录
  ├── index.html
  ├── tsconfig.json                  // TypeScript 配置文件
  ├── vite.config.ts                 // Vite 配置文件
  └── package.json
```

# 格式化所有文件（. 表示所有文件）

npx prettier --write .

图标组件
vite-plugin-svg-icons
## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

```bash

# 进入项目目录
cd xiaohai-web-show

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```
