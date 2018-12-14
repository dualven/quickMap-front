<template>
  <div class="body">
    <el-autocomplete
      v-model="inputVal"
      :fetch-suggestions="fetch"
      placeholder="请输入文件名称.支持自动补全,上下切换,Enter获取结果"
      @select="handleSelect"
      :trigger-on-focus="false"
      clearable
      :minlength="2"
    >
      <template slot-scope="{item}">
        <span class="solt-item">{{ item.string }}</span> &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="algolia-highlight solt-item" > >>查看结果</span>
      </template>
    </el-autocomplete>

     <el-table :data="searchData" v-show="searchResVisable" v-loading="loading" element-loading-text="拼命加载中" >
    <el-table-column
      label="序号"
      width="65">
      <template slot-scope="scope">
        <span style="margin-left: 10px;font-size:12px;">{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="时间">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px;font-size:12px;">{{ new Date(scope.row.timestamp).toMyString()}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="缩略图"
      width="100">
      <template slot-scope="scope">
          <span v-show="!scope.row.thumbImagePath" style="margin-left: 10px;font-size:12px;text-align:center;">/</span>
          <img v-show="scope.row.thumbImagePath" width="100%" :src="scope.row.thumbImagePath" alt="/">
        <el-popover trigger="hover" placement="top">
          <p>姓名: {{ scope.row.name }}</p>
          <p>住址: {{ scope.row.address }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>
<script>
import axios from "axios";
import constant from "@/config/Constant";
export default {
  mounted(){
    Date.prototype.toMyString = function() {
          return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
    };
  },
  data() {
    return {
      serverAddr: constant.serverAddr, //服务器地址
      inputVal: "",
      searchData : [],
      loading: true,
      searchResVisable : false
    };
  },
  methods: {
    fetch(str, cb) {
      setTimeout(() => {
        str ? axios.post(this.serverAddr.prefix + str)
              .then(function(resp) {
                cb(resp.data);
              })
              .catch(function(error) {
                console.error(error);
                this.$message({
                  message: "服务器异常",
                  type: "error"
                });
              })
          : undefined;
      }, 0);
    },
    handleSelect(item) {
      let self = this;
      self.inputVal = item.string;
      self.loading = true;
      axios.post(this.serverAddr.search + self.inputVal)
              .then(function(resp) {
                self.loading = false;
                self.initTable(resp.data);
              })
              .catch(function(error) {
                console.error(error);
                this.$message({
                  message: "服务器异常",
                  type: "error"
                });
              })
    },
    initTable(data) {
        this.searchData = data;
        this.searchResVisable = true;
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

input,.el-input__inner {
  width: 600px !important;
}
.body{
  width: 800px;
}

@media screen and (max-width: 550px) {
input,.el-input__inner {
  width: 400px !important;
}
.body{
  width: 520px;
}
}


</style>
