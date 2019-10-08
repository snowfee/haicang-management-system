<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="编辑参数"></el-step>
    </el-steps>      
    <el-form ref="roleForm" :model="ruleForm" :rules="rules" label-width="150px" class="edit-form">
      <el-form-item label="参数key" prop="key">
        <el-input v-model="ruleForm.key"></el-input>
      </el-form-item>
      <el-form-item label="参数值" prop="value">
        <el-input v-model="ruleForm.value"></el-input>
      </el-form-item>
      <el-form-item label="参数描述" prop="desc">
        <el-input v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
        <el-button @click="restForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { handleParamSetting, getParamSettingById } from '@/api/system'

export default {
  data() {
    return {
      stepStatus: 'progress',
      editType: '添加',
      id: '',
      preRuleForm: null,
      active: 0,
      ruleForm: {
        desc: '',
        key: '',
        value: ''
      },
      rules: {
        desc: [
          {required: true, message: '请输入参数描述', trigger: 'blur'}
        ],
        key: [
          {required: true, message: '请输入参数key', trigger: 'blur'}
        ],
        value: [
          {required: true, message: '请输入参数值', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.editType = '更新'
      this.getTheParamSetting()
    } else {
      this.editType = '添加'
    }
    this.preRuleForm = {...this.ruleForm}
  },
  methods: {
    getTheParamSetting() {
      getParamSettingById(this.id).then(res => {
        this.ruleForm = {...res.data}
        delete this.ruleForm.createTime
      })
    },
    restForm() {
      this.ruleForm = Object.assign({}, this.preRuleForm)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {...this.ruleForm}
          if (this.editType === '更新') {
            params.methodType = 'UPDATE'
          } else {
            params.methodType = 'ADD'
          }
          console.log('params', params) 
          handleParamSetting(params).then(res => {
            this.$message({
              message: `参数${this.editType}成功`,
              type: 'success'
            });
            this.$router.replace({
              path: 'settings'
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
