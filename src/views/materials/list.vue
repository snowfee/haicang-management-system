<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-search" />
          <span>筛选搜索</span>
        </div>
        <div class="top-right">
          <el-button>重置</el-button>
          <el-button type="primary" @click="getListData">查询结果</el-button>
        </div>
      </div>
      <div class="box-content">
        <el-form class="form" :model="listForm" label-width="150px" label-position="right" :inline="true">
          <el-form-item label="物料名称" prop="name">
            <el-input v-model="listForm.name" placeholder="物料名称" />
          </el-form-item>
          <el-form-item label="物料编号" prop="id">
            <el-input v-model="listForm.id" placeholder="物料编号" />
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
          <el-button type="primary" @click="toAddPage">添加</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column label="物料编号" prop="id" />
        <el-table-column label="物料名称" prop="name" />
        <el-table-column label="基本单位" prop="basicUnit" />
        <el-table-column label="采购单位" prop="purchaseUnit" />
        <!-- <el-table-column label="单价（元）" prop="name"></el-table-column> -->
        <!-- <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-value="ENABLE" inactive-value="DISABLE"></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="创建时间" prop="name" />
        <el-table-column label="操作" min-width="100px" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          :current-page="pageIndex + 1"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { queryMaterials, handleMaterial } from '@/api/materials'
export default {
  name: 'ProductList',
  data() {
    return {
      tableData: [],
      listForm: {
        name: '',
        id: ''
      },
      listRules: [],
      pageIndex: 0,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData() {
      const params = this.getParams()
      queryMaterials(params).then(res => {
        this.tableData = res.data.materials
        this.total = res.data.total
      })
    },
    getParams() {
      const params = Object.assign({}, this.listForm)
      params.pageIndex = this.pageIndex
      params.pageSize = this.pageSize
      return params
    },
    handleCurrentPageChange(val) {
      this.pageIndex = val - 1
      this.getListData()
    },
    handlePageSizeChange(val) {
      this.pageSize = val
      this.getListData()
    },
    handleEdit(id) {
      this.$router.push({
        path: `edit?id=${id}`
      })
    },
    toAddPage() {
      this.$router.push({
        path: 'add'
      })
    },
    handleDelete(id) {
      const params = {
        id,
        methodType: 'DELETE'
      }
      this.$confirm('此操作将永久删除该物料, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handleMaterial(params).then(res => {
          this.getListData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
