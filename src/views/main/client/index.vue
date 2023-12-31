<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <div class="search">
          <el-input style="width: 200px" v-model="query.name" placeholder="请输入姓名或电话号码查询"></el-input>
          <el-button type="primary" :icon="Search" class="search-btn" @click="getTableData(true)">查询</el-button>
        </div>
      </div>
      <div class="layout-container-form-search">
        <el-button type="primary" class="search-btn" @click="handleImport">导入</el-button>
      </div>
    </div>
    <div class="layout-container-table">
      <Table ref="table" v-model:page="page" v-loading="loading" :showSelection="true" :data="tableData"
        @getTableData="getTableData" @selection-change="handleSelectionChange">
        <el-table-column prop="id" label="序号" align="center" width="80" />
        <el-table-column prop="custName" label="客户姓名" align="center" />
        <el-table-column prop="custPhone" label="联系电话" align="center" />
        <el-table-column prop="custAddr" label="地址" align="center" />
        <el-table-column prop="prodName" label="使用产品" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="质保卡" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button :disabled="!scope.row.qualityAssuranceCard" type="text"
              @click="handleDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button type="text" @click="handleEdit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </Table>
      <Layer :layer="layer" v-if="layer.show" @getTableData="getTableData(true)" />
      <el-dialog v-model="visible" title="导入数据" width="30%">
        <el-upload class="upload-demo" drag :before-upload="beforeUpload" action="" :auto-upload="true" :limit="1"
          :show-file-list="false" accept="xlsx/*" ref="uploadDom" :http-request="handleFileUpload">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖拽文件至此处或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              .xlsx/.xls格式文件,文件大小小于2M
            </div>
          </template>
        </el-upload>
        <el-button type="text" @click="handleDownloadFile">点击此处下载模版文件</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { Page } from "@/components/table/type";
import { getClientList } from "@/api/client";
import { LayerInterface } from "@/components/layer/index.vue";
import Layer from "./layer.vue";
import Table from "@/components/table/index.vue";
import { Plus, Delete, Search } from '@element-plus/icons'
import { downloadFile, importCustTemp } from "@/api/system";
import { ElMessage } from "element-plus";
export default defineComponent({
  components: {
    Table,
    Layer,
  },
  setup() {
    const visible = ref(false);
    // 存储搜索用的数据
    const query = reactive({
      name: "",
    });
    // 弹窗控制器
    const layer: LayerInterface = reactive({
      show: false,
      title: "新增",
      showButton: true,
      width: '400px',
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
        const result: any = await getClientList(params);
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
      console.log(row.prodQrcodeUrl);
    }
    const handleAdd = () => {
      layer.title = "新增客户";
      layer.show = true;
      delete layer.row;
    }
    // 编辑弹窗功能
    const handleEdit = (row: any) => {
      layer.title = "编辑客户";
      layer.row = row;
      layer.show = true;
    }
    const handleImport = () => {
      visible.value = true;
    }

    const beforeUpload = (file: any) => {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        ElMessage.error("上传文件大小不能超过 10MB!");
        return false;
      }
    }

    const uploadChange = async (file: any) => {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const result: any = await importCustTemp(formData);
        if (result.code === 0) {
          ElMessage.success("导入成功");
        }
      } catch (error) {
        ElMessage.error("出错啦,请联系管理员");
      }
      visible.value = false;
      getTableData(true);
    }
    const handleFileUpload = async (params: { file: any; }) => {
      return uploadChange(params.file);
    }

    const handleDownloadFile = async () => {
      const result:any = await downloadFile({ fileId: 2 });
      if(result.code === 0) {
        window.open(result.fileUrl)
      }
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
      visible,
      handleAdd,
      handleEdit,
      handleDownload,
      handleImport,
      beforeUpload,
      handleFileUpload,
      handleDownloadFile
    };
  }
});
</script>

<style lang="scss" scoped>
.statusName {
  margin-right: 10px;
}

.search {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2px;
  margin-left: 20px;
}
</style>
