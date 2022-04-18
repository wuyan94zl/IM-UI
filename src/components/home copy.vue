<template>
  <div class="page-tabbar">
    <div>
      <mt-header fixed title="chart"></mt-header>
      <div class="page-wrap">
        <!-- tabcontainer -->
        <mt-tab-container class="page-tabbar-container" v-model="selected">
          <mt-tab-container-item id="聊天">
            <div style="margin: 40px 5px 5px 5px; width: 100%">
              <div
                style="padding: 5px"
                v-for="(chart, k) in chartList"
                :key="k"
                @click="inChart(chart)"
              >
                <p>{{ chart.nick_name }}---</p>
                <!-- <p><span>用户消息</span><span style="float:right;">用户消息</span></p> -->
              </div>
              <ul
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10"
              ></ul>
              <mt-popup v-model="qiyeVisible" position="right">
                <mt-header fixed :title="friend">
                  <mt-button
                    @click="qiyeVisible = false"
                    slot="left"
                    icon="back"
                    >返回</mt-button
                  >
                </mt-header>
                <div style="margin: 40px 5px 5px 5px; width: 100%" id="messageList">
                  <div>
                    <div
                      v-for="(msg, k) in messageList"
                      :key="k"
                      :class="
                        msg.type == '1' ? 'messages me' : 'messages friend'
                      "
                    >
                      <p class="name">{{ msg.nick_name }}</p>
                      <div class="msg">
                        <p style="width:100%">
                          {{ msg.content }}
                        </p>
                        <p class="timer">{{ msg.send_time }}</p>
                      </div>
                    </div>
                  </div>
                  <div
                    style="
                      position: fixed;
                      bottom: 5px;
                      width: 100%;
                      border-top: 1px solid red;
                    "
                  >
                    <mt-field
                      placeholder="输入发送的消息"
                      type="textarea"
                      rows="1"
                      v-model="message"
                    ></mt-field>
                    <mt-button
                      class="is-right"
                      style="float: right; width: 100px"
                      @click="sendMessage"
                      >发送</mt-button
                    >
                  </div>
                </div>
              </mt-popup>
            </div>
          </mt-tab-container-item>

          <mt-tab-container-item id="好友"> 好友 </mt-tab-container-item>
          <mt-tab-container-item id="我的">
            <router-link to="/">
              <!-- button -->
              <mt-button type="danger" size="large">退出</mt-button>
            </router-link>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
      <mt-tabbar v-model="selected" fixed>
        <mt-tab-item id="聊天"> 聊天 </mt-tab-item>
        <mt-tab-item id="好友"> 好友 </mt-tab-item>
        <mt-tab-item id="我的"> 我的 </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      userId: 0,
      chartList: [],
      qiyeVisible: false,
      selected: "聊天",
      allMessages: {},
      messageList: [],

      friend: "无言",
      channelId: "",
      message: "test",

      // // 键盘
      // docmHeight: document.documentElement.clientHeight, //默认屏幕高度
      // showHeight: document.documentElement.clientHeight, //实时屏幕高度
      // hidshow: true, //显示或者隐藏footer
    };
  },
  mounted() {
    this.userId = localStorage.getItem("_userId");
    // window.onresize监听页面高度的变化
    window.onresize = () => {
      return (() => {
        this.showHeight = document.body.clientHeight;
      })();
    };
    //注册监听事件
    window.addEventListener("onmessageWS", this.getSocketData);
  },
  watch: {},
  methods: {
    inChart(chart) {
      this.channelId = chart.channel_id;
      this.friend = chart.nick_name;
      if (this.allMessages[chart.user_id]) {
        this.messageList = this.allMessages[chart.user_id];
      } else {
        this.getMessage(chart.channel_id, chart.user_id);
      }
      this.qiyeVisible = true;
      this.setScrollTop();
    },
    getMessage(channel_id, user_id) {
      this.loading = true;
      this.$axios
        .post("/message/list", {
          channel_id: channel_id,
          min_message_id: 0,
        })
        .then((res) => {
          let data = res.data.list;
          this.allMessages[user_id] = data;
          this.messageList = data;
          this.loading = false;
        });
    },
    sendMessage() {
      let msg =
        '{"channel_id":"' +
        this.channelId +
        '","content":"' +
        this.message +
        '","type" : 100}';

      msg = msg.replace(/\n/g, "\\n");
      this.$SOCKET.sendMessage(msg);
    },
    loadMore() {
      this.loading = true;
      this.$axios.post("/friend/list", {}).then((response) => {
        console.log(response);
        this.chartList = response.data.list;
        this.loading = false;
      });
    },
    getSocketData(e) {
      let msg = JSON.parse(e.detail.data);
      if (msg.user_id == this.userId) {
        msg.type = 1;
      }
      this.messageList.push(msg);
      this.setScrollTop();
    },
    setScrollTop() {
      let list = this.$el.querySelector("#messageList");
      console.log("高", list);
      list.scrollTop = list.scrollHeight;
      
    },
  },
};
</script>
<style>

</style>
