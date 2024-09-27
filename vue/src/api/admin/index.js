import request from "../request.js";

// 获取管理信息
export function getAdminInfor() {
    return request({
        url: "/api/admin/getAdmin",
        method: "get"
    })
}

// 修改管理员信息
export function putAdminInfor(data) {
    return request({
        url: "/api/admin/putAdmin",
        method: "put",
        data
    })
}

// 修改管理员密码
export function modifyPassword(data) {
    return request({
        url: "/api/admin/changepassword",
        method: "post",
        data
    })
}