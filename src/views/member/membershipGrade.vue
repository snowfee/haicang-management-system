<template>
  <div class="container">
    <div class="grade-box first" v-if="grades">
      <div class="grade-item left">
        <p class="grade-name">{{grades[0].name}}</p>
        <p class="grade-limit">{{grades[0].price}}元成为会员</p>
      </div>
      <div class="grade-item right">
        <p class="grade-discount">{{grades[0].discount}}折</p>
        <p class="grade-count">{{grades[0].count}}件赠品/月</p>
      </div>
      <div class="grade-mask" @click="edit(grades[0].id)">
        <p class="grade-edit-btn">编辑</p>
      </div>
    </div>
    <div class="grade-box second" v-if="grades">
      <div class="grade-item left">
        <p class="grade-name">{{grades[1].name}}</p>
        <p class="grade-limit">{{grades[1].price}}元成为会员</p>
      </div>
      <div class="grade-item right">
        <p class="grade-discount">{{grades[1].discount}}折</p>
        <p class="grade-count">{{grades[1].count}}件赠品/月</p>
      </div>
      <div class="grade-mask" @click="edit(grades[1].id)">
        <p class="grade-edit-btn">编辑</p>
      </div>
    </div>
    <div class="grade-box third" v-if="grades">
      <div class="grade-item left">
        <p class="grade-name">{{grades[2].name}}</p>
        <p class="grade-limit">{{grades[2].price}}元成为会员</p>
      </div>
      <div class="grade-item right">
        <p class="grade-discount">{{grades[2].discount}}折</p>
        <p class="grade-count">{{grades[2].count}}件赠品/月</p>
      </div>
      <div class="grade-mask" @click="edit(grades[2].id)">
        <p class="grade-edit-btn">编辑</p>
      </div>
    </div>
  </div>
</template>
<script>
import { allMembershipGrade } from '@/api/member'
export default {
  data: () => {
    return {
      grades: null
    }
  },
  created() {
    this.getGrades()
  },
  methods: {
    getGrades() {
      allMembershipGrade().then(res => {
        this.grades = res.data
        console.log('ok', this.grades)
      })
    },
    edit(id) {
      this.$router.push({
        path: `updateGrade?id=${id}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
p{
  padding: 0;
  margin: 0;
}
.grade-box{
  width: 300px;
  padding: 10px 20px;
  border: 3px solid #C2C2C2;
  color: #919191;
  display: inline-block;
  margin: 20px;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  &.first{
    border-color:#5AD5FB;
  }
  &.second{
    border-color: #FDB34C;
  }
  .grade-item{
    display: inline-block;
    text-align: center;
    line-height: 30px;
    &.right{
      float: right;
    }
  }
  .grade-name{
    font-size: 21px;
    font-weight: bold;
    line-height: 50px;
    margin-bottom: 10px;
  }
  .grade-discount{
    font-size: 30px;
    font-weight: bold;
    line-height: 50px;
    margin-bottom: 10px;
  }
  .grade-mask{
    transition: all 0.3s linear;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(242,242,242,.8);
    text-align: center;
    opacity: 0;
    .grade-edit-btn{
      line-height: 115px;
      color: #409EFF;
      font-size: 28px;
      font-weight: bold;
    }
  }
  &:hover{
    .grade-mask{
      opacity: 1;
    }
  }
}

</style>
