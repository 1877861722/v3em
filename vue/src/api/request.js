import axios from 'axios'
import { tokenStore } from "../store/token.js";
const tokStore = tokenStore()
import { ElMessageBox, ElLoading } from 'element-plus';
let loadingInstance

// 关闭 loadin
// 防抖函数
function debounce(delay) {
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
        loadingInstance.close()
    }, delay);
}


// 创建axios实例
const service = axios.create({
    // 超时
    timeout: 30000
})

// request拦截器
service.interceptors.request.use(config => {
    config.headers['Authorization'] = 'Bearer ' + tokStore.getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    loadingInstance = ElLoading.service()
    return config
}, error => {
    console.log('*********error', error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    debounce(500)
    return res.data
},
    error => {
        console.log('err：' + error.status)
        console.log('err：' + error)
        if (error.status === 401) {
            ElMessageBox.confirm(
                '登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示',
                {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                tokStore.delToKen() // 清除token
                location.href = '/login';
            }).catch(() => {
                // 取消
            })
        }
        debounce(500)
        return Promise.reject(error)
    }
)
export default service
