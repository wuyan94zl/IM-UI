<template>
  <div>
    <mt-header fixed title="个人中心"> </mt-header>
    <mt-cell title="用户账号">{{ info.UserName }}</mt-cell>
    <mt-cell title="用户昵称">{{ info.NickName }}</mt-cell>
    <mt-button type="danger" size="large">退出</mt-button>
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
        console.log("用户信息",data)
      });
    },
  },
};
</script>

<style></style>
