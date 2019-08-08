<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-tickets" />
          <span>数据列表</span>
        </div>
        <div class="top-right">
          <el-button>添加</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="类型名称" prop="name"></el-table-column>
        <el-table-column label="属性数量" prop="attributeCount"></el-table-column>
        <el-table-column label="设置">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row.id)">属性列表</el-button>
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
              @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { skuAttributeList } from '@/api/materials'
export default {
  name: 'ProductList',
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData() {
      skuAttributeList().then(res => {
        this.tableData = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
