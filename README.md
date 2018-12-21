quick-map是一个分布式的图床服务器.可以提供高性能,高可用的分布式图片访问服务.
该项目是图床的前端工程

# 使用方法  

# 构建

## 安装依赖

```  
npm install
```  
## 构建

```  
npm run build
```  

# 配置

src/config/Constant.vue

## 配置quick-map服务器根地址

```  
const baseAddr = 'http://127.0.0.1:28092'; //服务器地址
```

## 其它配置

```  
const supportType = ['image/jpeg','image/png'];//支持的上传类型
const sizeLimit = 1000;//上传文件大小限制(KB)
const limitPerRequest = 5;//每次请求的数量限制

```  
