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
          <el-button type="primary">查询结果</el-button>
        </div>
      </div>
      <div class="box-content">
        <el-form :model="listForm" label-width="150px" label-position="right" :inline="true" >
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
            :props="categoriesRule" 
            :options="categories" 
            v-model="listForm.category"
            expand-trigger="hover"></el-cascader>
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
          <el-button>添加</el-button>
        </div>
      </div>
    </div>
    <div class="table">
      <el-table border :data="tableData">
        <el-table-column label="商品编号"></el-table-column>
        <el-table-column label="商品名称"></el-table-column>
        <el-table-column label="原价"></el-table-column>
        <el-table-column label="售价"></el-table-column>
        <el-table-column label="排序"></el-table-column>
        <el-table-column label="商品状态"></el-table-column>
        <el-table-column label="操作"></el-table-column>
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
      tableData: [],
      listForm: {
        name: '',
        id: '',
        status: '',
        category: ''
      },
      categories: [],
      categoriesRule: {
        value: 'id',
        label: 'name'
      }
    }
  },
  created() {
    this.getAllCategories()
  },
  methods: {
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
