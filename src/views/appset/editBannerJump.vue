<template>
  <div class="edit-container">
    <el-form :model="ruleForm" ref="roleForm" :rules="rules" class="edit-form" label-width="150px">
      <el-form-item label="跳转目标">
        <el-radio-group v-model="ruleForm.jumpDestination" prop="jumpDestination">
          <el-radio v-for="(item, index) in destinations" :key="index" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
       <template v-if="ruleForm.jumpDestination === 'WEBPAGE'">
         <el-form-item label="跳转链接" prop="jumpUrl ">
           <el-input v-model="ruleForm.jumpUrl"></el-input>
         </el-form-item>
      </template>
      <el-form-item label="广告图片" prop="picUrl">
        <upload :limit="1" :postQiniupData="postQiniupData" @uploadSuccess="uploadSuccess" @removeUploadFile="removeUploadFile"></upload>
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
          <el-button @click="openProductDialog">添加</el-button>
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
      <product-dialog @addProduct = addProduct :limit='1'></product-dialog>      
    </el-dialog>
  </div>
</template>
<script>
import { handleBannerJump } from '@/api/appset'
import { getAllCategories, productsList} from '@/api/product'
import { getQiniuUpToken } from '@/api/user'
import productDialog from './components/productDialog'
import upload from '@/components/Upload'
export default {
  components: {
    productDialog,
    upload
  },
  data() {
    return {
      editType: '添加',
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
        jumpDestination: [{required: true, trigger: 'blur'}],
        picUrl: [{required: true, trigger: 'blur'}],
        jumpUrl : [{required: true, trigger: 'blur'}],
        jumpCategoryId: [{required: true, trigger: 'blur'}],
        productId: [{required: true, trigger: 'blur'}]
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
    this.getQiniuUpToken()
    this.getCategories()
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
          console.log('params', params)
          handleBannerJump(params).then(res => {
            this.$message({
              message: `${this.editType}成功`,
              type: 'success'
            });
          })
        }
      })
    }
  }
}
</script>