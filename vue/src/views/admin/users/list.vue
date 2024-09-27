<template>
  <div class="users_list app-conter">
    <el-table :data="tableData" stripe>
      <el-table-column align="center" prop="id" label="ID" width="80" />
      <el-table-column align="center" prop="name" label="账号" width="180" />
      <el-table-column
        align="center"
        prop="userName"
        label="名称"
        width="280"
      />
      <el-table-column align="center" prop="introduction" label="简介" />
      <el-table-column align="center" label="操作" width="120">
        <template #default="scoped">
          <div
            class="btn"
            style="width: 100%; display: flex; justify-content: space-around"
          >
            <el-icon @click="editUser(scoped.row)"><Edit /></el-icon>

            <el-popconfirm
              title="删除后不可恢复,确认删除?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="delUser(scoped.row)"
            >
              <template #reference>
                <el-icon><Delete /></el-icon>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pag">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pages?.pageNumber || 0"
        :default-page-size="pages?.pageSize || 0"
        :total="pages?.total || 0"
        @current-change="changePage"
      />
    </div>

    <!-- 弹出修改框 -->
    <el-dialog
      v-model="dialogTableVisible"
      title="编辑"
      width="800"
      :close-on-click-modal="false"
    >
      <!-- <p>编辑</p> -->
      <el-form :model="userDeitData" class="dia_form">
        <el-form-item label="账号">
          <el-input v-model="userDeitData.name" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="userDeitData.userName" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="userDeitData.introduction" />
        </el-form-item>
        <el-form-item>
          <!--  <template #default="scoped"> -->
          <div class="btn">
            <el-button plain @click="dialogTableVisible = false">
              取消
            </el-button>
            <el-button plain @click="recoveryPassword">设为默认密码</el-button>
            <el-button type="primary" plain @click="changeModifyUser"
              >修改</el-button
            >
          </div>
          <!-- </template> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  deltUserData,
  getUserList,
  setUserWord,
  upDataUser,
} from "../../../api/user/index.js";
import { ElMessage, ElNotification } from "element-plus";
import { Edit, Delete } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const tableData = ref([]);
// 分页数据
const pages = ref({
  pageNumber: 1, // 分页
  pageSize: 10, // 每页多少
  total: 0, // 总共数据
});

// 弹框控制
const dialogTableVisible = ref(false);
// 编辑数据
const userDeitData = ref({});

// 获取查询信息
const getUserInfor = () => {
  getUserList({
    pageNumber: pages.value.pageNumber,
    pageSize: pages.value.pageSize,
  })
    .then((res) => {
      if (res.code === 200) {
        tableData.value = res.list;
        pages.value = res.total;
      } else {
        ElNotification.error(res.msg);
      }
    })
    .catch((err) => {
      console.log("获取用户列表信息失败！", err);
      ElNotification.error("获取用户列表信息失败！");
    });
};
const changePage = (val) => {
  pages.value.pageNumber = val;
  router.push({
    path: "/admin/users/list",
    query: {
      pageNumber: pages.value.pageNumber,
      pageSize: pages.value.pageSize,
    },
  });
  getUserInfor();
};

// 编辑按钮
const editUser = (data) => {
  // 拷贝数据
  userDeitData.value = JSON.parse(JSON.stringify(data));
  dialogTableVisible.value = !dialogTableVisible.value;
};

// 删除按钮
const delUser = (data) => {
  console.log("删除", data.id);
  deltUserData({ id: data.id })
    .then((res) => {
      ElNotification.success(res.msg);
      getUserInfor();
    })
    .catch((err) => {
      ElNotification.error("删除失败！");
    });
};

// 设置默认密码
const recoveryPassword = () => {
  setUserWord({ id: userDeitData.value.id })
    .then((res) => {
      ElNotification.success(res.msg);
      dialogTableVisible.value = false;
      getUserInfor();
    })
    .catch((err) => {
      ElNotification.error(err.msg);
    });
};

// 确认修改按钮
const changeModifyUser = () => {
  upDataUser(userDeitData.value)
    .then((res) => {
      ElNotification.success(res.msg);
      dialogTableVisible.value = false;
      getUserInfor();
    })
    .catch((err) => {
      if (err.code == 101) {
        ElNotification.error(err.msg);
      }
    });
};

onMounted(() => {
  if (!route.query.pageNumber || route.query.pageSize !== "10") {
    router.push({
      path: "/admin/users/list",
      query: {
        pageNumber: 1,
        pageSize: 10,
      },
    });
  } else {
    pages.value = {
      pageNumber: Number(route.query.pageNumber), // 分页
      pageSize: Number(route.query.pageSize), // 每页多少
    };
  }
  getUserInfor();
});
</script>

<style scoped lang="scss">
.btn {
  .el-icon {
    cursor: pointer;
  }
  .el-icon:hover {
    color: rgb(81, 138, 237);
  }
}

.pag {
  padding-top: 30px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.dia_form {
  .btn {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }
}
</style>