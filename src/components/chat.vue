<template>
  <div>
    <mt-header fixed title="聊天"> </mt-header>
    <mt-cell
      class="notice-list"
      title="通知"
      :label="noticeItem.label"
      is-link
      v-on:click.native="inNotice"
    >
      <mt-badge size="small" color="red" v-if="noticeItem.unReadNum > 0"
        >未读 {{ noticeItem.unReadNum }}</mt-badge
      >
    </mt-cell>
    <mt-popup v-model="noticeVisible" position="right">
      <mt-header fixed :title="friend">
        <mt-button @click="noticeVisible = false" slot="left" icon="back"
          >返回</mt-button
        >
      </mt-header>
      <div style="margin: 40px 5px 5px 5px">
        <mt-cell
          v-for="(item, k) in notice"
          :key="k"
          :title="item.nick_name"
          :label="item.content + item.create_time"
          :value="item.send_time"
          is-link
        >
          <span v-if="item.status == 0">
            <mt-button class="my-button" @click="firentHandle(item.id, k, 1)"
              >同意</mt-button
            >
            <mt-button class="my-button" @click="firentHandle(item.id, k, 0)"
              >拒绝</mt-button
            >
          </span>
          <span v-else> {{ item.is_agree }} </span>
        </mt-cell>
      </div>
    </mt-popup>
    <mt-cell-swipe
      class="notice-list"
      v-for="(chat, k) in list"
      :key="k"
      :title="chat.nick_name"
      :label="chat.content"
      is-link
      v-on:click.native="inChat(chat)"
      :right="[
        {
          content: '移除会话',
          style: { background: 'red', color: '#fff' },
          handler: () => removeChat(k),
        },
      ]"
    >
      <mt-badge size="small" color="red" v-if="chat.unread > 0"
        >未读 {{ chat.unread }}</mt-badge
      >
    </mt-cell-swipe>

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
            <p class="name">{{ msg.detail.nick_name }}</p>
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
      userId: "",
      list: [],
      listMap: {},

      qiyeVisible: false,
      allMessages: {},
      messageList: [],
      unreadStatData: {},

      friend: "",
      channelId: "",
      message: "",

      // 通知
      noticeVisible: false,
      noticeItem: {
        label: "",
        unReadNum: 0,
      },
      noticeLabel: "暂无新通知",
      noticeUnReadNum: 0,
      notice: [],
    };
  },
  mounted() {
    this.userId = localStorage.getItem("_userId");
    //注册监听事件
    window.addEventListener("onmessageWS", this.getSocketData);
    window.addEventListener("addMessage", this.addMessage);
    this.noticeList();
    // 延时加载信息
    setTimeout(() => {
      this.chatList();
    }, 200);
  },
  methods: {
    /** 监听事件 */
    addMessage(e) {
      this.inChat(e.detail.data);
    },
    /** 未读消息处理 */
    unreadStat(msg) {
      if (this.qiyeVisible == true && this.channelId == msg.channel_id) {
        return;
      }
      this.list[0].unread++;
      this.updHomeUnreadNum(1);
    },
    // 通知home页
    updHomeUnreadNum(num, all = false) {
      window.dispatchEvent(
        new CustomEvent("unreadUpd", {
          detail: {
            num: num,
            all: all,
          },
        })
      );
    },

    /** 会话管理 */
    // 移除会话
    removeChat(k) {
      this.list.splice(k, 1);
      this.cacheList();
    },
    // 会话列表排序
    sortList(add) {
      this.listMap = {};
      let unreadNum = 0;
      for (let i in this.list) {
        this.listMap[this.list[i].channel_id] = i;
        unreadNum += this.list[i].unread;
      }
      if (add == 1) {
        this.updHomeUnreadNum(unreadNum + this.noticeItem.unReadNum, true);
      }
      this.cacheList();
    },
    // 会话列表本地缓存
    cacheList() {
      localStorage.setItem("_chatList", JSON.stringify(this.list));
    },

    /** notice methods */
    // 进入notice
    inNotice() {
      if (this.noticeItem.unReadNum > 0) {
        this.updHomeUnreadNum(this.noticeItem.unReadNum * -1);
      }
      this.noticeVisible = true;
      this.noticeItem.unReadNum = 0;
      localStorage.setItem("_noticeItem", JSON.stringify(this.noticeItem));
    },
    // 通知列表
    noticeList() {
      let noticeItem = localStorage.getItem("_noticeItem");
      if (noticeItem) {
        this.noticeItem = JSON.parse(noticeItem);
      } else {
        this.noticeItem = { label: "暂无新通知", unReadNum: 0 };
      }
      this.loading = true;
      this.$axios.post("/notice/list", {}).then((res) => {
        let data = res.data;
        this.notice = data.list;
      });
    },
    // 通知消息处理
    firentHandle(id, k, rlt) {
      this.notice[k].content = "同意";
      this.loading = true;
      this.$axios
        .post("/friend/handle", { action_type: rlt, action_log_id: id })
        .then((res) => {
          if (res.data.status == true) {
            this.notice[k].status = 1;
            this.notice[k].is_agree = "已同意";
          } else {
            this.notice[k].status = 1;
            this.notice[k].is_agree = "已拒绝";
          }
        });
    },

    /** chat methods */
    // 会话列表，本地缓存获取
    chatList() {
      // this.loading = true;
      // this.$axios.post("/friend/list", {}).then((response) => {
      //   // this.list = response.data.list;
      //   JSON.stringify(response.data.list)
      //   localStorage.setItem("_chatList",JSON.stringify(response.data.list));
      //   // this.sortList();
      //   this.loading = false;
      // });
      var cacheList = localStorage.getItem("_chatList");
      if (cacheList) {
        this.list = JSON.parse(cacheList);
      }
      this.sortList(1);
    },
    // 进入会话聊天
    inChat(chat) {
      this.updHomeUnreadNum(chat.unread * -1);
      chat.unread = 0;
      if (!this.listMap[chat.channel_id]) {
        this.list.unshift(chat);
      }

      this.channelId = chat.channel_id;
      this.friend = chat.nick_name;
      let msgList = localStorage.getItem(chat.channel_id);
      if (msgList) {
        this.messageList = JSON.parse(msgList);
      } else {
        this.messageList = [];
      }
      this.setScrollTop();
      this.qiyeVisible = true;
      this.unreadStatData[chat.channel_id] = 0;
      this.sortList();
    },
    // 初始化聊天记录
    getMessage(channel_id) {
      // this.loading = true;
      // this.$axios
      //   .post("/message/list", {
      //     channel_id: channel_id,
      //     min_message_id: 0,
      //   })
      //   .then((res) => {
      //     let data = res.data.list;
      //     this.allMessages[user_id] = data;
      //     this.messageList = data;
      //     this.loading = false;
      //   });
      let msgList = localStorage.getItem(channel_id);
      if (msgList) {
        this.messageList = JSON.parse(msgList);
      } else {
        this.messageList = [];
      }
    },
    cacheMessageList(channel_id, msg) {
      let c = localStorage.getItem(channel_id);
      var list = [];
      if (c) {
        list = JSON.parse(c);
      }
      list.push(msg);
      localStorage.setItem(channel_id, JSON.stringify(list));
    },
    // 发送消息
    sendMessage() {
      if (this.message == "") {
        this.$toast({
          message: "请输入发送内容",
          position: "center",
          duration: 1000,
        });
        return;
      }
      let msg =
        '{"channel_id":"' +
        this.channelId +
        '","content":"' +
        this.message +
        '","type" : 100}';
      msg = msg.replace(/\n/g, "\\n"); // 回车换行处理
      this.message = "";
      this.$SOCKET.sendMessage(msg);
    },

    // 消息监听处理
    getSocketData(e) {
      let msg = JSON.parse(e.detail.data);
      console.log("消息监听：", msg);
      switch (msg.type) {
        case 100:
          // 不存在该会话
          if (this.listMap[msg.channel_id] == undefined) {
            this.listMap[msg.channel_id] = 0; // 排序索引
            // 添加到会话列表
            this.list.unshift({
              channel_id: msg.channel_id,
              user_id: msg.user_id,
              nick_name: msg.detail.nick_name,
              unread: 0,
            });
          } else {
            // 排序处理
            var i = this.listMap[msg.channel_id];
            if (i != 0) {
              let item = this.list[i];
              this.list.splice(i, 1);
              this.list.unshift(item);
            }
          }
          // 最新消息赋值
          this.list[0].content = msg.content;
          // 未读消息处理
          this.unreadStat(msg);
          // 排序处理
          this.sortList();
          if (!this.messageList) {
            this.messageList = new Array();
          }
          // 消息添加与置底
          this.messageList.push(msg);
          this.cacheMessageList(msg.channel_id, msg);
          if (this.qiyeVisible == true && this.channelId == msg.channel_id) {
            this.setScrollTop();
          }
          break;
        case 200: // 通知消息
          var context = JSON.parse(msg.content);
          context.nick_name = msg.detail.nick_name;
          context.unread = this.noticeUnReadNum;
          if (!this.notice) {
            this.notice = new Array();
          }
          this.notice.unshift(context);
          this.noticeItem.label = context.content;
          if (msg.user_id != this.userId) {
            this.noticeItem.unReadNum += 1;
            this.updHomeUnreadNum(1);
          }
          localStorage.setItem("_noticeItem", JSON.stringify(this.noticeItem));
          break;
        case 202: // 删除好友
          this.list.splice(this.listMap[msg.channel_id], 1);
          this.sortList(1);
          break;
        default:
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
