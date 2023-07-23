<template>
  <Layer :layer="layer" @confirm="submit">
    <el-form :model="ruleForm" :rules="rules" ref="form" label-width="120px" style="margin-right:30px;">
      <el-form-item label="色彩图片：" prop="prodImgUrl">
        <el-input v-model="ruleForm.prodImgUrl" v-show="false" placeholder="请输上传"></el-input>
        <el-upload v-if="!ruleForm.prodImgUrl" :before-upload="beforeUpload" class="upload-demo" action=""
          :auto-upload="true" :limit="1" :show-file-list="false" accept="image/*" ref="uploadDom"
          :http-request="handleFileUpload">
          <el-button type="primary" style="margin-right: 10px;">上传图片</el-button>
        </el-upload>
        <div v-else class="reload">
          <el-image style="width: 100px; height: 100px" fit="contain" :src="ruleForm.prodImgUrl"></el-image>
          <el-button type="text" @click="handleReload">重新上传</el-button>
        </div>
      </el-form-item>
      <el-form-item label="产品名称：" prop="prodName">
        <el-input v-model="ruleForm.prodName" placeholder="请输入产品名称"></el-input>
      </el-form-item>
      <el-form-item label="跳转方式：" prop="jumpType">
        <el-select v-model="ruleForm.jumpType" placeholder="请选择跳转方式">
          <el-option label="PDF文件" :value="1"></el-option>
          <el-option label="公众号文章" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="ruleForm.jumpType === 2" label="公众号链接：" prop="jumpUrl">
        <el-input v-model="ruleForm.jumpUrl" placeholder="请输入公众号跳转链接"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.jumpType === 1" label="PDF文件：" prop="jumpUrl">
        <el-input v-model="ruleForm.jumpUrl" v-show="false" placeholder="请输上传"></el-input>
        <el-upload v-if="!ruleForm.jumpUrl" :before-upload="beforeUpload" class="upload-demo" action=""
          :auto-upload="true" :limit="1" :show-file-list="false" accept="pdf/*" ref="uploadDom"
          :http-request="handlePDFUpload">
          <el-button type="primary" style="margin-right: 10px;">上传PDF文件</el-button>
        </el-upload>
        <div v-else class="reload">
          <el-input disabled v-model="ruleForm.jumpUrl" placeholder="请输上传"></el-input>
          <el-button type="text" @click="handlePDFReload">重新上传</el-button>
        </div>
      </el-form-item>
      <el-form-item label="产品编码" prop="prodCode">
        <el-input v-model="ruleForm.prodCode" placeholder="请输入产品编码" />
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, defineEmits } from 'vue'
import Layer from '@/components/layer/index.vue'
import { addOrEdit } from "@/api/product";
import { ElMessage } from 'element-plus'
import { Upload } from '@/utils/upload';
export default defineComponent({
  components: {
    Layer
  },
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          show: false,
          title: '',
          showButton: true
        }
      }
    }
  },
  emits: ['getTableData'],
  setup(props, ctx) {
    const form = ref();
    const uploadDom = ref();
    let ruleForm = reactive({
      prodName: "",
      prodImgUrl: "",
      jumpType: undefined,
      jumpUrl: "",
      prodCode: "",
    })
    if (props.layer.row) {
      ruleForm = reactive({ ...props.layer.row })
    }
    const rules = {
      prodName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
      prodImgUrl: [{ required: true, message: '请上传产品图片', trigger: 'blur' }],
      jumpType: [{ required: true, message: '请选择跳转方式', trigger: 'blur' }],
      jumpUrl: [{ required: true, message: '请输入跳转链接', trigger: 'blur' }],
      prodCode: [{ required: true, message: '请输入产品编号', trigger: 'blur' }],
    }

    const submit = () => {
      form.value.validate((valid: boolean) => {
        if (valid) {
          let params = ruleForm
          if (props.layer.row) {
            updateForm(params)
          } else {
            addForm(params)
          }
        } else {
          return false;
        }
      });
    }
    // 新增提交事件
    const addForm = (params: object) => {
      addOrEdit(params)
        .then(res => {
          ElMessage({
            type: 'success',
            message: '新增成功'
          })
          props.layer.show = false
          ctx.emit('getTableData', true)
        })
    }
    // 编辑提交事件
    const updateForm = (params: object) => {
      addOrEdit(params)
        .then(res => {
          ElMessage({
            type: 'success',
            message: '编辑成功'
          })
          props.layer.show = false
          ctx.emit('getTableData', true)
        })
    }
    const beforeUpload = (file: any) => {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        ElMessage.error("上传文件大小不能超过 2MB!");
        return false;
      }
    }
    const uploadChange = async (file: any) => {
      const upload = new Upload();
      const result: any = await upload.uploadFile(file);
      if (result) {
        ruleForm.prodImgUrl = result;
      }
    }
    const handleFileUpload = async (params: { file: any; }) => {
      return uploadChange(params.file);
    }
    const handlePDFUpload = async (params: { file: any; }) => {
      return uploadPDFChange(params.file);
    }
    const uploadPDFChange = async (file: any) => {
      const upload = new Upload();
      const result: any = await upload.uploadFile(file);
      if (result) {
        ruleForm.jumpUrl = result;
      }
    }
    const handleReload = () => {
      ruleForm.prodImgUrl = '';
    }
    const handlePDFReload = () => {
      ruleForm.jumpUrl = '';
    }

    return {
      ruleForm,
      rules,
      uploadDom,
      form,
      handleReload,
      handleFileUpload,
      handlePDFReload,
      handlePDFUpload,
      beforeUpload,
      uploadChange,
      submit
    }
  },
})
</script>

<style lang="scss" scoped>
.reload {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
}
</style>