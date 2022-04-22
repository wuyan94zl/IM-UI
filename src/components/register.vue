<template>
  <div>
    <mt-header fixed title="注册"> </mt-header>
    <div class="my-form" style="margin-top: 40px">
      <mt-field
        class="my-form-item my-form-item-border"
        placeholder="请输入登录用户名"
        v-model="username"
      ></mt-field>
      <mt-field
        class="my-form-item my-form-item-border"
        placeholder="请输入用户昵称"
        v-model="nickname"
      ></mt-field>
      <mt-field
        class="my-form-item my-form-item-border"
        placeholder="请输入登录密码"
        type="password"
        v-model="password"
      ></mt-field>
      <br />
      <div class="my-form-item" style="color: rgb(38, 162, 255)">
        <div style="width: 100%">
          <a @click="login">已有用户登录</a>
        </div>
      </div>
      <br />
      <div class="my-form-item my-form-submit">
        <mt-button type="danger" size="large" @click="register"
          >注册用户</mt-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      username: "",
      nickname: "",
      password: "",
    };
  },
  mounted() {},
  watch: {},
  methods: {
    login() {
      this.$router.push("/login");
    },
    register() {
      this.loading = true;
      this.$axios
        .post("/user/register", {
          user_name: this.username,
          nick_name: this.nickname,
          password: this.password,
          mobile: "",
        })
        .then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$router.push("/login");
          } else {
            alert(data.message);
          }
          this.loading = false;
        });
    },
  },
};
</script>
<style></style>
