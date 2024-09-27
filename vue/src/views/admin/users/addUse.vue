<template>
  <div class="add_users app-conter">
    <el-form
      :model="userInfor"
      :rules="rules"
      ref="ruleFormRef"
      label-width="auto"
      style="max-width: 600px"
      label-position="top"
    >
      <el-form-item label="名称：" prop="name">
        <el-input v-model="userInfor.name" />
      </el-form-item>
      <el-form-item label="账号：" prop="userName">
        <el-input v-model="userInfor.userName" />
      </el-form-item>
      <el-form-item label="密码：" prop="passWord">
        <el-input v-model="userInfor.passWord" />
      </el-form-item>
      <el-form-item label="简介：">
        <el-input v-model="userInfor.introduction" />
      </el-form-item>
      <el-form-item>
        <div style="width: 100%; display: flex; justify-content: center">
          <el-button
            plain
            @click="
              userInfor = {
                name: '',
                userName: '',
                passWord: '',
                introduction: '',
              }
            "
            >重置</el-button
          >
          <el-button type="primary" plain @click="submitForm()"
            >确认添加</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { addUserInfor } from "../../../api/user";
import { ElNotification } from "element-plus";
const userInfor = ref({
  name: "",
  userName: "",
  passWord: "",
  introduction: "",
});

const ruleFormRef = ref();

const rules = {
  name: [
    { required: true, message: "请输入名称", trigger: "blur" },
    { min: 3, max: 7, message: "3-7个字符", trigger: "blur" },
  ],
  userName: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 5, max: 11, message: "5-11个字符", trigger: "blur" },
  ],
  passWord: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 5, max: 18, message: "5-18个字符", trigger: "blur" },
  ],
};

// 提交按钮
const submitForm = () => {
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log("验证通过!");
      addUserInfor(userInfor.value)
        .then((res) => {
          ElNotification.success(
            "用户名：" + '"' + res.data.name + '"  ' + res.msg
          );
        })
        .catch((err) => {
          console.log("添加用户失败");
          ElNotification.error(err.msg);
        });
    } else {
      console.log("验证没有通过");
    }
  });
};
</script>

<style scoped lang="scss">
</style>