<template>
  <!-- 图库 -->
  <div class="gallery_box app-conter">
    <el-row :gutter="20" style="display: flex; justify-content: flex-end">
      <!-- 上传按钮  -->
      <el-upload
        :show-file-list="false"
        :auto-upload="false"
        :on-change="upImage"
      >
        <el-button
          style="margin-right: 20px; margin-bottom: 10px"
          type="primary"
          plain
          size="small"
        >
          上传图片
        </el-button>
      </el-upload>
    </el-row>
    <el-row :gutter="20" class="row_box" style="padding-bottom: 10px">
      <el-col :span="6" v-for="(item, index) in galleryDataList" :key="index">
        <el-card shadow="hover" style="max-width: 300px; height: 350px">
          <template #header>
            <span
              style="width: 100%; display: flex; justify-content: space-between"
            >
              <p>ID：{{ item.id }}</p>
              <el-popconfirm
                title="删除后不可恢复,是否删除?"
                :confirm-button-text="'确认'"
                :cancel-button-text="'取消'"
                @confirm="changeDelImg(item)"
              >
                <template #reference>
                  <el-button type="primary" plain size="small">
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </span>
          </template>
          <!-- :src="item.img_url" -->
          <img v-lazy="item.img_url" style="width: 100%" />
        </el-card>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-row :gutter="20" style="display: flex; justify-content: center">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pages?.pageNumber || 0"
        :default-page-size="pages?.pageSize || 0"
        :total="pages?.total || 0"
        @current-change="changePage"
      />
    </el-row>
  </div>
</template>

<script setup>
// 缓存
import { ElMessage, ElNotification } from "element-plus";
import { deleteImgData, getGalleryData } from "../../api/gallery/index.js";
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { upload } from "../../api/file/index.js";
const router = useRouter();
const route = useRoute();

// 列表数据
const galleryDataList = ref([]);
// 分页数据
const pages = ref({
  pageNumber: 1, // 当前分页
  pageSize: 8, // 每页多少条
  total: 0, // 总共多少数据
});

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
  router.push({
    path: "/admin/gallery",
    query: {
      pageNumber: pages.value.pageNumber,
      pageSize: pages.value.pageSize,
    },
  });
  getPictureList();
};

const setRoute = () => {
  let royPage = route.query;
  if (royPage.pageNumber) {
    pages.value.pageNumber = Number(royPage.pageNumber);
    pages.value.pageSize = Number(royPage.pageSize);
    router.push({
      path: "/admin/gallery",
      query: {
        pageNumber: pages.value.pageNumber,
        pageSize: pages.value.pageSize,
      },
    });
  }
};

// 上传按钮
const upImage = (rawFile) => {
  let formData = new FormData();
  formData.append("file", rawFile.raw, "这是名称");
  upload(formData)
    .then((res) => {
      getPictureList();
    })
    .catch((err) => {
      console.log("错误", err);
      ElNotification.error("上传图片失败");
    });
};

// 删除按钮
const changeDelImg = (data) => {
  deleteImgData({
    id: data.id,
    img_name: data.img_name,
  })
    .then((res) => {
      ElNotification.success("图片删除成功");
      getPictureList();
    })
    .catch((err) => {
      console.log("删除图片失败", err);
      ElNotification.error("删除图片失败");
    });
};

onMounted(() => {
  setRoute();
  getPictureList();
});
</script>

<style scoped lang="scss">
.gallery_box {
  .row_box {
    .el-col {
      display: flex;
      justify-content: center;
      padding-bottom: 20px;
    }
  }
}
</style>