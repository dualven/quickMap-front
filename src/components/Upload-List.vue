<template>
  <div v-show="visible">
    <el-tabs type="card">
      <el-tab-pane label="地址" >
        <code v-html="urls" class="cp"></code>
      </el-tab-pane>
      <el-tab-pane label="删除链接" >
        <code v-html="dels" class="cp"></code>
      </el-tab-pane>
    </el-tabs>
    <el-button type="primary" class="cp_btn" size="small" 
            v-clipboard:copyhttplist="clickBoard"
            v-clipboard:success="copySuccess">
      <i class="el-icon-document">复制到剪贴板</i>
    </el-button>
  </div>
</template>
<script>
import constant from "@/config/Constant";
export default {
  mounted() {
    if (!String.prototype.endsWith) {
      String.prototype.endsWith = function(search, thisLen) {
        if (thisLen === undefined || thisLen > this.length) {
          thisLen = this.length;
        }
        return this.substring(thisLen - search.length, thisLen) === search;
      };
    }
  },
  data() {
    return {
      serverAddr: constant.serverAddr, //服务器路径
      clickBoard : null,
    };
  },
  methods: {
    copySuccess() {
      this.$message({
        message: "复制成功",
        type: "success"
      });
    }
  },
  computed: {
    urls() {
      let self = this;
      let str = "";
      self.dataSource.forEach(e => {
        str += e.downloadUrl +
          "</br>";
      });
      this.clickBoard = self.dataSource.map(e=>e.downloadUrl).join(';');
      return str;
    },
    dels() {
      let self = this;
      let baseAddr = self.serverAddr.delete;
      let str = "";
      self.dataSource.forEach(e => {
        str += baseAddr + e.delParam + "</br>";
      });
      return str;
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    dataSource: {
      type: Array,
      default: []
    }
  }
};
</script>
<style>
.display {
  display: inline;
}

.undisplay {
  display: none;
}

code {
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 13px;
}

.cp_btn {
  margin-top: 5px !important;
  margin-bottom: 5px !important;
}
</style>
