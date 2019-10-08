<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="填写员工信息"></el-step>
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
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { roleList, handleStaff } from '@/api/staff'
export default {
  data() {
    return {
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
          {required: true, message: '请输入员工年龄', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入员工姓名', trigger: 'blur'}
        ],
        telephone: [
          {required: true, message: '请输入员工手机号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入员工密码', trigger: 'blur'}
        ],
        roleId: [
          {required: true, message: '请选择员工职位', trigger: 'blur'}
        ],
        idNumber: [
          {required: true, message: '请输入员工身份证号码', trigger: 'blur'}
        ]
      },
      roles: [],
      stepStatus: 'progress'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getAllRoles()
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
