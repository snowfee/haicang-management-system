<template>
  <div class="edit-container">
    <el-steps align-center :active="activeStep" class="edit-step">
      <el-step title="填写活动信息"></el-step>
    </el-steps>
    <el-form class="edit-form" ref="formData" :model="formData" :rules="ruleForm" label-width="150px">
      <el-form-item label="优惠券类型" prop="couponType">
        <el-select v-model="formData.couponType">
          <el-option v-for="(item, index) in couponTypes" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="优惠券说明" prop="description">
        <el-input v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="折扣" prop="discount" v-if="formData.couponType === 'DISCOUNT'">
        <el-input min="0" max="100" v-model="formData.discount">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="满减" v-if="formData.couponType === 'FULL_MINUS'">
        <el-form-item label="满" prop="full" label-width="45px">
          <el-input v-model="formData.full">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="减" prop="discount" label-width="45px">
          <el-input v-model="formData.discount">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="代金券" prop="discount" v-if="formData.couponType === 'VOUCHER'">
        <el-input v-model="formData.discount">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="可使用商品" prop="isForAllProduct">
        <el-radio-group v-model="formData.isForAllProduct">
          <el-radio-button :label="1">全场通用</el-radio-button>
          <el-radio-button :label="0">指定商品</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择" prop="productIds" v-if="formData.isForAllProduct === 0">
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
      <el-form-item label="是否需要积分" prop="isNeedPoints">
        <el-switch v-model="formData.isNeedPoints" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="积分" prop="points" v-if="formData.isNeedPoints === 1">
        <el-input v-model.number="formData.points"></el-input>
      </el-form-item>
      <el-form-item label="永久不结束" prop="isPermanent">
        <el-switch v-model="formData.isPermanent" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="有效期" prop="time" v-if="formData.isPermanent === 0">
        <el-date-picker 
          v-model="formData.time" 
          type="daterange" 
          range-separator="至" 
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期" 
          end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item size="large" class="form-btn">
        <el-button @click="reset()">重置</el-button>
        <el-button type="primary" @click="submit('formData')">提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog class="dialog" title="添加商品" width="70%" :visible.sync="showProductDialog">
      <product-dialog @addProduct = addProduct></product-dialog>      
    </el-dialog>
  </div>
</template>

<script>
import { handleCoupon, getCouponById } from '@/api/product'
import productDialog from '@/components/Dialog/productDialog'
export default {
  components: {
    productDialog
  },
  data() {
    return {
      id: '',
      editType: '添加',
      activeStep: 0,
      showProductDialog: false,
      products: [],
      couponTypes: [{value: 'DISCOUNT', label: '折扣'}, {value: 'FULL_MINUS', label: '满减'}, {value: 'VOUCHER', label: '代金券'}],
      formData: {
        name: '',
        couponType: 'DISCOUNT',
        time: [],
        isForAllProduct: 1,
        isPermanent: 0,
        isNeedPoints: 0,
        points: '',
        description: '',
        full: '',
        discount: '',
        productIds: ''
      },
      preFormData: null,
      ruleForm: {
        name: [{ required: true, trigger: 'blur' }],
        time: [{ required: true, trigger: 'blur' }],
        points: [{ required: true, trigger: 'blur' }],
        description: [{ required: true, trigger: 'blur'}],
        full: [
          { required: true, trigger: 'blur' }, 
          { pattern:/^[0-9]+(\.[0-9]{0,2})?$/, message: '格式应为数值且最多两位小数', trigger: 'blur' }
        ],
        discount: [
          { required: true, trigger: 'blur' },
          { pattern:/^[0-9]+(\.[0-9]{0,2})?$/, message: '格式应为数值且最多两位小数', trigger: 'blur' }
        ],
        productIds: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.id = this.$route.query.id || ''
    if (this.id) {
      this.editType = '更新'
      this.getTheCoupon()
    } else {
      this.editType = '添加'
    }
    this.preFormData = {...this.formData}
  },
  methods: {
    getTheCoupon() {
      getCouponById(this.id).then(res => {
        let data = res.data
        this.formData = {...res.data}
        this.formData.time = [data.startTime, data.endTime]
        this.formData.productIds = data.productIds.join(',')
        delete this.formData.createTime
        delete this.formData.startTime
        delete this.formData.endTime
        this.preFormData = {...this.formData}
      })
    },
    openProductDialog() {
      this.showProductDialog = true
    },
    addProduct(data) {
      this.showProductDialog = false
      if (!this.products || this.products.length === 0) {
        this.products = [...data]
      } else {
        this.products = [...this.products, ...data]
        this.products = this.uniqueById(this.products)
      }
      this.formData.productIds = this.products.map(item => item.id).join(',')
      console.log('ok', this.formData.productIds)
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
    reset() {
      this.formData = {...this.preFormData}
    },
    deleteProduct(index) {
      this.products.splice(index, 1)
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {...this.formData}
          delete params.time
          if (this.formData.time.length > 0) {
            params.endTime = this.formData.time[1]
            params.startTime = this.formData.time[0]
          }
          if (this.editType = '添加') {
            params.methodType = 'ADD'
          } else {
            params.methodType = 'UPDATE'
            params.id = this.id
          }
          console.log('params', params)
          handleCoupon(params).then(res => {
            this.$message({
              message: `活动${this.editType}成功`,
              type: 'success'
            });
            this.$router.replace({
              path: `coupon`
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
