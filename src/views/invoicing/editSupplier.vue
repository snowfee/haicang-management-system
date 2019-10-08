<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="编辑供应商信息"></el-step>
    </el-steps>
    <el-form :model="ruleForm" ref="roleForm" :rules="rules" label-width="150px" class="edit-form">
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="ruleForm.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input v-model="ruleForm.contactName"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="ruleForm.telephone"></el-input>
        </el-form-item>
         <el-form-item label="地址" prop="address">
          <el-input v-model="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item label="结算方式" prop="settleType">
          <el-radio-group v-model="ruleForm.settleType">
            <el-radio v-for="(type, index) in settleTypes" :key="index" :label="type.value">{{type.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          启用：<el-switch v-model="ruleForm.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item size="large" class="form-btn">
          <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
import { handleSupplier, getSupplierById } from '@/api/invoicing'
export default {
  data() {
    return {
      editType: '添加',
      preRuleForm: null,
      settleTypes: [{name: '货到付款', value: 'CASH_ON_DELIVERY'}, {name: '日结', value: 'DAILY'}, {name: '月结', value: 'MONTHLY'}, {name: '挂账', value: 'ONCREDIT'}],
      ruleForm: {
        supplierName: '',
        contactName: '',
        telephone: '',
        address: '',
        settleType: 'CASH_ON_DELIVERY',
        status: 1
      },
      rules: {
        supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
        contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        telephone: [{ required: true, message: '请输入电话', trigger: 'blur' }, {pattern: /^1[3456789]\d{9}$/, message: '格式错误', trigger: 'blur'}],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        settleType: [{ required: true, message: '请选择结算方式', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      stepStatus: 'progress'
    }
  },
  created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.editType = '更新'
      this.getTheSupplier()
    }
    this.preRuleForm = {...this.ruleForm}
  },
  methods: {
    getTheSupplier() {
      getSupplierById(this.id).then(res => {
        this.ruleForm = {...res.data}
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.ruleForm)
          if (this.editType === '添加') {
            params.methodType = 'ADD'
          } else {
            params.methodType = 'UPDATE'            
          }
          handleSupplier(params).then(res => {
            this.$message({
              message: `供应商${this.editType}成功`,
              type: 'success'
            });
            this.$router.replace({
              path: 'supplier'
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
