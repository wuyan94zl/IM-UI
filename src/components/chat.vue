<template>
  <div>
    <mt-header fixed title="聊天"> </mt-header>
    <mt-cell-swipe
      class="notice-list"
      title="通知"
      :label="noticeItem.label"
      is-link
      v-on:click.native="inNotice"
      :right="[
        {
          content: '清空通知',
          style: { background: 'red', color: '#fff' },
          handler: () => clearNotice(),
        },
      ]"
    >
      <mt-badge size="small" color="red" v-if="noticeItem.unReadNum > 0"
        >未读 {{ noticeItem.unReadNum }}</mt-badge
      >
    </mt-cell-swipe>
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
          :title="item.content"
          :label="item.note"
          :value="item.send_time"
          is-link
        >
          <span v-if="item.status == 0">
            <mt-button
              class="my-button"
              @click="firentHandle(item.id, k, 1, item.type)"
              >同意</mt-button
            >
            <mt-button
              class="my-button"
              @click="firentHandle(item.id, k, 0, item.type)"
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
      :title="chat.title"
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
      <mt-header fixed :title="title">
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

      title: "",
      type: 100,
      friend: "",
      channelId: "",
      message: "",

      // 通知
      noticeVisible: false,
      noticeItem: {
        label: "",
        unReadNum: 0,
      },
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

    /** notice methods */
    // 进入notice
    clearNotice() {
      localStorage.removeItem("_noticeItem");
      localStorage.removeItem("_noticeList");
      this.notice = [];
      this.noticeItem.label = "";
      this.noticeItem.unReadNum = 0;
    },
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
      let noticeList = localStorage.getItem("_noticeList");
      if (noticeList) {
        this.notice = JSON.parse(noticeList);
      } else {
        this.notice = [];
      }
      // this.loading = true;
      // this.$axios.post("/notice/list", {}).then((res) => {
      //   let data = res.data;
      //   this.notice = data.list;
      // });
    },
    // 通知消息处理
    firentHandle(id, k, rlt, type) {
      this.loading = true;
      switch (type) {
        case 1:
          this.$axios
            .post("/friend/handle", { action_type: rlt, action_log_id: id })
            .then((res) => {
              if (res.data.data.status == true) {
                this.notice[k].status = 1;
                this.notice[k].is_agree = "已同意";
                window.dispatchEvent(
                  new CustomEvent("friendList", {
                    detail: {},
                  })
                );
              } else {
                this.notice[k].status = 1;
                this.notice[k].is_agree = "已拒绝";
              }
              localStorage.setItem("_noticeList", JSON.stringify(this.notice));
            });
          break;
        case 2:
          this.$axios
            .post("/group/join/handle", { action_type: rlt, join_id: id })
            .then((res) => {
              if (res.data.data.status == true) {
                this.notice[k].status = 1;
                this.notice[k].is_agree = "已同意";
                window.dispatchEvent(
                  new CustomEvent("friendList", {
                    detail: {},
                  })
                );
              } else {
                this.notice[k].status = 1;
                this.notice[k].is_agree = "已拒绝";
              }
              localStorage.setItem("_noticeList", JSON.stringify(this.notice));
            });
          break;
      }
    },

    /** 会话管理 */
    // 移除会话
    removeChat(k) {
      localStorage.removeItem(this.list[k].channel_id);
      this.list.splice(k, 1);
      this.sortList(1);
    },
    // 会话列表排序
    sortList(all) {
      this.listMap = {};
      let unreadNum = 0;
      for (let i in this.list) {
        this.listMap[this.list[i].channel_id] = i;
        unreadNum += this.list[i].unread;
      }
      if (all == 1) {
        this.updHomeUnreadNum(unreadNum + this.noticeItem.unReadNum, true);
      }
      this.setCacheList();
    },
    // 会话列表本地缓存
    getCacheList() {
      var cacheList = localStorage.getItem("_chatList");
      if (cacheList) {
        this.list = JSON.parse(cacheList);
      } else {
        this.list = [];
      }
      this.sortList(1);
    },
    setCacheList() {
      localStorage.setItem("_chatList", JSON.stringify(this.list));
    },

    /** chat methods */
    // 会话列表，本地缓存获取
    chatList() {
      this.getCacheList("get");
    },
    // 进入会话聊天
    inChat(chat) {
      console.log("inchat params:", chat);
      this.updHomeUnreadNum(chat.unread * -1);
      chat.unread = 0;
      if (!this.listMap[chat.channel_id]) {
        this.list.unshift({
          title: chat.title,
          type: chat.type,
          channel_id: chat.channel_id,
          user_id: chat.user_id,
          nick_name: chat.nick_name,
          unread: 0,
        });
      }
      this.channelId = chat.channel_id;
      this.friend = chat.nick_name;
      this.title = chat.title;
      this.type = chat.type;
      this.messageList = this.getCacheMessage(chat.channel_id); // 消息初始化
      this.setScrollTop(); // 消息置底
      this.qiyeVisible = true;
      this.sortList(); // 会话排序
    },
    // 获取channel缓存数据
    getCacheMessage(channel_id) {
      let msgList = localStorage.getItem(channel_id);
      if (msgList) {
        return JSON.parse(msgList);
      } else {
        return [];
      }
    },
    setCacheMessage(channel_id, msg) {
      localStorage.setItem(channel_id, JSON.stringify(msg));
    },
    // 聊天数据处理
    handleMessageList(msg) {
      let messageList = [];
      if (this.qiyeVisible == true && this.channelId == msg.channel_id) {
        this.messageList.push(msg);
        messageList = this.messageList;
        this.setScrollTop();
      } else {
        messageList = this.getCacheMessage(msg.channel_id);
        messageList.push(msg);
      }
      this.setCacheMessage(msg.channel_id, messageList);
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
        '","channel_title":"' +
        this.title +
        '","content":"' +
        this.message +
        '","type" : ' +
        this.type +
        "}";
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
        case 101:
          // 不存在该会话
          if (this.listMap[msg.channel_id] == undefined) {
            // this.listMap[msg.channel_id] = 0; // 排序索引
            this.list.unshift({
              channel_id: msg.channel_id,
              user_id: msg.user_id,
              title: msg.channel_title,
              nick_name: msg.detail.nick_name,
              unread: 0,
              type: msg.type,
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
          // 消息处理
          this.handleMessageList(msg);

          // 最新消息赋值
          this.list[0].content = msg.content;
          // 未读消息数量处理
          this.unreadStat(msg);
          // 排序处理
          this.sortList();
          break;
        case 200:
        case 201:
        case 202:
          var context = JSON.parse(msg.content);
          var noticeItem = {
            id: context.Id,
            nick_name: msg.nick_name,
            type: context.Tp,
            content: context.Tp == 1 ? "好友通知消息" : "群组通知消息",
            note: context.Content,
            create_time: context.CreatTime,
            send_time: msg.send_time,
            status: context.Status,
            is_agree: context.IsAgree,
          };
          if (!this.notice) {
            this.notice = [];
          }
          this.notice.unshift(noticeItem);
          this.noticeItem.label = noticeItem.content;
          if (msg.user_id != this.userId) {
            this.noticeItem.unReadNum += 1;
            this.updHomeUnreadNum(1);
          }
          localStorage.setItem("_noticeItem", JSON.stringify(this.noticeItem));
          localStorage.setItem("_noticeList", JSON.stringify(this.notice));
          if (msg.type != 200) {
            this.list.splice(this.listMap[msg.channel_id], 1);
            this.sortList(1);
          }
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
