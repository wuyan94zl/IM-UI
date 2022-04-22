<template>
  <div>
    <mt-header fixed title="登录"> </mt-header>
    <div class="my-form" style="margin-top: 40px">
      <mt-field
        class="my-form-item my-form-item-border"
        placeholder="请输入登录用户名"
        v-model="username"
      ></mt-field>
      <mt-field
        class="my-form-item my-form-item-border"
        placeholder="请输入登录密码"
        type="password"
        v-model="password"
      ></mt-field>
      <br />
      <div class="my-form-item" style="color: rgb(38, 162, 255)">
        <div style="width: 50%; float: left; text-align: left">
          <a @click="forget">忘记密码</a>
        </div>
        <div style="width: 50%; float: left">
          <a @click="register">用户注册</a>
        </div>
      </div>
      <br /><br />
      <div class="my-form-item my-form-submit">
        <mt-button type="danger" size="large" @click="login">登录</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      username: "wuyan94zl",
      password: "123456",
    };
  },
  mounted() {
    // window.onresize监听页面高度的变化
    window.onresize = () => {
      return (() => {
        this.showHeight = document.body.clientHeight;
      })();
    };
  },
  watch: {},
  methods: {
    forget() {
      this.$toast({
        message: "暂不支持忘记密码！",
        position: "center",
        duration: 1000,
      });
    },
    register() {
      this.$router.push("/register");
    },
    login() {
      this.loading = true;
      this.$axios
        .post("/user/login", {
          user_name: this.username,
          password: this.password,
        })
        .then((res) => {
          let data = res.data;
          if (data.code == 200) {
            localStorage.setItem("_token", "Bearer " + data.data.access_token);
            localStorage.setItem("_userId", data.data.ws_token);
            this.$toast({
              message: "登录成功",
              position: "center",
              duration: 1000,
            });
            this.$router.push("/home");
          } else {
            this.$toast({
              message: data.message,
              position: "center",
              duration: 1000,
            });
          }
          this.loading = false;
        });
    },
  },
};
</script>
<style></style>
