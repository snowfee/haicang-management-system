<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-search" />
          <span>筛选搜索</span>
        </div>
        <div class="top-right">
          <el-button type="primary" @click="handelSearch()">查询</el-button>
          <el-button type="primary" @click="handleReset()">重置</el-button>
          <el-button type="primary" @click="handelExcel()">下载报表</el-button>
        </div>
      </div>
      <div class="box-content">
        <el-form class="form" :model="searchForm" label-width="150px" label-position="right" :inline="true" >
          <el-form-item label="订单状态" prop="orderStatus">
            <el-select v-model="searchForm.orderStatus">
              <el-option label="全部" value=""></el-option>
              <el-option label="未支付" value="NOT_PAID"></el-option>
              <el-option label="订单过期" value="EXPIRED"></el-option>
              <el-option label="已支付待配送" value="PAID"></el-option>
              <el-option label="派送中" value="DELIVERY"></el-option>
              <el-option label="成功" value="SUCCESS"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单号" prop="orderId">
            <el-input v-model="searchForm.orderId"></el-input>
          </el-form-item>
          <el-form-item label="结账时间" prop="time">
            <el-date-picker
              v-model="searchForm.time"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="支付方式" prop="payType">
            <el-select v-model="searchForm.payType">
              <el-option label="全部" value=""></el-option>
              <el-option label="微信支付" value="WECHAT"></el-option>
              <el-option label="支付宝" value="ALIPAY"></el-option>
              <el-option label="现金支付" value="CASH"></el-option>
              <el-option label="挂账" value="ONCREDIT"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优惠方式" prop="couponType">
            <el-select v-model="searchForm.couponType">
              <el-option label="" value="">全部</el-option>
              <el-option label="折扣" value="DISCOUNT"></el-option>
              <el-option label="满减" value="FULL_MINUS"></el-option>
              <el-option label="商品券" value="PRODUCT"></el-option>
              <el-option label="代金券" value="VOUCHER"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="销售员" prop="staffName">
            <el-input v-model="searchForm.staffName"></el-input>
          </el-form-item> -->
        </el-form>
      </div>
    </div>
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-tickets" />
          <span>数据列表</span>
        </div>
        <div class="box-content">
          <div class="amout-price">
            <span>合计</span>
            <span>订单数：{{count}}</span>
            <span>订单金额：{{orderPriceAmout}}</span>
          </div>
        </div>
      </div>
    </div>
    <el-table border :data="tableData" style="width: 100%;">
      <template slot="empty">
        <div>
          {{ emptyText }}
        </div>
      </template>
      <el-table-column prop="orderId" label="订单号"></el-table-column>
      <el-table-column prop="orderStatus" label="订单状态"></el-table-column>
      <el-table-column prop="createTime" label="下单时间"></el-table-column>
      <el-table-column prop="memberName" label="商家名称"></el-table-column>
      <!-- <el-table-column prop="regionName" label="区域"></el-table-column> -->
      <el-table-column prop="payType" label="支付方式"></el-table-column>
      <!-- <el-table-column prop="staffName" label="销售员"></el-table-column> -->
      <el-table-column prop="orderPrice" label="订单金额"></el-table-column>
      <el-table-column prop="couponPrice" label="优惠金额"></el-table-column>
      <el-table-column prop="couponType" label="优惠方式"></el-table-column>
      <el-table-column min-width="100px" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleSeeDes(scope.$index, scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="showDialog">
      <div v-if="orderData">
        <p>评分：{{orderData.score < 0 ? '暂无' : orderData.score}}</p>
        <p>评论内容：{{orderData.commentConent?orderData.commentConent:'暂无'}}</p>
        <p>评论图片：<span v-if="orderData.commentImages.length == 0">暂无</span></p>
        <el-row gutter="10" v-if="orderData.commentImages && orderData.commentImages.length>0">
          <el-col :span="8" v-for="(item, index) in orderData.commentImages" :key="index">
            <img :src="item" width="100%">
          </el-col>
        </el-row>
      </div>
      <el-table border :data="tableData_des" style="width: 100%;">
        <el-table-column prop="product.name" label="商品名称"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="count" label="数量"></el-table-column>
        <el-table-column label="小计">
          <template slot-scope="scope">
            {{scope.row.count * scope.row.price}}
        </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { queryOrderList, getOrderDetail } from '@/api/report'
export default {
  data() {
    return {
      tableData: [],
      tableData_des: [],
      orderData: null,
      excelServe: this.EXCELSERVE + '/backend/report/orderList',
      emptyText: '暂无数据',
      time: [],
      count: 0,
      orderPriceAmout: 0.00,
      dialogTitle: '',
      showDialog: false,
      searchForm: {
        orderStatus: '',
        orderId: '',
        time: [],
        payType: '',
        couponType: ''
        // staffName: ''
      }
    }
  },
  created() {
    this.handelSearch()
  },
  methods: {
    getParams() {
      this.searchForm.from = this.searchForm.time[0] ? this.searchForm.time[0] : ''
      this.searchForm.to = this.searchForm.time[1] ? this.searchForm.time[1] : ''
      let params = Object.assign({}, this.searchForm)
      delete params.time
      return params
    },
    handelSearch() {
      this.emptyText = 'loading...'
      let params = this.getParams()      
      let query = this.paramsToString(params)
      queryOrderList(query).then(res => {
        this.tableData = []
        if (res.status != 200) {
          this.emptyText = res.message
          return
        }
        if(res.data.pageData.length > 0) {
            this.tableData = res.data.pageData
            this.count = res.data.total1
            this.orderPriceAmout = res.data.total2
          } else {
            this.emptyText = '暂无数据'
          }
      })
    },
    handelExcel() {
      let params = this.getParams()
      params.excelExport = 1
      let query = this.paramsToString(params)
      window.open(`${this.excelServe}?${query}`)
    },
    paramsToString(obj) {
      let query = ''
      let keys = Object.keys(obj)
      let len = keys.length
      keys.forEach((key, index) => {
        query += `${key}=${obj[key]}`
        if (index < len - 1) {
          query += '&'
        }
      })
      return query
    },
    handleReset() {
      this.searchForm = {
        orderStatus: '',
        orderId: '',
        time: [],
        payType: '',
        couponType: '',
        staffName: ''
      }
    },
    handleSeeDes(index, row) {
      this.dialogTitle = `订单明细-${row.orderId}`
      getOrderDetail(row.orderId).then(res => {
        if (res.status == 200) {
          this.tableData_des = res.data.orderItems
          this.orderData = res.data
          this.showDialog = true
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.search-box{
  margin-bottom: 20px;
  width: 830px;
}
.amout-price{
  margin-bottom: 15px;
  span{
    margin-right: 20px;
  }
}
p{
  margin: 10px 0px;
}
</style>
