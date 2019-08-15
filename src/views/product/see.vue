<template>
  <div class="container">
    
  </div>  
</template>
<script>
import { productsList } from '@/api/product'
export default {
  data() {
    return {
      id: '',
      product: null
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getProductInfo()
  },
  methods: {
    getProductInfo() {
      let params = {
        id: this.id
      }
      productsList(params).then(res => {
        this.product = res.data.products[0]
      })
    }
  }
  
}
</script>
<style lang="scss" scoped>

</style>