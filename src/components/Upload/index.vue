<template>
  <el-upload
    action="https://upload.qiniup.com"
    accept="image/jpeg,image/png"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-upload="beforUpload"
    :limit="limit"
    :on-exceed="handleExceed"
    :file-list="fileList"
    list-type="picture"
    :data="postQiniupData">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
  </el-upload>  
</template>
<script>
export default {
  props: {
    limit: {
      default: 1
    },
    postQiniupData: {
      required: true
    },
    fileList: {
      default: () => []
    }
  },
  data() {
    return {
      imgServe: 'http://rsource.haic168.com'
    }
  },
  methods: {
    // 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
    handlePreview(file) {
      console.log(file)
    },
    handleRemove(file, fileList) {
      console.log(fileList)
      this.$emit('removeUploadFile', fileList, this.imgServe)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    beforUpload(file){
      // const isJPG = file.type === 'image/jpeg';
      const isLt10M = file.size / 1024 / 1024 < 10;
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      return isLt10M
    },
    handleExceed() {
      // 文件超出个数限制时的钩子
      this.$message.warning(`当前限制选择 ${this.limit} 个文件`);
    },
    handleSuccess(res, file, fileList) {
      this.$emit('uploadSuccess', fileList, this.imgServe)
    },
    handleError(err) {
      console.log('err')
      this.$message.error(err)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>