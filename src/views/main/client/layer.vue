<template>
  <Layer :layer="layer" @confirm="submit">
    <el-form label-width="100px" :model="ruleForm" :rules="rules" ref="form">
      <el-form-item label="姓名" prop="custName">
        <el-input class="w220" v-model="ruleForm.custName" placeholder="请输入客户姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="custPhone">
        <el-input class="w220" v-model="ruleForm.custPhone" placeholder="请输入客户电话"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="custAddr">
        <el-input class="w220" v-model="ruleForm.custAddr" placeholder="请输入客户地址"></el-input>
      </el-form-item>
      <el-form-item label="使用产品" prop="prodId">
        <el-select class="w220" v-model="ruleForm.prodId" placeholder="请选择使用产品">
          <el-option v-for="option in options" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, defineEmits } from 'vue'
import Layer from '@/components/layer/index.vue'
import { addOrEdit } from "@/api/client";
import { getProductList } from "@/api/product";
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
          showButton: true,
        }
      }
    }
  },
  emits: ['getTableData'],
  setup(props, ctx) {
    const form = ref();
    const uploadDom = ref();
    const disable = ref(false)
    let ruleForm = reactive({
      custName: "",
      custPhone: "",
      custAddr: "",
      prodId: "",
    })
    if (props.layer.row) {
      ruleForm = reactive({ ...props.layer.row })
    }
    const rules = {
      custName: [{ required: true, message: '请输入', trigger: 'blur' }],
      custAddr: [{ required: true, message: '请输入', trigger: 'blur' }],
      custPhone: [{ required: true, message: '请输入', trigger: 'blur' }],
      prodId: [{ required: true, message: '请选择', trigger: 'change' }],
    }

    const options = ref<any>([]);

    const getProducts = async()=> {
      const result:any = await getProductList({current: 1, size: 999});
      options.value = result?.page?.records.map((item: any) => ({
        label: item.prodName,
        value: item.id
      }))
    }

    const submit = () => {
      form.value.validate((valid: boolean) => {
        if (valid) {
          if (props.layer.row) {
            updateForm(ruleForm)
          } else {
            addForm(ruleForm)
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
    const updateForm = async (params: object) => {

      try {
        await addOrEdit(ruleForm);
        ElMessage({
          type: 'success',
          message: '编辑成功'
        })
        props.layer.show = false
      } catch (error) {
        ElMessage({
          type: 'error',
          message: String(error)
        })
      } finally {
        ctx.emit('getTableData', true)
      }
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
    getProducts();
    return {
      disable,
      ruleForm,
      rules,
      uploadDom,
      form,
      options,
      uploadchange,
      submit
    }
  },
})
</script>

<style lang="scss" scoped>
.w220 {
  width: 220px;
}
</style>
<style>
.el-input-number .el-input__inner {
  text-align: left;
}
</style>