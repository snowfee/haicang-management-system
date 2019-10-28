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
        <div id="editor"></div>
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
import upload from '@/components/Upload'
import jumpSet from '@/components/JumpSet'
import WangEditor from 'wangeditor'

export default {
  components: {
    upload,
    jumpSet
  },
  data() {
    return {
      editor: '',
      showEditor: false,
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
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        picUrl: [
          {required: true, message: '请上传图片', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入内容', trigger: 'blur'}
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
    createEditor(){  // 创建编辑器
        this.editor = new WangEditor('#editor');
        this.initEditorConfig();  // 初始化编辑器配置，在create之前
        this.editor.create();  // 生成编辑器
        // this.editor.$txt.html('<p>要初始化的内容</p>');  // 初始化内容
        // $('#account--editor').css('height', 'auto');  // 使编辑器内容区自动撑开，在css中定义min-height
    },
    destroyEditor(){  // 销毁编辑器，官方没有给出完美方案。此方案是作者给出的临时方案
        this.editor.destroy();  // 这个没有完全销毁实例，只是作了隐藏
        // $('#account--editor').remove();  // 不报错的话，这一步可以省略
        this.editor = null;
        WangEditor.numberOfLocation--;  // 手动清除地图的重复引用，作者的临时解决方案。否则单页面来回切换时，地图报错重复引用
    },
    initEditorConfig(){  // 初始化编辑器配置
        console.log(this.editor)
        this.editor.config = {}
        this.editor.customConfig.menus = [
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          'link',  // 插入链接
          'list',  // 列表
          'justify',  // 对齐方式
          'quote',  // 引用
          'emoticon',  // 表情
          'image',  // 插入图片
          'table',  // 表格
          'video',  // 插入视频
          'code',  // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
        ]
        this.editor.config.fontSizes = {  // 字号配置，增加14px
          // 格式：'value': 'title'
          1: '12px',
          2: '13px',
          3: '14px',
          4: '16px',
          5: '18px',
          6: '24px',
          7: '32px',
          8: '48px'
        }
        this.editor.customConfig.uploadImgServer = 'https://upload.qiniup.com'  // 图片上传地
        this.editor.customConfig.uploadFileName = 'file'   // 统一指定上传的文件name，需要指定。否则默认不同的上传方式是不同的nam
        this.editor.customConfig.uploadImgParams = {
          token: this.postQiniupData.token
        }
        this.editor.customConfig.uploadImgHooks = {
          qiniu: true,
          before: (xhr, editor, files) => {
            editor.config.uploadImgParams = {
              token: this.postQiniupData.token
            }
          },
          success: function (xhr, editor, result) {
            console.log('success', result)
              // 图片上传并返回结果，图片插入成功之后触发
              // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          },
          fail: function (xhr, editor, result) {
            console.log('fail', result)
              // 图片上传并返回结果，但图片插入错误时触发
              // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          },
          error: function (xhr, editor, result) {
            console.log('error', result)
              // 图片上传出错时触发
              // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
          },
          customInsert: function (insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
            // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            var url = `http://rsource.haic168.com/${result.key}`;
            insertImg(url);
            // result 必须是一个 JSON 格式字符串！！！否则报错
          }
        }
    },    
    getEditorContent(){  // 获取编辑器 内容区内容
        this.editorContent = this.editor.$txt.html();  // 获取 html 格式
        // this.editor.$txt.text();  // 获取纯文本
        // this.editor.$txt.formatText();  // 获取格式化后的纯文本
    },
    getTheMessage() {
      getMessageCenterById(this.id).then(res => {
        this.ruleForm = {...res.data}
        this.editor.txt.html(this.ruleForm.content);
        delete this.ruleForm.createTime
        delete this.isSend
      })
    },
    getQiniuUpToken() {
      getQiniuUpToken().then(res => {
        this.postQiniupData = {}
        this.postQiniupData.token = res.data
        this.createEditor()
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
      this.ruleForm.content = this.editor.txt.html()
      console.log(this.editor.txt.html())
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
