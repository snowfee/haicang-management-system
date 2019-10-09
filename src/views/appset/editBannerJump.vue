<template>
  <div class="edit-container">
    <el-form :model="ruleForm" ref="roleForm" :rules="rules" class="edit-form" label-width="150px">
      <el-form-item label="跳转目标">
        <el-radio-group v-model="ruleForm.jumpDestination" prop="jumpDestination">
          <el-radio style="line-height:40px" v-for="(item, index) in destinations" :key="index" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
       <template v-if="ruleForm.jumpDestination === 'WEBPAGE'">
         <el-form-item label="跳转链接" prop="jumpUrl">
           <el-input v-model="ruleForm.jumpUrl"></el-input>
         </el-form-item>
      </template>
      <el-form-item label="广告图片" prop="picUrl">
        <upload :limit="1" :fileList="fileList" :postQiniupData="postQiniupData" @uploadSuccess="uploadSuccess" @removeUploadFile="removeUploadFile"></upload>
      </el-form-item>
      <template v-if="ruleForm.jumpDestination === 'CATEGORY'">
        <el-form-item label="选择类目" prop="jumpCategoryId">
          <el-radio-group v-model="ruleForm.jumpCategoryId">
            <el-radio v-for="(item, index) in categories" :key="index" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <template v-if="ruleForm.jumpDestination === 'PRODUCT'">
        <el-form-item label="选择类目" prop="productId">
          <el-button type="primary" @click="openProductDialog">添加</el-button>
          <el-table border :data="products" style="margin-top: 20px;">
            <el-table-column label="商品编号" prop="id"></el-table-column>
            <el-table-column label="商品名称" prop="name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteProduct(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </template>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="添加商品" width="70%" :visible.sync="showProductDialog">
      <product-dialog @addProduct = addProduct :limit='1' :show='showProductDialog'></product-dialog>      
    </el-dialog>
  </div>
</template>
<script>
import { handleBannerJump, getBannerJumpById } from '@/api/appset'
import { getAllCategories, productsList} from '@/api/product'
import { getQiniuUpToken } from '@/api/user'
import productDialog from '@/components/Dialog/productDialog'
import upload from '@/components/Upload'
export default {
  components: {
    productDialog,
    upload
  },
  data() {
    return {
      editType: '添加',
      fileList: [],
      ruleForm: {
        jumpDestination: 'COUPON_CENTER',
        picUrl: '',
        jumpUrl : '',
        jumpCategoryId: '',
        productId: '',
        type: '',
        associatedId: ''
      },
      rules: {
        jumpDestination: [{required: true, message: '请选择跳转目标', trigger: 'blur'}],
        picUrl: [{required: true, message: '请上传广告图片', trigger: 'blur'}],
        jumpUrl : [{required: true, message: '请输入跳转链接', trigger: 'blur'}],
        jumpCategoryId: [{required: true, message: '请选择类目', trigger: 'blur'}],
        productId: [{required: true, message: '请添加商品', trigger: 'blur'}]
      },
      destinations: [{
        value: 'COUPON_CENTER',
        label: '领券中心'
      }, {
        value: 'WEBPAGE',
        label: '网页链接'
      }, {
        value: 'CATEGORY',
        label: '类目'
      }, {
        value: 'PRODUCT',
        label: '商品'
      }, {
        value: 'NO_JUMP',
        label: '不跳转'
      }],
      showProductDialog: false,
      categories: [],
      products: [],
      postQiniupData: null
    }
  },
  created() {
    this.ruleForm.associatedId = this.$route.query.associatedId || ''
    this.ruleForm.type = this.$route.query.type || ''
    this.ruleForm.id = this.$route.query.id || ''
    if (this.ruleForm.id) {
      this.editType = '更新'
      this.getBannerJumpInfo()
    }
    this.getQiniuUpToken()
    this.getCategories()
  },
  methods: {
    getBannerJumpInfo() {
      getBannerJumpById(this.ruleForm.id).then(res => {
        this.ruleForm = {...res.data}
        let picName = this.ruleForm.picUrl.split('/')
        picName = picName[picName.length -1]
        this.$set(this.fileList, 0, {name: picName, url: this.ruleForm.picUrl})
        if (res.data.product) {
          this.products = [{...res.data.product}]
        }
      })
    },
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
    getCategories() {
      getAllCategories().then(res => {
        this.categories = res.data
      })
    },
    openProductDialog() {
      this.showProductDialog = true
    },
    addProduct(data) {
      this.products = data
      this.ruleForm.productId = data[0].id
      this.showProductDialog = false
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
          console.log('params', params)
          handleBannerJump(params).then(res => {
            this.$message({
              message: `${this.editType}成功`,
              type: 'success'
            })
            if (this.ruleForm.type === 'HOME_SECTION') {
              this.$router.replace({
                path: `updateHomeBlock?id=${this.ruleForm.associatedId}`
              })
            } else {
              this.$router.replace({
                path: 'carousel'
              })
            }
          })
        }
      })
    }
  }
}
</script>