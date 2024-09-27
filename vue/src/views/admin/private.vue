<template>
  <div class="private app-conter">
    <el-form :model="adminInforData" style="max-width: 600px">
      <el-form-item label="账号">
        <el-input v-model="adminInforData.userName" disabled />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input placeholder="显示名称" v-model="adminInforData.name" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input
          v-model="adminInforData.introduction"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="个人简介"
        />
      </el-form-item>
      <el-form-item label="头像">
        <!-- :src="adminInforData.avatar" -->
        <img
          class="image"
          v-lazy="adminInforData.avatar"
          alt="a"
          @click="avatarSelectionBox = true"
        />
      </el-form-item>
      <el-form-item>
        <el-row
          :gutter="20"
          style="width: 100%; display: flex; justify-content: flex-end"
        >
          <el-button plain @click="passwordModificationBox = true">
            修改密码
          </el-button>
          <el-button type="primary" plain @click="putAdmin">保存信息</el-button>
        </el-row>
      </el-form-item>
    </el-form>
    <!-- 图片选择 -->
    <el-dialog
      v-model="avatarSelectionBox"
      :close-on-click-modal="false"
      title="选择头像"
      width="600"
    >
      <el-row :gutter="20" class="img_box">
        <el-col
          :span="6"
          v-for="(item, index) in galleryDataList"
          :key="index"
          class="col_img"
        >
          <el-image
            :class="selectAvatarData.id == item.id ? 'select' : ''"
            style="width: 100px; height: 100px"
            :src="item.img_url"
            fit="cover"
            @click="changeImg(item)"
          />
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        style="display: flex; justify-content: center; padding-bottom: 15px"
      >
        <el-pagination
          size="small"
          background
          layout="prev, pager, next"
          :current-page="pages?.pageNumber || 0"
          :default-page-size="pages?.pageSize || 0"
          :total="pages?.total || 0"
          @current-change="changePage"
        />
      </el-row>
      <el-row :gutter="20" style="display: flex; justify-content: center">
        <el-button @click="avatarSelectionBox = false">关闭</el-button>
        <el-button type="primary" plain @click="replace">确认</el-button>
      </el-row>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      v-model="passwordModificationBox"
      :close-on-click-modal="false"
      title="修改密码"
      width="600"
    >
      <el-form :model="passWordform">
        <el-form-item label="原密码">
          <el-input v-model="passWordform.oldPassword" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passWordform.newPassword" />
        </el-form-item>
        <el-form-item>
          <el-row
            :gutter="20"
            style="width: 100%; display: flex; justify-content: center"
          >
            <el-button @click="passwordModificationBox = false">关闭</el-button>
            <el-button type="primary" plain @click="changeWord">修改</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { tokenStore } from "../../store/token";
const tokStore = tokenStore();
import { onMounted, ref, watch } from "vue";
import { getAdminInfor, modifyPassword, putAdminInfor } from "../../api/admin";
import { ElMessage, ElNotification } from "element-plus";
import { getGalleryData } from "../../api/gallery";
// 个人信息数据
const adminInforData = ref({});
// 密码修改框
const passwordModificationBox = ref(false);
const passWordform = ref({
  oldPassword: "", // 原密码
  newPassword: "", // 新密码
  id: null, // id
});

// 弹窗数据是否可见
const avatarSelectionBox = ref(false);
// 头像列表数据
const galleryDataList = ref([]);
// 选中的图片数据
const selectAvatarData = ref({});
// 分页数据
const pages = ref({
  pageNumber: 1, // 当前分页
  pageSize: 8, // 每页多少条
  total: 0, // 总共多少数据
});
// 监听头像弹窗，打开弹窗时 请求数据
watch(
  avatarSelectionBox,
  (newVal) => {
    if (newVal) {
      selectAvatarData.value = {};
      pages.value = {
        pageNumber: 1, // 当前分页
        pageSize: 8, // 每页多少条
        total: 0, // 总共多少数据
      };
      getPictureList();
    } else {
      // 关闭的时候，刷新个人信息
      getInfor();
    }
  },
  {
    immediate: false,
    deep: false,
  }
);

const changeImg = (data) => {
  selectAvatarData.value = data;
};

// 获取数据列表
const getPictureList = () => {
  getGalleryData(pages.value)
    .then((res) => {
      galleryDataList.value = res.list;
      pages.value = res.total;
    })
    .catch((err) => {
      console.log("获取图片数据失败", err);
      ElMessage.error("获取图片数据失败");
    });
};
// 设置当前分页
const changePage = (val) => {
  pages.value.pageNumber = val;
  getPictureList();
};

// 确认替换头像按钮
const replace = () => {
  adminInforData.value.avatar = selectAvatarData.value.img_url;
  putAdmin();
  avatarSelectionBox.value = false;
};

// 修改个人信息
const putAdmin = () => {
  putAdminInfor({
    name: adminInforData.value.name,
    introduction: adminInforData.value.introduction,
    avatar: adminInforData.value.avatar,
    id: adminInforData.value.id,
  })
    .then((res) => {})
    .catch((err) => {
      console.log("修改头像失败", err);
      ElNotification.error(err.msg);
    });
};

// 获取个人信息
const getInfor = () => {
  getAdminInfor()
    .then((res) => {
      adminInforData.value = res.data;
    })
    .catch((err) => {
      console.log("获取管理信息失败！", err);
      ElNotification.error("个人信息获取失败");
    });
};

// 修改密码按钮
const changeWord = () => {
  modifyPassword({
    oldPassword: passWordform.value.oldPassword,
    newPassword: passWordform.value.newPassword,
    id: adminInforData.value.id,
  })
    .then((res) => {
      if (res.code === 200) {
        ElNotification.success(res.msg);
        passwordModificationBox.value = false;
        tokStore.setToken("");
      } else {
        ElNotification.error(res.msg);
      }
    })
    .catch((err) => {
      console.log("密码修改失败", err);
      ElNotification.error(err.msg);
    });
};

onMounted(() => {
  getInfor();
});
</script>

<style scoped lang="scss">
.private {
  width: 100%;
  height: 100%;
  .image {
    width: 120px;
    height: 120px;
    border: 1px solid #e1e1e1;
    border-radius: 6px;
    cursor: pointer;
    object-fit: cover;
  }

  .img_box {
    min-height: 120px;
    .col_img {
      display: flex;
      justify-content: center;
      padding-bottom: 15px;
      .el-image {
        cursor: pointer;
        border-radius: 6px;
        box-sizing: border-box;
        transition: all 0.1s;
      }
      .el-image:hover {
        border: 3px solid #69aaff;
        box-shadow: var(--el-box-shadow);
      }
      .select {
        border: 3px solid #69aaff;
        box-shadow: var(--el-box-shadow);
      }
    }
  }
}
</style>
 