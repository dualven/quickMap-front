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
          <a v-show="userInfo == null" href="#" @click="showLogin">登录</a>
          <el-dropdown @command="userMenuCommand" v-show="userInfo != null">
            <a href="#">{{(userInfo != null && userInfo.nickName) ? userInfo.nickName : ""}}</a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </nav>
        <el-dialog
          title="登录/注册"
          :show-close="false"
          :visible.sync="loginDialogVisible"
          width="300px"
          center
        >
          <el-form
            :rules="rules"
            ref="loginForm"
            :model="loginForm"
            v-show="tab == 'login'"
            label-width="80px"
            size="small"
            center
          >
            <el-form-item label="用户账号" prop="loginName">
              <el-input placeholder="请输入账号" v-model="loginForm.loginName" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
              <el-input placeholder="请输入密码" type="password" v-model="loginForm.password" clearable></el-input>
            </el-form-item>
            <el-form-item size="large">
              <el-button type="success" size="small" @click="execLogin">登录</el-button>
              <span>
                或
                <span class="algolia-highlight" @click="tab = 'reg'">注册</span>
              </span>
            </el-form-item>
          </el-form>
          <el-form
            :rules="rules"
            ref="regForm"
            :model="regForm"
            v-show="tab == 'reg'"
            label-width="80px"
            size="small"
            center
          >
            <el-form-item label="用户账号" prop="loginName">
              <el-input placeholder="最少5位" v-model="regForm.loginName" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
              <el-input placeholder="最少6位" v-model="regForm.password" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户名称" prop="userName">
              <el-input placeholder="最多16位" v-model="regForm.userName" clearable></el-input>
            </el-form-item>
            <el-form-item label="密保问题">
              <el-input placeholder="用于重置密码" v-model="regForm.resetPasswordAnswer" clearable></el-input>
            </el-form-item>
            <el-form-item size="large">
              <el-button type="primary" size="small" @click="execReg">注册</el-button>
              <span>
                或
                <span class="algolia-highlight" @click="tab = 'login'">登录</span>
              </span>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </el-header>
    <el-main class="m">
      <transition mode="out-in" name="fadeDown">
        <router-view style="animation-duration: 0.5s"></router-view>
      </transition>
    </el-main>
    <el-footer class="f">Copyright Ⓒ 2018</el-footer>
  </el-container>
</template>
<script>
import axios from "axios";
import constant from "@/config/Constant";
export default {
  mounted() {
    this.$EventBus.$on("showLogin", () => this.showLogin());
    this.loadUser();
  },
  computed: {},
  methods: {
    userMenuCommand(command) {
      switch (command) {
        case "logout":
          this.logout();
      }
    },
    logout() {
      var self = this;
      axios
        .post(self.serverAddr.logout)
        .then(function(resp) {
          sessionStorage.removeItem("user_info");
          window.location.reload();
        })
        .catch(function(error) {
          self.errorHandler(error);
        });
    },
    loadUser() {
      let userInfo;
      if ((userInfo = sessionStorage.getItem("user_info")) != null) {
        this.userInfo = JSON.parse(userInfo);
      }
    },
    setUser(user) {
      sessionStorage.setItem("user_info", JSON.stringify(user));
      this.userInfo = user;
    },
    showLogin() {
      this.tab = "login";
      this.loginDialogVisible = true;
    },
    execLogin() {
      let self = this;
      let loading = self.$loading({ fullscreen: true });
      axios.defaults.withCredentials = true;
      axios
        .post(this.serverAddr.login, self.loginForm)
        .then(function(resp) {
          loading.close();
          if (resp.data.success === false) {
            self.$message({
              message: "账号或密码不对",
              type: "error"
            });
            return;
          }
          self.setUser(resp.data);
          self.loginDialogVisible = false;
          self.$message({
            message: "登录成功",
            type: "success"
          });
        })
        .catch(function(error) {
          loading.close();
          self.errorHandler(error);
        });
    },
    execReg() {
      let self = this;
      let loading = self.$loading({ fullscreen: true });
      axios.defaults.withCredentials = true;
      axios
        .post(this.serverAddr.reg, self.regForm)
        .then(function(resp) {
          loading.close();
          self.loginDialogVisible = false;
          self.$message({
            message: "注册成功",
            type: "success"
          });
        })
        .catch(function(error) {
          loading.close();
          self.errorHandler(error);
        });
    }
  },
  data() {
    return {
      serverAddr: constant.serverAddr, //服务器地址
      loginDialogVisible: false, //显示登录框
      tab: "login", //登陆框tab
      userInfo: null, //用户信息
      loginForm: {
        //登陆表单
        loginName: null,
        password: null
      },
      regForm: {
        //注册表单
        loginName: null,
        password: null,
        userName: null,
        resetPasswordAnswer: null
      },
      rules: {
        //登陆/注册校验
        loginName: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 5, max: 32, message: "最少5位", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 32, message: "最少6位,最大32位", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { max: 16, message: "最大16位", trigger: "blur" }
        ]
      }
    };
  }
};
</script>
<style scoped>
.f {
  text-align: center;
  padding: 10px 0;
  width: 100%;
  left: 0;
  bottom: 0;
  position: fixed;
}
.m {
  width: -moz-fit-content;
  width: -webkit-fit-content;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  overflow: hidden;
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
nav > a,
nav > div > a {
  margin-left: 15px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 20px;
  text-shadow: 0.01em 0.01em 0.01em #333;
}
nav > a:link,
nav > div > a:link {
  text-decoration: none;
  color: rgb(95, 95, 95);
}
nav > a:active,
nav > div > a:active {
  text-decoration: blink;
  color: black;
}
nav > a:hover,
nav > div > a:hover {
  text-decoration: none;
  color: black;
}
nav > a:visited,
nav > div > a:visited {
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