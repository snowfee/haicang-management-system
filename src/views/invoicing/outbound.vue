<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-search" />
          <span>筛选搜索</span>
        </div>
        <div class="top-right">
          <el-button type="primary" @click="getListData">查询结果</el-button>
        </div>
      </div>
      <div class="box-content">
        <el-form class="form" :model="listForm" label-width="150px" label-position="right" :inline="true" >
          <el-form-item label="类型">
            <el-select v-model="listForm.targetRole">
              <el-option label="全部" value=""></el-option>
              <el-option label="供应商" value="SUPPLIER"></el-option>
              <el-option label="其他" value="OTHER"></el-option>
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
        <div class="top-right">
          <el-button @click="add">商品出库</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column prop="id" label="出库编号"></el-table-column>
        <el-table-column prop="targetRole" label="出库类型"></el-table-column>
        <el-table-column prop="materialId" label="物料ID"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" min-width="100px" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleSee(scope.$index)">明细</el-button>
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
    <el-dialog title="出库明细" :visible.sync="showDetaileDialog">
      <div v-if="detailData">
        <p>出库类型：{{detailData.targetRole | keyToDes}}</p>
        <p v-if="detailData.supplier">供应商名称：{{detailData.supplier.supplierName}}</p>
        <p>物料名称：{{detailData.material.name}}</p>
        <el-table border :data="detailData.material.materialSkuList">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="skuAttribute" label="属性"></el-table-column>
          <el-table-column prop="purchasePrice" label="采购价（元）"></el-table-column>
          <el-table-column prop="stock" label="库存"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryInventoryRecord, handleInventoryRecord } from '@/api/invoicing'
export default {
  data() {
    return {
      showDetaileDialog: false,
      listForm: {
        targetRole: ''
      },
      tableData: [],
      detailData: null,
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
        pageSize: this.pageSize,
        operateType: 'OUTBOUND'
      }
      if (this.listForm.targetRole) {
        param.targetRole = this.listForm.targetRole
      }
      queryInventoryRecord(param).then(res => {
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
        path: 'addOutbound'
      })
    },
    handleSee(index) {
      this.detailData = this.tableData[index]
      this.showDetaileDialog = true
    }
    // handleDelete(id) {
    //   let params = {
    //     id,
    //     methodType: 'DELETE',
    //   }
    //   this.$confirm('此操作将永久删除该出库信息, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     handleInventoryRecord(params).then(res => {
    //       this.getListData()
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!'
    //       })
    //     })
    //   })
    // },
  }
}
</script>

<style>

</style>
