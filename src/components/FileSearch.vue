<template>
  <div class="body">
    <h1>搜索</h1>
    <el-autocomplete
      class="searchBar"
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
    <el-button @click="enterfetch" plain>搜索</el-button>
    <span style="margin-left:20px;">
      或&nbsp;&nbsp;
      <span class="algolia-highlight" @click="showAdvSearchBar">高级搜索</span>
    </span>
    <el-collapse-transition>
      <div v-show="advSearchBarVisable" style="margin: 8px 8px 8px 8px;">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{selectTime}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="time:">所有时间</el-dropdown-item>
            <el-dropdown-item command="time:1">最近一天</el-dropdown-item>
            <el-dropdown-item command="time:7">最近一周</el-dropdown-item>
            <el-dropdown-item command="time:30">最近一月</el-dropdown-item>
            <el-dropdown-item command="time:183">最近半年</el-dropdown-item>
            <el-dropdown-item command="time:365">最近一年</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{selectSuffix}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="type:">所有类型</el-dropdown-item>
            <el-dropdown-item command="type:jpg" divided>jpg</el-dropdown-item>
            <el-dropdown-item command="type:png">png</el-dropdown-item>
            <el-dropdown-item command="type:bmp">bmp</el-dropdown-item>
            <el-dropdown-item command="type:gif">gif</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-collapse-transition>
    <el-table :data="searchData" v-show="searchResVisable">
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
          <span style="font-size:12px;">{{new Date(scope.row.timestamp).toMyString()}}</span>
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
          >复制</el-button>
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
  computed: {
    selectSuffix() {
      var map = {
        jpg: "jpg",
        png: "png",
        bmp: "bmp",
        gif: "gif",
        "": "所有类型"
      };
      return map[this.advanceSearchParam.suffix];
    },
    selectTime() {
      var map = {
        "1": "最近一天",
        "7": "最近一周",
        "30": "最近一月",
        "183": "最近半年",
        "365": "最近一年",
        "": "所有时间"
      };
      return map[this.selectTimeVal];
    }
  },
  data() {
    return {
      serverAddr: constant.serverAddr, //服务器地址
      inputVal: {}, //输出框值
      searchData: [], //搜索结果
      loading: true, //显示loading
      searchResVisable: false, //显示结果列表
      advSearchBarVisable: false, //显示高级搜索栏
      advanceSearchParam: {
        //查询参数
        before: null,
        after: null,
        suffix: ""
      },
      selectTimeVal: "", //选择的时间
    };
  },
  methods: {
    handleCommand(cmd) {
      if (cmd && cmd.startsWith("time:")) {
        this.handleTime(this.parseVal(cmd));
      } else if (cmd.startsWith("type")) {
        this.handleFileType(this.parseVal(cmd));
      }
      this.enterfetch(null);
    },
    handleFileType(val) {
      if (typeof val != "undefined") {
        this.advanceSearchParam.suffix = val;
      }
    },
    handleTime(val) {
      if (parseInt(val) != NaN) {
        let date = new Date();
        this.advanceSearchParam.after =
          (date = date.setDate(date.getDate() - val)).valueOf() || 0;
      }
      this.selectTimeVal = val;
    },
    pickDate() {

    },
    clearInput() {
      this.inputVal = "";
      this.advanceSearchParam.before = null;
      this.advanceSearchParam.after = null;
      this.advanceSearchParam.suffix = "";
      this.selectTimeVal = "";
    },
    parseVal(cmd) {
      return cmd.substring(cmd.indexOf(":") + 1);
    },
    showAdvSearchBar() {
      if (this.advSearchBarVisable) {
        this.clearInput();
      }
      this.advSearchBarVisable = !this.advSearchBarVisable;
    },
    enterfetch(e) {
      if (this.checkParamNull()) return;
      this.handleSelect(this.inputVal);
    },
    fetch(str, cb) {
      var self = this;
      setTimeout(() => {
        str
          ? axios
              .post(this.serverAddr.prefix + str)
              .then(function(resp) {
                cb(resp.data);
              })
                .catch(function(error) {
                  self.errorHandler(error);
              })
          : undefined;
      }, 0);
    },
    checkParamNull() {
      return (
        !this.inputVal.string &&
        !this.advanceSearchParam.before &&
        !this.advanceSearchParam.after &&
        !this.advanceSearchParam.suffix
      );
    },
    handleSelect(item) {
      let self = this;
      self.inputVal = item;
      let loading = self.$loading({ fullscreen: true });
      axios.post(this.serverAddr.search, null, {
          params: {
            fileName: self.inputVal.string,
            before: self.advanceSearchParam.before,
            after: self.advanceSearchParam.after,
            suffix: self.advanceSearchParam.suffix
          }
        })
        .then(function(resp) {
          loading.close();
          self.initTable(resp.data);
        })
        .catch(function(error) {
          loading.close();
          self.errorHandler(error);
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
      let errorHandle = function(error) {
        loading.close();
        self.errorHandler(error);
      };
      self
        .$confirm("确定删除?", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "好",
          cancelButtonText: "取消"
        })
        .then(() => {
          axios
            .post(self.serverAddr.delete + delParam)
            .then(function(resp) {
              loading.close();
              if (resp.data.success) {
                self.$message({
                  message: "删除成功",
                  type: "success"
                });
                self.handleSelect(self.inputVal);
              } else {
                errorHandle(data.message);
              }
            })
            .catch(function(error) {
              errorHandle(error);
            });
        })
        .catch(action => {
          loading.close();
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

.searchBar {
  width: 450px !important;
}
.body {
  width: 900px;
  height: 100%;
  margin-top: 15px;
}

@media screen and (max-width: 550px) {
  input,
  .searchBar {
    width: 400px !important;
  }
  .body {
    width: 500px;
  }
}

.inline {
  display: inline !important;
}


h1 {
  margin-top: 21px;
  margin-bottom: 10.5px;
  font-family: "Segoe UI", "Source Sans Pro", Calibri, Candara, Arial,
    sans-serif;
  font-weight: 300;
  line-height: 1.1;
  color: inherit;
}
</style>
