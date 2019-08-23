<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="编辑消息"></el-step>
    </el-steps>
    <jump-set
      class="edit-form" 
      ref="jumpSet"
      labelWidth = '150px'
      :bannerJump = ruleForm.bannerJump
      :destinations = jumpDestinations
      type="MESSAGE_CENTER"></jump-set>        
    <el-form ref="roleForm" :model="ruleForm" :rules="rules" label-width="150px" class="edit-form">
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="picUrl">
        <upload 
          :limit="1" 
          :fileList="fileList" 
          :postQiniupData="postQiniupData" 
          @uploadSuccess="uploadSuccess" 
          @removeUploadFile="removeUploadFile"></upload>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <quill-editor :options="editorOption" v-model="ruleForm.content"></quill-editor>
      </el-form-item>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
        <el-button @click="restForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { handleMessageCenter, getMessageCenterById } from '@/api/system'
import { getQiniuUpToken } from '@/api/user'
import { quillRedefine } from 'vue-quill-editor-upload' // 富文本编辑器vue-quill-editor的辅助插件，用于上传图片到你的服务器
import { quillEditor } from 'vue-quill-editor'
import upload from '@/components/Upload'
import jumpSet from '@/components/JumpSet'

export default {
  components: {
    upload,
    jumpSet,
    quillEditor,
    quillRedefine
  },
  data() {
    return {
      stepStatus: 'progress',
      editType: '添加',
      preRuleForm: null,
      active: 0,
      fileList: [], // 图片上传列表
      editorOption: {},
      postQiniupData: null,
      jumpDestinations: [{
        value: 'COUPON_CENTER',
        label: '领券中心'
      }, {
        value: 'PRODUCT',
        label: '商品'
      }, {
        value: 'NO_JUMP',
        label: '不跳转'
      }],
      ruleForm: {
        title: '',
        picUrl: '',
        content: '',
        bannerJump: null
      },
      rules: {
        title: [
          {required: true, trigger: 'blur'}
        ],
        picUrl: [
          {required: true, trigger: 'blur'}
        ],
        content: [
          {required: true, trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getQiniuUpToken()
    this.id = this.$route.query.id
    if (this.id) {
      this.editType = '更新'
      this.getTheMessage()
    }
    this.preRuleForm = {...this.ruleForm}
  },
  methods: {
    getTheMessage() {
      getMessageCenterById(this.id).then(res => {
        this.ruleForm = {...res.data}
        delete this.ruleForm.createTime
        delete this.isSend
      })
    },
    getQiniuUpToken() {
      getQiniuUpToken().then(res => {
        this.postQiniupData = {}
        this.postQiniupData.token = res.data
        this.editorOption = quillRedefine({
          placeholder: '',
          theme: 'snow',  // or 'bubble'
          // toolOptions: [],
          // 图片上传的设置
          uploadConfig: {
            action:  'https://upload.qiniup.com',  // 必填参数 图片上传地址
            token: this.postQiniupData.token,
            accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon',  // 可选参数 可上传的图片格式
            // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
            // 你必须把返回的数据中所包含的图片地址 return 回去
            res: (response) => {
              console.log(response)
              return respnse.info  // 这里切记要return回你的图片地址
            },
            success: () => {

            },
            error: () => {
              console.error('err')
            }
          }
        })
      })
    },
    uploadSuccess(fileList, imgServe) {
      console.log(fileList)
      this.ruleForm.picUrl = `${imgServe}/${fileList[0].response.key}`
    },
    removeUploadFile(file, imgServe) {
      this.ruleForm.picUrl = ''
    },
    restForm() {
      this.ruleForm = Object.assign({}, this.preRuleForm)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let jumpData = this.$refs.jumpSet.submitForm()
          if (!jumpData.valid) return
          this.ruleForm.bannerJump = {...jumpData.bannerJump}
          let params = {...this.ruleForm}
          if (this.editType === '更新') {
            params.methodType = 'UPDATE'
          } else {
            params.methodType = 'ADD'
          }
          console.log('params', params)
          handleMessageCenter(params).then(res => {
            this.$message({
              message: `消息${this.editType}成功`,
              type: 'success'
            });
            this.$router.replace({
              path: 'messageCenter'
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
