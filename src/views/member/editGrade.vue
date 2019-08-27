<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="编辑会员等级信息"></el-step>
    </el-steps>
    <el-form :model="ruleForm" ref="roleForm" :rules="rules" label-width="150px" class="edit-form">
        <el-form-item label="会员名称" prop="userName">
          <el-input v-model="ruleForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="MALE">男</el-radio>
            <el-radio label="FEMALE">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="ruleForm.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="ruleForm.telephone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="headUrl">
          <upload :limit="1" :fileList="fileList" :postQiniupData="postQiniupData" @uploadSuccess="uploadSuccess" @removeUploadFile="removeUploadFile"></upload>          
        </el-form-item>
        <el-form-item size="large" class="form-btn">
          <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
import { handleMembershipGrade, getMembershipGradeById } from '@/api/member'
export default {
  components:{
    upload
  },
  data() {
    return {
      ruleForm: {
        age : '',
        userName: '',
        password: '',
        sex: 'MALE',
        telephone: '',
        headUrl: ''
      },
      rules: {
        age: [{ required: true, trigger: 'blur' }],
        userName: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }],
        sex: [{ required: true, trigger: 'blur' }],
        telephone: [{ required: true, trigger: 'blur' }],
        headUrl: [{ required: true, trigger: 'blur' }]
      },
      stepStatus: 'progress',
      id: ''
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    this.getGradeInfo()
  },
  methods: {
    getGradeInfo() {
      getMembershipGradeById(this.id).then(res => {
        
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {...this.ruleForm}
          if (this.editType === '添加') {
            params.methodType = 'ADD'
          } else {
            params.methodType = 'UPDATE'
          }
          delete params.permissions
          handleMember(params).then(res => {
            this.$message({
              message:`会员${this.editType}成功`,
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
