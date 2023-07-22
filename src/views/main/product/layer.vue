<template>
  <Layer :layer="layer" @confirm="submit">
    <el-form :model="ruleForm" :rules="rules" ref="form" label-width="120px" style="margin-right:30px;">
      <el-form-item label="产品图片：" prop="prodImgUrl">
        <el-upload
          class="upload-demo"
          action=""
          :auto-upload="false"
          accept="image/*"
          ref="uploadDom"
          :on-change="uploadchange"
        >
          <el-button type="primary" style="margin-right: 10px;">上传图片</el-button>
      </el-upload>
      </el-form-item>
      <el-form-item label="产品名称：" prop="prodName">
        <el-input v-model="ruleForm.prodName" placeholder="请输入产品名称"></el-input>
      </el-form-item>
      <el-form-item label="跳转方式：" prop="jumpType">
        <el-select v-model="ruleForm.jumpType" placeholder="请选择跳转方式">
          <el-option label="公众号文章" :value="1"></el-option>
          <el-option label="PDF文件" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公众号链接：" prop="jumpUrl">
        <el-input v-model="ruleForm.jumpUrl" placeholder="请输入公众号跳转链接"></el-input>
      </el-form-item>
      <el-form-item label="PDF文件：" prop="jumpUrl">
        <el-input v-model="ruleForm.jumpUrl" placeholder="请上传PDF文件"></el-input>
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
      jumpType: "",
      jumpUrl: "",
      prodCode: "",
    })
    const rules = {
      prodName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
      prodImgUrl:[{ required: true, message: '请上传产品图片', trigger: 'blur' }],
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
          ctx.emit('getTableData', true)
        })
    }
      // handle the file change
    const uploadchange = (file: any, fileList: any) => {
    file2base64(file)
      uploadDom.value.clearFiles()
    }
    const file2base64 = (file: any) => {
      let imgFile = new FileReader()
      imgFile.readAsDataURL(file.raw)
    }

    return {
      ruleForm,
      rules,
      uploadDom,
      form,
      uploadchange,
      submit
    }
  },
})
</script>

<style lang="scss" scoped></style>