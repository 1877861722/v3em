import request from "../request.js";

// 获取用户列表
export function getUserList(data) {
    return request({
        url: `/api/users/inforList?pageNumber=${data.pageNumber}&pageSize=${data.pageSize}`,
        method: "get"
    })
}

// 添加用户
export function addUserInfor(data) {
    return request({
        url: `/api/users/addUser`,
        method: "post",
        data
    })
}

// 删除用户
export function deltUserData(data) {
    return request({
        url: "/api/users/deleteUser",
        method: "delete",
        data
    })
}

// 修改用户
export function upDataUser(data) {
    return request({
        url: "/api/users/updataUser",
        method: "put",
        data
    })
}

// 恢复默认密码
export function setUserWord(data) {
    return request({
        url: "/api/users/setWord",
        method: "post",
        data
    })
}