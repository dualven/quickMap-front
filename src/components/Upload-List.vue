<template>
  <div :class="display">
    <el-tabs type="card">
      <el-tab-pane label="地址" >
        <code v-html="urls" class="cp"></code>
      </el-tab-pane>
      <el-tab-pane label="删除链接" >
        <code v-html="dels" class="cp"></code>
      </el-tab-pane>
    </el-tabs>
    <el-button type="primary" class="cp_btn" size="small" @click="copy">
      <i class="el-icon-document">复制到剪贴板</i>
    </el-button>
  </div>
</template>
<script>
import constant from "@/config/Constant";
import Clipboard from "clipboard";
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
    copy() {
    }
  },
  computed: {
    display() {
      return this.visible ? "display" : "undisplay";
    },
    urls() {
      var self = this;
      var str = "";
      self.dataSource.forEach(e => {
        str += e.downloadUrl +
          "</br>";
      });
      return str;
    },
    dels() {
      var self = this;
      var baseAddr = self.serverAddr.delete;
      var str = "";
      self.dataSource.forEach(e => {
        str += baseAddr + e.delParam
          "</br>";
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
