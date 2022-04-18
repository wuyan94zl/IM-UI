<template>
  <div class="page-tabbar">
    <div>
      <mt-field
        label="用户名"
        placeholder="请输入用户名"
        v-model="username"
      ></mt-field>
      <mt-field
        label="密码"
        placeholder="请输入密码"
        type="password"
        v-model="password"
      ></mt-field>
      <mt-button @click="login">登录</mt-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
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
    login() {
      console.log(this.username, this.password);
      this.loading = true;
      this.$axios
        .post(
          "http://localhost:8888/user/login",
          {
            user_name: this.username,
            password: this.password,
          },
          {
            headers: {
              "content-type": "application/json",
            },
          }
        )
        .then((res) => {
          alert;
          let data = res.data;
          if (data.code == 200) {
            console.log(data);
            localStorage.setItem("_token", "Bearer " + data.data.access_token);
            localStorage.setItem("_userId", data.data.ws_token);
            this.$router.push('/home');
          } else {
            alert(data.message);
          }
          this.loading = false;
        });
    },
  },
};
</script>
<style>
</style>