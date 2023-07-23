<template>
  <Layer :layer="layer" @confirm="submit">
    <el-form :disabled="disable" label-position="top" :inline="true" :model="ruleForm" :rules="rules" ref="form">
      <el-form-item label="公司名称" prop="compName">
        <el-input class="w220" v-model="ruleForm.compName" placeholder="请输入公司名称"></el-input>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="userName">
        <el-input class="w220" v-model="ruleForm.userName" placeholder="请输入联系人姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话" prop="phone">
        <el-input class="w220" v-model="ruleForm.phone" placeholder="请输入联系人电话"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input class="w220" v-model="ruleForm.projectName" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目地址" prop="projectAddr">
        <el-input class="w220" v-model="ruleForm.projectAddr" placeholder="请输入项目地址"></el-input>
      </el-form-item>
      <el-form-item label="应用" prop="useType">
        <el-select class="w220" v-model="ruleForm.useType" placeholder="请选择应用类型">
          <el-option v-for="option in options" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规模（万）" prop="projectScale">
        <el-input-number :controls="false" class="w220" v-model="ruleForm.projectScale"
          placeholder="请输入规模（万）"></el-input-number>
      </el-form-item>
      <el-form-item label="产品型号（颜色）" prop="colourId">
        <el-select class="w220" v-model="ruleForm.colourId" placeholder="请选择产品型号（颜色）">
          <el-option v-for="option in options3" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目阶段" prop="projectStage">
        <el-select class="w220" v-model="ruleForm.projectStage" placeholder="请选择项目阶段">
          <el-option v-for="option in options2" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业主/设施/施工信息" prop="constructionInfo">
        <el-input class="w220" v-model="ruleForm.constructionInfo" placeholder="请输入业主/设施/施工信息"></el-input>
      </el-form-item>
      <el-form-item label="项目服务内容" prop="serviceContent">
        <el-input class="w220" v-model="ruleForm.serviceContent" placeholder="请输入项目服务内容"></el-input>
      </el-form-item>
      <el-form-item label="申请授权开始日期" prop="authorizeStartDate">
        <el-date-picker value-format="YYYY-MM-DD" v-model="ruleForm.authorizeStartDate" type="date" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, defineEmits } from 'vue'
import Layer from '@/components/layer/index.vue'
import { getAuthorizeList, pass, add } from "@/api/authorize";
import { getColorList } from "@/api/color";
import { ElMessage } from 'element-plus'
import { tr } from 'element-plus/lib/locale';
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
          width: '200px'
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
      compName: "",
      userName: "",
      phone: "",
      projectName: "",
      projectAddr: "",
      useType: "",
      projectScale: undefined,
      colourId: undefined,
      projectStage: "",
      constructionInfo: "",
      serviceContent: "",
      authorizeStartDate: "",
    })
    if (props.layer.row) {
      ruleForm = reactive({ ...props.layer.row })
      disable.value = true;
    }
    const rules = {
      compName: [{ required: true, message: '请输入', trigger: 'blur' }],
      userName: [{ required: true, message: '请输入', trigger: 'blur' }],
      phone: [{ required: true, message: '请输入', trigger: 'blur' }],
      projectName: [{ required: true, message: '请输入', trigger: 'blur' }],
      projectAddr: [{ required: true, message: '请输入', trigger: 'blur' }],
      useType: [{ required: true, message: '请选择', trigger: 'change' }],
      projectScale: [{ required: true, message: '请输入', trigger: 'blur' }],
      colourId: [{ required: true, message: '请选择', trigger: 'change' }],
      projectStage: [{ required: true, message: '请选择', trigger: 'change' }],
      constructionInfo: [{ required: true, message: '请输入', trigger: 'blur' }],
      serviceContent: [{ required: true, message: '请输入', trigger: 'blur' }],
      authorizeStartDate: [{ required: true, message: '请输入', trigger: 'blur' }],
    }

    const options = [{
      label: '零售',
      value: 'retail',
    },
    {
      label: '地产',
      value: 'property',
    },
    {
      label: '医疗',
      value: 'medical',
    },
    {
      label: '商业空间',
      value: 'commercial',
    },
    {
      label: '交通',
      value: 'traffic',
    },
    {
      label: '外墙',
      value: 'exteriorWall',
    }]

    const options2 = [{
      label: '上图',
      value: 'upper',
    },
    {
      label: '出样',
      value: 'sampling',
    },
    {
      label: '投标',
      value: 'bid',
    },
    {
      label: '商业签约',
      value: 'commercialSigning',
    }]

    const options3 = ref<any>([]);

    const getColors = async () => {
      const result: any = await getColorList({ current: 1, size: 999 });
      options3.value = result?.page?.records.map((item: any) => ({
        label: item.colourName,
        value: item.id
      }))
    }


    const submit = () => {
      form.value.validate((valid: boolean) => {
        if (valid) {
          addForm(ruleForm)
        } else {
          return false;
        }
      });
    }
    // 新增提交事件
    const addForm = (params: object) => {
      add(params)
        .then(res => {
          console.log(res);
          ElMessage({
            type: 'success',
            message: '新增成功'
          })
          props.layer.show = false
          ctx.emit('getTableData', true)
        })
    }
    getColors();

    return {
      disable,
      ruleForm,
      rules,
      uploadDom,
      form,
      options,
      options2,
      options3,
      submit,
      getColors,
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