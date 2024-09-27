import { defineStore } from 'pinia'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const tokenStore = defineStore('token', {
    // other options...
    state: (() => ({
        token: "",
    })),
    
    actions: {
        // 设置token
        setToken(k) {
            sessionStorage.setItem('toKen', k)
            this.token = sessionStorage.getItem('toKen')
        },
        // 删除token
        delToKen() {
            sessionStorage.removeItem('toKen')
        },
        // 获取token
        getToken() {
            if (!this.token) {
                this.token = sessionStorage.getItem('toKen')
            }

            return this.token
        }
    }
})