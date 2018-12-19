<script>
    export default {
        errorHandler : function (error) {
            this.$message({
            message: error.response.data.msg ? error.response.data.msg : '服务器异常',
            type: "error"
          });
          if(error.status == 403){
                showLogin();
          }
        }
    }
    function showLogin() {
        
    }
</script>