<script>
const supportType = ['image/jpeg','image/png'];//支持的上传类型
const sizeLimit = 1000;//上传文件大小限制(KB)
const baseAddr = 'http://127.0.0.1:28092'; //服务器地址
const limitPerRequest = 5;//每次请求的数量限制
const serverAddr = {
    upload : baseAddr + '/file/' + 'upload/',//上传
    upload64 : baseAddr  + '/file/' + 'upload64/',//上传base64
    download : baseAddr + '/file/' + '',//下载
    list : baseAddr + '',//获取最近上传列表
    delete : baseAddr + '/file/' + 'del/',//删除
    prefix : baseAddr + '/file/' + 'prefix/' ,//前缀输入补全
    search : baseAddr + '/file/' + 'search/exec', //搜索
    login : baseAddr + "/login/auth",//登录
    logout : baseAddr + "/login/logOut",//登出
    reg : baseAddr + "/login/createUser"//登出
};
export default {
    supportType :supportType,
    serverAddr : serverAddr,
    sizeLimit : sizeLimit, 
    limitPerRequest : limitPerRequest,
}
</script>
