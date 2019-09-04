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
          <el-form-item label="支付方式" prop="payType">
            <el-select v-model="searchForm.payType">
              <el-option label="全部" value=""></el-option>
              <el-option label="微信支付" value="WECHAT"></el-option>
              <el-option label="支付宝" value="ALIPAY"></el-option>
              <el-option label="现金支付" value="CASH"></el-option>
              <el-option label="挂账" value="ONCREDIT"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="payStatus">
            <el-select v-model="searchForm.payStatus">
              <el-option label="全部" value=""></el-option>
              <el-option label="支付成功" value="PAID_SUCCESS"></el-option>
              <el-option label="支付失败" value="PAID_FAILURE"></el-option>
            </el-select>
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
    </div>
    <el-table border :data="tableData" style="width: 100%;">
      <template slot="empty">
        <div>
          {{ emptyText }}
        </div>
      </template>
      <el-table-column prop="tradeNo" label="流水号"></el-table-column>
      <el-table-column prop="id" label="订单号"></el-table-column>
      <el-table-column prop="payType" label="支付方式">
        <template slot-scope="scope">
          {{scope.row.payType | keyToDes}}
        </template>
      </el-table-column>
      <el-table-column prop="paidPrice" label="支付金额"></el-table-column>
      <el-table-column prop="orderStatus" label="订单状态">
        <template slot-scope="scope">
          {{scope.row.orderStatus | keyToDes}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="支付时间"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { queryPaymentFlow } from '@/api/report'
export default {
  data() {
    return {
      tableData: [],
      excelServe: this.EXCELSERVE + '/backend/report/paymentFlow',
      emptyText: '暂无数据',
      searchForm: {
        payType: '',
        payStatus: '',
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
      queryPaymentFlow(query).then(res => {
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
