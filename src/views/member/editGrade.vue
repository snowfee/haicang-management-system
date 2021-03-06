<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="编辑会员等级信息" />
    </el-steps>
    <el-form ref="roleForm" :model="ruleForm" :rules="rules" label-width="150px" class="edit-form">
      <el-form-item label="会员等级名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="会员图片" prop="picUrl">
        <upload :limit="1" :file-list="fileList" :post-qiniup-data="postQiniupData" @uploadSuccess="uploadSuccess" @removeUploadFile="removeUploadFile" />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="ruleForm.price">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="折扣" prop="discount">
        <el-input v-model="ruleForm.discount" autocomplete="off">
          <template slot="append">折</template>
        </el-input>
      </el-form-item>
      <el-form-item label="赠品选择" prop="productId">
        <el-button @click="showProductDialog = true">更换赠品</el-button>
        <el-table border :data="product" style="margin-top: 15px">
          <el-table-column label="编号" prop="id" />
          <el-table-column label="商品名称" prop="name" />
          <el-table-column label="商品属性" prop="selectedSKU.skuAttribute" />
        </el-table>
      </el-form-item>
      <el-form-item label="赠品数量" prop="count">
        <el-input v-model.number="ruleForm.count" autocomplete="off">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="赠品下发时间" prop="startDay">
        <el-input v-model="ruleForm.startDay" autocomplete="off">
          <template slot="prepend">当月</template>
          <template slot="append">日</template>
        </el-input>
      </el-form-item>
      <el-form-item label="赠品过期时间" prop="endDay">
        <el-input v-model="ruleForm.endDay">
          <template slot="prepend">当月</template>
          <template slot="append">日</template>
        </el-input>
      </el-form-item>
      <el-form-item label="会员升级价格" prop="upgradePrice">
        <el-input v-model="ruleForm.upgradePrice" />
      </el-form-item>
      <el-form-item label="续费价格" prop="renewPrice">
        <el-input v-model="ruleForm.renewPrice">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="提示语设置" prop="markedWords">
        <el-input v-model="ruleForm.markedWords" />
      </el-form-item>
      <el-form-item label="积分获取比例" prop="pointsProportion">
        <el-input v-model="ruleForm.pointsProportion" placeholder="0到1之前的小数，最多两位小数点" />
      </el-form-item>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog class="dialog" title="选择商品" width="50%" :visible.sync="showProductDialog">
      <product-dialog :can-select-sku="true" :limit="1" :show="showProductDialog" @addProduct="addProduct" />
    </el-dialog>
  </div>
</template>

<script>
import { handleMembershipGrade, getMembershipGradeById } from '@/api/member'
import { getQiniuUpToken } from '@/api/user'
import upload from '@/components/Upload'
import productDialog from '@/components/Dialog/productDialog'
export default {
  components: {
    upload,
    productDialog
  },
  data() {
    return {
      showProductDialog: false,
      ruleForm: {
        name: '',
        picUrl: '',
        price: '',
        discount: '',
        count: '',
        startDay: '',
        endDay: '',
        upgradePrice: '',
        renewPrice: '',
        markedWords: '',
        pointsProportion: '',
        productId: '',
        productSkuId: ''
      },
      rules: {
        name: [{ required: true, message: '请输入会员等级名称', trigger: 'blur' }],
        picUrl: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }, { pattern: /^[0-9]+(.[0-9]{1,2})?$/, message: '格式错误,最多两位小数', trigger: 'blur' }],
        discount: [{ required: true, message: '请输入折扣', trigger: 'blur' }, { pattern: /^[0-9]{1}(.[0-9]{1,2})?$/, message: '格式错误', trigger: 'blur' }],
        count: [{ required: true, message: '请输入赠品数量', trigger: 'blur' }],
        startDay: [{ required: true, message: '请输入赠品下发时间', trigger: 'blur' }],
        endDay: [{ required: true, message: '请输入赠品过期时间', trigger: 'blur' }],
        upgradePrice: [{ required: true, message: '请输入会员升级价格', trigger: 'blur' }, { pattern: /^[0-9]+(.[0-9]{1,2})?$/, message: '格式错误,最多两位小数', trigger: 'blur' }],
        renewPrice: [{ required: true, message: '请输入续费价格', trigger: 'blur' }, { pattern: /^[0-9]+(.[0-9]{1,2})?$/, message: '格式错误,最多两位小数', trigger: 'blur' }],
        markedWords: [{ required: true, message: '请输入提示语设置', trigger: 'blur' }],
        pointsProportion: [{ required: true, message: '请输入积分获取比例', trigger: 'blur' }, { pattern: /^0\.[0-9]{1,2}$/, message: '0到1之前的小数，最多两位小数点', trigger: 'blur' }],
        productId: [{ required: true, message: '请添加赠品', trigger: 'blur' }]
      },
      stepStatus: 'progress',
      id: '',
      postQiniupData: null,
      fileList: [],
      product: []
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    this.getGradeInfo()
    this.getQiniuUpToken()
  },
  methods: {
    cancel() {
      this.$router.back()
    },
    getGradeInfo() {
      getMembershipGradeById(this.id).then(res => {
        this.ruleForm = { ...res.data }
        this.fileList = [{ url: this.ruleForm.picUrl }]
        this.product = [{ ...res.data.product }]
        this.product[0].selectedSKU = { ...res.data.productSku }
        delete this.ruleForm.product
        delete this.ruleForm.productSku
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
    addProduct(product) {
      this.product = [...product]
      console.log('ok', this.product)
      this.showProductDialog = false
      this.ruleForm.productId = this.product[0].id
      this.ruleForm.productSkuId = this.product[0].selectedSKU.id
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = { ...this.ruleForm }
          params.methodType = 'UPDATE'
          handleMembershipGrade(params).then(res => {
            this.$message({
              message: `会员等级更新成功`,
              type: 'success'
            })
            this.$router.replace({
              path: 'membershipGrade'
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
