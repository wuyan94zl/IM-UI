<template>
  <div>
    <!-- <vFriend></vFriend> -->
    <div style="margin-top: 40px">
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="聊天">
          <v-chat></v-chat>
        </mt-tab-container-item>
        <mt-tab-container-item id="好友">
          <v-friend></v-friend>
        </mt-tab-container-item>
        <mt-tab-container-item id="我的">
          <v-about></v-about>
        </mt-tab-container-item>
      </mt-tab-container>

      <mt-tabbar v-model="selected" fixed>
        <mt-tab-item id="聊天"> 聊天 </mt-tab-item>
        <mt-tab-item id="好友"> 好友 </mt-tab-item>
        <mt-tab-item id="我的"> 我的 </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>
</template>
<script>
import vChat from "./chat.vue";
import vFriend from "./friend.vue";
import vAbout from "./about.vue";
export default {
  name: "login",
  data() {
    return {
      selected: "聊天",
    };
  },
  components: {
    vChat,
    vFriend,
    vAbout,
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
  },
};
</script>
<style>
@import "../css/app.css";
</style>
