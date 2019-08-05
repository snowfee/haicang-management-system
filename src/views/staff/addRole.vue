<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="填写职位信息"></el-step>
    </el-steps>
    <el-form :model="ruleForm" ref="roleForm" :rules="rules" label-width="150px" class="edit-form">
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职位编码" prop="code">
          <el-input v-model="ruleForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限勾选" prop="permissions">
          <div v-for="(perm, index) in allPermissions" :key='index'>
            <div v-if="perm.children.length > 0">
              <el-checkbox :indeterminate="isIndeterminate[index]" v-model="checkAll[index]" @change="(value) => handleCheckAllChange(value, perm.children, index)">{{perm.name}}</el-checkbox>
              <el-checkbox-group v-model="ruleForm.permissions[index]" @change="(value) => handleCheckedItemChange(value, perm.children, index)">
                <el-checkbox v-for="(permC, cIndex) in perm.children" :label="permC.id" :key="cIndex">{{permC.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <el-checkbox v-else v-model="ruleForm.permissions[index]" :label="perm.id">{{perm.name}}</el-checkbox>
            <div style="margin: 15px 0;"></div>
          </div>
        </el-form-item>
        <el-form-item size="large" class="form-btn">
          <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
import { handleRole, allPermissions } from '@/api/staff'
export default {
  data() {
    return {
      ruleForm: {
        code : '',
        name: '',
        permissions: []
      },
      rules: {
        name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入职位编码', trigger: 'blur' }],
        permissions: [{ required: true, message: '', trigger: 'blur' }]
      },
      roles: [],
      stepStatus: 'progress',
      allPermissions: [],
      isIndeterminate: [],
      checkAll: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getAllPermissions()
    },
    getAllPermissions() {
      allPermissions().then(res => {
        this.allPermissions = res.data
        this.allPermissions.forEach((item, index) => {
          this.$set(this.isIndeterminate, index, false)
          this.$set(this.checkAll, index, false)
          this.ruleForm.permissions[index] = []
        })
      })
    },
    handleCheckAllChange(val, permC, index) {
      this.ruleForm.permissions[index] = val ? permC.map(item => item.id) : []
    },
    handleCheckedItemChange(val, permC, index) {
      let checkedCount = val.length
      // 数据绑定 改变数组时 使用this.$set()
      this.$set(this.checkAll, index, checkedCount === permC.length)
      this.$set(this.isIndeterminate, index, checkedCount > 0 && checkedCount < permC.length)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.ruleForm)
          params.permissionIds = this.ruleForm.permissions.flat(Infinity).join(',')
          params.methodType = 'ADD'
          delete params.permissions
          handleRole(params).then(res => {
            this.$message({
              message: '职位添加成功',
              type: 'success'
            });
            this.$router.replace({
              path: 'role'
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
