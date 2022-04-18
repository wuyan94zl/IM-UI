<template>
  <div class="page-tabbar">
    <div>
      <mt-header fixed title="chart"></mt-header>
      <div class="page-wrap">
        <div>
          <mt-cell class="page-part" title="当前选中" :value="selected"/>
        </div>
        <!-- tabcontainer -->
        <mt-tab-container class="page-tabbar-container" v-model="selected">
          <mt-tab-container-item id="聊天">
            <ul v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10">
              <li>qwe</li>
              <li v-for="item in list" :key="item">
                {{ item.nick_name }}
                <mt-button @click="sendMessage(item.channel_id)">发送消息</mt-button>
              </li>
            </ul>
          </mt-tab-container-item>
          <mt-tab-container-item id="好友">
          </mt-tab-container-item>
          <mt-tab-container-item id="我的">
            <router-link to="/">
              <!-- button -->
              <mt-button type="danger" size="large">退出</mt-button>
            </router-link>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
      <mt-tabbar v-model="selected" fixed>
        <mt-tab-item id="聊天">
          聊天
        </mt-tab-item>
        <mt-tab-item id="好友">
          好友
        </mt-tab-item>
        <mt-tab-item id="我的">
          我的
        </mt-tab-item>
      </mt-tabbar>
    </div>

    <div style="display: none">
      <mt-header fixed :title="friend">
        <router-link slot="left" @click="back">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
      <ul>
        <li>asd</li>
        <li>asd</li>
      </ul>
      <mt-field placeholder="自我介绍" type="textarea" rows="4" style="border: 1px solid #333333;" :value="message">
      </mt-field>
      <mt-button @click="sendMessage">发送</mt-button>
    </div>

    <div style="width: 100%;height: 100%">
      123123
      <mt-cell
          style="border:1px dotted red;border-radius:5px;width:80vw;margin-left:12vw"
          title="企业"
          @click.native="qiyeVisible=true"/>

      <mt-popup v-model="qiyeVisible" position="right">
        <mt-header fixed :title="friend">
          <router-link slot="left" @click="qiyeVisible=false">
            <mt-button icon="back">返回</mt-button>
          </router-link>
        </mt-header>
        <hr>
        <div style="margin: 40px 5px 5px 5px;width: 100%;">
          <div style="margin-right: 10px">
            <div v-for="msg in messageList" :key="msg" :class="msg.type == 1 ? 'messages me' : 'messages friend'">
              <p class="name">{{ msg.name }}</p>
              <div class="msg">
                <p class="content">{{ msg.msg }}</p>
                <p class="timer">{{ msg.timer }}</p>
              </div>
            </div>
          </div>
          <div style="position: fixed;bottom: 5px;width: 100%;border-top: 1px solid red">
            <mt-field placeholder="输入发送的消息" type="textarea" rows="1" v-modal="introduction"></mt-field>
            <mt-button class="is-right" style="float: right;width: 100px;">发送</mt-button>
          </div>
        </div>
      </mt-popup>
    </div>
  </div>

</template>
<script>

export default {
  name: 'page-tabbar',
  data() {
    return {
      qiyeVisible: false,
      selected: '聊天',
      friend: "无言",
      channelId: "d3d9446802a44259755d38e6d163e820",
      message: '456',
      list: [],
      messages: {},
      messageList: [
        {
          "name": "wuyan",
          "msg": "哈哈哈",
          "timer": "2022/04/15 11:50:56",
          "type": 1
        },
        {
          "name": "friend",
          "msg": "哈哈哈",
          "timer": "2022/04/15 11:50:56",
          "type": 0
        }
      ],
      // 键盘
      docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
      showHeight: document.documentElement.clientHeight,   //实时屏幕高度
      hidshow: true  //显示或者隐藏footer
    };
  },
  mounted() {
    // window.onresize监听页面高度的变化
    window.onresize = () => {
      return (() => {
        this.showHeight = document.body.clientHeight;
      })()
    }
  },
  watch: {},
  methods: {
    back() {

    },
    sendMessage() {
      let obj = '{"channel_id": "' + this.channelId + '","content": "发送的消息","type": "3"}'
      this.$SOCKET.sendMessage(obj)
    },
    loadMore() {
      this.loading = true;
      this.$axios.post('http://localhost:8888/friend/list', {}, {
        headers: {
          'content-type': 'application/json',
          "Authorization": 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTA1MTE3NDIsImlhdCI6MTY0OTkwNjk0MiwiaWQiOjYsIm5pY2tfbmFtZSI6IuaXoOiogDk0emwifQ.Q3WYRX695C52xNDi4LhB0MwldsyzPSKXQd5Oe5FWNig'  //token换成从缓存获取
        }
      }).then(res => {
        this.list = res.data.list
        this.loading = false
        console.log(this.list)
      })
    }
  }
};
</script>