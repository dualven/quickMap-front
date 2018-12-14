<script>
const supportType = ['image/jpeg','image/png'];//支持的上传类型
const sizeLimit = 1000;//上传文件大小限制(KB)
const baseAddr = 'http://127.0.0.1:28092' + '/file/'; //服务器地址
const limitPerRequest = 5;//每次请求的数量限制
const serverAddr = {
    upload : baseAddr + 'upload/',
    upload64 : baseAddr + 'upload64/',
    download : baseAddr + '',
    meta : baseAddr + '',
    list : baseAddr + '',
    delete : baseAddr + 'del/',
    prefix : baseAddr + 'prefix/' ,
    search : baseAddr + 'search/' 
};
export default {
    supportType :supportType,
    serverAddr : serverAddr,
    sizeLimit : sizeLimit, 
    limitPerRequest : limitPerRequest,
}
</script>
