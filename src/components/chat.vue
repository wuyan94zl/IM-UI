<template>
  <div>
    <div
      class="chatList"
      style="padding: 5px"
      v-for="(chart, k) in chartList"
      :key="k"
      @click="inChart(chart)"
    >
      <p>{{ chart.nick_name }}---</p>
      <p class="newMsg">
        <span>用户消息</span><span style="float: right">用户消息</span>
      </p>
    </div>
    <ul
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
    ></ul>
    <mt-popup v-model="qiyeVisible" position="right">
      <mt-header fixed :title="friend">
        <mt-button @click="qiyeVisible = false" slot="left" icon="back"
          >返回</mt-button
        >
      </mt-header>
      <div style="margin: 40px 5px 5px 5px; width: 100%" id="messageList">
        <div>
          <div
            v-for="(msg, k) in messageList"
            :key="k"
            :class="msg.user_id == userId ? 'messages me' : 'messages friend'"
          >
            <p class="name">{{ msg.nick_name }}</p>
            <div class="msg time-instruction">
              <p style="width: 100%">
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
</template>
<script>
export default {
  data() {
    return {
      userId: 0,
      chartList: [],
      qiyeVisible: false,
      allMessages: {},
      messageList: [],

      friend: "无言",
      channelId: "",
      message: "test",

      // 通知
      notice: [],
    };
  },
  mounted() {
    this.userId = localStorage.getItem("_userId");
    //注册监听事件
    window.addEventListener("onmessageWS", this.getSocketData);
  },
  methods: {
    inChart(chart) {
      // 进入聊天
      this.channelId = chart.channel_id;
      this.friend = chart.nick_name;
      if (this.allMessages[chart.user_id]) {
        this.messageList = this.allMessages[chart.user_id];
      } else {
        this.getMessage(chart.channel_id, chart.user_id);
      }
      this.setScrollTop();
      this.qiyeVisible = true;
    },
    getMessage(channel_id, user_id) {
      // 初始化聊天消息
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
      // 发送消息
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
      // 聊天列表
      this.loading = true;
      this.$axios.post("/friend/list", {}).then((response) => {
        this.chartList = response.data.list;
        this.loading = false;
      });
    },
    getSocketData(e) {
      // 监听消息接受
      let msg = JSON.parse(e.detail.data);
      console.log("消息接受：", msg);
      switch (msg.type) {
        case 100:
          if (msg.user_id == this.userId) {
            msg.type = 1;
          }
          if (!this.messageList) {
            this.messageList = new Array();
          }
          this.messageList.push(msg);
          this.setScrollTop();
          break;
        default:
          this.notice.push(msg);
          break;
      }
    },
    setScrollTop() {
    //   this.$nextTick(() => {
    //     let list = this.$el.querySelector("#messageList");
    //     list.scrollTop = list.scrollHeight;
    //   });
      let list = this.$el.querySelector("#messageList");
      setTimeout(function () {
        list.scrollTop = list.scrollHeight;
      }, 100);
    },
  },
};
</script>
