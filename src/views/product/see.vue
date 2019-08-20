<template>
  <div class="container">
    <h2>查看商品</h2>
    <div class="content-box">
      <div class="detail-item">
        <div class="item-cell">
          <span class="title">商品分类：</span>
          {{categoryName}}
        </div>
        <div class="item-cell">
          <span class="title">商品货号：</span>
          {{product.id}}
        </div>
      </div>
      <div class="detail-item">
        <div class="item-cell">
          <span class="title">商品名称：</span>
          {{product.name}}
        </div>
        <div class="item-cell">
          <span class="title">副标题：</span>
          {{product.subtitle || ''}}
        </div>
      </div>
      <div class="detail-item">
        <div class="item-cell">
          <span class="title">商品售价：</span>
          {{product.priceInterval }}元
        </div>
        <div class="item-cell">
          <span class="title">商品原价：</span>
          {{product.priceIntervalOriginal }}元
        </div>
      </div>
      <div class="detail-item">
        <div class="item-cell">
          <span class="title">生产日期：</span>
          {{product.producedDate}}
        </div>
        <div class="item-cell">
          <span class="title">计量单位：</span>
          {{product.priceUnit}}
        </div>
      </div>
      <div class="detail-item">
        <div class="item-cell">
          <span class="title">商品类型：</span>
          {{product.type | keyToDes}}
        </div>
        <div class="item-cell">
          <span class="title">总销量：</span>
          {{product.totalSales}}
        </div>
      </div>
      <div class="detail-item">
        <div class="item-cell">
          <span class="title">保质期：</span>
          {{product.shelfLife}}
        </div>
        <div class="item-cell">
          <span class="title">其他信息：</span>
          {{product.remark || ''}}
        </div>
      </div>
      <div class="detail-item">
        <span class="title">商品相册：</span>
        <span class="img-box">
          <img v-for="(pic, index) in product.listUrl" :key="index" :src="pic"/>
        </span>
      </div>
    </div>
  </div>  
</template>
<script>
import { productsList, getAllCategories } from '@/api/product'
export default {
  data() {
    return {
      id: '',
      product: {},
      categoryName: ''
    }
  },
  created() {
    this.id = this.$route.query.id
    // this.getProductInfo()
    this.getAllCategories()
  },
  methods: {
    getProductInfo() {
      let params = {
        id: this.id
      }
      return productsList(params).then(res => {
        this.product = res.data.products[0]
        this.product.listUrl = this.product.listUrl.split(',')
      })
    },
    async getAllCategories() {
      await this.getProductInfo()
      getAllCategories().then(res => {
        this.categoryName = this.getCategoryName(this.product.category.allLineIds, res.data)
      })
    },
    getCategoryName(val, opt) {
      let nameArr = []
      const len = val.length 
      val.forEach((val, index) => {
        for (let item of opt) {
          if (item.id === val) {
            nameArr.push(item.name)
            if (index < len - 1) {
              opt = item.children
              break
            }
          }
        }
      });
      return nameArr.join('/')
    }
  }
  
}
</script>
<style lang="scss" scoped>
  .container{
    padding: 20px 50px;
  }
  .content-box{
    .detail-item{
      line-height: 40px;
      .title{
        color: grey;
        vertical-align: top;
      }
      .item-cell{
        display: inline-block;
        &:first-of-type{
          width: 500px;
        }
      }
      .img-box{
        img{
          vertical-align: top;
          height: 180px;
          padding: 0 10px;
        }
      }
    }
  }
</style>