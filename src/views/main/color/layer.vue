<template>
  <Layer :layer="layer" @confirm="submit">
    <el-form :model="ruleForm" :rules="rules" ref="form" label-width="120px" style="margin-right:30px;">
      <el-form-item label="色彩图片：" prop="colourImgUrl">
        <el-input v-model="ruleForm.colourImgUrl" v-show="false" placeholder="请输上传"></el-input>
        <el-upload v-if="!ruleForm.colourImgUrl" :before-upload="beforeUpload" class="upload-demo" action=""
          :auto-upload="true" :limit="1" :show-file-list="false" accept="image/*" ref="uploadDom"
          :http-request="handleFileUpload">
          <el-button type="primary" style="margin-right: 10px;">上传图片</el-button>
        </el-upload>
        <div v-else class="reload">
          <el-image style="width: 100px; height: 100px" fit="contain" :src="ruleForm.colourImgUrl"></el-image>
          <el-button type="text" @click="handleReload">重新上传</el-button>
        </div>
      </el-form-item>
      <el-form-item label="色彩编号：" prop="colourCode">
        <el-input v-model="ruleForm.colourCode" placeholder="请输入色彩编号"></el-input>
      </el-form-item>
      <el-form-item label="色彩名称：" prop="colourName">
        <el-input v-model="ruleForm.colourName" placeholder="请输入色彩名称"></el-input>
      </el-form-item>
      <el-form-item label="色彩介绍：" prop="colourInfo">
        <el-input v-model="ruleForm.colourInfo" autosize type="textarea" placeholder="请输入色彩介绍" />
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import Layer from '@/components/layer/index.vue'
import { addOrEdit } from "@/api/color";
import { Upload } from '@/utils/upload';
import { ElMessage } from 'element-plus';
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
  setup(props, ctx) {
    let ruleForm = reactive({
      colourCode: "",
      colourImgUrl: "",
      colourInfo: "",
      colourName: "",
    })
    if (props.layer.row) {
      ruleForm = reactive({ ...props.layer.row })
    }
    const rules = {
      colourCode: [{ required: true, message: '请输入色彩编号', trigger: 'blur' }],
      colourImgUrl: [{ required: true, message: '请选择图片', trigger: 'blur' }],
      colourInfo: [{ required: true, message: '请输入色彩介绍', trigger: 'blur' }],
      colourName: [{ required: true, message: '请输入色彩名称', trigger: 'blur' }]
    }
    return {
      ruleForm,
      rules,
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid: boolean) => {
        if (valid) {
          let params = this.ruleForm
          if (this.layer.row) {
            this.updateForm(params)
          } else {
            this.addForm(params)
          }
        } else {
          return false;
        }
      });
    },
    beforeUpload(file: any) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        ElMessage.error("上传文件大小不能超过 2MB!");
        return false;
      }
    },
    async uploadChange(file: any) {
      const upload = new Upload();
      const result: any = await upload.uploadFile(file);
      if (result) {
        this.ruleForm.colourImgUrl = result;
      }
    },
    handleFileUpload(params: { file: any; }) {
      return this.uploadChange(params.file);
    },
    handleReload() {
      this.ruleForm.colourImgUrl = '';
    },
    // 新增提交事件
    addForm(params: object) {
      addOrEdit(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.layer.show = false
          this.$emit('getTableData', true)
        })
    },
    // 编辑提交事件
    updateForm(params: object) {
      addOrEdit(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.layer.show = false
          this.$emit('getTableData', false)
        })
    }
  }
})
</script>

<style lang="scss" scoped>
.reload {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
}
</style>