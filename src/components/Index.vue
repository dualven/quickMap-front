<template>
  <el-container>
    <el-header class="h">
      <div class="p">
        <h1 class="inline">
          <i class="el-icon-upload logo">QuickMap</i>
        </h1>
        <nav class="inline my_nav">
          <router-link to="/index/upload">上传</router-link>
          <router-link to="/index/search">搜索</router-link>
          <router-link to="/index/about">关于</router-link>
          <router-link to="/index/apiList">Api</router-link>
        </nav>
      </div>
    </el-header>
    <el-main class="m">
      <transition>
        <router-view></router-view>
      </transition>
    </el-main>
    <el-footer class="f">Copyright Ⓒ 2018</el-footer>
  </el-container>
</template>
<script>
export default {
};
</script>
<style scoped>
.f {
  text-align: center;
  padding: 10px 0;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  position: absolute;
}
.m {
  width: -moz-fit-content;
  width: -webkit-fit-content;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
}
.logo {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  margin-right: 450px;
  font-size: 30px;
}
.p {
  width: -moz-fit-content;
  width: -webkit-fit-content;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.inline {
  display: inline;
}
nav > a {
  margin-left: 15px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 20px;
  text-shadow: 0.01em 0.01em 0.01em #333;
}
nav > a:link {
  text-decoration: none;
  color: rgb(95, 95, 95);
}
nav > a:active {
  text-decoration: blink;
  color: black;
}
nav > a:hover {
  text-decoration: none;
  color: black;
}
nav > a:visited {
  text-decoration: none;
  color: rgb(75, 75, 75);
}

@media screen and (max-width: 900px) {
  .logo {
    margin-right: 100px;
  }
}
@media screen and (max-width: 550px) {
  .logo {
    display: none;
  }
}


</style>