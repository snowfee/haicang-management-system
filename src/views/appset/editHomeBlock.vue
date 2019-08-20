<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="填写版块信息"></el-step>
    </el-steps>
    <el-form ref="roleForm" :model="ruleForm" :rules="rules" label-width="150px" class="edit-form">
      <el-form-item label="版块名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="版块类型" prop="type">
        <el-radio-group v-model="ruleForm.type" size="large" @change="handleTypeChange">
          <el-radio v-for="(type, index) in types" :key="index" :label="type.value" style="line-height: 40px">{{type.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <template v-if="ruleForm.type === 'CATEGORY'">
        <el-form-item label="商品类目">
          <el-checkbox-group v-model="ruleForm.categoryIds">
            <el-checkbox v-for="(item, index) in categories" :key="index" :label="item.id" style="line-height: 40px">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </template>
      <template v-if="ruleForm.type === 'SNAP_UP'">
        <el-form-item label="有效期">
          <el-date-picker
            v-model="ruleForm.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </template>
      <template v-if="ruleForm.type === 'ACTIVITY'">
        <el-form-item label="添加活动">
          <el-table border :data="bannerJumpList">
            <el-table-column label="活动编号" prop="id"></el-table-column>
            <el-table-column label="排序" prop="sort"></el-table-column>
            <el-table-column label="跳转目标" prop="jumpDestination ">
              <template slot-scope="scope">
                {{scope.row.jumpDestination | keyToDes}}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="editBannerJump(scope.row.id)">编辑</el-button>
                <el-button type="text" @click="deleteBannerJump(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <span class="err" v-show="showAddBannerJumpErr">请先提交后再添加活动</span>
            <el-button @click="addBannerJump" style="float: right">添加</el-button>
          </div>
        </el-form-item>
      </template>
      <template v-if="ruleForm.type === 'PRODUCT_LIST' || ruleForm.type === 'PRODUCT_BINARY' || ruleForm.type === 'SNAP_UP'">
        <el-form-item label="选择商品">
          <el-button @click="openProductDialog">添加商品</el-button>
          <el-table border :data="products" style="margin-top: 20px">
            <el-table-column label="编号" prop="id"></el-table-column>
            <el-table-column label="商品名称" prop="name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteProduct(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </template>
      <template v-if="ruleForm.type === 'GET_COUPON'">
        <el-form-item label="上传图片">
            <upload :limit="1" :fileList="fileList" :postQiniupData="postQiniupData" @uploadSuccess="uploadSuccess" @removeUploadFile="removeUploadFile"></upload>
        </el-form-item>
      </template>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog class="dialog" title="添加商品" width="70%" :visible.sync="showProductDialog">
      <product-dialog @addProduct = addProduct></product-dialog>      
    </el-dialog>
  </div>
</template>

<script>
import { handleHomeSection, getHomeSectionById, handleBannerJump } from '@/api/appset'
import { getAllCategories } from '@/api/product'
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
      id: '',
      editType: '添加',
      categories: [],
      fileList: [], // 图片上传列表
      ruleForm: {
        name: '',
        type: 'ACTIVITY',
        sort: '',
        categoryIds: [],
        time: '',
        picUrl: ''
      },
      rules: {
        name: [
          {required: true, trigger: 'blur'}
        ],
        type: [
          {required: true, trigger: 'blur'}
        ],
        sort: [
          {required: true, trigger: 'blur'}
        ],
        categoryIds: [
          {required: true, trigger: 'blur'}
        ]
      },
      types: [],
      stepStatus: 'progress',
      showProductDialog: false,
      products: [],
      postQiniupData: null,
      showAddBannerJumpErr: false,
      bannerJumpList: [] // 活动banner跳转集合
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    if (!this.id) { 
      this.showAddBannerJumpErr = true
    } else {
      this.editType = '更新'
      this.getHomeSectionInfo()
    }
    this.types = [{
      label: '活动版块',
      value: 'ACTIVITY'
    },{
      label: '类目版块',
      value: 'CATEGORY'
    },{
      label: '商品版块（列表）',
      value: 'PRODUCT_LIST'
    },{
      label: '商品版块（二分）',
      value: 'PRODUCT_BINARY'
    },{
      label: '抢购版块',
      value: 'SNAP_UP'
    },{
      label: '领券版块',
      value: 'GET_COUPON'
    },]
    this.getQiniuUpToken()
    this.getCategories()
  },
  methods: {
    getHomeSectionInfo() {
      getHomeSectionById(this.id).then(res => {
        let data = res.data
        this.ruleForm = {
          name: data.name,
          type: data.type,
          sort: data.sort,
          categoryIds: data.categoryIds.map(item => +item),
          time: '',
          picUrl: data.picUrl
        }
        this.products = [...data.productList]
        this.bannerJumpList = [...data.bannerJumpList]
        let picName = this.ruleForm.picUrl.split('/')
        picName = picName[picName.length -1]
        this.$set(this.fileList, 0, {name: picName, url: this.ruleForm.picUrl})
        if (data.type === 'SNAP_UP') {
          this.ruleForm.time = [data.startTime, data.endTime]
        }
      })
    },
    getQiniuUpToken() {
      getQiniuUpToken().then(res => {
        this.postQiniupData = {}
        this.postQiniupData.token = res.data
      })
    },
    getCategories() {
      getAllCategories().then(res => {
        this.categories = res.data
      })
    },
    uploadSuccess(fileList, imgServe) {
      console.log(fileList)
      this.ruleForm.picUrl = `${imgServe}/${fileList[0].response.key}`
    },
    removeUploadFile(file, imgServe) {
      this.ruleForm.picUrl = ''
    },
    openProductDialog() {
      this.showProductDialog = true
    },
    addProduct(data) {
      this.showProductDialog = false
      if (!this.products || this.products.length === 0) {
        this.products = [...data]
        return
      }
      this.products = [...this.products, ...data]
      this.products = this.uniqueById(this.products)
    },
    // 去重
    uniqueById(arr) {
      if (!Array.isArray(arr)) {
        console.log('type error')
        return
      }
      let obj = {}
      return arr.filter(item => {
        if (!obj[item.id]) {
          obj[item.id] = 1
          return true
        } else {
          ++obj[item.id]
          return false
        }
      })
    },
    deleteProduct(index) {
      this.products.splice(index, 1)
    },
    editBannerJump(id) {
      this.$router.push({
        path: `editJump?id=${id}`
      })
    },
    deleteBannerJump(id) {
      let params = {
        id,
        methodType: 'DELETE'
      }
      this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleBannerJump(params).then(res => {
          this.getHomeSectionInfo()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    handleTypeChange(val) {
      console.log(val)
      // 类型选择切换时清空已选商品
      this.products = []
      this.ruleForm.picUrl = ''
      this.ruleForm.time = ''
      this.ruleForm.categoryIds = []
    },
    addBannerJump() {
      if (!this.id) return
      this.$router.push({
        path: `addJump?associatedId=${this.id}&type=HOME_SECTION`
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.ruleForm)
          if (this.editType === '添加') {
            params.methodType = 'ADD'
          } else {
            params.methodType = 'UPDATE'
          }
          if (params.time) {
            params.startTime = params.time[0]
            params.endTime = params.time[1]
          }
          params.categoryIds = params.categoryIds.join(',')
          if (this.products && this.products.length > 0) {
            let productIds = []
            this.products.forEach(item => {
              productIds.push(item.id)
            })
            params.productIds = productIds.join(',')
          }
          delete params.time
          console.log('ok', params)
          handleHomeSection(params).then(res => {
            this.$message({
              message: `版块${this.editType}成功`,
              type: 'success'
            });
            if (this.editType === '添加' && this.ruleForm.type === 'ACTIVITY') {
              this.$router.replace({
                path: `updateHomeBlock?id=${res.data}`
              })
            } else {
              this.$router.replace({
                path: 'homePage'
              })
            }
          })
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.err{
  color: red;
  font-size: 12px;
}
</style>
