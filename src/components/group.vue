<template>
  <div>
    <mt-header fixed title="群组">
      <mt-button @click="searchVisible = true" slot="right" icon="add"
        >搜索</mt-button
      >
      <mt-button @click="addVisible = true" slot="right" icon="add"
        >创建</mt-button
      >
    </mt-header>
    <mt-popup v-model="searchVisible" position="right">
      <mt-header fixed title="群组搜索">
        <mt-button @click="searchVisible = false" slot="left" icon="back"
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
          <div style="margin-top: 48px" v-if="searchGroup.isHas">
            <mt-cell title="群组名称">{{ searchGroup.title }}</mt-cell>
            <br />
            <mt-cell title="群组说明">{{ searchGroup.description }}</mt-cell>
            <br />
            <mt-cell title="群主">{{ searchGroup.manager }}</mt-cell>
            <br />
            <mt-button
              v-if="searchGroup.is_join == 0"
              type="primary"
              class="my-button"
              size="large"
              @click="joinGroup(searchGroup)"
              >申请加入</mt-button
            >
            <mt-button v-else type="primary" class="my-button" size="large"
              >已加入</mt-button
            >
            <br />
          </div>
        </mt-search>
      </div>
    </mt-popup>
    <mt-popup v-model="addVisible" position="right">
      <mt-header fixed title="创建群组">
        <mt-button @click="addVisible = false" slot="left" icon="back"
          >返回</mt-button
        >
      </mt-header>
      <div class="my-form" style="margin-top: 40px">
        <mt-field
          class="my-form-item my-form-item-border"
          placeholder="群组名称"
          v-model="group.title"
        ></mt-field>
        <mt-field
          class="my-form-item my-form-item-border"
          placeholder="群组说明"
          v-model="group.description"
        ></mt-field>
        <br /><br />
        <div class="my-form-item my-form-submit">
          <mt-button type="danger" size="large" @click="addGroup"
            >创建</mt-button
          >
        </div>
      </div>
    </mt-popup>
    <mt-cell
      class="notice-list"
      v-for="(group, k) in groups"
      :key="k"
      :title="group.title"
      is-link
      v-on:click.native="info(group)"
    ></mt-cell>
    <mt-popup v-model="infoVisible" position="right">
      <mt-header fixed title="信息">
        <mt-button @click="infoVisible = false" slot="left" icon="back"
          >返回</mt-button
        >
      </mt-header>
      <div style="margin-top: 40px"></div>
      <mt-cell title="群组名称">{{ group.title }}</mt-cell>
      <br />
      <mt-cell title="群组说明">{{ group.description }}</mt-cell>
      <br />
      <mt-cell title="群主">{{ group.manager }}</mt-cell>
      <br />
      <mt-button
        type="primary"
        class="my-button"
        size="large"
        @click="joinMessage(group)"
        >发送消息</mt-button
      >
      <br />
      <mt-button
        v-if="group.is_manager == 1"
        type="danger"
        class="my-button"
        size="large"
        @click="delGroup(group)"
        >删除群组</mt-button
      >
      <mt-button
        v-else
        type="danger"
        class="my-button"
        size="large"
        @click="outGroup(group)"
        >退出群组</mt-button
      >
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
      group: {
        title: "测试",
        description: "test",
      },

      groups: [],

      infoVisible: false,

      searchVisible: false,
      keyword: "",
      searchGroup: {},

      result: [],
    };
  },
  mounted() {
    //注册监听事件
    window.addEventListener("onmessageWS", this.getSocketData);
    this.groupList();
  },
  watch: {
    keyword: function (newVal) {
      if (newVal != "") {
        this.$axios
          .post("/group/search", { title: this.keyword })
          .then((res) => {
            if (res.data.code == 200) {
              this.searchGroup = res.data.data;
              this.searchGroup.isHas = true;
            } else {
              this.searchGroup = {};
            }
          });
      }
    },
  },
  methods: {
    // 群组列表
    groupList() {
      this.$axios.post("/group/list", {}).then((res) => {
        let data = res.data.data.list;
        this.groups = data;
      });
    },
    // 添加群组
    addGroup() {
      this.$axios.post("/group/add", this.group).then((res) => {
        let data = res.data;
        this.addVisible = false;
        if (data.code != 200) {
          this.$toast({
            message: data.message,
            position: "center",
            duration: 1000,
          });
          return;
        }
        data = data.data;
        this.$toast({
          message: data.message,
          position: "center",
          duration: 1000,
        });
        this.groupList();
      });
    },
    info(group) {
      this.group = group;
      this.infoVisible = true;
    },
    joinGroup(group) {
      this.$axios
        .post("/group/join", { group_id: group.id, note: "申请加入" })
        .then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.searchVisible = false;
            this.$toast({
              message: data.data.message,
              position: "center",
              duration: 1000,
            });
          } else {
            this.$toast({
              message: data.message,
              position: "center",
              duration: 1000,
            });
          }
        });
    },
    outGroup(group) {
      this.$axios.post("/group/out", { group_id: group.id }).then((res) => {
        let data = res.data;
          if (data.code == 200) {
            this.infoVisible = false;
            this.$toast({
              message: data.data.message,
              position: "center",
              duration: 1000,
            });
          } else {
            this.$toast({
              message: data.message,
              position: "center",
              duration: 1000,
            });
          }
      });
    },
    delGroup(group) {
      this.$axios.post("/group/del", { group_id: group.id }).then((res) => {
        let data = res.data;
          if (data.code == 200) {
            this.infoVisible = false;
            this.$toast({
              message: data.data.message,
              position: "center",
              duration: 1000,
            });
          } else {
            this.$toast({
              message: data.message,
              position: "center",
              duration: 1000,
            });
          }
      });
    },
    // 进入会话
    joinMessage(group) {
      window.dispatchEvent(
        new CustomEvent("addMessage", {
          detail: {
            data: {
              unread: 0,
              content: "",
              nick_name: group.title,
              channel_id: group.channel_id,
              title: group.title,
              type: 101,
            },
          },
        })
      );
      this.infoVisible = false;
    },
    // 消息监听处理
    getSocketData(e) {
      let msg = JSON.parse(e.detail.data);
      switch (msg.type) {
        case 202: // 群组更新
          this.groupList();
          break;
      }
    },
  },
};
</script>
