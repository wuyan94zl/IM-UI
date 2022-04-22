<template>
  <div>
    <mt-header fixed title="好友">
      <mt-button @click="addVisible = true" slot="right" icon="add"
        >添加</mt-button
      >
    </mt-header>
    <mt-popup v-model="addVisible" position="right">
      <mt-header fixed title="好友搜索">
        <mt-button @click="addVisible = false" slot="left" icon="back"
          >返回</mt-button
        >
      </mt-header>
      <div style="margin-top: 40px">
        <mt-search
          v-model="keyword"
          succees-text="取消"
          placeholder="搜索"
          :result.sync="result"
        >
          <div style="margin-top: 48px">
            <mt-cell
              v-for="(item, k) in result"
              :key="k"
              :title="item.nick_name"
              @click.native="addFriend(item.id, item.is_friend)"
            >
              <span v-if="item.is_friend == 1">已添加</span>
              <span v-else>添加</span>
            </mt-cell>
          </div>
        </mt-search>
      </div>
    </mt-popup>
    <mt-cell-swipe
      class="notice-list"
      v-for="(friend, k) in friends"
      :key="k"
      :title="friend.nick_name"
      is-link
      @touchstart.native="info(friend)"
    ></mt-cell-swipe>
    <mt-popup v-model="infoVisible" position="right">
      <mt-header fixed title="信息">
        <mt-button @click="infoVisible = false" slot="left" icon="back"
          >返回</mt-button
        >
      </mt-header>
      <div style="margin-top: 40px"></div>
      <mt-cell title="昵称">{{ friend.nick_name }}</mt-cell>
      <br/>
      <mt-button type="primary" class="my-button" size="large" @click="joinMessage(friend)">发送消息</mt-button>
      <br/>
      <mt-button type="danger" class="my-button" size="large" @click="delFriend(friend)">删除朋友</mt-button>
    </mt-popup>
  </div>
</template>

//
<script>
export default {
  name: "login",
  data() {
    return {
      addVisible: false,
      keyword: "",
      result: [],
      friends: [],
      friend: {},
      infoVisible: false,
    };
  },
  mounted() {
    //注册监听事件
    window.addEventListener("onmessageWS", this.getSocketData);
    this.friendList();
  },
  watch: {
    keyword: function (newVal) {
      if (newVal != "") {
        this.$axios
          .post("/user/list", { keyword: this.keyword })
          .then((res) => {
            let data = res.data.list;
            this.result = data;
          });
      }
    },
  },
  methods: {
    // 朋友列表
    friendList() {
      this.$axios.post("/friend/list", {}).then((res) => {
        let data = res.data.list;
        this.friends = data;
        console.log("friends", this.friends);
      });
    },
    // 添加朋友
    addFriend(id, isFriend) {
      if (isFriend == 1) {
        return;
      }
      this.$axios
        .post("/friend/add", {
          friend_id: id,
        })
        .then((res) => {
          console.log(res);
        });
    },
    // 删除朋友
    delFriend(friend) {
      console.log("friend delete", friend);
      this.$axios
        .post("/friend/del", { friend_id: friend.user_id })
        .then((res) => {
          let data = res.data;
          console.log("friend delete", data);
        });
    },
    // 朋友详情
    info(friend) {
      this.friend = friend;
      this.infoVisible = true;
    },
    // 进入会话
    joinMessage(){
      
    },
    // 消息监听处理
    getSocketData(e) {
      let msg = JSON.parse(e.detail.data);
      switch (msg.type) {
        case 201: // 添加好友
          if (msg.content == "1") {
            this.friendList();
          }
          break;
        case 202: // 删除好友
          if (msg.content == "1") {
            this.friendList();
          }
          break;
      }
    },
  },
};
</script>
