<template>
  <div class="edit-container">
    <el-form class="edit-form" ref="formData" :model="formData" :rules="ruleForm" label-width="150px">
      <el-form-item label="属性名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="属性类型" prop="attributeId">
        <el-select v-model="formData.attributeId" disabled>
          <el-option v-for="(attr, index) in attributes" :key="index" :label="attr.name" :value="attr.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="属性值可选值列表" prop="inputList">
        <el-input v-model="formData.inputList" placeholder="每个属性请用逗号隔开"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input type="number" v-model="formData.sort"></el-input>
      </el-form-item>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary" @click="submit('formData')">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template> 

<script>
import { skuAttributeList, handleSkuAttributeItem } from '@/api/materials'
export default {
  data() {
    return {
      attributes: [], // 属性类型
      formData: {
        name: '',
        attributeId: '',
        inputList: '',
        sort: ''
      },
      ruleForm: {
        name: [{ required: true, message: '请输入属性名称', trigger: 'blur' }],
        // attributeId: [{ required: true, trigger: 'blur' }],
        inputList: [
          { required: true, message: '请输入属性值', trigger: 'blur' },
          {pattern:/^[^,|^，]+([,|，][^,|^，]+)*$/, message: '格式不正确', trigger: 'blur'}
        ],
        sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.formData.attributeId = +this.$route.params.attrId || ''
    this.getAttributes()
  },
  methods: {
    getAttributes() {
      skuAttributeList().then(res => {
        this.attributes = res.data

      })
    },
    reset() {
      this.formData = {
        name: '',
        inputList: '',
        sort: ''
      }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = { ...this.formData }
          params.methodType = 'ADD'
          handleSkuAttributeItem(params).then(res => {
            this.$message({
              message: '属性添加成功',
              type: 'success'
            });
            this.$router.replace({
              path: `./../attributeList?id=${params.attributeId}`
            })
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
