<template>
  <div>
    <mt-cell
      class="notice-list"
      v-for="(item, k) in notice"
      :key="k"
      :title="item.nick_name"
      :label="item.content + item.create_time"
      :value="item.send_time"
    >
      <span v-if="item.status == 0">
        <mt-button class="my-button" @click="firentHandle(item.id, k, 1)"
          >同意</mt-button
        >
        <mt-button class="my-button" @click="firentHandle(item.id, k, 0)"
          >拒绝</mt-button
        >
      </span>
      <span v-else> {{item.is_agree}} </span>
    </mt-cell>
  </div>
</template>

//
<script>
// import { Toast } from "mint-ui";
export default {
  name: "login",
  data() {
    return {
      notice: [],
    };
  },
  mounted() {
    //注册监听事件
    window.addEventListener("onmessageWS", this.getSocketData);
    this.noticeList();
  },
  methods: {
    getSocketData(e) {
      // 监听消息接受
      let msg = JSON.parse(e.detail.data);
      console.log("notice 消息", msg);
      switch (msg.type) {
        case 3:
          var context = JSON.parse(msg.content);
          context.nick_name = msg.nick_name;
          if (!this.notice){
              this.notice = new Array()
          }
          this.notice.unshift(context);
          break;
        default:
          break;
      }
    },
    noticeList() {
      this.loading = true;
      this.$axios.post("/notice/list", {}).then((res) => {
        let data = res.data;
        this.notice = data.list;
      });
    },
    firentHandle(id, k, rlt) {
      console.log(id, k);
      this.notice[k].content = "同意";
      this.loading = true;
      this.$axios
        .post("/friend/handle", { action_type: rlt, action_log_id: id })
        .then((res) => {
            console.log(res.data.status);
            if (res.data.status == true){
                this.notice[k].status = 1
                this.notice[k].is_agree = "已同意"
            }else{
                console.log("拒绝1",this.notice[k]);
                this.notice[k].status = 1
                this.notice[k].is_agree = "已拒绝"
                console.log("拒绝2",this.notice[k]);
            }
        });
    },
  },
};
</script>
