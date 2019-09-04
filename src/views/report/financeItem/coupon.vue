<template>
  <div>
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-search" />
          <span>筛选搜索</span>
        </div>
        <div class="top-right">
          <el-button type="primary" @click="handelSearch()">查询</el-button>
          <el-button type="primary" @click="handelExcel()">下载报表</el-button>
        </div>
      </div>
      <div class="box-content">
        <el-form class="form" :model="searchForm" label-width="150px" label-position="right" :inline="true" >
          <el-form-item label="交易时间" prop="time">
            <el-date-picker
              v-model="searchForm.time"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-tickets" />
          <span>数据列表</span>
        </div>
      </div>
      <div class="box-content">
        <div class="amout-price">
          <span>合计</span>
          <span>优惠合计：{{total1}}</span>
          <span>优惠订单数：{{total2}}</span>
        </div>
      </div>
    </div>
    <el-table border :data="tableData" style="width: 100%;">
      <template slot="empty">
        <div>
          {{ emptyText }}
        </div>
      </template>
      <el-table-column prop="date" label="订单日期"></el-table-column>
      <el-table-column prop="orderPrice" label="订单金额（元）"></el-table-column>
      <el-table-column prop="couponPrice" label="优惠合计（元）"></el-table-column>
      <el-table-column prop="couponPriceRate" label="优惠率"></el-table-column>
      <el-table-column prop="orderNum" label="订单总数"></el-table-column>
      <el-table-column prop="couponNum" label="优惠订单数"></el-table-column>
      <el-table-column prop="couponTotalRate" label="优惠总占比"></el-table-column>
      <el-table-column prop="fullMinusRate" label="满减占比"></el-table-column>
      <el-table-column prop="voucherRate" label="代金券占比"></el-table-column>
      <el-table-column prop="discountRate" label="折扣占比"></el-table-column>
      <el-table-column prop="productRate" label="商品券占比"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { queryFinanceForCoupon } from '@/api/report'
export default {
  data() {
    return {
      tableData: [],
      excelServe: this.EXCELSERVE + '/backend/report/financeForCoupon',
      emptyText: '暂无数据',
      total1: 0.00,
      total2: 0,
      searchForm: {
        time: []
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
      queryFinanceForCoupon(query).then(res => {
        this.tableData = []
        if (res.status != 200) {
          this.emptyText = res.message
          return
        }
        if(res.data.pageData.length > 0) {
            this.tableData = res.data.pageData
            this.total1 = res.data.total1
            this.total2 = res.data.total2
          } else {
            this.emptyText = '暂无数据'
          }
      })
    },
    handleCategoryChange(val) {
      this.searchForm.categoryId = val[val.length - 1]
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
          this.showDialog = true
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.search-box{
  margin-bottom: 30px;
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
