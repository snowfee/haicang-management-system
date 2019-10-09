<template>
  <div class="order-container">
    <h2>{{receiptHead}}</h2>
    <div class="order-box">
      <el-row class="row">
        <el-col :span="8">订单编号：</el-col>
        <el-col :span="16">{{orderId}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">订单时间：</el-col>
        <el-col :span="16">{{orderDetail.createTime }}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">预约配送时间：</el-col>
        <el-col :span="16">{{orderDetail.deliveryTime }}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">送货人：</el-col>
        <el-col :span="16">{{deliveryman}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">送货人联系电话：</el-col>
        <el-col :span="16">{{phone}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">用户联系电话：</el-col>
        <el-col :span="16">{{receiverPhone}}</el-col>
      </el-row>
      <p class="font-bold">备注:</p>
      <p class="font-bold">{{orderDetail.remark}}</p>
    </div>
    <div class="order-box">
      <el-row class="row title">
        <el-col :span="8">购买清单：</el-col>
        <el-col class="title-right" :span="16">共{{orderDetail.allProductsCount }}件</el-col>
      </el-row>
      <el-row :gutter="5" class="row" v-for="(order, index) in orderItems" :key="index">
        <el-col :span="8">{{index+1}}.{{order.product.name}}</el-col>
        <el-col :span="4" style="text-align: center">{{order.count}}</el-col>
        <el-col :span="6">{{order.product.specification || order.product.priceUnit}}</el-col>
        <el-col :span="6" style="text-align: right">{{order.price}}元</el-col>
      </el-row>
    </div>
    <div class="order-box">
      <el-row class="row">
        <el-col :span="8">订单总额：</el-col>
        <el-col class="text-right" :span="16">{{orderDetail.paidPrice + orderDetail.discountPrice}}元</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">订单运费：</el-col>
        <el-col class="text-right" :span="16">{{orderDetail.deliveryPrice}}元</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">订单优惠：</el-col>
        <el-col class="text-right" :span="16">{{orderDetail.discountPrice}}元</el-col>
      </el-row>
    </div>
    <div class="order-box">
      <el-row class="row">
        <el-col :span="8">应收金额：</el-col>
        <el-col class="text-right" :span="16">{{orderDetail.paidPrice + orderDetail.deliveryPrice}}元</el-col>
      </el-row>
    </div>
    <div class="order-box">
      <el-row class="row">
        <el-col :span="24">{{receiptTail}}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">{{openTime}}</el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getPrintParams } from '@/api/home'
import { getOrderDetail } from '@/api/report'
export default {
  data() {
    return {
      orderItems: [],
      orderId: '',
      deliveryman: '',
      phone: '',
      issuer: '',
      companyName: '',
      printType: '',
      receiptHead: '',
      receiptTail: '',
      openTime: '',
      orderDetail: null
    }
  },
  created() {
    console.log(this.$route.query)
    this.orderId = this.$route.query.orderId
    this.deliveryman =this.$route.query.deliveryman
    this.phone = this.$route.query.phone
    this.issuer = this.$route.query.issuer
    this.receiverPhone = this.$route.query.receiverPhone
    this.getOrderDetail()
    this.getPrintParams()
  },
  methods: {
    getPrintParams() {
      getPrintParams('PRINT_COMPANY_NAME').then((res) => {
          if (res.status == 200) {
            this.companyName = res.data
          }
      })
      getPrintParams('PRINT_INVOICE_TYPE').then((res) => {
        if (res.status == 200) {
          this.printType = res.data
        }
      })
      // 小票头部提示语
      getPrintParams('RECEIPT_HEAD').then((res) => {
        if (res.status == 200) {
          this.receiptHead = res.data
        }
      })
      // 小票尾部提示语
      getPrintParams('RECEIPT_TAIL').then((res) => {
        if (res.status == 200) {
          this.receiptTail = res.data
        }
      })
      // 营业时间
      getPrintParams('RECEIPT_OPEN_HOURS').then((res) => {
        if (res.status == 200) {
          this.openTime = res.data
        }
      })
    },
    getOrderDetail() {
      getOrderDetail(this.orderId).then(res => {
        if (res.status == 200) {
          this.orderDetail = res.data
          this.orderItems = res.data.orderItems
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.font-bold{
  font-weight: bold;
}
.text-right{
  text-align: right;
}
.order-container {
  text-align: center;
  font-size: 16px;
  width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #000;
  .order-box {
    width: 100%;
    text-align: left;
    &::after{
      width: 100%;
      display: block;
      color: #cdcdcd;
      margin: 20px 0;
      content: '- - - - - - - - - - - - - - - 分割线 - - - - - - - - - - - - - - -';
      text-align: center;
    }
    .title{
      line-height: 40px;
      .title-right{
        text-align: right;
        font-size: 20px;
        font-weight: bold;
      }
    }
    &:last-child{
      &::after{
        display: none;
      }
    }
  }
}
</style>


