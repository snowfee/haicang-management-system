<template>
  <div class="container">
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-search" />
          <span>时间设置</span>
        </div>
        <div class="top-right">
          <el-button>重置</el-button>
          <el-button type="primary" @click="queryData()">查询</el-button>
        </div>
      </div>
      <div class="box-content">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          @change="dataTimeChange"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-checkbox style="margin-right:20px" v-model="checkedToday" @change="setTodyData">今天</el-checkbox>
      </div>
    </div>
    <div class="box">
      <div class="box-top">
        <div class="top-left">
          <i class="el-icon-tickets" />
          <span>结果数据</span>
        </div>
      </div>
      <div class="amout-container">
        <el-row>
          <el-col :span="8">
            <div class="amout-box">
              <p>实收金额</p>
              <p>{{actualPrice}}元</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="amout-box">
              <p>订单数</p>
              <p>{{orderNum}}单</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="amout-box">
              <p>挂账金额</p>
              <p>{{creditPrice}}元</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="chart-container" v-show="columnNum">
        <el-radio-group v-model="columnType" size="small" @change="handelColumnChange">
          <el-radio-button label="price">按金额</el-radio-button>
          <el-radio-button label="num">按单数</el-radio-button>
        </el-radio-group>
        <div id='columnChart' style="width:800px;height:300px"></div>
      </div>
      <div class="chart-container" v-show="!columnNum">
        <p class="no-data">暂无数据</p>
      </div>
      <div class="chart-container" v-show="columnNum">
        <el-row :gutter="20">
          <el-col :span="12">
            <div id="pieChart" style="width:800px;height:600px"></div>
          </el-col>
        </el-row>
      </div>
      <div class="chart-container" v-show="!columnNum">
        <p class="no-data">暂无数据</p>
      </div>
    </div>
  </div>
