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
          <el-form-item label="商品编号">
            <el-input v-model="listForm.id" placeholder="商品编号"></el-input>
          </el-form-item>
          <el-form-item label="商品状态">
            <el-select v-model="listForm.status">
              <el-option label="上架" :value="0"></el-option>
              <el-option label="下架" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader 
            v-model="listForm.category"
            :props="categoriesRule" 
            :options="categories" 
            expand-trigger="hover"
            @change="handleCategoriesChange"></el-cascader>
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
          <el-button type="primary" @click="add">添加</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column label="商品编号" prop="id"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="原价（元）" prop="priceIntervalOriginal"></el-table-column>
        <el-table-column label="售价（元）" prop="priceInterval"></el-table-column>
        <el-table-column label="商品类型" prop="type">
          <template slot-scope="scope">
            {{scope.row.type | keyToDes}}
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="商品状态" prop="status">
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
            <el-button
              size="mini"
              type="text"
              @click="handleSee(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
</template>
<script>
import { getAllCategories, productsList, handleProduct } from '@/api/product'
export default {
  name: 'ProductList',
  data() {
    return {
      tableData: [],
      listForm: {
        name: '',
        id: '',
        status: '',
        category: []
      },
      categories: [],
      categoriesRule: {
        value: 'id',
        label: 'name'
      },
      pageIndex: 0,
      pageSize: 10,
      total: 0,
      categoryId2: '',
      categoryId3: ''
    }
  },
  created() {
    this.getListData()
    this.getAllCategories()
  },
  methods: {
    getListData() {
      let params = this.getParams()
      productsList(params).then(res => {
        this.tableData = res.data.products
        this.total = res.data.total
      })
    },
    getParams() {
      let params = {
        'categoryId2': this.categoryId2,
        'categoryId3': this.categoryId3,
        'id': this.listForm.id,
        'keyword': this.listForm.name,
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize
      }
      if (this.listForm.status) {
        params.productStatus = this.listForm.status
      }
      return params
    },
    resetQuery() {
      this.listForm = {
        name: '',
        id: '',
        status: '',
        category: []
      }
      this.categoryId2 = ''
      this.categoryId3 = ''
    },
    getAllCategories() {
      getAllCategories().then(res => {
        this.categories = res.data
        this.deleteEmptyChildren(this.categories)
        console.log(this.categories)
      })
    },
    deleteEmptyChildren(data) {
      data.forEach(item => {
        if (item.children.length === 0 ) {
          delete item.children
        } else {
          this.deleteEmptyChildren(item.children)
        }
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
    handleCategoriesChange(value) {
      console.log('ok', value)
      this.categoryId2 = value[1] || ''
      this.categoryId3 = value[2] || ''
      console.log(this.categoryId2)
    },
    add() {
      this.$router.push({
        path: 'add'
      })
    },
    handleEdit(id) {
      this.$router.push({
        path: `update?id=${id}`
      })
    },
    handleSee(id) {
      this.$router.push({
        path: `see?id=${id}`
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
        handleProduct(params).then(res => {
          // this.getListData()
          this.$message({
            type: 'success',
            message: '状态修改成功!'
          })
        })
      }).catch(() => {
        if (val == 'SHELVE') {
          this.tableData[index].status = 'UNSHELVE'
        } else {
          this.tableData[index].status = 'SHELVE'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
