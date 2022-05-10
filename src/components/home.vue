<template>
  <div>
    <!-- <vFriend></vFriend> -->
    <div style="margin-top: 40px">
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="聊天">
          <v-chat></v-chat>
        </mt-tab-container-item>
        <mt-tab-container-item id="朋友">
          <v-friend></v-friend>
        </mt-tab-container-item>
        <mt-tab-container-item id="群组">
          <v-group></v-group>
        </mt-tab-container-item>
        
        <mt-tab-container-item id="我的">
          <v-about></v-about>
        </mt-tab-container-item>
      </mt-tab-container>

      <mt-tabbar v-model="selected" fixed>
        <mt-tab-item id="聊天">
          <div style="float: left; margin-left: 40%">
            <i class="iconfont icon-chat"></i><br />聊天
          </div>
          <mt-badge size="small" color="red" v-if="unreadNum > 0">{{
            unreadNum
          }}</mt-badge>
        </mt-tab-item>
        <mt-tab-item id="朋友">
          <i class="iconfont icon-friend"></i><br />朋友
        </mt-tab-item>
        <mt-tab-item id="群组">
          <i class="iconfont icon-qunzuduoren"></i><br />群组
        </mt-tab-item>
        <mt-tab-item id="我的">
          <i class="iconfont icon-me"></i><br />我的
        </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>
</template>
<script>
import vChat from "./chat.vue";
import vFriend from "./friend.vue";
import vAbout from "./about.vue";
import vGroup from "./group.vue";
export default {
  name: "login",
  data() {
    return {
      selected: "聊天",
      unreadNum: 0,
    };
  },
  components: {
    vChat,
    vFriend,
    vAbout,
    vGroup,
  },
  mounted() {
    //注册监听事件
    window.addEventListener("unreadUpd", this.unreadUpd);
    window.addEventListener("onmessageWS", this.getSocketData);
    window.addEventListener("addMessage", this.addMessage);
  },
  methods: {
    addMessage() {
      this.selected = "聊天";
    },
    unreadUpd(data) {
      console.log("home readnum", data);
      if (data.detail.all) {
        this.unreadNum = data.detail.num;
      } else {
        this.unreadNum += data.detail.num;
      }
    },
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
@import url("//at.alicdn.com/t/font_3351369_q6rdxosf90c.css");
</style>
