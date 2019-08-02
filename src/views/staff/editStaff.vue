<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="编辑员工信息"></el-step>
    </el-steps>
    <el-form ref="roleForm" :model="ruleForm" :rules="rules" label-width="150px" class="edit-form">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="ruleForm.sex" placeholder="选择性别">
          <el-option label="男" value="MALE"></el-option>
          <el-option label="女" value="FEMALE"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="ruleForm.age"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="telephone">
        <el-input v-model="ruleForm.telephone"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber">
        <el-input v-model="ruleForm.idNumber"></el-input>
      </el-form-item>
      <el-form-item label="职位" prop="roleId">
        <el-select v-model="ruleForm.roleId" placeholder="选择职位">
          <el-option v-for="(role, index) in roles" :key="index" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
        <el-button @click="restForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { roleList, handleStaff, getStaffById } from '@/api/staff'
export default {
  data() {
    return {
      preRuleForm: null,
      ruleForm: {
        age: '',
        name: '',
        sex: 'MALE',
        telephone: '',
        password: '',
        roleId: '',
        idNumber: ''
      },
      rules: {
        age: [
          {required: true, message: '请输入活动名称', trigger: 'blur'}
        ],
        name: [
          {required: true, trigger: 'blur'}
        ],
        telephone: [
          {required: true, trigger: 'blur'}
        ],
        password: [
          {required: true, trigger: 'blur'}
        ],
        roleId: [
          {required: true, trigger: 'blur'}
        ],
        idNumber: [
          {required: true, trigger: 'blur'}
        ]
      },
      roles: [],
      stepStatus: 'progress',
      id: ''
    }
  },
  created() {
    this.id = this.$route.query.id
    this.init()
  },
  methods: {
    init() {
      this.getEditStaff()
      this.getAllRoles()
    },
    getEditStaff() {
      getStaffById(this.id).then(res => {
        this.ruleForm = Object.assign({}, res.data)
        delete this.ruleForm.role
        delete this.createTime
        this.preRuleForm = Object.assign({}, this.ruleForm)
      })
    },
    getAllRoles() {
      let param = {
        pageIndex: 0,
        pageSize: 999
      }
      roleList(param).then(res => {
        this.roles = res.data.pageData
      })
    },
    restForm() {
      this.ruleForm = Object.assign({}, this.preRuleForm)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.ruleForm
          params.methodType = 'UPDATE'
          handleStaff(params).then(res => {
            this.$message({
              message: '员工更新成功',
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
