<template>
  <div v-if="showDialog">
    <el-dialog class="dialog" title="添加物料" width="70%" :visible="true" @close="closeDialog">
      <div class="search-box">
        <el-input class="search-input" prefix-icon="el-icon-search" v-model="searchForm.name" placeholder="输入物料名称"></el-input>
        <el-input class="search-input" prefix-icon="el-icon-search" v-model="searchForm.id" placeholder="输入物料编号"></el-input>
        <el-button @click="getListData">查询</el-button>
        <el-button type="primary" @click="addMaterial">添加</el-button>
      </div>
      <div class="dialog-content">
        <el-table border :data="tableData" @selection-change="handleSelectionChange">
           <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="物料编号" prop="id"></el-table-column>
          <el-table-column label="物料名称" prop="name"></el-table-column>
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
    </el-dialog>
  </div>
</template>

<script>
import { queryMaterials } from '@/api/materials'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    materialsType: {
      default: 'single'
    }
  },
  data() {
    return {
      tableData: [], // 物料查询结果列表
      searchForm: {
        name: '',
        id: ''
      },
      pageIndex: 0,
      pageSize: 10,
      total: 0,
      materials: null // 最后添加的物料
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
      queryMaterials(params).then(res => {
        this.tableData = res.data.materials
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
    handleSelectionChange(val) {
      console.log(val)
      if (this.materialsType === 'single') {
        if (this.materials && this.materials.length > 1) {
          this.$message({
            message: '商品组成为单个物料',
            type: 'warning'
          });
          thia.materials = val[0]
        } else {
          this.materials = val
        }
      } else {
        this.materials = val
      }
    },
    closeDialog(){
      console.log('ok')
      this.$emit('close')
    },
    addMaterial() {
      if (this.materials && this.materials.length > 0) {
        this.$emit('addMaterial', this.materials)
      } else {
        this.$alert('请选择物料', {
          confirmButtonText: '确定'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog{
  .search-box{
    .search-input{
      width: 200px;
    }
  }
  .dialog-content{
    margin-top: 30px;
  }
}
</style>
