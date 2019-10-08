<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="添加app启动页图片"></el-step>
    </el-steps>      
    <el-form ref="roleForm" :model="ruleForm" :rules="rules" label-width="150px" class="edit-form">
      <el-form-item label="添加图片" prop="picUrl">
        <upload 
          :limit="1" 
          :fileList="fileList" 
          :postQiniupData="postQiniupData" 
          @uploadSuccess="uploadSuccess" 
          @removeUploadFile="removeUploadFile"></upload>
      </el-form-item>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addAppStartPage } from '@/api/system'
import { getQiniuUpToken } from '@/api/user'
import upload from '@/components/Upload'

export default {
  components: {
    upload
  },
  data() {
    return {
      active: 0,
      stepStatus: 'progress',
      fileList: [],
      ruleForm: {
        picUrl: ''
      },
      rules: {
        picUrl: [
          {required: true, trigger: 'blur'}
        ]
      },
      postQiniupData: null
    }
  },
  created() {
    this.getQiniuUpToken()
  },
  methods: {
    getQiniuUpToken() {
      getQiniuUpToken().then(res => {
        this.postQiniupData = {}
        this.postQiniupData.token = res.data
      })
    },
    uploadSuccess(file, imgServe) {
      console.log(file)
      this.ruleForm.picUrl = `${imgServe}/${file[0].response.key}`
    },
    removeUploadFile(file, imgServe) {
      this.ruleForm.picUrl = ''
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {...this.ruleForm}
          console.log('params', params) 
          addAppStartPage(params).then(res => {
            this.$message({
              message: `图片提交成功`,
              type: 'success'
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
