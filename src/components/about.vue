<template>
  <div>
    <mt-header fixed title="个人中心"> </mt-header>
    <mt-cell title="用户账号">{{ info.UserName }}</mt-cell>
    <mt-cell title="用户昵称">{{ info.NickName }}</mt-cell>
    <mt-button type="danger" size="large" @click="logout">退出</mt-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$axios.post("/user/info", {}).then((res) => {
        let data = res.data;
        this.info = data.data;
      });
    },
    logout() {
      localStorage.removeItem("_token");
      localStorage.removeItem("_userId");
      localStorage.removeItem("_chatList");
      this.$router.push("/login");
    },
  },
};
</script>

<style></style>
