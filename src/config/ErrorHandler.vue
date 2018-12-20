<template>
</template>

<script>
import index from '@/components/Index';
export default {
  errorHandler: function(error) {
    this.$message({
      message: error.response.data.msg ? error.response.data.msg + '无法使用该功能' : "服务器异常",
      type: "error"
    });
    if (error.response.status == 403 || error.response.status == 401) {
        this.$EventBus.$emit('showLogin');
    }
  }
};
</script>