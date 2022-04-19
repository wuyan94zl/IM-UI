<template>
  <div>
    <vFriend></vFriend>
    <div style="margin-top: 40px;">
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="聊天">
          <v-chat></v-chat>
        </mt-tab-container-item>
        <mt-tab-container-item id="通知">
          <v-notice></v-notice>
        </mt-tab-container-item>
        <mt-tab-container-item id="我的">
          <router-link to="/">
            <mt-button type="danger" size="large">退出</mt-button>
          </router-link>
        </mt-tab-container-item>
      </mt-tab-container>

      <mt-tabbar v-model="selected" fixed>
        <mt-tab-item id="聊天"> 聊天 </mt-tab-item>
        <mt-tab-item id="通知"> 通知 </mt-tab-item>
        <mt-tab-item id="我的"> 我的 </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>
</template>
<script>
import vChat from "./chat.vue";
import vFriend from "./friend.vue";
import vNotice from "./notice.vue";
// import { Toast } from "mint-ui";
export default {
  name: "login",
  data() {
    return {
      selected: "聊天",
      // 通知
      // notice: [],
    };
  },
  components: {
    vChat,vFriend,vNotice,
  },
  mounted() {
    //注册监听事件
    window.addEventListener("onmessageWS", this.getSocketData);
  },
  methods: {
    getSocketData(e) {
      // 监听消息接受
      let msg = JSON.parse(e.detail.data);
      switch (msg.type) {
        case 100:

          break;
      }
    },
    // getNotice() {
    //   this.loading = true;
    //   this.$axios.post("/notice/list", {}).then((res) => {
    //     let data = res.data.list;
    //     this.notice = data;
    //     this.loading = false;
    //   });
    // },
  },
};
</script>
<style>
@import "../css/app.css";
</style>