</template>
<script>
import { queryRevenueProfile } from '@/api/report'
export default {
  data() {
    return {
      time: [],
      preTime: [],
      from: '',
      to: '',
      todayData: 0,
      checkedToday: false,
      orderNum: 0,
      actualPrice: 0.00,
      creditPrice: 0.00,
      columnNum: null,
      columnPrice: null,
      columnType: 'price'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let yesterTime = new Date()
      yesterTime.setTime(yesterTime.getTime()-24*60*60*1000)
      let yesterDay = yesterTime.getFullYear()+"-" + (yesterTime.getMonth()+1) + "-" + yesterTime.getDate()
      let yesterDayFrom = `${yesterDay} 00:00:00`
      let yesterDayTo = `${yesterDay} 23:59:59`
      this.time = [yesterDayFrom, yesterDayTo]
      this.getData()
    },
    getData() {
      let params = this.getParams()
      let query = this.paramsToString(params)
      queryRevenueProfile(query).then(res => {
        if (res.status == 200) {
          if (res.data) {
            this.preTime = [params.from, params.to]
            this.creditPrice = res.data.creditPrice
            this.orderNum = res.data.orderNum
            this.actualPrice = res.data.actualPrice
            this.columnNum = res.data.columnNum
            this.columnPrice = res.data.columnPrice
            let column = null
            if (this.columnType == 'num') {
              column = this.columnNum
            } else {
              column = this.columnPrice
            }
            this.getColumnChart(column)
            this.getPieChart(res.data.pieChart)
          } else {
            this.$message({
              type: 'warning',
              message: '无数据'
            })
            // if (this.todayData == 1) {
            //   this.checkedToday = false
            //   this.todayData = 0
            // }
            // if (!this.preTime || this.preTime.length == 0) {
            //   this.checkedToday = true
            //   this.todayData = 1
            //   this.preTime = []
            // }
            // this.time = this.preTime
          }
        }
      })
    },
    getPieChart(data) {
      let first = [],
        second = [],
        third = []
      data.forEach(item => {
        first.push({
          name: item.categoryName,
          value: item.totalPrice
        })
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            second.push({
              name: child.categoryName,
              value: child.totalPrice
            })
            if (child.children && child.children.length > 0) {
              child.children.forEach(subChild => {
                third.push({
                  name: subChild.categoryName,
                  value: subChild.totalPrice
                })
              })
            }
          })
        }
      })
      console.log(first, second)
      let pieChart = this.$echarts.init(document.getElementById('pieChart'), 'light')
      console.log(pieChart)
      var option={
          title: {
            text: '订单类型汇总比例'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: 合计￥{c} (占比{d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: Object.keys(third)
          },      
          series: [
            {
              name:'三级分类',
              type:'pie',
              selectedMode: 'single',
              radius: ['50%', '70%'],
              label: {
                normal: {
                  // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                  // backgroundColor: '#eee',
                  // borderColor: '#aaa',
                  // borderWidth: 1,
                  // borderRadius: 4,
                  // rich: {
                  //   a: {
                  //     color: '#999',
                  //     lineHeight: 22,
                  //     align: 'center'
                  //   },                                     
                  //   hr: {
                  //       borderColor: '#aaa',
                  //       width: '100%',
                  //       borderWidth: 0.5,
                  //       height: 0
                  //   },
                  //   b: {
                  //     fontSize: 16,
                  //     lineHeight: 33
                  //   },
                  //   per: {
                  //     color: '#eee',
                  //     backgroundColor: '#334455',
                  //     padding: [2, 4],
                  //     borderRadius: 2
                  //   }
                  // }
                }
              },
              data: third
            },
            {
              name:'二级分类',      //内容标题
              type:'pie',                 //图标样式
              selectedMode: 'single',     //选中模式：单选
              radius: ['25%', '45%'],         //饼图大小，[x,y]:x表示内半径，y表示外半径  
              label: {                    //标签
                normal: {
                  position:'inside',
                  align:'right',
                  fontSize: 12,
                  fontFamily:'Microsoft YaHei'
                }
              },               
              data: second            
            },
            {
              name:'一级分类',      //内容标题
              type:'pie',                 //图标样式
              selectedMode: 'single',     //选中模式：单选
              radius: [0, '20%'],         //饼图大小，[x,y]:x表示内半径，y表示外半径  
              label: {                    //标签
                normal: {
                  position:'inside',
                  align:'right',
                  fontSize: 12,
                  fontFamily:'Microsoft YaHei'
                }
              },               
              data: first           
            }
          ]
      }
      pieChart.setOption(option)
    },
    getColumnChart(column) {
      let columnChart = this.$echarts.init(document.getElementById('columnChart'), 'light')
      if (this.columnType == 'num') {
        var option = {
            title: {
              text: '时段销售趋势'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{b}号：{c}单"
            },
            legend: {
                data:['订单数']
            },
            xAxis: {
                data: Object.keys(column),
                name: '日期'
            },
            yAxis: {
              name: '订单数（单）'
            },
            series: [{
                name: '订单数',
                type: 'bar',
                data: Object.values(column)
            }]
        };
      } else {
        var option = {
            title: {
              text: '时段销售趋势'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{b}号：￥{c}"
            },
            legend: {
                data:['金额']
            },
            xAxis: {
                data: Object.keys(column),
                name: '日期'
            },
            yAxis: {
              name: '金额（元）'
            },
            series: [{
                name: '金额',
                type: 'bar',
                data: Object.values(column)
            }]
        };
      }

        // 使用刚指定的配置项和数据显示图表。
        columnChart.setOption(option);

    },
    getParams() {
      this.from = this.time && this.time[0] ? this.time[0] : ''
      this.to = this.time && this.time[1] ? this.time[1] : ''
      let params = {
        from: this.from,
        to: this.to,
        todayData: this.todayData
      }
      return params
    },
    paramsToString(obj) {
      let query = ''
      let keys = Object.keys(obj)
      let len = keys.length
      keys.forEach((key, index) => {
        query += `${key}=${obj[key]}`
        if (index < len - 1) {
          query += '&'
        }
      })
      return query
    },
    setTodyData(checked) {
      if (checked) {
        this.todayData = 1
        this.time = []
        this.from = ''
        this.to = ''
      } else {
        this.todayData = 0
      }
    },
    dataTimeChange() {
      console.log('ok')
      this.todayData = 0
      this.checkedToday = false
      console.log(this.todayData)
    },
    queryData() {
      this.getData()
    },
    handelColumnChange(val) {
      let column = null
      if (val == 'num') {
        column = this.columnNum
      } else {
        column = this.columnPrice
      }
      this.getColumnChart(column)
    }
  }
}
</script>
<style lang="scss" scoped>
.amout-container {
  margin-top: 20px;
  width: 700px;
  .amout-box {
    text-align: center;
    width: 200px;
    height: 100px;
    border: 1px solid #d2d2d2;
    color: #464646;
  }
}
.chart-container{
  margin-top: 20px;
  .no-data{
    width: 800px;
    line-height: 100px;
    text-align: center;
    background-color: #d2d2d2;
  }
}
</style>

