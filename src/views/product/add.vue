<template>
  <div class="edit-container">
    <el-steps align-center :active="activeStep">
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品属性"></el-step>
    </el-steps>
    <div v-show="activeStep == 0">
      <el-form :model="formData" :rule="ruleForm" label-width="100px">
        <el-form-item label="商品分类">
          <!-- <el-input v-model="" placeholder=""></el-input> -->
        </el-form-item>
        <el-form-item label="商品名称">
          <!-- <el-input v-model="" placeholder=""></el-input> -->
        </el-form-item>
        <el-form-item label="商品分类">
          <!-- <el-input v-model="" placeholder=""></el-input> -->
        </el-form-item>
      </el-form>
    </div>
    <div v-show="activeStep == 1">
      <el-form :model="formData" :rule="ruleForm" label-width="100px">
        <el-form-item label="商品分类"></el-form-item>
        <el-form-item label="商品分类"></el-form-item>
        <el-form-item label="商品分类"></el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeStep: 0,
      formData: {},
      ruleForm: {}
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
