<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
      </div>
      <div class="layout-container-form-search">
        <el-button type="primary" class="search-btn" @click="handleImport">导入</el-button>
      </div>
    </div>
    <div class="layout-container-table">
      <Table ref="table" v-model:page="page" v-loading="loading" :showSelection="true" :data="tableData"
        @getTableData="getTableData" @selection-change="handleSelectionChange">
        <el-table-column prop="id" label="序号" align="center" width="80" />
        <el-table-column prop="prodImgUrl" label="产品主图" align="center">
          <template #default="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.prodImgUrl"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="prodName" label="产品名称" align="center" />
        <el-table-column prop="jumpType" label="跳转方式" align="center">
          <template #default="scope">
            {{ scope.row.jumpType === 2 ? '公众号链接' : 'PDF文件' }}
          </template>
        </el-table-column>>
        <el-table-column prop="prodCode" label="产品编码" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="产品二维码" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button type="text" @click="handleDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </Table>
      <Layer :layer="layer" @getTableData="getTableData(true)" v-if="layer.show" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { Page } from "@/components/table/type";
import { getProductList } from "@/api/product";
import { LayerInterface } from "@/components/layer/index.vue";
import Layer from "./layer.vue";
import Table from "@/components/table/index.vue";
import { Plus, Delete, Search } from '@element-plus/icons'
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
        const result: any = await getProductList(params);
        tableData.value = result?.page?.records
        page.total = Number(result?.page?.total);
        page.index = result?.page?.current;
        page.size = result?.page?.size;
      } catch (error) {
        tableData.value = [];
        page.index = 1;
        page.total = 0;
      } finally {
        loading.value = false;
      }
    }

    const handleDownload = (row: any) => {
      if (row.prodQrcodeUrl) {
        window.open(row.prodQrcodeUrl)
      }
    }
    // 新增弹窗功能
    const handleAdd = () => {
      layer.title = "新增产品";
      layer.show = true;
      delete layer.row;
    }
    // 编辑弹窗功能
    const handleEdit = (row: any) => {
      layer.title = "编辑产品";
      layer.row = row;
      layer.show = true;
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
      handleEdit,
      handleImport,
    };
  }
});
</script>

<style lang="scss" scoped>
.statusName {
  margin-right: 10px;
}
</style>
