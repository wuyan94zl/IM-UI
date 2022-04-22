<template>
  <div>
    <mt-header fixed title="注册"> </mt-header>
    <div style="margin-top: 40px">
      <mt-field
        label="用户名"
        placeholder="请输入用户名"
        v-model="username"
      ></mt-field>
      <mt-field
        label="用户昵称"
        placeholder="请输入昵称"
        v-model="nickname"
      ></mt-field>
      <mt-field
        label="密码"
        placeholder="请输入密码"
        type="password"
        v-model="password"
      ></mt-field>
      <mt-button @click="register">注册</mt-button>
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
    register() {
      this.loading = true;
      this.$axios
        .post("/user/register", {
          user_name: this.username,
          nick_name: this.nickname,
          password: this.password,
          mobile:""
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
