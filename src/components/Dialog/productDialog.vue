<template>
  <div>
    <div class="search-box">
      <el-input class="search-input" prefix-icon="el-icon-search" v-model="searchForm.keyword" placeholder="输入商品名称"></el-input>
      <el-input class="search-input" prefix-icon="el-icon-search" v-model="searchForm.id" placeholder="输入商品编号"></el-input>
      <el-button @click="getListData">查询</el-button>
      <el-button type="primary" @click="addProduct">添加</el-button>
    </div>
    <div class="dialog-content">
      <p v-if="limit != Infinity">提示：只能选择{{ limit }}个商品</p>
      <el-table border :data="tableData" @selection-change="handleSelectionChange">
         <el-table-column
          type="selection"
          width="55"
          :selectable="checkRow">
        </el-table-column>
        <el-table-column label="商品编号" prop="id"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
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
import { productsList } from '@/api/product'
export default {
  props: {
    limit: {
      default: Infinity
    }
  },
  data() {
    return {
      tableData: [],
      searchForm: {
        keyword: '',
        id: ''
      },
      pageIndex: 0,
      pageSize: 10,
      total: 0,
      products: []
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData() {
      let params = Object.assign({}, this.searchForm)
      params.pageSize = this.pageSize
      params.pageIndex = this.pageIndex
      productsList(params).then(res => {
        this.tableData = res.data.products
        this.total = res.data.total
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
    checkRow(row, index) {
      let checked = this.products.some(item => item.id === row.id)
      if (checked) return 1
      if (this.products.length >= this.limit) {
        return 0
      } else {
        return 1
      }
    },
    handleSelectionChange(val) {
      this.products = val
      console.log('pro', this.products)
    },
    addProduct() {
      if (this.products && this.products.length > 0) {
        this.$emit('addProduct', this.products)       
      } else {
        this.$alert('请选择商品', {
          confirmButtonText: '确定'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.search-box{
  .search-input{
    width: 200px;
  }
}
.dialog-content{
  margin-top: 30px;
}
</style>