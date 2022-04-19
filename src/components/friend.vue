<template>
  <div>
    <mt-header fixed title="chart">
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
              value="添加"
              is-link
              @click.native="addFriend(item.id)"
            >
            </mt-cell>
          </div>
        </mt-search>
      </div>
    </mt-popup>
  </div>
</template>

//
<script>
import { Toast } from "mint-ui";
export default {
  name: "login",
  data() {
    return {
      addVisible: false,
      keyword: "test",
      result: [],
    };
  },
  mounted() {
    //注册监听事件
    this.$axios
          .post("/user/list", { keyword: "无" })
          .then((res) => {
            let data = res.data.list;
            this.result = data;
          });
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
    addFriend(id) {
      this.$axios
        .post("/friend/add", {
          friend_id: id,
        })
        .then((res) => {
          console.log(res);
          Toast("Upload Complete");
        });
    }
  },
};

</script>
