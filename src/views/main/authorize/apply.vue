<template>
  <div class="layout-container-form flex space-between">
    <div class="layout-container-form-handle">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
      <div class="search">
        <el-input
          style="width: 200px"
          v-model="query.name"
          placeholder="请输入姓名或电话号码查询"
        ></el-input>
        <el-button
          type="primary"
          :icon="Search"
          class="search-btn"
          @click="getTableData(true)"
          >查询</el-button
        >
      </div>
    </div>
    <div class="layout-container-form-search">
      <el-button type="primary" class="search-btn" @click="handleImport">导入</el-button>
    </div>
  </div>
  <div class="layout-container-table">
    <Table ref="table" v-model:page="page" v-loading="loading" :showSelection="true" :data="tableData"
      @getTableData="getTableData" @selection-change="handleSelectionChange">
      <el-table-column prop="id" label="序号" align="center" width="180" />
      <el-table-column prop="compName" label="公司名称" align="center" width="180" />
      <el-table-column prop="userName" label="联系人姓名" align="center" width="180" />
      <el-table-column prop="phone" label="联系电话" align="center" width="180" />
      <el-table-column prop="projectName" label="项目名称" align="center" width="180" />
      <el-table-column prop="projectAddr" label="项目地址" align="center" width="180" />
      <el-table-column prop="useTypeName" label="应用" align="center" width="180" />
      <el-table-column prop="projectScale" label="规模（万）" align="center" width="180" />
      <el-table-column prop="colourName" label="产品型号（颜色）" align="center" width="180" />
      <el-table-column prop="projectStageName" label="项目阶段" align="center" width="180" />
      <el-table-column prop="constructionInfo" label="业主/设施/施工信息" align="center" width="180" />
      <el-table-column prop="serviceContent" label="项目服务内容" align="center" width="180" />
      <el-table-column prop="authorizeStartDate" label="申请授权开始日期" align="center" width="180" />
      <el-table-column prop="createTime" label="申请时间" align="center" width="180" />
      <el-table-column label="操作" align="center" fixed="right" width="180" >
        <template #default="scope">
          <el-button @click="handlePass(scope.row)">审核通过</el-button>
        </template>
      </el-table-column>
    </Table>
    <Layer :layer="layer" v-if="layer.show" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { Page } from "@/components/table/type";
import { getAuthorizeList, pass } from "@/api/authorize";
import { LayerInterface } from "@/components/layer/index.vue";
import Layer from "./layer.vue";
import Table from "@/components/table/index.vue";
import { Plus, Delete, Search } from '@element-plus/icons'
import { ElMessage } from 'element-plus'
export default defineComponent({
  components: {
    Table,
    Layer,
  },
  setup() {
    // 存储搜索用的数据
    const query = reactive({
      name: "",
    });
    // 弹窗控制器
    const layer: LayerInterface = reactive({
      show: false,
      title: "新增",
      showButton: true,
      width: '600px'
    });
    // 分页参数, 供table使用
    const page: Page = reactive({
      index: 1,
      size: 20,
      total: 0,
    });
    const loading = ref(true);
    const tableData = ref([]);
    const chooseData = ref([]);
    const handleSelectionChange = (val: []) => {
      chooseData.value = val;
    };
    // 获取表格数据
    // params <init> Boolean ，默认为false，用于判断是否需要初始化分页
    const getTableData = async (init: Boolean) => {
      loading.value = true
      if (init) {
        page.index = 1
      }
      let params = {
        current: page.index,
        size: page.size,
        ...query
      }
      try {
        const result: any = await getAuthorizeList(params);
        tableData.value = result?.page?.records
        page.total = Number(result?.page?.total);
        page.index = result?.page?.current;
        page.total = result?.page?.size;
      } catch (error) {
        tableData.value = [];
        page.index = 1;
        page.total = 0;
      } finally {
        loading.value = false;
      }
    }

    const handleDownload = (row: any) => {
      console.log(row.prodQrcodeUrl);
    }
    // 新增弹窗功能
    const handleAdd = () => {
      layer.title = "新增授权";
      layer.show = true;
      delete layer.row;
    }
    
    const handlePass = async (row: any) => {
      try {
        await pass({id: row.id, state: 1});
        ElMessage({
          type: 'success',
          message: '操作成功'
        })
      } catch (error) {
        ElMessage({
          type: 'error',
          message: String(error)
        })
      } finally {
        getTableData(false);
      }
    }
    const handleImport = () => {
    }
    getTableData(true)
    return {
      Plus,
      Delete,
      Search,
      query,
      tableData,
      chooseData,
      loading,
      page,
      layer,
      handleSelectionChange,
      getTableData,
      handleDownload,
      handleAdd,
      handlePass,
      handleImport,
    };
  }
});
</script>

<style lang="scss" scoped>
.statusName {
  margin-right: 10px;
}
.search{
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2px;
  margin-left: 20px;
}
</style>
