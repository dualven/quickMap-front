<template>
  <div  v-show="uploadvisible" >
    <h1>上传</h1>
    <div
      class="el-upload__tip"
      slot="tip"
    >只能上传{{types}}类型文件，且不超过{{sizeLimit}}KB,每次请求最多上传{{limitPerRequest}}个文件</div>
    <el-button
      style="margin-left: 10px;margin-top:15px;margin-bottom:15px;"
      size="medium"
      type="success"
      class="el-upload__tip"
      slot="tip"
      @click="uploadHttpRequest"
    >上传</el-button>
    <el-upload
      v-loading="loading"
      element-loading-text="努力上传中"
      ref="upload"
      class="upload-block"
      drag
      multiple
      action="*"
      list-type="fileList"
      :limit="limitPerRequest"
      :auto-upload="autoUpload"
      :on-exceed="onExceed"
      :on-change="onChange"
      :on-preview="onPreview"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击选择文件</em>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="文件类型不支持预览">
    </el-dialog>
    <uploadList :visible.sync="uploadListVisable" :dataSource.sync="uploadListData"></uploadList>
  </div>
</template>
<script>
import constant from "@/config/Constant";
import uploadList from "@/components/Upload-List";
import axios from "axios";
export default {
  data() {
    return {
      supportType: constant.supportType, //支持的类型
      sizeLimit: constant.sizeLimit, //大小
      limitPerRequest: constant.limitPerRequest, //每次上传的数量
      autoUpload: false,
      uploadListData: [],
      fileList: [], //文件列表
      dialogImageUrl: "", //预览文件url
      dialogVisible: false, //预览窗口显示/隐藏
      uploadListVisable: false, //上传成功后的回调列表显示/隐藏
      serverAddr: constant.serverAddr, //服务器路径
      uploaded: false, //标记是否已经上传
      loading: false //显示loading遮罩
    };
  },
  components: {
    uploadList
  },
  computed: {
    //类型
    types() {
      return this.supportType.map(v => v.replace("image/", "")).join(",");
    }
  },
  methods: {
    //上传异常钩子
    onError(err) {
      console.log(err);
      this.errorHandler(err);
    },
    //上传成功钩子
    onSuccess(response) {
      let body = response.data;
      if (body.success) {
        this.$refs.upload.clearFiles();
        this.uploadListData = body.data;
        console.log("uploadlist is ",body.data)
        this.$emit("listenUploadEvent",body.data);
        this.uploadListVisable = true;
        this.uploaded = true;
        this.fileList.length = 0;
      } else {
        this.onError("上传失败");
        return;
      }
    },
    //上传请求构建
    uploadHttpRequest() {
      let self = this;
      if (self.fileList.length == 0) {
        return;
      }
      self.loading = true;
      let formData = new FormData();
      self.fileList.forEach(e => {
        formData.append("file", e.raw);
      });
      axios.post(this.serverAddr.upload, formData, {
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data"
          },
          params: {
            thumbImage: true
          },
          transformRequest: [
            function(data) {
              return data;
            }
          ]
        })
        .then(function(resp) {
          self.loading = false;
          self.onSuccess(resp);
        })
        .catch(function(error) {
          self.loading = false;
          self.onError(error);
        });
    },
    //预览
    onPreview(file) {
      let self = this;
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e) {
        self.dialogImageUrl = this.result;
        self.dialogVisible = true;
      };
    },
    //上传失败钩子
    onExceed(files, fileList) {
      this.$message({
        message: "最多上传" + this.limitPerRequest + "个文件",
        type: "error"
      });
    },
    //选择文件钩子
    onChange(file, fileList) {
      let self = this;
      let count = 0;
      let sizeLim = file.size / 1024 > this.sizeLimit;
      let notSupport = this.supportType.indexOf(file.raw.type) < 0;
      for (let i = 0; i < fileList.length; ++i) {
        let t = fileList[i];
        if (
          t.name == file.name &&
          t.size == file.size &&
          (++count >= 2 || notSupport || sizeLim)
        ) {
          if (count >= 2) {
            this.$message({
              message: "添加失败,文件[" + file.name + "]已经存在",
              type: "error"
            });
          } else if (notSupport) {
            this.$message({
              message: "不支持的类型",
              type: "error"
            });
          } else if (sizeLim) {
            this.$message({
              message: "文件大小超出限制,最大" + this.sizeLimit + "KB",
              type: "error"
            });
          }
          fileList.splice(i, 1);
        }
      }
      this.fileList = fileList;
    },
  },
    props: {
    uploadvisible: {
      type: Boolean,
      default: true
    }
   
  }
};
</script>
<style>
h1 {
  margin-top: 21px;
  margin-bottom: 10.5px;
  font-family: "Segoe UI", "Source Sans Pro", Calibri, Candara, Arial,
    sans-serif;
  font-weight: 300;
  line-height: 1.1;
  color: inherit;
}
.el-upload-dragger {
  background-color: rgba(160, 159, 159, 0.24) !important;
  width: 750px !important;
  height: 150px !important;
  position: relative;
}
</style>

