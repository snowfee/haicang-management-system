<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-tickets" />
          <span>数据列表</span>
        </div>
        <div class="top-right">
          <el-button type="primary" @click="handelExcel">下载报表</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="materialId" label="物料ID"></el-table-column>
        <!-- <el-table-column prop="name" label="物料名称"></el-table-column> -->
        <el-table-column prop="purchasePrice" label="采购价格（元）"></el-table-column>
        <el-table-column prop="skuAttribute" label="SKU属性"></el-table-column>
        <el-table-column prop="stock" label="库存"></el-table-column>
        <el-table-column prop="stockPrice" label="库存金额（元）"></el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
          :current-page="pageIndex + 1"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>
    </div>
  </div>
</template>

<script>
import { inventoryMainList } from '@/api/invoicing'
export default {
  data() {
    return {
      tableData: [],
      pageSize: 10,
      excelServe: this.EXCELSERVE + '/backend/invoicing/productInventoryList',
      total: 0,
      pageIndex: 0
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getListData()
    },
    getListData() {
      let param = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      inventoryMainList(param).then(res => {
        this.tableData = res.data.pageData
        this.total = res.data.count
      })
    },
    handleCurrentPageChange(val) {
      this.pageIndex = val - 1
      this.getListData()
    },
    handlePageSizeChange(val) {
      this.pageSize = val
      this.getListData()
    },
    handelExcel() {
      let params = {}
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
  }
}
</script>

<style>

</style>
