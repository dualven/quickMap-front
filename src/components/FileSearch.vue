<template>
  <div class="body">
    <h1>搜索</h1>
    <el-autocomplete
      v-model="inputVal.string"
      :fetch-suggestions="fetch"
      placeholder="请输入文件名称.支持自动补全.↑↓切换.Enter获取结果"
      @select="handleSelect"
      :trigger-on-focus="false"
      clearable
      :minlength="2"
      @keyup.enter.native="enterfetch"
    >
      <template slot-scope="{item}">
        <span class="solt-item">{{ item.string }}</span> &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="algolia-highlight solt-item">>>查看结果</span>
      </template>
    </el-autocomplete>
    <span style="margin-left:30px;">或&nbsp;&nbsp;<span class="algolia-highlight" >高级搜索</span></span> 

    <el-table
      :data="searchData"
      v-show="searchResVisable"
    >
      <el-table-column label="序号" width="65">
        <template slot-scope="scope">
          <span style="font-size:12px;">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="180">
        <template slot-scope="scope">
          <span style="font-size:12px;">{{scope.row.filename}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="font-size:12px;">{{ new Date(scope.row.timestamp).toMyString()}}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="120">
        <template slot-scope="scope">
          <span style="font-size:12px;">{{readablizeBytes(scope.row.size)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预览" width="100">
        <template slot-scope="scope">
          <el-popover placement="left" trigger="hover" v-show="scope.row.thumbImagePath">
            <img
              width="100%"
              style="max-width:600px;max-height:400px;"
              :src="scope.row.downloadUrl"
              alt="文件类型不支持预览"
            >
            <div slot="reference">
              <img width="100%" :src="scope.row.thumbImagePath" alt="/">
            </div>
          </el-popover>
          <span v-show="!scope.row.thumbImagePath" style="font-size:12px;text-align:center;">无</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            class="inline"
            v-clipboard:copyhttplist="scope.row.downloadUrl"
            v-clipboard:success="copySuccess"
          >复制链接到剪贴板</el-button>
          <el-button
            size="mini"
            type="danger"
            class="inline"
            @click="remove(scope.row.delParam)"
          >从库中移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import axios from "axios";
import constant from "@/config/Constant";
export default {
  mounted() {
    Date.prototype.toMyString = function() {
      return (
        this.getFullYear() +
        "/" +
        (this.getMonth() + 1) +
        "/" +
        this.getDate() +
        " " +
        this.getHours() +
        ":" +
        this.getMinutes() +
        ":" +
        this.getSeconds()
      );
    };
  },
  data() {
    return {
      serverAddr: constant.serverAddr, //服务器地址
      inputVal: {},
      searchData: [],
      loading: true,
      searchResVisable: false
    };
  },
  methods: {
    enterfetch(e){
        this.handleSelect(this.inputVal);
    },
    fetch(str, cb) {
      var self = this;
      setTimeout(() => {
        str? axios.post(this.serverAddr.prefix + str)
              .then(function(resp) {
                cb(resp.data);
              })
              .catch(function(error) {
                console.error(error);
                self.$message({
                  message: "服务器异常",
                  type: "error"
                });
              })
          : undefined;
      }, 0);
    },
    handleSelect(item) {
      let self = this;
      self.inputVal = item;
      let loading = self.$loading({ fullscreen: true });
      axios.post(this.serverAddr.search + item.string)
        .then(function(resp) {
          loading.close();
          self.initTable(resp.data);
        })
        .catch(function(error) {
          loading.close();
          console.error(error);
          self.$message({
            message: "服务器异常",
            type: "error"
          });
        });
    },
    initTable(data) {
      this.searchData = data;
      this.searchResVisable = true;
    },
    readablizeBytes(bytes) {
      let s = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
      let e = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    },
    copySuccess(e) {
      this.$message({
        message: "复制成功",
        type: "success"
      });
    },
    remove(delParam) {
      let self = this;
      let loading = self.$loading({ fullscreen: true });
      self.$confirm("确定删除?", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "好",
        cancelButtonText: "取消"
      }).then(() => {
        axios.post(self.serverAddr.delete + delParam).then(function(resp) {
          loading.close();
          if (resp.data.success) {
            self.$message({
              message: "删除成功",
              type: "success"
            })
            self.handleSelect(self.inputVal);
          }
        });
      });
    }
  }
};
</script>
<style>
.solt-item {
  font-size: 12px;
}
.algolia-highlight {
  color: #409eff;
  font-weight: 700;
}

input,
.el-input__inner {
  width: 450px !important;
}
.body {
  width: 900px;
  height: 100%;
  margin-top: 15px;
}

@media screen and (max-width: 550px) {
  input,
  .el-input__inner {
    width: 400px !important;
  }
  .body {
    width: 500px;
  }
}

.inline {
  display: inline !important;
}
</style>
