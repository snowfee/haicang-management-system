<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-search" />
          <span>筛选搜索</span>
        </div>
        <div class="top-right">
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" @click="getListData">查询结果</el-button>
        </div>
      </div>
      <div class="box-content">
        <el-form class="form" :model="listForm" label-width="150px" label-position="right" :inline="true" >
          <el-form-item label="商品名称">
            <el-input v-model="listForm.name" placeholder="商品名称"></el-input>
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
          <el-button @click="add">添加</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="exchangePoints" label="价格"></el-table-column>
        <el-table-column prop="limited" label="限量(单位：份)"></el-table-column>
        <el-table-column prop="product.listUrl" label="图片">
          <template slot-scope="scope">
            <el-button type="text" @click="seePics(scope.row.product.listUrl)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            上架：<el-switch v-model="scope.row.status" active-value="SHELVE" inactive-value="UNSHELVE" 
            @change="handleStatusChange($event, scope.row.id, scope.$index)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row.id)">编辑</el-button>
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
    <el-dialog title="" :visible.sync="showProdutPicDialog" width="30%">
      <el-carousel height="300px">
        <el-carousel-item v-for="item in picUrls" :key="item">
          <img :src="item" width="100%" height="100%"/>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import { queryPointsProduct, handlePointsProduct } from '@/api/member'
export default {
  data() {
    return {
      tableData: [],
      listForm: {
        name: ''
      },
      pageSize: 10,
      total: 0,
      pageIndex: 0,
      showProdutPicDialog: false,
      picUrls: []
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
        name: this.listForm.name
      }
      queryPointsProduct(param).then(res => {
        this.tableData = res.data.pageData
        this.total = res.data.count
      })
    },
    seePics(picstr) {
      this.picUrls = picstr.split(',')
      this.showProdutPicDialog = true
    },
    resetQuery() {
      this.listForm.name = ''
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
        path: 'addPointsProduct'
      })
    },
    handleEdit(id) {
      this.$router.push({
        path: `updatePointsProduct?id=${id}`
      })
    },
    handleStatusChange(val, id, index) {
      console.log(index)
      let params = {
        id,
        status: val,
        methodType: 'SHELVE_PRODUCT'
      }
      this.$confirm('此操作将修改商品状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handlePointsProduct(params).then(res => {
          // this.getListData()
          this.$message({
            type: 'success',
            message: '状态修改成功!'
          })
        }, err => {
            if (val == 'SHELVE') {
            this.tableData[index].status = 'UNSHELVE'
          } else {
            this.tableData[index].status = 'SHELVE'
          }
        })
      })
    }
  }
}
</script>

