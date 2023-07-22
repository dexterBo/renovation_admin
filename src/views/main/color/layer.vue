<template>
  <Layer :layer="layer" @confirm="submit">
    <el-form :model="ruleForm" :rules="rules" ref="form" label-width="120px" style="margin-right:30px;">
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
          this.$emit('getTableData', false)
        })
    }
  }
})
</script>

<style lang="scss" scoped></style>