<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="填写版块信息"></el-step>
    </el-steps>
    <el-form ref="roleForm" :model="ruleForm" :rules="rules" label-width="150px" class="edit-form">
      <el-form-item label="版块名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="版块类型" prop="type">
        <el-radio-group v-model="ruleForm.type" size="large">
          <el-radio v-for="(type, index) in types" :key="index" :label="type.value" style="line-height: 40px">{{type.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.type === 'CATEGORY'" label="商品类目">
        <el-checkbox-group v-model="ruleForm.categoryIds">
          <el-checkbox v-for="(item, index) in categories" :key="index" :label="item.id" style="line-height: 40px">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { handleHomeSection } from '@/api/appset'
import { getAllCategories } from '@/api/product'
export default {
  data() {
    return {
      categories: [],
      ruleForm: {
        name: '',
        type: '',
        sort: '',
        categoryIds: ''
      },
      rules: {
        name: [
          {required: true, trigger: 'blur'}
        ],
        type: [
          {required: true, trigger: 'blur'}
        ],
        sort: [
          {required: true, trigger: 'blur'}
        ],
        categoryIds: [
          {required: true, trigger: 'blur'}
        ]
      },
      types: [],
      stepStatus: 'progress'
    }
  },
  created() {
    this.types = [{
      label: '活动',
      value: 'ACTIVITY'
    },{
      label: '类目',
      value: 'CATEGORY'
    },{
      label: '商品列表',
      value: 'PRODUCT_LIST'
    },{
      label: '商品二分',
      value: 'PRODUCT_BINARY'
    },{
      label: '抢购',
      value: 'SNAP_UP'
    },{
      label: '领券',
      value: 'GET_COUPON'
    },]
    this.getCategories()
  },
  methods: {
    getCategories() {
      getAllCategories().then(res => {
        this.categories = res.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.ruleForm)
          params.methodType = 'ADD'
          handleStaff(params).then(res => {
            this.$message({
              message: '员工添加成功',
              type: 'success'
            });
            this.$router.replace({
              path: 'list'
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
