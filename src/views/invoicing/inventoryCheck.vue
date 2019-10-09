<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-tickets" />
          <span>数据列表</span>
        </div>
        <div class="top-right">
          <el-button type="primary" @click="add">添加</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="type" label="盘点类型">
          <template slot-scope="scope">
            {{scope.row.type | keyToDes}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{scope.row.status === 1 ? '已完成' : '未完成'}}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" min-width="100px" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleSee(scope.row.id)">明细</el-button>
            <!-- <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row.id)">删除</el-button> -->
          </template>
        </el-table-column>
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
    <el-dialog title="盘点明细" :visible.sync="showDetaileDialog">
      <div v-if="detailData">
        <p>盘点时间：{{detailData.createTime}}</p>
        <p> 盘点类型：{{detailData.type | keyToDes}} </p>
        <p>状态：{{detailData.status==0?'未完成':'已完成'}}</p>
        <p>备注：{{detailData.remark?detailData.remark:'无'}}</p>
        <p>盘点内容：</p>
        <el-table border :data="detailData.content.items">
          <el-table-column prop="id" label="物料ID"></el-table-column>
          <el-table-column prop="skuAttribute" label="属性"></el-table-column>
          <el-table-column prop="systemCount" label="实盘数量"></el-table-column>
          <el-table-column prop="purchasePrice" label="账面数量"></el-table-column>
          <el-table-column prop="purchasePrice" label="采购价（元）"></el-table-column>
          <el-table-column prop="lossAmount" label="损益金额（元）"></el-table-column>
          <el-table-column prop="lossCount" label="损益数量"></el-table-column>
          <el-table-column prop="stock" label="库存"></el-table-column>
          <el-table-column prop="balanceStatus" label="抹平状态">
            <template slot-scope="scope">
              {{scope.row.balanceStatus == 0?'未抹平':'已抹平'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100px" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.balanceStatus == 0"
                size="mini"
                type="text"
                @click="balanceStock(detailData.id, scope.row.id, scope.row.actualCount)">抹平</el-button>
              <span v-else>无</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { stockCheckList, handleStockCheck, balanceStockCheckItem } from '@/api/invoicing'
export default {
  data() {
    return {
      showDetaileDialog: false,
      detailData: null,
      tableData: [],
      pageSize: 10,
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
      stockCheckList(param).then(res => {
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
    add() {
      this.$router.push({
        path: 'addInventoryCheck'
      })
    },
    handleSee(id) {
      this.detailData = this.tableData.filter(item => item.id === id)[0]
      console.log('ok', this.detailData)
      this.showDetaileDialog = true
    },
    balanceStock(id, materialSkuId, count) {
      let params = {
        id,
        materialSkuId,
        count
      }
      this.$confirm('是否抹平该盘点信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        balanceStockCheckItem(params).then(res => {
          this.getListData()
        })
      })
    }
    // handleDelete(id) {
    //   let params = {
    //     id,
    //     methodType: 'DELETE'
    //   }
    //   this.$confirm('此操作将永久删除该供应商, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     handleSupplier(params).then(res => {
    //       this.getListData()
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!'
    //       })
    //     })
    //   })
    // }
  }
}
</script>

<style>

</style>
