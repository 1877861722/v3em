import { createRouter, createWebHistory } from "vue-router";

// 1. 配置路由
const routes = [
    // 重定向
    {
        path: "/",
        redirect: '/login',
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/login.vue"),
        meta: {
            title: "登录"
        }
    },
    {
        path: "/admin",
        redirect: '/admin/index',
        component: () => import("../views/admin/index.vue"),
        children: [
            {
                path: "/admin/index",
                component: () => import("../views/admin/home.vue"),
                meta: {
                    title: "首页"
                },
            },
            {
                path: "/admin/gallery",
                component: () => import("../views/admin/gallery.vue"),
                meta: {
                    title: "图库"
                },
            },
            {
                path: "/admin/private",
                component: () => import("../views/admin/private.vue"),
                meta: {
                    title: "个人页面"
                },
            },
            {
                path: "/admin/users/list",
                component: () => import("../views/admin/users/list.vue"),
                meta: {
                    title: "用户列表"
                },
            },
            {
                path: "/admin/users/adduser",
                component: () => import("../views/admin/users/addUse.vue"),
                meta: {
                    title: "添加用户"
                },
            }
        ]
    },
    {
        path: "/:pathMatch(.*)*",
        name: "Error",
        component: () => import("../views/404.vue"),
        meta: {
            title: "404页面"
        }
    },

];

// 2.返回一个 router 实列，为函数，配置 history 模式
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 3.导出路由   去 main.ts 注册 router.ts
export default router