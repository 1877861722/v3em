<template>
  <div class="login">
    <el-form :model="userData">
      <el-form-item label="账号">
        <el-input v-model="userData.userName" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input show-password v-model="userData.passWord" />
      </el-form-item>
      <el-form-item>
        <div class="btn">
          <el-button type="primary" plain @click="changeLogin">登录</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { login } from "../api/login/index.js";
import { ElMessage } from "element-plus";
import { tokenStore } from "../store/token.js";
const tokStore = tokenStore();
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const userData = ref({
  userName: "",
  passWord: "",
});

const changeLogin = () => {
  login(userData.value)
    .then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        tokStore.setToken(res.token);
        router.push("/admin/index");
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch((err) => {
      ElMessage.error("登录失败！");
    });
};
</script>

<style scoped lang="scss">
.login {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 25%;
  height: 150px;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3);
  border-radius: 6px;
  ::v-deep(.el-form-item__label) {
    color: #fff;
  }
  .btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>