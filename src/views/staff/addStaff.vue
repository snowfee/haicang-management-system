<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="填写员工信息"></el-step>
    </el-steps>
    <el-form :model="formData" :rule="rules" label-width="150px" class="edit-form">
      <el-form-item label="姓名">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="formData.sex" placeholder="选择性别">
          <el-option label="男" value="MALE"></el-option>
          <el-option label="女" value="FEMALE"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="formData.age"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formData.telephone"></el-input>
      </el-form-item>
      <el-form-item label="登录密码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="formData.idNumber"></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-select v-model="formData.roleId" placeholder="选择职位">
          <el-option v-for="(role, index) in roles" :key="index" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary">提交</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { roleList } from '@/api/staff'
export default {
  data() {
    return {
      formData: {
        age: '',
        name: '',
        sex: 'MALE',
        telephone: '',
        password: '',
        roleId: '',
        idNumber: ''
      },
      rules: {

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
    }

  }
}
</script>

<style>
</style>
