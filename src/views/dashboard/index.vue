<template>
  <div class="container">
    <el-tabs type="border-card" v-model="form.orderStatus" @tab-click="handelTabClick">
      <el-tab-pane label="待配送" name="PAID">
          <div class="info-container" v-loading="isLoading_0">
              <order-info-box 
              :orderInfos="orderInfos_0" 
              :orderStatus="form.orderStatus"
              @handleOrderPrint="handleOrderPrint" 
              @orderOperate="orderOperate"></order-info-box>
          </div>
      </el-tab-pane>
      <el-tab-pane label="配送中" name="DELIVERY">
          <div class="info-container" v-loading="isLoading_1">
              <order-info-box 
              :orderInfos="orderInfos_1" 
              :orderStatus="form.orderStatus" 
              @handleOrderPrint="handleOrderPrint"
              @orderOperate="orderOperate"></order-info-box>
          </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="添加配送员"  :visible.sync="showDialog" @close="resetForm('dialogForm')">
      <el-form :model="dialogForm" ref="dialogForm" style="width: 500px" :rules="rules">
        <el-form-item label="送货员" :label-width="formLabelWidth" prop="name">
          <el-select v-model="dialogForm.name" @change="handleStaffChange">
              <el-option v-for="(staff, index) in staffs" :key="staff.id" :value="index" :label="staff.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="dialogForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出单人" :label-width="formLabelWidth">
          <el-input v-model="name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('dialogForm')">重 置</el-button>
        <el-button type="primary" @click="submitForm()">提 交</el-button>
      </div>
    </el-dialog>
   </div>
</template>
<script>
import { handleHomeOrder, getHomeOrder } from '@/api/home'
import { staffList } from '@/api/staff'
import { mapGetters, mapState } from 'vuex'
import orderInfoBox from './components/orderInfoBox'
import { dirname } from 'path';
export default {
    components: {
        orderInfoBox
    },
    data() {
        return {
            form: {
                orderStatus: 'PAID',
                regionId_0: '',
                regionId_1: ''
            },
            orderId: '',
            isLoading_0: false,
            isLoading_1: false,
            formLabelWidth: '120px',
            regions: [],
            staffs: [],
            orderInfos_0: [],
            orderInfos_1: [],
            showDialog: false,
            dialogForm: {
                name: '',
                phone: '',
                // issuer: this.userName
            },
            rules: {
                name: [{ required: true, message: '请输入配送员', trigger: 'blur' }],
                phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' },{pattern: /^[0-9]{11}$/, message: '格式错误', trigger: 'blur'}],
                // issuer: [{ required: true, message: '请输入出单人', trigger: 'blur' }],
            }
        }
    },
    created() {
      this.getHomeOrder()
      this.getAllStaff()
    },
    methods: {
        getAllStaff() {
          staffList({pageIndex:0, pageSize:999}).then(res => {
            if (res.status == 200) {
                this.staffs = res.data.staffs
            }
          })
        },
        handelTabClick(tab, event) {
          this.getHomeOrder()
        },
        handleOrderPrint(orderId) {
            this.orderId = orderId
            if (this.form.orderStatus == 'PAID') {
                this.showDialog = true
            } else {
                let routeUrl = this.$router.resolve({
                     path: "/print",
                     query: {orderId}
                });
                window.open(routeUrl.href, '_blank');
            }
        },
        getHomeOrder() {
            if (this.form.orderStatus == 'PAID') {
              this.isLoading_0 = true
            } else {
               this.isLoading_1 = true
            }
            let params = {
                "orderStatus": this.form.orderStatus
            }
            getHomeOrder(params).then(res => {
                if (res.status == 200) {
                    if (params.orderStatus == 'PAID') {
                        this.orderInfos_0  = res.data.orderInfos || []
                        this.isLoading_0 = false                     
                    } else if (params.orderStatus == 'DELIVERY') {
                        this.orderInfos_1 = res.data.orderInfos || []
                        this.isLoading_1 = false
                    }
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].clearValidate()
            this.dialogForm = {
                name: '',
                phone: '',
                issuer: ''
            }
        },
        submitForm() {
            this.$refs.dialogForm.validate(valid => {
                if (valid) {
                    this.showDialog = false
                    let routeUrl = this.$router.resolve({
                        path: "/print",
                        query: {
                            orderId: this.orderId,
                            deliveryman: this.dialogForm.name,
                            phone: this.dialogForm.phone,
                            issuer: this.name
                        }
                    });
                    window.open(routeUrl.href, '_blank');
                }
            })
        },
        handleStaffChange(val) {
            this.dialogForm.phone = this.staffs[val].telephone
            this.dialogForm.name = this.staffs[val].name
        },
        orderOperate(id) {
            let params = {
                "id": id
            }
            let confirmText = ''
            let regionId = ''
            if (this.form.orderStatus == "PAID") {
                params.methodType = "ORDER_DELIVERY"
                regionId = this.form.regionId_0
                confirmText = '开始配送'
            } else if (this.form.orderStatus == "DELIVERY") {
                params.methodType = 'ORDER_SUCCESS'
                regionId = this.form.regionId_1
                confirmText = '完成配送'
            }
            this.$confirm(`订单号${id},确认${confirmText}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                handleHomeOrder(params).then(res => {
                    if (res.status == 200) {
                        this.getHomeOrder()
                        this.$message({
                            type: 'success',
                            message: '成功!'
                        })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.message
                        })
                    }
                })
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消操作'
            })          
      })
        }
    },
    computed: {
      ...mapGetters([ 'name' ])
    },
    watch: {
    //   getNewOrderNum(val) {
    //     this.form.orderStatus = 'PAID'
    //     this.getHomeOrder()
    //   }
    }
}
</script>
<style lang="scss" scoped>
.info-container{
    margin-top: 30px;
    font-size: 14px;
    color: #464646;
}
    
</style>

