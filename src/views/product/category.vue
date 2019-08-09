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
      <el-table border :data="tableData" highlight-current-row>
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="分类名称" prop="name"></el-table-column>
        <el-table-column label="级别" prop="level"></el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="查看下级" type="expand" >
          <template slot-scope="scope">
            <!-- <el-button>查看下级</el-button> -->
            <el-table border :data="scope.row.children" style="width: 100%">
              <el-table-column label="编号" prop="id"></el-table-column>
              <el-table-column label="分类名称" prop="name"></el-table-column>
              <el-table-column label="级别" prop="level"></el-table-column>
              <el-table-column label="排序" prop="sort"></el-table-column>
              <el-table-column label="查看下级" type="expand">
                <template slot-scope="childScope">
                  <el-table border :data="childScope.row.children" style="width: 100%">
                    <el-table-column label="编号" prop="id"></el-table-column>
                    <el-table-column label="分类名称" prop="name"></el-table-column>
                    <el-table-column label="级别" prop="level"></el-table-column>
                    <el-table-column label="排序" prop="sort"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="grandChildScope" min-width="100px" fixed="right">
                        <el-button
                          size="mini"
                          type="text"
                          @click="handleEdit(grandChildScope.row.id)">编辑</el-button>
                        <el-button
                          size="mini"
                          type="text"
                          @click="handleDelete(grandChildScope.row.id)">删除</el-button>
                      </template>
                    </el-table-column> 
                  </el-table>  
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="childScope" min-width="100px" fixed="right">
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleEdit(childScope.row.id)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleDelete(childScope.row.id)">删除</el-button>
                </template>
              </el-table-column>  
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" min-width="100px" fixed="right">
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
import { getAllCategories } from '@/api/product'
export default {
  name: 'ProductList',
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getAllCategories()
  },
  methods: {
    getAllCategories() {
      getAllCategories().then(res => {
        this.tableData = res.data
        console.log(this.tableData)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
