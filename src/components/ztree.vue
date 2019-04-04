<template>
  <div class="content_wrap">
    <div class="zTreeDemoBackground left">
      <div id="treeDemo" class="ztree"></div>
    </div>
    <div class="right">
      <upload :uploadvisible.sync="upvisible" v-on:listenUploadEvent="handleUploadData"></upload>
    </div>
  </div>
</template>
<script>
import Upload from "@/components/Upload";
export default {
  data() {
    return {
      message: "yes",
      className: "dark",
      newCount: 1,
      newId: 1,
      operatingnode: null,
      upvisible: true,
      setting: {
        view: {
          addHoverDom: this.addHoverDom,
          removeHoverDom: this.removeHoverDom,
          selectedMulti: false
        },
        edit: {
          enable: true,
          editNameSelectAll: true,
          showRemoveBtn: this.showRemoveBtn,
          showRenameBtn: this.showRenameBtn
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          beforeDrag: this.beforeDrag,
          beforeEditName: this.beforeEditName,
          beforeRemove: this.beforeRemove,
          beforeRename: this.beforeRename,
          onRemove: this.onRemove,
          onRename: this.onRename,
          onMouseDown: this.zTreeOnMouseDown
        }
      },

      zNodes: [
        { id: 1, pId: 0, name: "父节点 1", open: true },
        { id: 11, pId: 1, name: "叶子节点 1-1" },
        { id: 12, pId: 1, name: "叶子节点 1-2" },
        { id: 2, pId: 0, name: "父节点 2", open: true },
        { id: 21, pId: 2, name: "叶子节点 2-1" },
        { id: 22, pId: 2, name: "叶子节点 2-2" },
        { id: 23, pId: 2, name: "叶子节点 2-3" },
        { id: 3, pId: 0, name: "父节点 3", open: true },
        { id: 31, pId: 3, name: "叶子节点 3-1" },
        { id: 32, pId: 3, name: "叶子节点 3-2" },
        { id: 13, pId: 1, name: "叶子节点 1-3" },
        { id: 33, pId: 3, name: "叶子节点 3-3" }
      ]
    };
  },
  components: {
    upload: Upload
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
      var mysettings = this.setting;
      let _self = this;
      $.ajax({
        url: "/getAllNodes",
        type: "get",
        success: function(result) {
          console.log("getAllNodess temp", result.yes, result.maxid[0]);
          _self.newCount =
            result.maxid[0].maxid > 100 ? result.maxid[0].maxid - 100 + 1 : 1;
          _self.newId = result.maxid[0].maxid + 1;
          $.fn.zTree.init($("#treeDemo"), mysettings, result.yes);
        },
        error: function() {
          console.log("error! edit temp ,should rollback");
        }
      });
    },
    handleUploadData: function(data) {
      console.log(data);
      // alert(data);
      this.batchAddNodes(this.operatingnode, data);
    },
    zTreeOnMouseDown: function(event, treeId, treeNode) {
      // alert(treeNode ? treeNode.tId + ", " + treeNode.name : "isRoot");
      this.upvisible = true;
      this.operatingnode = treeNode;
    },
    beforeDrag: function(treeId, treeNodes) {
      return false;
    },
    beforeEditName: function(treeId, treeNode) {
      this.className = this.className === "dark" ? "" : "dark";
      // showLog("[ " + getTime() + " beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
      var zTree = $.fn.zTree.getZTreeObj("treeDemo");
      zTree.selectNode(treeNode);
      setTimeout(function() {
        if (confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？")) {
          setTimeout(function() {
            zTree.editName(treeNode);
          }, 0);
        }
      }, 0);
      return false;
    },
    beforeRemove: function(treeId, treeNode) {
      this.className = this.className === "dark" ? "" : "dark";
      // showLog("[ " + getTime() + " beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
      var zTree = $.fn.zTree.getZTreeObj("treeDemo");
      let notdel = treeNode.isParent && treeNode.children;
      if (notdel) {
        alert("你要先删除子结点！");
        return false;
      }

      zTree.selectNode(treeNode);
      return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
    },
    onRemove: function(e, treeId, treeNode) {
      $.ajax({
        url: "/delNode",
        data: { id: treeNode.id },
        dataType: "text",
        type: "post",
        success: function(result) {
          console.log("del success temp");
        },
        error: function() {
          console.log("error! del temp ,should rollback");
        }
      });
      // showLog("[ " + getTime() + " onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    },
    beforeRename: function(treeId, treeNode, newName, isCancel) {
      this.className = this.className === "dark" ? "" : "dark";
      // showLog((isCancel ? "<span style='color:red'>" : "") + "[ " + getTime() + " beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>" : ""));
      if (newName.length == 0) {
        setTimeout(function() {
          var zTree = $.fn.zTree.getZTreeObj("treeDemo");
          zTree.cancelEditName();
          alert("节点名称不能为空.");
        }, 0);
        return false;
      }
      return true;
    },

    onRename: function(e, treeId, treeNode, isCancel) {
      let id = treeNode.id;
      let pId = treeNode.pId;
      let open = treeNode.open;
      let name = treeNode.name;
      $.ajax({
        url: "/saveEditNodes",
        data: { id: id, name: name },
        dataType: "text",
        type: "post",
        success: function(result) {
          console.log("edit success temp");
        },
        error: function() {
          console.log("error! edit temp ,should rollback");
        }
      });
      // showLog((isCancel ? "<span style='color:red'>" : "") + "[ " + getTime() + " onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>" : ""));
    },
    showRemoveBtn: function(treeId, treeNode) {
      // return !treeNode.isFirstNode;
      return true;
    },
    showRenameBtn: function(treeId, treeNode) {
      // return !treeNode.isLastNode;
      return true;
    },
    showLog: function(str) {
      if (!log) log = $("#log");
      log.append("<li class='" + this.className + "'>" + str + "</li>");
      if (log.children("li").length > 8) {
        log.get(0).removeChild(log.children("li")[0]);
      }
    },
    getTime: function() {
      var now = new Date(),
        h = now.getHours(),
        m = now.getMinutes(),
        s = now.getSeconds(),
        ms = now.getMilliseconds();
      return h + ":" + m + ":" + s + " " + ms;
    },

    // var newCount = 1;
    addHoverDom: function(treeId, treeNode) {
      var sObj = $("#" + treeNode.tId + "_span");
      if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
        return;
      var addStr =
        "<span class='button add' id='addBtn_" +
        treeNode.tId +
        "' title='add node' onfocus='this.blur();'></span>";
      sObj.after(addStr);
      var _self = this;
      var btn = $("#addBtn_" + treeNode.tId);
      if (btn)
        btn.bind("click", function() {
          var zTree = $.fn.zTree.getZTreeObj("treeDemo");
          $.ajax({
            url: "/saveAllNodes",
            data: {
              node: [
                [
                  100 + _self.newCount,
                  treeNode.id,
                  "new node" + _self.newCount,
                  0
                ]
              ]
            },
            dataType: "text",
            type: "post",
            success: function() {
              console.log("add temp");
              zTree.addNodes(treeNode, {
                id: 100 + _self.newCount,
                pId: treeNode.id,
                name: "new node" + _self.newCount
              });
              _self.newCount++;
            },
            error: function() {
              console.log("error! add temp");
            }
          });

          return false;
        });
    },
    batchAddNodes: function(treeNode, data) {
      var _self = this;
      var pId = treeNode.id;
      var nodes = new Array();
      for (let i = 0; i < data.length; i++) {
        nodes[i] = new Array(4);
        nodes[i][0] = _self.newId + i;
        nodes[i][1] = pId;
        nodes[i][2] = data[i].filename;
        nodes[i][3] = 0;
      }
      $.ajax({
        url: "/saveAllNodes",
        data: {
          node: nodes
        },
        dataType: "text",
        type: "post",
        success: function() {
          console.log("add temp");
          nodes.forEach(element => {
             $.fn.zTree.getZTreeObj("treeDemo").addNodes(treeNode, {
              id: element[0],
              pId: element[1],
              name: element[2],
              open: element[3]
            });
          });

          _self.newId += nodes.length;
          console.log("success! add temps");
          $.fn.zTree.getZTreeObj("treeDemo").refresh();
        },
        error: function() {
          console.log("error! add temp");
        }
      });
    },
    removeHoverDom: function(treeId, treeNode) {
      $("#addBtn_" + treeNode.tId)
        .unbind()
        .remove();
    },
    selectAll: function() {
      var zTree = $.fn.zTree.getZTreeObj("treeDemo");
      zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
    },
    getAllSimpleData: function() {
      let data = $.fn.zTree
        .getZTreeObj("treeDemo")
        .transformToArray($.fn.zTree.getZTreeObj("treeDemo").getNodes());
      var nodes = new Array();
      for (let i = 0; i < data.length; i++) {
        nodes[i] = new Object();
        nodes[i][0] = data[i].id;
        nodes[i][1] = data[i].pId || 0;
        nodes[i][2] = data[i].name;
        nodes[i][3] = data[i].open == true ? 1 : 0;
        console.log(nodes[i]);
      }
      console.log("in the getAllsimple(", JSON.stringify(nodes));
      return nodes;
    },
    saveData: function() {
      let nodes = getAllSimpleData();
      let strnodes = JSON.stringify(nodes);
      console.log("in the saveData !", strnodes);
      $.ajax({
        url: "/saveAllNodes",
        data: { node: nodes },
        dataType: "text",
        type: "post",
        success: function() {
          console.log("success");
        },
        error: function() {
          console.log("error!");
        }
      });
    },
    getData: function() {
      $.ajax({
        url: "/getAllNodes",
        type: "get",
        success: function(result) {
          console.log("....................*****");
          console.log(result);
          $.fn.zTree.init($("#treeDemo"), setting, result.yes);
        },
        error: function() {
          console.log("error2!");
        }
      });
    }
  }
};
</script>
<style>
div.right {
  float: right;
}
</style>