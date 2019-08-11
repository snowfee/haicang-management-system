<template>
  <div class="edit-container">
    <el-steps align-center :active="activeStep" class="edit-step">
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品属性"></el-step>
    </el-steps>
      <el-form :model="formData" :rule="ruleForm" label-width="120px">
        <template v-show="activeStep == 0">
          <el-form-item label="商品分类">

          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="name"></el-input>
          </el-form-item>
          <el-form-item label="副标题">
            <el-input v-model="subtitle"></el-input>
          </el-form-item>
          <el-form-item label="计量单位">
            <el-input v-model="priceUnit"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="weight"></el-input>
          </el-form-item>
          <el-form-item label="生产日期">
            <el-input v-model="producedDate"></el-input>
          </el-form-item>
           <el-form-item label="保质期">
            <el-input v-model="shelfLife"></el-input>
          </el-form-item>
          <el-form-item label="其他信息">
            <el-input v-model="remar"></el-input>
          </el-form-item>
        </template>
        <template v-show="activeStep == 1">
          
        </template>
      </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeStep: 0,
      formData: {
        name: ''
      },
      ruleForm: {}
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
