<template>
  <!--左内容区-->
  <el-col :lg="14" :xl="11">
    <h1 class="flex-center"><svg-icon icon-class="time-dark"></svg-icon> 归档</h1>
    <el-card class="box-card" shadow="hover">
      <el-timeline>
        <el-timeline-item
          v-for="article in dataList"
          :key="article"
          :timestamp="article.createTime.split(' ')[0]"
          placement="top"
        >
          <el-card class="box-card">
            <el-link :underline="false" @click="getArticleId(article.id)">
              <h2>{{ article.title }}</h2>
            </el-link>

            <span style="display: flex; align-items: center; flex-direction: row-reverse">
              <el-space size="small">
                <el-avatar size="small" :src="image(article.avatar)" />
                <span v-if="article.nickname" class="text-xs">{{ article.nickname }}</span>
                <span v-else class="text-xs">{{ article.username }}</span>
              </el-space>
            </span>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-pagination
        style="justify-content: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="queryParams.pageSize"
        layout="prev, pager, next"
        :total="total"
      />
    </el-card>
  </el-col>
  <!--右内容区-->
  <el-col class="hidden-md-and-down" :lg="6" :xl="5">
    <RightSide></RightSide>
  </el-col>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import RightSide from '@/components/layouts/RightSide.vue'
import { listBack } from '@/api/show'
import { image } from '@/utils/publicMethods'

const router = useRouter()
// 展示归档列表
const dataList: any = ref([])
// 总数
const total = ref()

const data = reactive({
  queryParams: {
    currentPage: 1,
    pageSize: 10
  }
})

const { queryParams } = toRefs(data)

/** 查询归档列表 */
function getList() {
  listBack(queryParams.value).then((response) => {
    dataList.value = response.data.records
    total.value = response.data.total
  })
}

// 页面跳转
function getArticleId(id: any) {
  router.push({ path: `/article/${id}` })
}

const handleSizeChange = (val: number) => {
  queryParams.value.currentPage = val
  getList()
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val: number) => {
  queryParams.value.currentPage = val
  getList()
  console.log(`current page: ${val}`)
}

getList()
</script>

<style scoped>
.box-card {
  padding: 0;
  border-radius: 10px;
  border: 1px solid transparent;
}
</style>
