<template>
  <div>
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px">
      <el-form-item label="跳转目标" prop="jumpDestination">
        <el-radio-group v-model="ruleForm.jumpDestination">
          <el-radio style="line-height:40px" v-for="(item, index) in destinations" :key="index" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
       <template v-if="ruleForm.jumpDestination === 'WEBPAGE'">
         <el-form-item label="跳转链接" prop="jumpUrl">
           <el-input v-model="ruleForm.jumpUrl"></el-input>
         </el-form-item>
      </template>
      <el-form-item label="广告图片" prop="picUrl">
        <upload :limit="1" :postQiniupData="postQiniupData" @uploadSuccess="uploadSuccess" @removeUploadFile="removeUploadFile"></upload>
        <div class="err" v-if="picUrlErr">请上传图片</div>
      </el-form-item>
      <template v-if="ruleForm.jumpDestination === 'CATEGORY'">
        <el-form-item label="选择类目" prop="jumpCategoryId">
          <el-radio-group v-model="ruleForm.jumpCategoryId">
            <el-radio v-for="(item, index) in categories" :key="index" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <template v-if="ruleForm.jumpDestination === 'PRODUCT'">
        <el-form-item label="选择商品" prop="productId">
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
          <div class="err" v-if="productErr">请添加商品</div>
        </el-form-item>
      </template>
    </el-form>
    <el-dialog title="添加商品" width="70%" :visible.sync="showProductDialog">
      <product-dialog @addProduct = addProduct :limit='1'></product-dialog>      
    </el-dialog>
  </div>
</template>
<script>
import { getAllCategories } from '@/api/product'
import { getQiniuUpToken } from '@/api/user'
import productDialog from '@/components/Dialog/productDialog'
import upload from '@/components/Upload'
export default {
  components: {
    productDialog,
    upload
  },
  props: {
    bannerJump: {
      default: null
    },
    type: {
      default: 'HOME_SECTION'
    }
  },
  data() {
    return {
      productErr: false,
      picUrlErr: false,
      ruleForm: {
        jumpDestination: '',
        picUrl: '',
        jumpUrl : '',
        jumpCategoryId: '',
        productId: '',
        type: '',
        associatedId: ''
      },
      rules: {
        jumpDestination: [{required: true, trigger: 'blur'}],
        // picUrl: [{required: true, message: '请上传图片', trigger: 'blur'}],
        jumpUrl : [{required: true, trigger: 'blur'}],
        jumpCategoryId: [{required: true, trigger: 'blur'}],
        // productId: [{required: true, trigger:  'blur'}]
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
    // this.ruleForm.associatedId = this.$route.query.associatedId || ''
    this.ruleForm.type = this.type
    if (!this.bannerJump) this.ruleForm = {...this.bannerJump}
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
      console.log('1', this.ruleForm.productId)
    },
    submitForm() {
      let data = {}
      console.log('2', this.ruleForm)
      this.$refs['ruleForm'].validate(valid => {
        this.picUrlErr = !Boolean(this.ruleForm.picUrl)
        if (this.ruleForm.type === 'PRODUCT') {
          this.productErr = !Boolean(this.ruleForm.productId)
        }
        data.valid = valid && !this.picUrlErr && !this.productErr
        console.log('ok', data.valid)
        if (data.valid) {
          data.bannerJump = {...this.ruleForm}
        }
      })
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
.err{
  // position: absolute;
  color: #F56C6C;
}
</style>