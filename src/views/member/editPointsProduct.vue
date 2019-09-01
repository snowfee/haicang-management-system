<template>
  <div class="edit-container">
    <el-steps align-center :active="0" :process-status="stepStatus" class="edit-step">
      <el-step title="编辑商品信息"></el-step>
    </el-steps>
    <el-form :model="ruleForm" ref="roleForm" :rules="rules" label-width="150px" class="edit-form">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="count">
        <el-input v-model.number="ruleForm.count"></el-input>
      </el-form-item>
      <el-form-item label="需要积分数" prop="exchangePoints">
        <el-input v-model.number="ruleForm.exchangePoints" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="限量" prop="limited">
        <el-input v-model.number="ruleForm.limited" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio label="SHELVE">上架</el-radio>
          <el-radio label="UNSHELVE">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品选择" prop="productId">
        <el-button @click="showProductDialog = true">选择</el-button>
        <el-table border :data="product" style="margin-top: 15px">
          <el-table-column label="编号" prop="id"></el-table-column>
          <el-table-column label="商品名称" prop="name"></el-table-column>
          <el-table-column label="商品属性" prop="selectedSKU.skuAttribute"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item size="large" class="form-btn">
        <el-button type="primary" @click="submitForm('roleForm')">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog class="dialog" title="选择商品" width="50%" :visible.sync="showProductDialog">
      <product-dialog :canSelectSku="true" @addProduct = addProduct :limit="1"></product-dialog>      
    </el-dialog>
  </div>
</template>

<script>
import { handlePointsProduct, getPointsProductById } from '@/api/member'
import productDialog from '@/components/Dialog/productDialog'
export default {
  components:{
    productDialog
  },
  data() {
    return {
      editType: '添加',
      showProductDialog: false,
      product: [],
      preRuleForm: null,
      ruleForm: {
        name : '',
        count: '',
        exchangePoints: '',
        limited: '',
        status: 'SHELVE'
      },
      rules: {
        name: [{ required: true, trigger: 'blur' }],
        count: [{ required: true, trigger: 'blur' }],
        exchangePoints: [{ required: true, trigger: 'blur' }],
        limited: [{ required: true, trigger: 'blur' }],
        status: [{ required: true, trigger: 'blur' }]
      },
      stepStatus: 'progress',
      id: ''
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    this.preRuleForm = {...this.ruleForm}
    if (this.id) {
      this.editType = '更新'
      this.getTheProduct()
    }
  },
  methods: {
    getTheProduct() {
      getPointsProductById(this.id).then(res => {
        this.ruleForm = {...res.data}
        this.product = [{...res.data.product}]
        this.product[0].selectedSKU = {...res.data.productSku}
        delete this.ruleForm.product
        delete this.ruleForm.productSku
        this.preRuleForm = {...this.ruleForm}
      })
    },
    addProduct(product) {
      this.product = [...product]
      this.showProductDialog = false
      this.ruleForm.productId = this.product[0].id
      this.ruleForm.productSkuId = this.product[0].selectedSKU.id
    },
    reset() {
      this.ruleForm = {...this.preRuleForm}
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
          handlePointsProduct(params).then(res => {
            this.$message({
              message:`积分商品${this.editType}成功`,
              type: 'success'
            });
            this.$router.replace({
              path: 'pointsProduct'
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
