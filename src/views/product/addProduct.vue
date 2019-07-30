<template>
  <div class="edit-container box">
    <el-steps align-center :active="activeStep">
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品属性"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeStep: 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-container{
    width: 800px;
    margin: 20px auto;
  }
</style>
